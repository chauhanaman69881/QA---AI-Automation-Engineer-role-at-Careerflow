/**
 * Credentials Configuration
 * 
 * ⚠️ DEPRECATED: This file is no longer used.
 * 
 * Migration: Tests now use Faker.js for generating unique test data
 * See: tests/utils/dataGenerator.js
 * See: tests/data/loginTestData.js
 * 
 * This file is kept for reference only. Remove if not needed.
 */

// Deprecated - use generateLoginCredentials() from tests/utils/dataGenerator.js instead
const getCredentials = () => {
  return {
    validEmail: process.env.TEST_EMAIL || 'test@careerflow.ai',
    validPassword: process.env.TEST_PASSWORD || 'TestPassword123!',
    invalidPassword: process.env.INVALID_PASSWORD || 'WrongPassword123!',
  };
};

module.exports = {
  getCredentials,
};
