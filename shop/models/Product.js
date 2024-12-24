module.exports = (sequelize,DataTypes)=>{
    
    const Product = sequelize.define('Product', {
        product_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        product_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        img : {
            type : DataTypes.STRING,
            allowNull : true
        },
        remaining: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0, 
            }
        },
        description:{
            type: DataTypes.STRING,
            allowNull: true
        }
        ,
        status_id :{
            type : DataTypes.INTEGER,
            allowNull : true
        },
        manufacturer_id :{
            type : DataTypes.INTEGER,
            allowNull : true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        timestamps: true, 
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'products'
    });
    Product.associate = (models)=>{
        Product.hasMany(models.Review, {
            foreignKey: 'product_id',
            as: 'reviews',
        });
        Product.belongsToMany(models.User,{
            foreignKey: {name :'product_id'},
            through: models.Review,
            otherKey: 'user_id',
            as : 'users'
        });
    
        Product.belongsTo(models.Status,{
            foreignKey: {name :'status_id'}
        });
        Product.belongsTo(models.Manufacturer,{
            foreignKey : {name : 'manufacturer_id'},
        });
        Product.belongsToMany(models.Category, {
            foreignKey: 'product_id',
            through: 'product_category',
            otherKey: 'category_id',
            as: 'categories',
            timestamps: false
        });
    }
    return Product
}