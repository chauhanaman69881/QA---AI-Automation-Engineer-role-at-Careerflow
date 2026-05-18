# Data-Driven Testing with Faker.js

This guide explains how the test suite uses Faker.js to generate unique, realistic test data automatically.

## Overview

Instead of hard-coding test data, the test suite now uses **Faker.js** to generate random, unique data for each test run. This ensures:

✅ **Unique data** - Every email, name, and password is different  
✅ **Realistic data** - Generated data mimics real user inputs  
✅ **Maintainability** - Easy to add new test scenarios  
✅ **Reduced flakiness** - No conflicts from reused test data  

## Architecture

```
tests/
├── auth.spec.js              # Login tests (data-driven)
├── signup.spec.js            # Signup tests (data-driven)
├── data/
│   ├── loginTestData.js      # Login test scenarios
│   └── signupTestData.js     # Signup test scenarios
└── utils/
    └── dataGenerator.js      # Faker utility functions
```

## How It Works

### 1. Data Generator (`tests/utils/dataGenerator.js`)

Provides reusable functions to generate unique test data:

```javascript
const { generateUserData, generateLoginCredentials, generatePassword } = require('../tests/utils/dataGenerator');

// Generate complete user with email, name, password
const user = generateUserData();
// Returns: { firstName: 'John', lastName: 'Doe', email: 'john.x@example.com', password: 'P@ss123!' }

// Generate login credentials
const credentials = generateLoginCredentials();
// Returns: { email: 'jane@example.com', password: 'SecurePass!' }

// Generate a strong password
const pwd = generatePassword();
// Returns: 'C0mpl3x!Pass'

// Generate invalid email for negative testing
const invalidEmail = generateInvalidEmail();
// Returns: 'notanemail' or 'missing@domain' (random invalid format)
```

### 2. Test Data Files

#### Login Test Data (`tests/data/loginTestData.js`)

```javascript
const { getLoginTestData } = require('./data/loginTestData');

const scenarios = getLoginTestData();
// Returns array of login test scenarios with generated data:
// [
//   {
//     id: 'TC-001',
//     title: 'Login succeeds with valid credentials',
//     email: 'unique@example.com',  // Generated unique email
//     password: 'uniquePass123!',   // Generated unique password
//     action: 'login',
//     expectSuccess: true
//   },
//   ...
// ]
```

#### Signup Test Data (`tests/data/signupTestData.js`)

```javascript
const { getSignupTestData } = require('./data/signupTestData');

const scenarios = getSignupTestData();
// Returns array of signup scenarios with generated unique user data
```

### 3. Test Execution

Tests iterate through scenarios and use generated data:

```javascript
const signupTestData = getSignupTestData();

for (const scenario of signupTestData) {
  test(`${scenario.id}: ${scenario.title}`, async ({ page }) => {
    // Each test uses uniquely generated data
    await signupPage.signup(
      scenario.firstName,    // Generated unique first name
      scenario.lastName,     // Generated unique last name
      scenario.email,        // Generated unique email
      scenario.password,     // Generated unique password
      scenario.confirmPassword
    );
  });
}
```

## Available Data Generators

### `generateUserData()`
Generates a complete unique user object with:
- `firstName` - Random first name
- `lastName` - Random last name
- `email` - Unique email address
- `password` - Strong random password

### `generateMultipleUsers(count)`
Generates multiple unique users for batch testing

### `generateUniqueEmails(count)`
Generates array of unique email addresses

### `generatePassword()`
Generates a strong random password

### `generateInvalidEmail()`
Generates an invalid email format for negative testing

### `generateLoginCredentials()`
Generates email and password for login tests

## Adding New Test Scenarios

### Example: Add a new login scenario

Edit `tests/data/loginTestData.js`:

```javascript
const getLoginTestData = () => {
  const validCredentials = generateLoginCredentials();
  
  return [
    // Existing scenarios...
    
    // New scenario with faker-generated data
    {
      id: 'TC-007',
      title: 'Login fails with SQL injection attempt',
      email: generateInvalidEmail(),  // Use faker generator
      password: "' OR '1'='1",
      action: 'login',
      expectSuccess: false,
      expectedError: 'Invalid credentials',
      description: 'SQL injection should be sanitized',
    },
  ];
};
```

### Example: Add a new signup scenario

Edit `tests/data/signupTestData.js`:

```javascript
const getSignupTestData = () => {
  const validUser = generateUserData();
  
  return [
    // Existing scenarios...
    
    // New scenario with faker-generated data
    {
      id: 'SC-007',
      title: 'Signup fails with duplicate email',
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: 'already.registered@example.com',  // Known registered email
      password: validUser.password,
      confirmPassword: validUser.password,
      acceptTerms: true,
      action: 'signup',
      expectSuccess: false,
      expectedError: 'Email already registered',
      description: 'Duplicate email should trigger error',
    },
  ];
};
```

## Running Tests

### Run all tests with faker-generated data
```bash
npm test
```

### Run only login tests
```bash
npm test -- tests/auth.spec.js
```

### Run only signup tests
```bash
npm test -- tests/signup.spec.js
```

### Run with headed browser to see Faker data in action
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

## Viewing Generated Data

Each test uses different data. To see what Faker generates, check the test output:

```bash
npx playwright test tests/auth.spec.js --project=chromium -v
```

The verbose output shows which email/password combinations were tested.

## Best Practices

1. **Always use Faker generators** - Don't hardcode test data
2. **Use `getLoginTestData()` and `getSignupTestData()`** - Call these functions once in your test setup
3. **Describe scenarios clearly** - Add `description` field to explain what's being tested
4. **Use generators for negative tests too** - `generateInvalidEmail()` for validation tests
5. **Keep test data separate** - Data stays in `/tests/data/`, logic in `/tests/*.spec.js`

## Faker Locales

You can generate data for different locales:

```javascript
const { faker } = require('@faker-js/faker');

// US English (default)
const usUser = faker.person.firstName();

// German
faker.setLocale('de');
const deUser = faker.person.firstName();

// Japanese
faker.setLocale('ja');
const jaUser = faker.person.firstName();
```

See [Faker.js locales](https://fakerjs.dev/guide/localization.html) for all supported locales.

## Troubleshooting

### Error: "Cannot read properties of undefined"
**Cause**: Faker API version mismatch  
**Solution**: Ensure Faker v8+ is installed:
```bash
npm install --save-dev @faker-js/faker@latest
```

### Same data generated across runs
**Cause**: Need different seed or more test runs  
**Solution**: Each test run generates new data by default. If you need reproducible data:

```javascript
const { faker } = require('@faker-js/faker');
faker.seed(12345); // Sets seed for reproducible data
```

## Resources

- [Faker.js Documentation](https://fakerjs.dev/)
- [Playwright Test Docs](https://playwright.dev/docs/intro)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
