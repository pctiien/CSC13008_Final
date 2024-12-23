const Sequelize = require('sequelize');
const { Op } = require('sequelize'); 
const sequelize = require('../../config/database');
const QueryHelper = require('../../utils/QueryHelper');
const AppError = require('../../utils/AppError');
const models = require('../../index');
const Product = models.Product;
const Category = models.Category;
const Review = models.Review;

const getProductById = async(productId) => {
    try {
        let product = await Product.findByPk(productId, {
            include: [
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: [] },  
                },
                // {
                //     model: Review,
                //     as: 'reviews',
                //     attributes: ['user_id', 'reviews_msg', 'rating', 'createdAt'],  
                // }
            ],
            subQuery: false, 
        });
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        product = product.get({ plain: true });

        // const reviews = product.reviews;
        // const totalReviews = reviews.length;
        // const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        // const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
        
        // product.total_rating = totalReviews;
        // product.avg_rating = parseFloat(avgRating)
        
        return product;
    } catch(e) {
        console.error(e)
        throw new AppError('Cannot get product with id : ' + productId, 500);
    }
}


const getAllProducts= async(query)=> {
    try {
        const filterConditions = {};

        if (query.category_id) {
            filterConditions['$categories.category_id$'] = query.category_id; 
        }

        if (query.price) {
            const priceConditions = {};
            if (query.price.gte) {
                priceConditions[Op.gte] = Number(query.price.gte)
            }
            if (query.price.lte) {
                priceConditions[Op.lte] = Number(query.price.lte)
            }

            if (priceConditions[Op.gte] || priceConditions[Op.lte]) {
                filterConditions['price'] = priceConditions;
            }
        }

        if (query.search) {
            const searchLower = query.search.toLowerCase(); 
        
            filterConditions[Op.or] = [
                Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('product_name')),
                    {
                        [Op.like]: `%${searchLower}%`
                    }
                ),
                Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('description')),
                    {
                        [Op.like]: `%${searchLower}%`
                    }
                )
            ];
        }

        if (query.manufacturer_id) {
            filterConditions['manufacturer_id'] = query.manufacturer_id; 
        }

        if (query.status_id) {
            filterConditions['status_id'] = query.status_id;
        }
        const page = query.page ? parseInt(query.page, 9) : 1;
        const limit = query.limit ? Math.min(parseInt(query.limit, 9), 9) : 9
        const offset = (page - 1) * limit;

        const {count, rows: products} = await Product.findAndCountAll({
            where: filterConditions, 
            limit: limit,
            offset: offset,
            include: [{
                model: Category,
                as: 'categories',
                required: false,
                through: { attributes: [] }
                }
            ],
            subQuery: false
        });

        return {
            products: products.map(p => p.get({ plain: true })),
            currentPage: page,
            totalPage: Math.ceil(count / limit)
        };

    } catch (error) {
        console.error(error);
        throw new Error('Error filtering products');
    }
}

const getRelatedProducts = async(currentProductId, queryStr = {}) => {
    try {
        const currentProduct = await Product.findByPk(currentProductId, {
            include: [{
                model: Category,
                as: 'categories',
                through: { attributes: [] }
            }]
        });

        if (!currentProduct) {
            throw new AppError('Current product not found', 404);
        }

        const categoryIds = currentProduct.categories.map(cat => cat.category_id);

        const relatedProducts = await Product.findAll({
            where: {
                product_id: {
                    [Sequelize.Op.ne]: currentProductId
                }
            },
            include: [{
                model: Category,
                through: { attributes: [] },
                as: 'categories',
                where: {
                    category_id: categoryIds 
                }
            }],
            limit: queryStr.limit || 3,
            order: sequelize.random()
        });

        if (relatedProducts.length < (queryStr.limit || 3)) {
            const additionalProducts = await Product.findAll({
                where: {
                    product_id: {
                        [Sequelize.Op.notIn]: [
                            currentProductId,
                            ...relatedProducts.map(p => p.product_id)
                        ]
                    }
                },
                limit: (queryStr.limit || 3) - relatedProducts.length,
                order: sequelize.random()
            });
            
            return [
                ...relatedProducts.map(p => p.get({ plain: true })),
                ...additionalProducts.map(p => p.get({ plain: true }))
            ];
        }

        return relatedProducts.map(p => p.get({ plain: true }));
    } catch(e) {
        console.error('Error fetching related products:', e);
        throw new AppError('Cannot get related products: ' + e.message, 500);
    }
};

const getAllProductsJson = async () => {
    try {
        let products = await Product.findAll({
            include: [{
                model: Category,
                as: 'categories',
                through: { attributes: [] }
            }]
        });

        return products
    } catch (e) {
        console.error('Error fetching products:', e);
        throw new AppError('Cannot get all products, error: ' + e.message, 404);
    }
};

module.exports = { getAllProducts, getProductById, getRelatedProducts, getAllProductsJson };
