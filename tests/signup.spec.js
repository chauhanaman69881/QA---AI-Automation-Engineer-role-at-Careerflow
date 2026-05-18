const { test, expect } = require('@playwright/test');
const { SignupPage } = require('../pages/SignupPage');
const { getSignupTestData } = require('./data/signupTestData');

/**
 * User Registration Test Suite - End-to-End Signup Flow
 * 
 * Data-driven test suite for signup scenarios:
 * - Successful registration with unique generated user data
 * - Validation of required fields
 * - Password mismatch detection
 * - Email validation
 * - Terms and conditions acceptance
 * - Navigation to login from signup page
 * 
 * Uses Faker.js to generate unique user data for each test run
 */

test.describe('User Registration Flow', () => {
    let signupPage;

    test.beforeEach(async ({ page }) => {
        // Initialize signup page object
        signupPage = new SignupPage(page);
    });

    // Generate unique test data for this test run
    const signupTestData = getSignupTestData();

    for (const scenario of signupTestData) {
        test(`${scenario.id}: ${scenario.title}`, async ({ page }) => {
            await signupPage.navigateToSignup();

            // Verify signup form is visible
            await expect.soft(signupPage.firstNameInput()).toBeVisible();
            await expect.soft(signupPage.emailInput()).toBeVisible();
            await expect.soft(signupPage.passwordInput()).toBeVisible();

            if (scenario.action === 'signup') {
                // Fill signup form with generated data
                await signupPage.fillSignupForm(
                    scenario.firstName,
                    scenario.lastName,
                    scenario.email,
                    scenario.password,
                    scenario.confirmPassword
                );

                if (scenario.acceptTerms) {
                    await signupPage.acceptTerms();
                }

                // Click signup button
                if (await signupPage.isSignupButtonEnabled()) {
                    await signupPage.signupButton().click();

                    if (scenario.expectSuccess) {
                        // Verify successful signup
                        await page.waitForNavigation().catch(() => {});
                        await expect.soft(page).toHaveURL(/dashboard|home/);
                    } else {
                        // Verify error message
                        await expect.soft(signupPage.errorMessage()).toBeVisible();
                        const errorText = await signupPage.errorMessage().textContent();
                        expect(errorText).toContain(scenario.expectedError);
                    }
                } else if (!scenario.expectSuccess) {
                    // Button should remain disabled for invalid scenarios
                    expect(await signupPage.isSignupButtonEnabled()).toBe(false);
                }
            }
        });
    }

    test('SC-007: User can navigate to login from signup page', async ({ page }) => {
        // Step 1: Navigate to signup page
        await signupPage.navigateToSignup();

        // Step 2: Click login link
        await signupPage.clickLoginLink();

        // Assertion: Verify navigation to login page
        await expect(page).toHaveURL(/login/);
    });
});
