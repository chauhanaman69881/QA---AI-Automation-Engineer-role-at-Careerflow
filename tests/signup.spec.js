const { test, expect } = require('@playwright/test');
const { SignupPage } = require('../pages/SignupPage');
const { getCredentials } = require('../config/credentials.config');

/**
 * User Registration Test Suite - End-to-End Signup Flow
 * 
 * This test suite covers all signup scenarios:
 * - Successful registration with valid data
 * - Validation of required fields
 * - Password mismatch detection
 * - Email validation
 * - Terms and conditions acceptance
 * - Navigation to login from signup page
 * 
 * NOTE: Replace placeholder test data with actual credentials
 */

test.describe('User Registration Flow', () => {
    let signupPage;

    test.beforeEach(async ({ page }) => {
        // Initialize signup page object
        signupPage = new SignupPage(page);
    });

    test('SC-001: User can successfully signup with valid data', async ({ page }) => {

        await signupPage.navigateToSignup();

        // Soft Assertions
        await expect.soft(signupPage.firstNameInput()).toBeVisible();
        await expect.soft(signupPage.emailInput()).toBeVisible();
        await expect.soft(signupPage.passwordInput()).toBeVisible();

        const firstName = 'John';
        const lastName = 'Doe';
        const email = 'john.doe@yopmail.com';
        const password = 'SecurePassword123!';
        const confirmPassword = 'SecurePassword123!';

        await signupPage.signup(
            firstName,
            lastName,
            email,
            password,
            confirmPassword
        );

        await page.waitForNavigation();

        await expect.soft(page).toHaveURL(/dashboard/);
    });

    test('SC-002: User cannot signup with empty required fields', async ({ page }) => {

        // Step 1: Navigate to signup page
        await test.step('Navigate to signup page', async () => {
            await signupPage.navigateToSignup();
        });

        // Step 2: Verify signup button is disabled initially
        await test.step('Verify signup button is disabled initially', async () => {

            // Soft assertion used because this is a UI validation
            await expect.soft(
                await signupPage.isSignupButtonEnabled()
            ).toBe(false);

        });

        // Step 3: Fill only first name
        await test.step('Fill only first name field', async () => {

            await signupPage.fillInput(
                signupPage.firstNameInput,
                'John'
            );

            // Button should still remain disabled
            await expect.soft(
                await signupPage.isSignupButtonEnabled()
            ).toBe(false);

        });

        // Step 4: Fill remaining mandatory fields except terms checkbox
        await test.step('Fill all required fields except terms acceptance', async () => {

            await signupPage.fillInput(
                signupPage.lastNameInput,
                'Doe'
            );

            await signupPage.fillInput(
                signupPage.emailInput,
                'john@example.com'
            );

            await signupPage.fillInput(
                signupPage.passwordInput,
                'Pass123!'
            );

            await signupPage.fillInput(
                signupPage.confirmPasswordInput,
                'Pass123!'
            );

            // Verify signup button is still disabled
            // because terms & conditions are not accepted yet
            await expect.soft(
                await signupPage.isSignupButtonEnabled()
            ).toBe(false);

        });

        // Step 5: Accept terms and conditions
        await test.step('Accept terms and conditions', async () => {

            await signupPage.acceptTerms();

            // Final validation:
            // Signup button should now become enabled
            await expect.soft(
                await signupPage.isSignupButtonEnabled()
            ).toBe(true);

        });

    });

    test('SC-003: User cannot signup with mismatched passwords', async ({ page }) => {

        // Test data
        const firstName = 'Jane';
        const lastName = 'Smith';
        const email = 'jane.smith@example.com';
        const password = 'SecurePass123!';
        const mismatchPassword = 'DifferentPass456!';

        // Step 1: Navigate to signup page
        await test.step('Navigate to signup page', async () => {

            await signupPage.navigateToSignup();

            // Hard assertion because page load is critical
            await expect(
                signupPage.signupButton()
            ).toBeVisible();

        });

        // Step 2: Fill signup form with mismatched passwords
        await test.step('Fill signup form with mismatched passwords', async () => {

            await signupPage.fillSignupForm(
                firstName,
                lastName,
                email,
                password,
                mismatchPassword
            );

            // Accept terms and conditions
            await signupPage.acceptTerms();

            // Soft assertions for field visibility/state validation
            await expect.soft(
                signupPage.firstNameInput()
            ).toBeVisible();

            await expect.soft(
                signupPage.passwordInput()
            ).toBeVisible();

            await expect.soft(
                signupPage.confirmPasswordInput()
            ).toBeVisible();

        });

        // Step 3: Submit signup form
        await test.step('Submit signup form', async () => {

            // Hard assertion because button interaction is critical
            await expect(
                signupPage.signupButton()
            ).toBeEnabled();

            await signupPage.signupButton().click();

        });

        // Step 4: Verify password mismatch validation message
        await test.step('Verify password mismatch validation message', async () => {

            // Verify error message becomes visible
            await expect.soft(
                signupPage.errorMessage()
            ).toBeVisible();

            // Verify correct validation message is displayed
            await expect.soft(
                signupPage.errorMessage()
            ).toContainText('passwords');

            // Optional stronger validation
            // await expect.soft(
            //     signupPage.errorMessage()
            // ).toContainText('Passwords do not match');

        });

    });
    test('SC-004: User cannot signup with invalid email format', async ({ page }) => {

        // Test data
        const firstName = 'Test';
        const lastName = 'User';
        const invalidEmail = 'invalid-email-format';
        const password = 'Pass123!';

        // Step 1: Navigate to signup page
        await test.step('Navigate to signup page', async () => {

            await signupPage.navigateToSignup();

            // Hard assertion because page load is critical
            await expect(
                signupPage.signupButton()
            ).toBeVisible();

        });

        // Step 2: Fill signup form with invalid email format
        await test.step('Fill signup form with invalid email format', async () => {

            await signupPage.firstNameInput().fill(firstName);

            await signupPage.lastNameInput().fill(lastName);

            await signupPage.emailInput().fill(invalidEmail);

            await signupPage.passwordInput().fill(password);

            await signupPage.confirmPasswordInput().fill(password);

            // Accept terms & conditions
            await signupPage.acceptTerms();

            // Soft assertions for UI field verification
            await expect.soft(
                signupPage.firstNameInput()
            ).toHaveValue(firstName);

            await expect.soft(
                signupPage.emailInput()
            ).toHaveValue(invalidEmail);

            await expect.soft(
                signupPage.passwordInput()
            ).toHaveValue(password);

        });

        // Step 3: Submit signup form
        await test.step('Submit signup form', async () => {

            // Hard assertion because button interaction is critical
            await expect(
                signupPage.signupButton()
            ).toBeEnabled();

            await signupPage.signupButton().click();

        });

        // Step 4: Verify invalid email validation message
        await test.step('Verify invalid email validation message', async () => {

            // Verify validation/error message is visible
            await expect.soft(
                signupPage.errorMessage()
            ).toBeVisible();

            // Verify correct validation message content
            await expect.soft(
                signupPage.errorMessage()
            ).toContainText('email');

            // Recommended stronger assertion
            // await expect.soft(
            //     signupPage.errorMessage()
            // ).toContainText('Please enter a valid email address');

        });

    });

    test('SC-005: User cannot signup with weak password', async ({ page }) => {

        // Test data
        const firstName = 'Test';
        const lastName = 'User';
        const email = 'test@example.com';
        const weakPassword = '123';

        // Step 1: Navigate to signup page
        await test.step('Navigate to signup page', async () => {

            await signupPage.navigateToSignup();

            // Hard assertion because page load is critical
            await expect(
                signupPage.signupButton()
            ).toBeVisible();

        });

        // Step 2: Fill signup form with weak password
        await test.step('Fill signup form with weak password', async () => {

            await signupPage.firstNameInput().fill(firstName);

            await signupPage.lastNameInput().fill(lastName);

            await signupPage.emailInput().fill(email);

            await signupPage.passwordInput().fill(weakPassword);

            await signupPage.confirmPasswordInput().fill(weakPassword);

            // Accept terms & conditions
            await signupPage.acceptTerms();

            // Soft assertions for entered values
            await expect.soft(
                signupPage.firstNameInput()
            ).toHaveValue(firstName);

            await expect.soft(
                signupPage.emailInput()
            ).toHaveValue(email);

            await expect.soft(
                signupPage.passwordInput()
            ).toHaveValue(weakPassword);

            await expect.soft(
                signupPage.confirmPasswordInput()
            ).toHaveValue(weakPassword);

        });

        // Step 3: Submit signup form
        await test.step('Submit signup form', async () => {

            // Hard assertion because interaction is critical
            await expect(
                signupPage.signupButton()
            ).toBeEnabled();

            await signupPage.signupButton().click();

        });

        // Step 4: Verify weak password validation message
        await test.step('Verify weak password validation message', async () => {

            // Verify validation message is visible
            await expect.soft(
                signupPage.errorMessage()
            ).toBeVisible();

            // Verify correct validation message appears
            await expect.soft(
                signupPage.errorMessage()
            ).toContainText('password');

            // Recommended stronger validation
            // await expect.soft(
            //     signupPage.errorMessage()
            // ).toContainText(
            //     'Password must contain at least 8 characters'
            // );

        });

    });

    test('SC-006: User cannot signup without accepting terms', async ({ page }) => {

        // Test data
        const firstName = 'Alex';
        const lastName = 'Johnson';
        const email = 'alex.johnson@example.com';
        const password = 'SecurePass123!';
        const confirmPassword = 'SecurePass123!';

        // Step 1: Navigate to signup page
        await test.step('Navigate to signup page', async () => {

            await signupPage.navigateToSignup();

            // Hard assertion because page load is critical
            await expect(
                signupPage.signupButton()
            ).toBeVisible();

        });

        // Step 2: Fill signup form without accepting terms
        await test.step('Fill signup form without accepting terms', async () => {

            await signupPage.fillSignupForm(
                firstName,
                lastName,
                email,
                password,
                confirmPassword
            );

            // Intentionally skipping terms acceptance

            // Soft assertions for entered values
            await expect.soft(
                signupPage.firstNameInput()
            ).toHaveValue(firstName);

            await expect.soft(
                signupPage.emailInput()
            ).toHaveValue(email);

            await expect.soft(
                signupPage.passwordInput()
            ).toHaveValue(password);

        });

        // Step 3: Verify signup button remains disabled
        await test.step('Verify signup button remains disabled', async () => {

            // Wait for page/form stability
            await page.waitForLoadState('load');

            // Verify signup button is disabled
            await expect.soft(
                signupPage.signupButton()
            ).toBeDisabled();

        });

    });
    test('SC-007: User cannot signup with already registered email', async ({ page }) => {

        // Test data
        const firstName = 'Test';
        const lastName = 'User';
        const registeredEmail = 'already.registered@example.com';
        const password = 'SecurePass123!';
        const confirmPassword = 'SecurePass123!';

        // Step 1: Navigate to signup page
        await test.step('Navigate to signup page', async () => {

            await signupPage.navigateToSignup();

            // Hard assertion because page load is critical
            await expect(
                signupPage.signupButton()
            ).toBeVisible();

        });

        // Step 2: Fill signup form with already registered email
        await test.step('Fill signup form with already registered email', async () => {

            await signupPage.fillSignupForm(
                firstName,
                lastName,
                registeredEmail,
                password,
                confirmPassword
            );

            // Accept terms & conditions
            await signupPage.acceptTerms();

            // Soft assertions for entered values
            await expect.soft(
                signupPage.emailInput()
            ).toHaveValue(registeredEmail);

            await expect.soft(
                signupPage.passwordInput()
            ).toHaveValue(password);

        });

        // Step 3: Submit signup form
        await test.step('Submit signup form', async () => {

            // Hard assertion because interaction is critical
            await expect(
                signupPage.signupButton()
            ).toBeEnabled();

            await signupPage.signupButton().click();

        });

        // Step 4: Verify already registered email validation message
        await test.step('Verify already registered email validation message', async () => {

            // Verify error message is visible
            await expect.soft(
                signupPage.errorMessage()
            ).toBeVisible();

            // Verify correct validation message
            await expect.soft(
                signupPage.errorMessage()
            ).toContainText('already exists');

            // Recommended stronger validation
            // await expect.soft(
            //     signupPage.errorMessage()
            // ).toContainText(
            //     'Email already registered'
            // );

        });

    });
    test('SC-008: User can navigate to login from signup page', async ({ page }) => {

        // Step 1: Navigate to signup page
        await test.step('Navigate to signup page', async () => {

            await signupPage.navigateToSignup();

            // Hard assertion because page load is critical
            await expect(
                signupPage.loginLink()
            ).toBeVisible();

        });

        // Step 2: Click login link
        await test.step('Click login link', async () => {

            // Hard assertion because interaction is critical
            await expect(
                signupPage.loginLink()
            ).toBeEnabled();

            await signupPage.clickLoginLink();

        });

        // Step 3: Verify navigation to login page
        await test.step('Verify navigation to login page', async () => {

            // Hard assertion because this is the final business validation
            await expect(page).toHaveURL(/login/);

        });

    });

    test('SC-009: User sees validation errors for special characters in name', async ({ page }) => {
        // Step 1: Navigate to signup page
        await signupPage.navigateToSignup();

        // Step 2: Fill form with special characters in name
        await signupPage.firstNameInput().fill('John@#$');
        await signupPage.lastNameInput().fill('Doe!!!');
        await signupPage.emailInput().fill('john@example.com');
        await signupPage.passwordInput().fill('Pass123!');
        await signupPage.confirmPasswordInput().fill('Pass123!');
        await signupPage.acceptTerms();

        // Step 3: Try to submit form
        await signupPage.signupButton().click();

        // Assertion: Error message should appear
        expect(await signupPage.isErrorMessageVisible()).toBe(true);

        // Assertion: Verify error message content
        const errorText = await signupPage.getErrorMessage();
        expect(errorText).toContain('name');
    });

    test('SC-010: User receives confirmation email after successful signup', async ({ page }) => {
        // Step 1: Navigate to signup page
        await signupPage.navigateToSignup();

        // Step 2: Fill form with valid signup data
        await signupPage.firstNameInput().fill('Email');
        await signupPage.lastNameInput().fill('Verify');
        await signupPage.emailInput().fill('verify@example.com');
        await signupPage.passwordInput().fill('SecurePass123!');
        await signupPage.confirmPasswordInput().fill('SecurePass123!');
        await signupPage.acceptTerms();

        // Step 3: Submit signup form
        await signupPage.signupButton().click();

        // Assertion: Verify signup success message
        expect(await signupPage.isSuccessMessageVisible()).toBe(true);

        // Assertion: Verify success message content
        const successText = await signupPage.getSuccessMessage();
        expect(successText).toContain('verification');

        // Note:
        // Email verification can be automated using:
        // - Mailhog
        // - Mailtrap
        // - Temp Mail APIs
        // - Yopmail
    });
});
