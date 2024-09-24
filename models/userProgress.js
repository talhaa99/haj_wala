const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const UserProgress = sequelize.define('UserProgress', {
    // userId: { // Add this line
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     references: {
    //         model: User, // Reference to the User model
    //         key: 'id',   // Assuming 'id' is the primary key in the User table
    //     }
    // },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    mode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = UserProgress;
