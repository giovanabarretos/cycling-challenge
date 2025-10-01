// Global test setup
beforeAll(() => {
  // Setup test environment variables
  process.env.NODE_ENV = 'test';
  
  // Create test data directories if they don't exist
  const fs = require('fs');
  const path = require('path');
  
  const testDataDir = path.join(__dirname, '..', 'data', 'test');
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true });
  }
});

// Cleanup after all tests
afterAll(() => {
  // Clean up test data if needed
});