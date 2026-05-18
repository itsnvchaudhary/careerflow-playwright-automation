/**
 * Base Page Class
 * Provides common functionality for all Page Objects
 * Reduces code duplication and ensures consistent wait strategies
 */

const { expect } = require('@playwright/test');
const Logger = require('./logger');

class BasePage {
  constructor(page) {
    this.page = page;
    this.logger = new Logger(this.constructor.name);
    
    // Common timeouts (can be overridden per page)
    this.defaultTimeout = 30000;
    this.actionTimeout = 30000;
    this.navigationTimeout = 60000;
  }
  
  /**
   * Navigate to a URL with proper wait strategies
   */
  async navigateToUrl(url) {
    this.logger.step('Navigate', `to ${url}`);
    await this.page.goto(url, {
      waitUntil: 'load',
      timeout: this.navigationTimeout,
    });
  }
  
  /**
   * Wait for an element and perform an action
   */
  async waitAndPerformAction(locator, action, timeout = this.actionTimeout) {
    try {
      await expect(locator).toBeVisible({ timeout });
      await action();
    } catch (error) {
      this.logger.error(`Failed to perform action on element`, error);
      throw error;
    }
  }
  
  /**
   * Fill input with validation
   */
  async fillInput(locator, value, label = 'field') {
    try {
      await expect(locator).toBeVisible({ timeout: this.defaultTimeout });
      await locator.fill(value);
      await expect(locator).toHaveValue(value);
      this.logger.debug(`Filled ${label} with value: ${value}`);
    } catch (error) {
      this.logger.error(`Failed to fill ${label}`, error);
      throw error;
    }
  }
  
  /**
   * Click element with visibility check
   */
  async clickElement(locator, label = 'element', waitForNavigation = false) {
    try {
      await expect(locator).toBeVisible({ timeout: this.defaultTimeout });
      await expect(locator).toBeEnabled({ timeout: this.defaultTimeout });
      
      if (waitForNavigation) {
        await Promise.all([
          this.page.waitForLoadState('domcontentloaded'),
          locator.click({ timeout: this.actionTimeout }),
        ]);
      } else {
        await locator.click({ timeout: this.actionTimeout });
      }
      
      this.logger.debug(`Clicked ${label}`);
    } catch (error) {
      this.logger.error(`Failed to click ${label}`, error);
      throw error;
    }
  }
  
  /**
   * Verify element is visible
   */
  async verifyElementVisible(locator, label = 'element') {
    try {
      await expect(locator).toBeVisible({ timeout: this.defaultTimeout });
      this.logger.debug(`Verified ${label} is visible`);
    } catch (error) {
      this.logger.error(`Element ${label} not visible`, error);
      throw error;
    }
  }
  
  /**
   * Verify multiple elements are visible
   */
  async verifyElementsVisible(elements) {
    try {
      for (const [locator, label] of elements) {
        await this.verifyElementVisible(locator, label);
      }
    } catch (error) {
      this.logger.error(`Failed to verify elements`, error);
      throw error;
    }
  }
  
  /**
   * Wait for network idle
   */
  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle', {
      timeout: this.navigationTimeout,
    });
  }
  
  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(filename) {
    try {
      const fs = require('fs');
      const screenshotsDir = './screenshots';
      
      // Create screenshots directory if it doesn't exist
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }
      
      await this.page.screenshot({ path: `${screenshotsDir}/${filename}.png` });
      this.logger.debug(`Screenshot saved: ${filename}`);
    } catch (error) {
      this.logger.warn(`Failed to save screenshot: ${filename}`);
    }
  }
  
  /**
   * Get page title
   */
  async getPageTitle() {
    return await this.page.title();
  }
  
  /**
   * Get page URL
   */
  async getPageUrl() {
    return this.page.url();
  }
  
  /**
   * Verify page URL contains text
   */
  async verifyUrlContains(urlPart) {
    const currentUrl = await this.getPageUrl();
    if (!currentUrl.includes(urlPart)) {
      throw new Error(`URL does not contain ${urlPart}. Current URL: ${currentUrl}`);
    }
    this.logger.debug(`URL contains ${urlPart}`);
  }
}

module.exports = BasePage;
