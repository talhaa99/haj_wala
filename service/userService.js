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

    const leaderboardTypes = {
        1: "a",
        2: "b",
        3: "c"
    };

    for (let i = 1; i <= 6; i++) {
        for (let j = 1; j <= 3; j++) {
            await UserProgress.create({
                userId: user.id,
                mode: `${i}${leaderboardTypes[j]}`
            });
        }
    }

    return {success: true, message: 'User registered successfully.', data: {user}};
};

// exports.register = async (userName) => {
//     // Check if the user already exists in the UserProgress table
//     let userProgress = await UserProgress.findOne({where: {userName}});
//
//     if (userProgress) {
//         throw new ThrowError('User already exists', 409); // Custom error for already existing user
//     }
//
//     // Register a new user with default scores for all modes
//     userProgress = await UserProgress.create({
//         userName,
//         mode1Score: 0,
//         mode2Score: 0,
//         mode3Score: 0,
//         mode4Score: 0,
//         mode5Score: 0,
//         mode6Score: 0,
//     });
//
//     return {
//         success: true,
//         message: 'User registered successfully with all mode scores set to 0.',
//         data: {userProgress},
//     };
// };

exports.updateScore = async (userName, newScore, mode) => {

    // Check if the user exists in the database
    let user = await User.findOne({where: {userName}});
    if (!user) {
        throw new ThrowError('User does not exist', 404);
    }

    // Use userId from the User record
    const userId = user.id;

    // Check if a UserProgress entry exists for the user with the specified mode and userId
    let userProgress = await UserProgress.findOne({where: {userId, mode}});

    if (userProgress) {
        // Update the score if the new score is greater than the current score
        if (newScore > userProgress.score) {
            await UserProgress.update(
                {score: newScore},
                {where: {userId, mode}}
            );
            return {
                success: true,
                message: 'Score updated successfully.',
                data: {userName, score: newScore, mode, userId}
            };
        } else {
            throw new ThrowError('New score is not greater than current score', 400, {
                userName,
                currentScore: userProgress.score,
                userId
            });
        }
    } else {
        let user_progress = await UserProgress.create({
            userId, // Use userId, not userName
            score: newScore,
            mode,
        });

        return {
            success: true,
            message: 'Record created successfully.',
            data: user_progress
        };
    }
};


// exports.updateScore = async (userName, newScore, mode) => {
//     // Check if the user exists in the database
//     let user = await UserProgress.findOne({where: {userName}});
//
//     if (!user) {
//         throw new ThrowError('User does not exist', 404);
//     }
//
//     // Determine which mode score column to update (mode1Score, mode2Score, etc.)
//     const modeColumn = `mode${mode}Score`;
//
//     // Check if the user's current score for the specified mode exists
//     const currentScore = user[modeColumn];
//
//     if (currentScore !== undefined) {
//         // Update the score if the new score is greater than the current score
//         if (newScore > currentScore) {
//             user[modeColumn] = newScore; // Update the score in the user object
//             await user.save(); // Save the updated user record to the database
//
//             return {
//                 success: true,
//                 message: 'Score updated successfully.',
//                 data: user
//             };
//         } else {
//             throw new ThrowError('New score is not greater than current score', 400, {
//                 userName,
//                 currentScore: currentScore
//             });
//         }
//     } else {
//         throw new ThrowError(`Invalid mode: ${mode}`, 400, {
//             userName,
//             mode
//         });
//     }
// };
