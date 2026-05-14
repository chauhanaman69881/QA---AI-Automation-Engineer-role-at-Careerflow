const { BasePage } = require('./BasePage');

/**
 * DashboardPage - Page Object Model for user dashboard
 * Encapsulates all actions related to the main dashboard after login
 */
class DashboardPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.userGreeting = '[data-testid="user-greeting"]';
    this.logoutButton = 'button:has-text("Logout")';
    this.profileMenu = '[data-testid="profile-menu"]';
    this.jobTrackerSection = '[data-testid="job-tracker"]';
    this.addJobButton = 'button:has-text("Add Job")';
    this.jobList = '[data-testid="job-list"] > li';
  }

  /**
   * Wait for dashboard to fully load
   */
  async waitForDashboard() {
    await this.waitForElement(this.userGreeting);
    await this.waitForPageLoad();
  }

  /**
   * Get user greeting text to verify successful login
   */
  async getUserGreeting() {
    return await this.getText(this.userGreeting);
  }

  /**
   * Check if user is logged in by verifying greeting is visible
   */
  async isUserLoggedIn() {
    return await this.isElementVisible(this.userGreeting);
  }

  /**
   * Perform logout
   */
  async logout() {
    await this.click(this.profileMenu);
    await this.click(this.logoutButton);
  }

  /**
   * Click on Job Tracker section
   */
  async openJobTracker() {
    await this.click(this.jobTrackerSection);
    await this.waitForPageLoad();
  }

  /**
   * Click add job button
   */
  async clickAddJob() {
    await this.click(this.addJobButton);
  }

  /**
   * Get number of jobs in the list
   */
  async getJobCount() {
    const jobs = await this.page.locator(this.jobList);
    return await jobs.count();
  }
}

module.exports = { DashboardPage };
