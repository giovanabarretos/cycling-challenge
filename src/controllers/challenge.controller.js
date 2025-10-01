const ChallengeService = require('../services/challenge.service');

class ChallengeController {
  async submitPasscode(req, res) {
    try {
      const { instagramUser, passcode } = req.body;
      
      if (!instagramUser || !passcode) {
        return res.status(400).json({ 
          error: 'Instagram username and passcode are required' 
        });
      }

      const result = await ChallengeService.submitPasscode(instagramUser, passcode);
      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid passcode' || 
          error.message === 'Passcode already submitted by this user') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error submitting passcode:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLeaderboard(req, res) {
    try {
      const leaderboard = await ChallengeService.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getRemainingTime(req, res) {
    try {
      const time = ChallengeService.getRemainingTime();
      res.json(time);
    } catch (error) {
      console.error('Error fetching remaining time:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = new ChallengeController();