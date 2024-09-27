const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const User = require('./user'); // Correctly import User

const UserProgress = sequelize.define('UserProgress', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference to the User model
            key: 'id',   // Assuming 'id' is the primary key in the User table
        }
    },
    mode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
});

// Make sure the association is defined after User and UserProgress are properly set up
UserProgress.belongsTo(User, { foreignKey: 'userId' }); // Associate UserProgress with User

module.exports = UserProgress;
