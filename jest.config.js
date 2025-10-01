module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testTimeout: 10000,
  // Setup test coverage reporting
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/public/**',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  // Setup test file patterns
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  // Setup test environment configuration
  setupFilesAfterEnv: ['./tests/setup.js'],
  // Worker configuration
  maxWorkers: '50%',
  workerIdleMemoryLimit: "512MB"
};