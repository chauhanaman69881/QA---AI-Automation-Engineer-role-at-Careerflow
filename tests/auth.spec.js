const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { getLoginTestData } = require('./data/loginTestData');
const { generateLoginCredentials } = require('./utils/dataGenerator');

/**
 * Authentication Test Suite - End-to-End Login Flow
 * 
 * This test demonstrates the Page Object Model (POM) pattern in action.
 * By abstracting page interactions into page objects, tests become:
 * - More readable and maintainable
 * - Less brittle (selectors are centralized)
 * - Easier to reuse across multiple test files
 *
 * Data-driven approach:
 * - Generates unique test data using Faker.js for each test run
 * - Tests both valid and invalid login scenarios
 * - Validates form field behavior and error handling
 */

test.describe('User Authentication Flow', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects for each test
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  // Generate unique test data for this test run
  const loginTestData = getLoginTestData();

  for (const scenario of loginTestData) {
    test(`${scenario.id}: ${scenario.title}`, async ({ page }) => {
      await loginPage.navigateToLogin();
      expect(await loginPage.emailInput().isVisible()).toBe(true);
      expect(await loginPage.passwordInput().isVisible()).toBe(true);

      // Use generated data directly from scenario
      const email = scenario.email;
      const password = scenario.password;

      if (scenario.action === 'checkButtonDisabled') {
        if (email) await loginPage.emailInput().fill(email);
        if (password) await loginPage.passwordInput().fill(password);
        expect(await loginPage.isLoginButtonEnabled()).toBe(false);
      } else {
        await loginPage.login(email, password);

        if (scenario.expectSuccess) {
          await dashboardPage.waitForDashboard();
          expect(await dashboardPage.isUserLoggedIn()).toBe(true);
          const greeting = await dashboardPage.getUserGreeting();
          expect(greeting).toBeTruthy();
        } else {
          // For unsuccessful login, verify the appropriate error based on error type
          if (scenario.errorType === 'format') {
            // Format validation errors (invalid email format)
            await expect(
              page.getByText(/Please enter a valid email address/i)
            ).toBeVisible();
          } else if (scenario.errorType === 'not_found') {
            // Credential validation errors (user not found)
            await expect(
              page.getByText('User not found! Please use the Sign Up option to create a new account.')
            ).toBeVisible();
          }
        }
      }
    });
  }

 

  test('TC-008: User can login with remember me option checked', async ({ page }) => {
    // Step 1: Navigate to login page
    await loginPage.navigateToLogin();

    // Step 2: Login with remember me option using generated credentials
    const { email, password } = generateLoginCredentials();
    
    await loginPage.loginWithRememberMe(email, password);

    // Step 3: Wait for dashboard
    await dashboardPage.waitForDashboard();

    // Assertion: User should be logged in
    expect(await dashboardPage.isUserLoggedIn()).toBe(true);

    // Assertion: Verify persistent cookie/session is set
    const cookies = await page.context().cookies();
    const rememberMeCookie = cookies.find(c => c.name === 'remember_me');
    expect(rememberMeCookie).toBeDefined();
  });
});
