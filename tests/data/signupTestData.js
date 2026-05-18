/**
 * Signup Test Data with Faker-Generated Unique Data
 * 
 * This data-driven approach generates unique test user data for each test run.
 * Ensures each signup test uses fresh, unique email addresses and credentials.
 */

const { generateUserData, generatePassword, generateInvalidEmail } = require('../utils/dataGenerator');

/**
 * Generate signup test scenarios with unique data
 * Each call generates fresh user data using Faker
 * @returns {Array} Array of signup test scenarios
 */
const getSignupTestData = () => {
  const validUser = generateUserData();
  const anotherUser = generateUserData();
  
  return [
    {
      id: 'SC-001',
      title: 'User can successfully signup with valid data',
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: validUser.email,
      password: validUser.password,
      confirmPassword: validUser.password,
      acceptTerms: true,
      action: 'signup',
      expectSuccess: true,
      expectedError: null,
      description: 'Valid user data should allow successful signup',
    },
    {
      id: 'SC-002',
      title: 'User cannot signup with mismatched passwords',
      firstName: anotherUser.firstName,
      lastName: anotherUser.lastName,
      email: anotherUser.email,
      password: anotherUser.password,
      confirmPassword: generatePassword(), // Different password
      acceptTerms: true,
      action: 'signup',
      expectSuccess: false,
      expectedError: 'Passwords do not match',
      description: 'Mismatched passwords should trigger validation error',
    },
    {
      id: 'SC-003',
      title: 'User cannot signup without accepting terms',
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: generateUserData().email,
      password: validUser.password,
      confirmPassword: validUser.password,
      acceptTerms: false,
      action: 'signup',
      expectSuccess: false,
      expectedError: 'You must accept terms',
      description: 'Terms acceptance is mandatory for signup',
    },
    {
      id: 'SC-004',
      title: 'User cannot signup with invalid email format',
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: generateInvalidEmail(),
      password: validUser.password,
      confirmPassword: validUser.password,
      acceptTerms: true,
      action: 'signup',
      expectSuccess: false,
      expectedError: 'Invalid email format',
      description: 'Malformed email should fail validation',
    },
    {
      id: 'SC-005',
      title: 'User cannot signup with empty first name',
      firstName: '',
      lastName: validUser.lastName,
      email: generateUserData().email,
      password: validUser.password,
      confirmPassword: validUser.password,
      acceptTerms: true,
      action: 'signup',
      expectSuccess: false,
      expectedError: 'First name is required',
      description: 'First name is a mandatory field',
    },
    {
      id: 'SC-006',
      title: 'User cannot signup with empty email',
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: '',
      password: validUser.password,
      confirmPassword: validUser.password,
      acceptTerms: true,
      action: 'signup',
      expectSuccess: false,
      expectedError: 'Email is required',
      description: 'Email is a mandatory field',
    },
  ];
};

module.exports = { getSignupTestData };
