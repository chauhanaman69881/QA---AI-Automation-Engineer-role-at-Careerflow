const { BasePage } = require('./BasePage');
const { URLS } = require('../config/urls.config');

/**
 * SignupPage - Page Object Model for signup page
 * Encapsulates all selectors and actions related to signup functionality
 * 
 * Note: Signup is a tab on the login page, not a separate URL
 */
class SignupPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors using Playwright accessibility roles (best practice)
    // These target elements by their role and placeholder/label text
    this.firstNameInput = () => this.page.getByRole('textbox', { name: /first name/i });
    this.lastNameInput = () => this.page.getByRole('textbox', { name: /last name/i });
    this.emailInput = () => this.page.getByRole('textbox', { name: /example@email.com/i });
    this.passwordInput = () => this.page.getByRole('textbox', { name: /password/i });
    this.agreeTermsCheckbox = () => this.page.getByRole('checkbox');
    this.signupButton = () => this.page.getByRole('button', { name: /sign up/i });
    this.loginButton = () => this.page.getByRole('button', { name: /log in/i });
    this.signupTab = () => this.page.getByRole('tab', { name: 'Sign Up' });
  }

  /**
   * 
   * Navigate to signup page
   * Steps:
   * 1. First navigate to login page
   * 2. Click on "Sign Up" tab
   */
  async navigateToSignup() {
    // Navigate to login page first
    await this.goto(URLS.login);
    await this.waitForPageLoad();
    
    // Click on the "Sign Up" tab
    await this.page.getByRole('tab', { name: 'Sign Up' }).click();
    await this.page.waitForLoadState('load');
  }

  /**
   * Fill all signup form fields
   */
  async fillSignupForm(firstName, lastName, email, password, confirmPassword) {
    await this.firstNameInput().fill(firstName);
    await this.lastNameInput().fill(lastName);
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    
  }

  /**
   * Perform complete signup flow
   */
  async signup(firstName, lastName, email, password, confirmPassword) {
    await this.fillSignupForm(firstName, lastName, email, password, confirmPassword);
    await this.acceptTerms();
    await this.signupButton().click();
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms() {
    await this.agreeTermsCheckbox().click();
  }

  /**
   * Check if signup button is enabled
   */
  async isSignupButtonEnabled() {
    return await this.signupButton().isEnabled();
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible() {
    return await this.page.locator('[data-testid="error-message"]').isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    return await this.page.locator('[data-testid="error-message"]').textContent();
  }

  /**
   * Check if success message is visible
   */
  async isSuccessMessageVisible() {
    return await this.page.locator('[data-testid="success-message"]').isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Click login link to navigate back to login
   */
  async clickLoginLink() {
    await this.page.getByRole('link', { name: /log in|login/i }).click();
  }
}

module.exports = { SignupPage };
