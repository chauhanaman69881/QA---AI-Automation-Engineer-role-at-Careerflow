const { BasePage } = require('./BasePage');
const { URLS } = require('../config/urls.config');

/**
 * LoginPage - Page Object Model for login page
 * Encapsulates all selectors and actions related to login functionality
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors using Playwright accessibility roles (best practice)
    this.emailInput = () => this.page.getByRole('textbox', { name: /example@email.com/i });
    this.passwordInput = () => this.page.getByRole('textbox', { name: /password/i });
    this.loginButton = () => this.page.getByRole('button', { name: /log in|login/i });
    this.forgotPasswordLink = () => this.page.getByRole('button', { name: /forgot password/i });
    this.signupTab = () => this.page.getByRole('tab', { name: 'Sign Up' });
    this.rememberMeCheckbox = () => this.page.getByRole('checkbox');
  }

  /**
   * Navigate to login page using centralized URL config
   */
  async navigateToLogin() {
    await this.goto(URLS.login);
    await this.waitForPageLoad();
  }

  /**
   * Perform complete login flow with email and password
   */
  async login(email, password) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.loginButton().click();
  }

  /**
   * Login with email, password, and remember me option
   */
  async loginWithRememberMe(email, password) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.rememberMeCheckbox().click();
    await this.loginButton().click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    return await this.page.locator('[data-testid="error-message"]').textContent();
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible() {
    return await this.page.locator('[data-testid="error-message"]').isVisible({ timeout: 5000 }).catch(() => false);
  }

  /**
   * Click on forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink().click();
  }

  /**
   * Click on sign up link
   */
  async clickSignUp() {
    await this.signupTab().click();
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled() {
    return await this.loginButton().isEnabled();
  }
}

module.exports = { LoginPage };
