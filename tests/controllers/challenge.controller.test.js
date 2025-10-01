const ChallengeController = require('../../src/controllers/challenge.controller');
const ChallengeService = require('../../src/services/challenge.service');

// Mock the service
jest.mock('../../src/services/challenge.service');

describe('ChallengeController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Set up mock request and response
    mockReq = {
      body: {}
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('submitPasscode', () => {
    test('should submit valid passcode successfully', async () => {
      const mockUser = {
        instagramUser: '@test_user',
        submissions: [{ passcodeId: '1', points: 10 }],
        totalPoints: 10
      };

      mockReq.body = {
        instagramUser: '@test_user',
        passcode: 'TEST123'
      };

      ChallengeService.submitPasscode.mockResolvedValue(mockUser);

      await ChallengeController.submitPasscode(mockReq, mockRes);

      expect(ChallengeService.submitPasscode).toHaveBeenCalledWith('@test_user', 'TEST123');
      expect(mockRes.json).toHaveBeenCalledWith(mockUser);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should return 400 for missing parameters', async () => {
      mockReq.body = { instagramUser: '@test_user' }; // Missing passcode

      await ChallengeController.submitPasscode(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Instagram username and passcode are required'
      });
      expect(ChallengeService.submitPasscode).not.toHaveBeenCalled();
    });

    test('should return 400 for invalid passcode', async () => {
      mockReq.body = {
        instagramUser: '@test_user',
        passcode: 'INVALID'
      };

      ChallengeService.submitPasscode.mockRejectedValue(new Error('Invalid passcode'));

      await ChallengeController.submitPasscode(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid passcode'
      });
    });
  });

  describe('getLeaderboard', () => {
    test('should return leaderboard successfully', async () => {
      const mockLeaderboard = [
        { instagramUser: '@user1', totalPoints: 20 },
        { instagramUser: '@user2', totalPoints: 10 }
      ];

      ChallengeService.getLeaderboard.mockResolvedValue(mockLeaderboard);

      await ChallengeController.getLeaderboard(mockReq, mockRes);

      expect(ChallengeService.getLeaderboard).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockLeaderboard);
    });

    test('should handle service errors', async () => {
      ChallengeService.getLeaderboard.mockRejectedValue(new Error('Database error'));

      await ChallengeController.getLeaderboard(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });
  });

  describe('getRemainingTime', () => {
    test('should return remaining time successfully', async () => {
      const mockTime = {
        total: 123456,
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4
      };

      ChallengeService.getRemainingTime.mockReturnValue(mockTime);

      await ChallengeController.getRemainingTime(mockReq, mockRes);

      expect(ChallengeService.getRemainingTime).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockTime);
    });

    test('should handle calculation errors', async () => {
      ChallengeService.getRemainingTime.mockImplementation(() => {
        throw new Error('Calculation error');
      });

      await ChallengeController.getRemainingTime(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });
  });
});