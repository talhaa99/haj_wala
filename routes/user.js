const express = require('express');
const router = express.Router();
const {
    updateScore,
    register,
    leaderBoard,
} = require('../controller/user');

// POST request to update user score
router.post('/updateScore', updateScore);
router.post('/register', register);
router.get('/leaderboard', leaderBoard);

module.exports = router;