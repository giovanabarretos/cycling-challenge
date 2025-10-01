const fs = require('fs').promises;
const path = require('path');
const UserModel = require('../../src/models/user.model');

// Mock data
const testUsers = {
  users: [
    {
      instagramUser: '@test_user',
      submissions: [
        {
          passcodeId: '1',
          timestamp: '2023-09-30T10:00:00Z',
          points: 10
        }
      ],
      totalPoints: 10
    }
  ]
};

describe('UserModel', () => {
  const testDataPath = path.join(__dirname, '../../data/test/users.json');
  
  beforeEach(async () => {
    // Set up test data before each test
    await fs.writeFile(testDataPath, JSON.stringify(testUsers));
    // Override the data path for testing
    UserModel.dataPath = testDataPath;
  });

  afterEach(async () => {
    // Clean up test data after each test
    try {
      await fs.unlink(testDataPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  describe('getLeaderboard', () => {
    test('should return sorted leaderboard', async () => {
      const leaderboard = await UserModel.getLeaderboard();
      expect(leaderboard).toHaveLength(1);
      expect(leaderboard[0].instagramUser).toBe('@test_user');
      expect(leaderboard[0].totalPoints).toBe(10);
    });

    test('should return empty array when no users exist', async () => {
      await fs.unlink(testDataPath);
      const leaderboard = await UserModel.getLeaderboard();
      expect(leaderboard).toEqual([]);
    });
  });

  describe('addSubmission', () => {
    test('should add new submission for existing user', async () => {
      const passcode = {
        id: '2',
        points: 5
      };
      
      await UserModel.addSubmission('@test_user', passcode);
      const users = JSON.parse(await fs.readFile(testDataPath, 'utf8')).users;
      
      expect(users[0].submissions).toHaveLength(2);
      expect(users[0].totalPoints).toBe(15);
    });

    test('should create new user with submission', async () => {
      const passcode = {
        id: '1',
        points: 10
      };
      
      await UserModel.addSubmission('@new_user', passcode);
      const users = JSON.parse(await fs.readFile(testDataPath, 'utf8')).users;
      
      expect(users).toHaveLength(2);
      const newUser = users.find(u => u.instagramUser === '@new_user');
      expect(newUser).toBeTruthy();
      expect(newUser.totalPoints).toBe(10);
    });

    test('should prevent duplicate passcode submissions', async () => {
      const passcode = {
        id: '1',
        points: 10
      };
      
      await expect(UserModel.addSubmission('@test_user', passcode))
        .rejects
        .toThrow('Passcode already submitted by this user');
    });
  });
});