const { TIMEOUTS, WAIT_FOR } = require('../config/constants');

/**
 * BasePage class - Parent class for all page objects
 * Provides common methods and utilities used across all pages
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} path - URL or path to navigate to
   * @throws {Error} If navigation fails
   */
  async goto(path = '') {
    if (!path) throw new Error('Navigation path cannot be empty');
    await this.page.goto(path);
  }

  /**
   * Fill an input field with text
   * @param {string} selector - Element selector
   * @param {string} text - Text to fill
   * @throws {Error} If element cannot be filled
   */
  async fillInput(selector, text) {
    if (!selector) throw new Error('Selector cannot be empty');
    await this.page.fill(selector, text);
  }

  /**
   * Click an element
   * @param {string} selector - Element selector
   * @throws {Error} If element cannot be clicked
   */
  async click(selector) {
    if (!selector) throw new Error('Selector cannot be empty');
    await this.page.click(selector);
  }

  /**
   * Wait for an element to be present in DOM
   * @param {string} selector - Element selector
   * @param {number} timeout - Wait timeout in milliseconds
   * @throws {Error} If element not found within timeout
   */
  async waitForElement(selector, timeout = TIMEOUTS.MEDIUM) {
    if (!selector) throw new Error('Selector cannot be empty');
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Get text content of an element
   * @param {string} selector - Element selector
   * @returns {Promise<string>} Element text content or empty string
   */
  async getText(selector) {
    if (!selector) throw new Error('Selector cannot be empty');
    const text = await this.page.textContent(selector);
    return text?.trim() || '';
  }

  /**
   * Check if element is visible
   * @param {string} selector - Element selector
   * @param {number} timeout - Wait timeout in milliseconds
   * @returns {Promise<boolean>} True if element is visible
   */
  async isElementVisible(selector, timeout = TIMEOUTS.SHORT) {
    if (!selector) throw new Error('Selector cannot be empty');
    try {
      await this.page.waitForSelector(selector, { timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to load completely
   * @param {string} loadState - Load state ('load', 'domcontentloaded', 'networkidle')
   * @throws {Error} If page fails to load
   */
  async waitForPageLoad(loadState = WAIT_FOR.PAGE_LOAD) {
    await this.page.waitForLoadState(loadState);
  }
}

module.exports = { BasePage };
