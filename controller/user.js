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
    const {userName, score, mode} = req.body;

    try {
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
            throw new ThrowError('Mode is  required', 400);
        }
        // Call the service function to retrieve the top scores based on the provided number of entries
        const leaderboard = await UserProgress.findAll({
            attributes: ['userName', 'score', 'mode'],
            where: {mode}, // Filter by mode
            order: [['score', 'DESC']],
            limit: limit,
        });
        // Return the retrieved scores as a response
        res.json({success: true, message: 'LeaderBoard fetched successfully', leaderboard});
    } catch (error) {
        sendErrorResponse(res, error);
    }
};
