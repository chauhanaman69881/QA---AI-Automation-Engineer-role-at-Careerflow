const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { getCredentials } = require('../config/credentials.config');

/**
 * Authentication Test Suite - End-to-End Login Flow
 * 
 * This test demonstrates the Page Object Model (POM) pattern in action.
 * By abstracting page interactions into page objects, tests become:
 * - More readable and maintainable
 * - Less brittle (selectors are centralized)
 * - Easier to reuse across multiple test files
 * 
 * Flow tested:
 * 1. User navigates to login page
 * 2. User enters valid credentials
 * 3. User successfully logs in
 * 4. User is redirected to dashboard
 * 5. User can verify their logged-in status
 */

test.describe('User Authentication Flow', () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects for each test
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('TC-001: User can successfully login with valid credentials', async ({ page }) => {
    // Step 1: Navigate to login page
    await loginPage.navigateToLogin();
    
    // Assertion: Verify login form is visible
    expect(await loginPage.emailInput().isVisible()).toBe(true);
    expect(await loginPage.passwordInput().isVisible()).toBe(true);

    // Step 2: Enter credentials (loaded from environment variables)
    const { validEmail, validPassword } = getCredentials();
    
    await loginPage.login(validEmail, validPassword);

    // Step 3: Wait for dashboard to load
    await dashboardPage.waitForDashboard();

    // Assertion: Verify user is logged in by checking dashboard elements
    expect(await dashboardPage.isUserLoggedIn()).toBe(true);
    
    // Assertion: Verify greeting message contains user context
    const greeting = await dashboardPage.getUserGreeting();
    expect(greeting).toBeTruthy();
  });

  test('TC-002: User cannot login with invalid credentials', async ({ page }) => {
    // Step 1: Navigate to login page
    await loginPage.navigateToLogin();

    // Step 2: Attempt login with invalid password
    const { validEmail, invalidPassword } = getCredentials();
    
    await loginPage.login(validEmail, invalidPassword);

    // Assertion: Error message should be visible
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    
    // Assertion: Verify error message content
    const errorText = await loginPage.getErrorMessage();
    expect(errorText).toContain('Invalid credentials');
  });

  test('TC-003: User can navigate to sign up from login page', async ({ page }) => {
    // Step 1: Navigate to login page
    await loginPage.navigateToLogin();

    // Step 2: Click sign up link
    await loginPage.clickSignUp();

    // Assertion: Verify navigation to sign up page
    expect(page.url()).toContain('/signup');
  });

  test('TC-004: Login button is disabled with empty fields', async ({ page }) => {
    // Step 1: Navigate to login page
    await loginPage.navigateToLogin();

    // Assertion: Login button should be disabled initially
    expect(await loginPage.isLoginButtonEnabled()).toBe(false);

    // Step 2: Fill only email
    const { validEmail } = getCredentials();
    await loginPage.emailInput().fill(validEmail);

    // Assertion: Login button should still be disabled
    expect(await loginPage.isLoginButtonEnabled()).toBe(false);
  });

  test('TC-005: User can login with remember me option checked', async ({ page }) => {
    // Step 1: Navigate to login page
    await loginPage.navigateToLogin();

    // Step 2: Login with remember me option
    const { validEmail, validPassword } = getCredentials();
    
    await loginPage.loginWithRememberMe(validEmail, validPassword);

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
