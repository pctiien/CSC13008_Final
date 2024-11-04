const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('reviews', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    reviews_msg: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    }
}, {
    timestamps: false
});

module.exports = Review;