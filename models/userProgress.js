const {DataTypes} = require('sequelize');
const sequelize = require('../config');
const User = require('./user');

const UserProgress = sequelize.define('UserProgress', {
    userId: { // 1
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference to the User model
            key: 'id',   // Assuming 'id' is the primary key in the User table
        }
    },
    mode: { // 1a
        type: DataTypes.STRING,
        allowNull: false
    },
    score: { // 10
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }

});

module.exports = UserProgress;
