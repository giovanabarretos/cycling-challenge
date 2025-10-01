const express = require('express');
const router = express.Router();
const ChallengeController = require('../controllers/challenge.controller');

// Submit a passcode
router.post('/passcodes', ChallengeController.submitPasscode);

// Get leaderboard
router.get('/leaderboard', ChallengeController.getLeaderboard);

// Get remaining time
router.get('/timer', ChallengeController.getRemainingTime);

module.exports = router;