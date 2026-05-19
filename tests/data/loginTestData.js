/**
 * Login Test Data with Faker-Generated Unique Data
 * 
 * This data-driven approach generates unique test credentials for each test run.
 * This ensures realistic testing without hardcoding values.
 */

const { generateLoginCredentials, generateInvalidEmail, generatePassword } = require('../utils/dataGenerator');

/**
 * Generate login test scenarios with unique data
 * Each call generates fresh credentials using Faker
 * @returns {Array} Array of login test scenarios
 */
const getLoginTestData = () => {
  const validCredentials = generateLoginCredentials();
  const invalidCredentials = generateLoginCredentials();
  
  return [
    {
      id: 'TC-001',
      title: 'Login succeeds with valid credentials',
      email: validCredentials.email,
      password: validCredentials.password,
      action: 'login',
      expectSuccess: true,
      expectedError: null,
      description: 'Valid email and password should allow successful login',
    },
    {
      id: 'TC-002',
      title: 'Login fails with invalid password',
      email: validCredentials.email,
      password: generatePassword(), // Different password for same email
      action: 'login',
      expectSuccess: false,
      errorType: 'not_found',
      expectedError: 'User not found',
      description: 'Wrong password should trigger error message',
    },
    {
      id: 'TC-003',
      title: 'Login fails with invalid email format',
      email: generateInvalidEmail(),
      password: validCredentials.password,
      action: 'login',
      expectSuccess: false,
      errorType: 'format',
      expectedError: 'Please enter a valid email address',
      description: 'Malformed email should fail validation',
    },
    {
      id: 'TC-004',
      title: 'Login button stays disabled when password is empty',
      email: validCredentials.email,
      password: '',
      action: 'checkButtonDisabled',
      expectSuccess: false,
      expectedError: null,
      description: 'Empty password field should keep submit button disabled',
    },
    {
      id: 'TC-005',
      title: 'Login button stays disabled when email is empty',
      email: '',
      password: validCredentials.password,
      action: 'checkButtonDisabled',
      expectSuccess: false,
      expectedError: null,
      description: 'Empty email field should keep submit button disabled',
    },
    {
      id: 'TC-006',
      title: 'Login button stays disabled with both fields empty',
      email: '',
      password: '',
      action: 'checkButtonDisabled',
      expectSuccess: false,
      expectedError: null,
      description: 'Empty email and password should keep submit button disabled',
    },
  ];
};

module.exports = { getLoginTestData };