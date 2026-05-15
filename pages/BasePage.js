/**
 * BasePage class - Parent class for all page objects
 * Provides common methods and utilities used across all pages
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL path
   */
  async goto(path = '') {
    await this.page.goto(path);
  }

  /**
   * Fill an input field
   */
  async fillInput(selector, text) {
    await this.page.fill(selector, text);
  }

  /**
   * Click an element
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElement(selector, timeout = 30000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Get text content of an element
   */
  async getText(selector) {
    return await this.page.textContent(selector) || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector) {
    try {
      await this.page.waitForSelector(selector, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('load');
  }
}

module.exports = { BasePage };
