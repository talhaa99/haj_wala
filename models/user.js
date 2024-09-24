const {DataTypes} = require('sequelize');
const sequelize = require('../config');

const User = sequelize.define('User', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = User;