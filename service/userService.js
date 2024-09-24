const User = require('../models/user');
const UserProgress = require('../models/userProgress');
const ThrowError = require('../helpers/ThrowError');

exports.register = async (userName) => {
    // Check if the user already exists in the database
    let user = await User.findOne({where: {userName}});
    if (user) {
        throw new ThrowError('User already exist', 409); //using ThrowError custom class
    }

    // register a new user
    user = await User.create({userName});
    return {success: true, message: 'User registered successfully.', data: {user}};
};

exports.updateScore = async (userName, newScore, mode) => {
    // Check if the user exists in the database
    let user = await User.findOne({where: {userName}});

    if (!user) {
        throw new ThrowError('User does not exist', 404); // using ThrowError custom class
    }

    // Check if a UserProgress entry exists for the user with the specified mode
    let userProgress = await UserProgress.findOne({where: {userName: userName, mode}});

    if (userProgress) {
        // Update the score if the new score is greater than the current score
        if (newScore > userProgress.score) {
            await UserProgress.update({score: newScore}, {where: {userName: userName, mode}});
            return {success: true, message: 'Score updated successfully.', data: {userName, score: newScore, mode}};
        } else {
            throw new ThrowError('New score is not greater than current score', 400, {
                userName,
                currentScore: userProgress.score
            });
        }
    } else {
        // If no UserProgress exists, create a new record
        await UserProgress.create({userName: userName, score: newScore, mode});
        return {success: true, message: 'Record created successfully.', data: {userName, score: newScore, mode}};
    }
};
