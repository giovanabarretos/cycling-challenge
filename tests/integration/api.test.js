const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');
const app = require('../../src/app');

describe('API Endpoints', () => {
  const examplePasscodesPath = path.join(__dirname, '../../data/example-passcodes.json');
  const exampleUsersPath = path.join(__dirname, '../../data/example-users.json');
  const passcodeBackupPath = path.join(__dirname, '../../data/example-passcodes.backup.json');
  const usersBackupPath = path.join(__dirname, '../../data/example-users.backup.json');

  beforeEach(async () => {
    // Backup original files
    await fs.copyFile(examplePasscodesPath, passcodeBackupPath);
    await fs.copyFile(exampleUsersPath, usersBackupPath);

    // Set up test data
    const testPasscodes = {
      passcodes: [
        {
          id: "1",
          code: "BIKE2023",
          points: 10,
          location: "City Park",
          active: true
        }
      ]
    };

    const testUsers = {
      users: [
        {
          instagramUser: "@example_user",
          submissions: [],
          totalPoints: 0
        }
      ]
    };

    await fs.writeFile(examplePasscodesPath, JSON.stringify(testPasscodes, null, 2));
    await fs.writeFile(exampleUsersPath, JSON.stringify(testUsers, null, 2));
  });

  afterEach(async () => {
    // Restore original files
    try {
      await fs.copyFile(passcodeBackupPath, examplePasscodesPath);
      await fs.copyFile(usersBackupPath, exampleUsersPath);
      await fs.unlink(passcodeBackupPath);
      await fs.unlink(usersBackupPath);
    } catch (error) {
      // Ignore if files don't exist
    }
  });

  describe('POST /api/passcodes', () => {
    test('should accept valid passcode submission', async () => {
      const response = await request(app)
        .post('/api/passcodes')
        .send({
          instagramUser: '@new_user',
          passcode: 'BIKE2023'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalPoints');
      expect(response.body.instagramUser).toBe('@new_user');
    });

    test('should reject invalid passcode', async () => {
      const response = await request(app)
        .post('/api/passcodes')
        .send({
          instagramUser: '@test_user',
          passcode: 'INVALID'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should reject missing parameters', async () => {
      const response = await request(app)
        .post('/api/passcodes')
        .send({
          instagramUser: '@test_user'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Instagram username and passcode are required');
    });
  });

  describe('GET /api/leaderboard', () => {
    test('should return leaderboard', async () => {
      const response = await request(app)
        .get('/api/leaderboard');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/timer', () => {
    test('should return remaining time', async () => {
      const response = await request(app)
        .get('/api/timer');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('days');
      expect(response.body).toHaveProperty('hours');
      expect(response.body).toHaveProperty('minutes');
      expect(response.body).toHaveProperty('seconds');
    });
  });
});