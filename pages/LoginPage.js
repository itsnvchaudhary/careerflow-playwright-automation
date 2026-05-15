const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

   this.emailInput = page
  .getByLabel(/email/i)
  .or(page.getByPlaceholder(/youremail@mail.com/i))
  .first();

this.passwordInput = page
  .getByLabel(/password/i)
  .or(page.getByPlaceholder(/enter the password/i))
  .first();

this.loginButton = page.getByRole('button', { name: /^Continue$/i });

    
  }

  async navigateToLoginPage() {
    const loginPath = process.env.LOGIN_PATH || '/login';

    await this.page.goto(loginPath, {
      waitUntil: 'domcontentloaded'
    });

    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoginPageIsVisible() {
    await expect(this.emailInput).toBeVisible({ timeout: 30000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 30000 });
    await expect(this.loginButton).toBeVisible({ timeout: 30000 });
    await expect(this.loginButton).toBeEnabled();
  }

  async enterEmail(email) {
    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);
    await expect(this.emailInput).toHaveValue(email);
  }

  async enterPassword(password) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();

    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.loginButton.click()
    ]);

    await this.page.waitForLoadState('networkidle');
  }

  async login(email, password) {
    await this.verifyLoginPageIsVisible();
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }
}

module.exports = { LoginPage };