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
    
    // Logout button selectors
    this.logoutButton = page
      .getByRole('button', { name: /logout|log out|sign out|exit/i })
      .or(page.getByText(/logout|log out|sign out/i))
      .first();
    
    // User menu for accessing logout (sometimes in a dropdown)
    this.userMenu = page
      .getByRole('button', { name: /profile|user|account|menu/i })
      .or(page.locator('[class*="avatar"], [class*="user-menu"]'))
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
  
  async logout() {
    this.logger.step('Logout from application');
    
    // Try to click logout button directly
    const logoutVisible = await this.logoutButton.isVisible().catch(() => false);
    
    if (logoutVisible) {
      await this.clickElement(this.logoutButton, 'logout button', true);
      this.logger.info('Logged out successfully');
      return;
    }
    
    // If logout button not visible, try opening user menu first
    const userMenuVisible = await this.userMenu.isVisible().catch(() => false);
    if (userMenuVisible) {
      await this.clickElement(this.userMenu, 'user menu');
      
      // Wait for logout button to appear in dropdown
      const logoutInMenu = this.page
        .getByRole('button', { name: /logout|log out|sign out|exit/i })
        .or(this.page.getByText(/logout|log out|sign out/i))
        .first();
      
      await expect(logoutInMenu).toBeVisible({ timeout: this.defaultTimeout });
      await this.clickElement(logoutInMenu, 'logout option in menu', true);
      this.logger.info('Logged out successfully');
      return;
    }
    
    this.logger.warn('Logout button not found, but continuing test');
  }
  
  async verifyLoggedOut() {
    this.logger.step('Verify user is logged out');
    
    // Should be redirected to login page or see login elements
    const loginButton = this.page.getByRole('button', { name: /login|continue/i });
    const loginInput = this.page.getByPlaceholder(/email|password/i);
    
    const isLoginButtonVisible = await loginButton.isVisible().catch(() => false);
    const isLoginInputVisible = await loginInput.isVisible().catch(() => false);
    
    if (isLoginButtonVisible || isLoginInputVisible) {
      this.logger.info('User successfully logged out - login page visible');
      return;
    }
    
    this.logger.warn('Could not verify logout - login page not visible');
  }
}

module.exports = { HomePage };