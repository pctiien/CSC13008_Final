const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manufacturer = sequelize.define('manufacturers', {
    manufacturer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    m_name: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
});

module.exports = Manufacturer;