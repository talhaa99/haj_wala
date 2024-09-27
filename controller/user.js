const {updateScore, register} = require('../service/userService');
const {sendErrorResponse} = require('../helpers/response');
const ThrowError = require('../helpers/ThrowError');
const UserProgress = require("../models/userProgress");
const {Op} = require('sequelize'); // Make sure to import Op for Sequelize operations
const User = require('../models/user');
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

        // Construct the array of modes based on the base mode
        mode = parseInt(mode);
        const modes = ["A", "B", "C"];

        // Initialize an object to hold the leaderboards for each mode
        const leaderboards = {};

        // Fetch leaderboard for each mode
        for (const m of modes) {
            leaderboards[`leaderboard${m}`]  = await UserProgress.findAll({
                attributes: ['score', 'mode', 'userId'],
                where: {
                    mode: `${mode}${m.toLowerCase()}`, // Filter by the current mode
                },
                order: [['score', 'DESC']], // Order by score in descending order
                limit: limit, // Limit the number of results
            });

            // Map the fetched leaderboard to include userName
            // const formattedLeaderboard = leaderboard.map(entry => ({
            //     score: entry.score,
            //     mode: entry.mode,
            //     userId: entry.userId,
            // }));
        }
        
        res.json({
            success: true,
            message: 'Leaderboards fetched successfully',
            leaderboards,
        });
    } catch (error) {
        sendErrorResponse(res, error);
    }
};




