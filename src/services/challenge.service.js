const PasscodeModel = require('../models/passcode.model');
const UserModel = require('../models/user.model');

class ChallengeService {
  async submitPasscode(instagramUser, passcode) {
    // Validate passcode
    const passcodeData = await PasscodeModel.validatePasscode(passcode);
    if (!passcodeData) {
      throw new Error('Invalid passcode');
    }

    // Add submission
    return await UserModel.addSubmission(instagramUser, passcodeData);
  }

  async getLeaderboard() {
    return await UserModel.getLeaderboard();
  }

  getRemainingTime() {
    const endDateStr = process.env.CHALLENGE_END_DATE || '2025-12-31T23:59:59Z';
    const endDate = new Date(endDateStr);
    const now = new Date();
    const remainingTime = endDate - now;

    return {
      total: remainingTime,
      days: Math.floor(remainingTime / (1000 * 60 * 60 * 24)),
      hours: Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((remainingTime % (1000 * 60)) / 1000)
    };
  }
}

module.exports = new ChallengeService();