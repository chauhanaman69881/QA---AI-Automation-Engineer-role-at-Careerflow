/**
 * Test Data Generator Utility
 * 
 * Uses Faker.js to generate realistic, unique test data for each test run.
 * This ensures tests are data-driven and realistic without hardcoding values.
 * All generated data is validated to prevent null/undefined values in tests.
 */

const { faker } = require('@faker-js/faker');
const { VALIDATION } = require('../../config/constants');

/**
 * Generate unique user registration data with validation
 * @returns {Object} User data with email, firstName, lastName, password
 * @throws {Error} If generated data fails validation
 */
const generateUserData = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email();
  const password = generatePassword();

  // Validate generated data
  if (!firstName || firstName.length < VALIDATION.NAME_MIN_LENGTH) {
    throw new Error('Generated firstName is invalid');
  }
  if (!lastName || lastName.length < VALIDATION.NAME_MIN_LENGTH) {
    throw new Error('Generated lastName is invalid');
  }
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    throw new Error('Generated email is invalid');
  }
  if (!password || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    throw new Error('Generated password is too short');
  }

  return { firstName, lastName, email, password };
};

/**
 * Generate multiple unique user records for batch testing
 * @param {number} count - Number of unique user records to generate
 * @returns {Array} Array of user data objects
 */
const generateMultipleUsers = (count = 5) => {
  return Array.from({ length: count }, () => generateUserData());
};

/**
 * Generate unique email addresses
 * @param {number} count - Number of unique emails
 * @returns {Array} Array of unique email addresses
 */
const generateUniqueEmails = (count = 1) => {
  return Array.from({ length: count }, () => faker.internet.email());
};

/**
 * Generate strong password with validation
 * @returns {string} A strong random password (14+ characters)
 * @throws {Error} If generated password fails validation
 */
const generatePassword = () => {
  const password = faker.internet.password({
    length: 14,
    memorable: false,
    pattern: /[A-Za-z0-9!@#$%^&*]/,
  });

  if (!password || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    throw new Error('Generated password is too short');
  }

  return password;
};

/**
 * Generate invalid email for negative testing
 * @returns {string} An invalid email address
 */
const generateInvalidEmail = () => {
  const invalidFormats = [
    'notanemail',
    'missing@domain',
    '@nodomain.com',
    'spaces in@email.com',
    'double@@domain.com',
  ];
  return invalidFormats[Math.floor(Math.random() * invalidFormats.length)];
};

/**
 * Generate login credentials with validation
 * @returns {Object} Login credentials with email and password
 * @throws {Error} If generated credentials fail validation
 */
const generateLoginCredentials = () => {
  const email = faker.internet.email();
  const password = generatePassword();

  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    throw new Error('Generated email is invalid');
  }

  return { email, password };
};

module.exports = {
  generateUserData,
  generateMultipleUsers,
  generateUniqueEmails,
  generatePassword,
  generateInvalidEmail,
  generateLoginCredentials,
};
