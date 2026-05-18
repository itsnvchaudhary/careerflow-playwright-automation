/**
 * Home Page Object Model
 * Handles dashboard and home page interactions
 */

const { expect } = require('@playwright/test');
const BasePage = require('../utils/basePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Multiple strategies to find dashboard elements
    this.dashboardElement = page
      .getByRole('heading', { name: /dashboard|home|welcome/i })
      .or(page.getByText(/dashboard|home|welcome|job tracker/i))
      .or(page.locator('main'))
      .or(page.locator('[role="main"]'))
      .first();
    
    this.jobTrackerNavigation = page
      .getByRole('link', { name: /job tracker|jobs/i })
      .or(page.getByRole('button', { name: /job tracker|jobs/i }))
      .or(page.getByText(/job tracker/i))
      .or(page.locator('a, button').filter({ hasText: /job tracker/i }))
      .first();
  }
  
  async verifyDashboardIsLoaded() {
    this.logger.step('Verify dashboard is loaded');
    
    // Wait for the job tracker navigation to appear (unique to dashboard)
    try {
      await this.jobTrackerNavigation.waitFor({ timeout: this.defaultTimeout, state: 'visible' });
      this.logger.debug('Job Tracker navigation found - Dashboard loaded');
    } catch (error) {
      this.logger.warn('Job Tracker navigation not visible, taking screenshot for debugging');
      await this.takeScreenshot('dashboard-debug');
      throw error;
    }
    
    this.logger.info('Dashboard loaded successfully');
  }
  
  async navigateToJobTracker() {
    this.logger.step('Navigate to Job Tracker');
    await this.clickElement(this.jobTrackerNavigation, 'job tracker navigation', true);
    this.logger.info('Navigated to Job Tracker');
  }
}

module.exports = { HomePage };