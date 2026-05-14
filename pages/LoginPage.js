const { BasePage } = require('./BasePage');

/**
 * LoginPage - Page Object Model for login page
 * Encapsulates all selectors and actions related to login functionality
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.emailInput = 'input[name="email"]';
    this.passwordInput = 'input[type="password"]';
    this.loginButton = 'button[type="submit"]';
    this.errorMessage = '[data-testid="error-message"]';
    this.forgotPasswordLink = 'a:has-text("Forgot password")';
    this.signupLink = 'a:has-text("Sign up")';
    this.rememberMeCheckbox = 'input[type="checkbox"]';
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  /**
   * Perform complete login flow with email and password
   */
  async login(email, password) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Login with email, password, and remember me option
   */
  async loginWithRememberMe(email, password) {
    await this.fillInput(this.emailInput, email);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.rememberMeCheckbox);
    await this.click(this.loginButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    await this.waitForElement(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible() {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Click on forgot password link
   */
  async clickForgotPassword() {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click on sign up link
   */
  async clickSignUp() {
    await this.click(this.signupLink);
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled() {
    const button = await this.page.locator(this.loginButton);
    return await button.isEnabled();
  }
}

module.exports = { LoginPage };
