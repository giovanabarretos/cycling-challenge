const fs = require('fs').promises;
const path = require('path');
const PasscodeModel = require('../../src/models/passcode.model');

// Mock data
const testPasscodes = {
  passcodes: [
    {
      id: '1',
      code: 'TEST123',
      points: 10,
      location: 'Test Location',
      active: true
    },
    {
      id: '2',
      code: 'INACTIVE',
      points: 5,
      location: 'Inactive Location',
      active: false
    }
  ]
};

describe('PasscodeModel', () => {
  const testDataPath = path.join(__dirname, '../../data/test/passcodes.json');
  
  beforeEach(async () => {
    // Set up test data before each test
    await fs.writeFile(testDataPath, JSON.stringify(testPasscodes));
    // Override the data path for testing
    PasscodeModel.dataPath = testDataPath;
  });

  afterEach(async () => {
    // Clean up test data after each test
    try {
      await fs.unlink(testDataPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
  });

  describe('getAllPasscodes', () => {
    test('should return all passcodes', async () => {
      const passcodes = await PasscodeModel.getAllPasscodes();
      expect(passcodes).toHaveLength(2);
      expect(passcodes).toEqual(testPasscodes.passcodes);
    });

    test('should return empty array when no passcodes exist', async () => {
      await fs.unlink(testDataPath);
      const passcodes = await PasscodeModel.getAllPasscodes();
      expect(passcodes).toEqual([]);
    });
  });

  describe('validatePasscode', () => {
    test('should validate correct active passcode', async () => {
      const result = await PasscodeModel.validatePasscode('TEST123');
      expect(result).toBeTruthy();
      expect(result.code).toBe('TEST123');
      expect(result.active).toBe(true);
    });

    test('should reject inactive passcode', async () => {
      const result = await PasscodeModel.validatePasscode('INACTIVE');
      expect(result).toBeFalsy();
    });

    test('should reject invalid passcode', async () => {
      const result = await PasscodeModel.validatePasscode('INVALID');
      expect(result).toBeFalsy();
    });
  });
});