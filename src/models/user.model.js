const fs = require('fs').promises;
const path = require('path');

class UserModel {
  constructor() {
    this.dataPath = path.join(__dirname, '../../data/example-users.json');
  }

  async getAllUsers() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8');
      return JSON.parse(data).users;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, return empty array
        return [];
      }
      throw error;
    }
  }

  async addSubmission(instagramUser, passcodeData) {
    const users = await this.getAllUsers();
    const submission = {
      passcodeId: passcodeData.id,
      timestamp: new Date().toISOString(),
      points: passcodeData.points
    };

    let user = users.find(u => u.instagramUser === instagramUser);
    if (!user) {
      user = {
        instagramUser,
        submissions: [],
        totalPoints: 0
      };
      users.push(user);
    }

    // Check if user already submitted this passcode
    if (user.submissions.some(s => s.passcodeId === passcodeData.id)) {
      throw new Error('Passcode already submitted by this user');
    }

    user.submissions.push(submission);
    user.totalPoints += passcodeData.points;

    await fs.writeFile(this.dataPath, JSON.stringify({ users }, null, 2));
    return user;
  }

  async getLeaderboard() {
    const users = await this.getAllUsers();
    return users
      .sort((a, b) => {
        // First sort by total points
        if (b.totalPoints !== a.totalPoints) {
          return b.totalPoints - a.totalPoints;
        }
        // If points are equal, sort by earliest submission
        const aEarliest = Math.min(...a.submissions.map(s => new Date(s.timestamp)));
        const bEarliest = Math.min(...b.submissions.map(s => new Date(s.timestamp)));
        return aEarliest - bEarliest;
      });
  }
}

module.exports = new UserModel();