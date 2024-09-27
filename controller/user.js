const {updateScore, register} = require('../service/userService');
const {sendErrorResponse} = require('../helpers/response');
const ThrowError = require('../helpers/ThrowError');
const UserProgress = require("../models/userProgress");

exports.register = async (req, res) => {
    try {
        const {userName} = req.body;
        if (!userName) {
            throw new ThrowError('userName is required', 400);
        }

        // Call the register function from the service with the provided userName
        const result = await register(userName);
        res.json(result);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};
exports.updateScore = async (req, res) => {

    const {userName, mode, score} = req.body;

    try {
        // console.log("req.body", req.body)
        if (!(userName && score && mode)) {
            throw new ThrowError('All inputs are required', 400);
        }

        // Call the updateScore function from the service with the provided userName, score, and mode
        const result = await updateScore(userName, score, mode);
        res.json(result);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};
exports.leaderBoard = async (req, res) => {
    try {
        let limit = req.query.limit;
        let mode = req.query.mode;
        limit = parseInt(limit) || 20;

        if (!mode) {
            throw new ThrowError('Mode is required', 400);
        }

        // Check if any entries exist for the given mode
        const modeExists = await UserProgress.findOne({
            where: { mode },
        });

        if (!modeExists) {
            throw new ThrowError('Mode does not exist', 404);
        }

        // Retrieve the top scores based on the provided number of entries
        const leaderboard = await UserProgress.findAll({
            attributes: ['score', 'mode', 'userId'],
            where: { mode }, // Filter by mode
            order: [['score', 'DESC']], // Order by score in descending order
            limit: limit, // Limit the number of results
        });

        // Return the retrieved scores as a response
        res.json({ success: true, message: 'LeaderBoard fetched successfully', leaderboard });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};


// exports.leaderBoard = async (req, res) => {
//     try {
//         let limit = req.query.limit;
//         let mode = req.query.mode;
//         limit = parseInt(limit) || 20;
//         mode = parseInt(mode);
//
//         if (!mode) {
//             throw new ThrowError('Mode is required', 400);
//         }
//
//         const modeForLeaderboard = `mode${mode}Score`;
//
//         // Check if the mode column exists in the UserProgress table
//         const columnExists = await UserProgress.describe();
//
//         if (!columnExists[modeForLeaderboard]) {
//             throw new ThrowError(`Mode ${mode} does not exist in the database`, 404);
//         }
//
//         // Call the service function to retrieve the top scores based on the provided number of entries
//         const leaderboard = await UserProgress.findAll({
//             attributes: ['userName', [modeForLeaderboard, 'score']], // Dynamic column alias as 'score'
//             order: [[modeForLeaderboard, 'DESC']], // Order by the dynamic mode score
//             limit: limit,
//         });
//
//         // Return the retrieved scores as a response
//         res.json({
//             success: true,
//             message: 'LeaderBoard fetched successfully',
//             leaderboard: leaderboard.map(entry => ({
//                 userName: entry.userName,
//                 score: entry.get('score'), // Retrieve the dynamic score
//                 mode: mode // Include the mode in the response
//             })),
//         });
//     } catch (error) {
//         sendErrorResponse(res, error);
//     }
// };


