# Environment Variables Setup Guide

## Overview
This project uses environment variables to manage test credentials securely. Credentials are **NOT hardcoded** in test files to prevent exposure in version control.

## Setup Instructions

### 1. Install Dependencies
First, install the required package:
```bash
npm install
```

This installs `dotenv` which loads environment variables from a `.env` file.

### 2. Create `.env` File
Copy the `.env.example` file to create your `.env` file:
```bash
cp .env.example .env
```

### 3. Add Your Test Credentials
Edit the `.env` file and replace the placeholder values with your actual test credentials:
```
TEST_EMAIL=your-test-email@example.com
TEST_PASSWORD=your-test-password
INVALID_PASSWORD=a-wrong-password
ENVIRONMENT=local
```

## Security Best Practices

✅ **DO:**
- Store sensitive credentials in the `.env` file
- Keep `.env` file locally only (it's in `.gitignore`)
- Use strong, unique passwords for test accounts
- Rotate test credentials periodically
- Use environment-specific credentials (staging, production)

❌ **DON'T:**
- Commit `.env` file to version control
- Hardcode credentials in test files
- Share `.env` file via email or chat
- Use production credentials for testing
- Use the same password across different services

## How Credentials Are Used

The credentials are loaded in tests through the `credentials.config.js` file:

```javascript
const { getCredentials } = require('../config/credentials.config');
const { validEmail, validPassword } = getCredentials();
```

Environment variables are automatically loaded by `dotenv` configured in `playwright.config.js`.

## Running Tests

Tests will automatically use credentials from your `.env` file:
```bash
npm test
```

If no `.env` file is found, tests will use fallback values from `credentials.config.js`.

## CI/CD Integration

For CI/CD pipelines (GitHub Actions, Jenkins, etc.), set environment variables directly in the pipeline configuration instead of using a `.env` file:

**GitHub Actions Example:**
```yaml
env:
  TEST_EMAIL: ${{ secrets.TEST_EMAIL }}
  TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
  INVALID_PASSWORD: ${{ secrets.INVALID_PASSWORD }}
```

## Troubleshooting

**Issue:** Tests using hardcoded credentials  
**Solution:** Ensure `dotenv` is installed and `.env` file exists in the project root.

**Issue:** Environment variables not loading  
**Solution:** Check that `.env` file is in the correct location (project root) and has the right format.

**Issue:** Credentials exposing in logs  
**Solution:** Make sure `.env` is in `.gitignore` and never commit it.
