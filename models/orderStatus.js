const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderStatus = sequelize.define('order_status', {
    status_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = OrderStatus;