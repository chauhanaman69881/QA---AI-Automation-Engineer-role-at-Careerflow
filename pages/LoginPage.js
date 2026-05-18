const { BasePage } = require('./BasePage');
const { URLS } = require('../config/urls.config');
const { TIMEOUTS, SELECTORS } = require('../config/constants');

/**
 * LoginPage - Page Object Model for login page
 * Encapsulates all selectors and actions related to login functionality
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors using Playwright accessibility roles (best practice)
    this.emailInputSelector = () => this.page.getByRole('textbox', { name: /example@email.com/i });
    this.passwordInputSelector = () => this.page.getByRole('textbox', { name: /password/i });
    this.loginButtonSelector = () => this.page.getByRole('button', { name: /log in|login/i });
    this.forgotPasswordLinkSelector = () => this.page.getByRole('button', { name: /forgot password/i });
    this.signupTabSelector = () => this.page.getByRole('tab', { name: 'Sign Up' });
    this.rememberMeCheckboxSelector = () => this.page.getByRole('checkbox');
    this.errorMessageSelector = SELECTORS.ERROR_MESSAGE;
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
    if (!email || !password) throw new Error('Email and password are required');
    await this.emailInputSelector().fill(email);
    await this.passwordInputSelector().fill(password);
    await this.loginButtonSelector().click();
  }

  /**
   * Login with email, password, and remember me option
   */
  async loginWithRememberMe(email, password) {
    if (!email || !password) throw new Error('Email and password are required');
    await this.emailInputSelector().fill(email);
    await this.passwordInputSelector().fill(password);
    await this.rememberMeCheckboxSelector().click();
    await this.loginButtonSelector().click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage() {
    return await this.page.locator(this.errorMessageSelector).textContent();
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible() {
    return await this.isElementVisible(this.errorMessageSelector, TIMEOUTS.SHORT);
  }

  /**
   * Click on forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLinkSelector().click();
  }

  /**
   * Click on sign up tab
   */
  async clickSignUp() {
    await this.signupTabSelector().click();
  }

  /**
   * Check if login button is enabled
   */
  async isLoginButtonEnabled() {
    return await this.loginButtonSelector().isEnabled();
  }

  /**
   * Convenience getter for email input
   */
  emailInput() {
    return this.emailInputSelector();
  }

  /**
   * Convenience getter for password input
   */
  passwordInput() {
    return this.passwordInputSelector();
  }
}

module.exports = { LoginPage };
