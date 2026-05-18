/**
 * Shared Constants for QA Automation Tests
 * 
 * Centralized configuration for timeouts, selectors, and common values
 * to ensure consistency across all page objects and tests.
 */

// Timeout Constants (milliseconds)
const TIMEOUTS = {
  SHORT: 5000,        // UI interactions (error messages, visibility checks)
  MEDIUM: 30000,      // Element wait (page loads, navigation)
  LONG: 60000,        // Complex operations (full page loads, redirects)
  PAGE_LOAD: 30000,   // Page load completion
};

// Common Wait Strategies
const WAIT_FOR = {
  VISIBILITY: 5000,
  ELEMENT: 30000,
  PAGE_LOAD: 'load',
  NETWORK_IDLE: 'networkidle',
};

// Data Validation Patterns
const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
};

// Error Messages
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  PASSWORDS_MISMATCH: 'Passwords do not match',
  EMAIL_REQUIRED: 'Email is required',
  FIRST_NAME_REQUIRED: 'First name is required',
  INVALID_EMAIL: 'Invalid email format',
  TERMS_REQUIRED: 'You must accept terms',
};

// Test Data Selectors
const SELECTORS = {
  ERROR_MESSAGE: '[data-testid="error-message"]',
  SUCCESS_MESSAGE: '[data-testid="success-message"]',
  USER_GREETING: '[data-testid="user-greeting"]',
  JOB_LIST: '[data-testid="job-list"] > li',
};

module.exports = {
  TIMEOUTS,
  WAIT_FOR,
  VALIDATION,
  ERROR_MESSAGES,
  SELECTORS,
};
