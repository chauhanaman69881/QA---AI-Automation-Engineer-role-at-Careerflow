/**
 * Credentials Configuration
 * Loads test credentials from environment variables
 * This keeps sensitive data out of version control
 */

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
