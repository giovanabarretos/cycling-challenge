const ChallengeService = require('../../src/services/challenge.service');
const PasscodeModel = require('../../src/models/passcode.model');
const UserModel = require('../../src/models/user.model');

// Mock the models
jest.mock('../../src/models/passcode.model');
jest.mock('../../src/models/user.model');

describe('ChallengeService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('submitPasscode', () => {
    test('should successfully submit valid passcode', async () => {
      const mockPasscode = {
        id: '1',
        code: 'TEST123',
        points: 10,
        active: true
      };
      const mockUser = {
        instagramUser: '@test_user',
        submissions: [{ passcodeId: '1', points: 10 }],
        totalPoints: 10
      };

      PasscodeModel.validatePasscode.mockResolvedValue(mockPasscode);
      UserModel.addSubmission.mockResolvedValue(mockUser);

      const result = await ChallengeService.submitPasscode('@test_user', 'TEST123');
      
      expect(PasscodeModel.validatePasscode).toHaveBeenCalledWith('TEST123');
      expect(UserModel.addSubmission).toHaveBeenCalledWith('@test_user', mockPasscode);
      expect(result).toEqual(mockUser);
    });

    test('should reject invalid passcode', async () => {
      PasscodeModel.validatePasscode.mockResolvedValue(null);

      await expect(ChallengeService.submitPasscode('@test_user', 'INVALID'))
        .rejects
        .toThrow('Invalid passcode');
      
      expect(UserModel.addSubmission).not.toHaveBeenCalled();
    });
  });

  describe('getLeaderboard', () => {
    test('should return sorted leaderboard', async () => {
      const mockLeaderboard = [
        { instagramUser: '@user1', totalPoints: 20 },
        { instagramUser: '@user2', totalPoints: 10 }
      ];

      UserModel.getLeaderboard.mockResolvedValue(mockLeaderboard);

      const result = await ChallengeService.getLeaderboard();
      
      expect(UserModel.getLeaderboard).toHaveBeenCalled();
      expect(result).toEqual(mockLeaderboard);
    });
  });

  describe('getRemainingTime', () => {
    test('should calculate remaining time correctly', () => {
      // Use Jest fake timers to mock current date
      const mockNow = new Date('2023-09-30T12:00:00Z');
      jest.useFakeTimers().setSystemTime(mockNow);

      const time = ChallengeService.getRemainingTime();
      
      expect(time).toHaveProperty('total');
      expect(time).toHaveProperty('days');
      expect(time).toHaveProperty('hours');
      expect(time).toHaveProperty('minutes');
      expect(time).toHaveProperty('seconds');

      jest.useRealTimers();
    });
  });
});