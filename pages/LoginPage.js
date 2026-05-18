/**
 * Login Page Object Model
 * Handles all login-related interactions and verifications
 */

const { expect } = require('@playwright/test');
const BasePage = require('../utils/basePage');
const config = require('../config/config');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.emailInput = page
      .getByPlaceholder(/example@email\.com|youremail@mail\.com/i)
      .or(page.locator('input[type="email"]'))
      .first();
    
    this.passwordInput = page
      .getByPlaceholder(/password/i)
      .or(page.locator('input[type="password"]'))
      .first();
    
    this.loginButton = page.getByRole('button', { name: /^Login|Continue$/i });
  }
  
  async navigateToLoginPage() {
    const loginPath = config.loginPath || '/login';
    this.logger.step('Navigate to login page', `path: ${loginPath}`);
    await this.navigateToUrl(config.getUrl(loginPath));
  }
  
  async verifyLoginPageIsVisible() {
    this.logger.step('Verify login page is visible');
    await this.verifyElementsVisible([
      [this.emailInput, 'email input'],
      [this.passwordInput, 'password input'],
      [this.loginButton, 'login button'],
    ]);
    await expect(this.loginButton).toBeEnabled();
    this.logger.debug('All login elements are visible and ready');
  }
  
  async enterEmail(email) {
    this.logger.step('Enter email', email);
    await this.fillInput(this.emailInput, email, 'email field');
  }
  
  async enterPassword(password) {
    this.logger.step('Enter password');
    await expect(this.passwordInput).toBeVisible({
      timeout: this.defaultTimeout,
    });
    await this.passwordInput.fill(password);
    this.logger.debug('Password entered');
  }
  
  async clickLoginButton() {
    this.logger.step('Click login button');
    await this.clickElement(this.loginButton, 'login button', true);
  }
  
  /**
   * Complete login flow with email and password
   */
  async login(email, password) {
    this.logger.step('Perform login flow', `email: ${email}`);
    await this.verifyLoginPageIsVisible();
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
    this.logger.info('Login completed successfully');
  }
}

module.exports = { LoginPage };
