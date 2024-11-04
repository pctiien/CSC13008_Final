const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('user_role', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = UserRole;