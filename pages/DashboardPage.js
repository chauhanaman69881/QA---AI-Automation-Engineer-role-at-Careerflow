const { BasePage } = require('./BasePage');
const { TIMEOUTS, SELECTORS } = require('../config/constants');

/**
 * DashboardPage - Page Object Model for user dashboard
 * Encapsulates all actions related to the main dashboard after login
 */
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors for dashboard elements
    this.userGreetingSelector = SELECTORS.USER_GREETING;
    this.logoutButtonSelector = 'button:has-text("Logout")';
    this.profileMenuSelector = '[data-testid="profile-menu"]';
    this.jobTrackerSectionSelector = '[data-testid="job-tracker"]';
    this.addJobButtonSelector = 'button:has-text("Add Job")';
    this.jobListSelector = SELECTORS.JOB_LIST;
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboard() {
    await this.waitForElement(this.userGreetingSelector, TIMEOUTS.MEDIUM);
    await this.waitForPageLoad();
  }

  /**
   * Get user greeting text to verify successful login
   */
  async getUserGreeting() {
    return await this.getText(this.userGreetingSelector);
  }

  /**
   * Check if user is logged in by verifying greeting is visible
   */
  async isUserLoggedIn() {
    return await this.isElementVisible(this.userGreetingSelector, TIMEOUTS.SHORT);
  }

  /**
   * Perform logout
   */
  async logout() {
    await this.click(this.profileMenuSelector);
    await this.click(this.logoutButtonSelector);
  }

  /**
   * Click on Job Tracker section
   */
  async openJobTracker() {
    await this.click(this.jobTrackerSectionSelector);
    await this.waitForPageLoad();
  }

  /**
   * Click add job button
   */
  async clickAddJob() {
    await this.click(this.addJobButtonSelector);
  }

  /**
   * Get number of jobs in the list
   */
  async getJobCount() {
    const jobs = await this.page.locator(this.jobListSelector);
    return await jobs.count();
  }
}

module.exports = { DashboardPage };
