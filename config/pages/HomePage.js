const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;

    this.dashboardElement = page
      .getByRole('heading', { name: /dashboard|home|welcome/i })
      .or(page.getByText(/dashboard|home|welcome|job tracker/i))
      .first();

    this.jobTrackerNavigation = page
      .getByRole('link', { name: /job tracker|jobs/i })
      .or(page.getByRole('button', { name: /job tracker|jobs/i }))
      .or(page.getByText(/job tracker/i))
      .first();
  }

  async verifyDashboardIsLoaded() {
    await this.page.waitForLoadState('networkidle');

    await expect(this.dashboardElement).toBeVisible({
      timeout: 30000
    });

    await expect(this.jobTrackerNavigation).toBeVisible({
      timeout: 30000
    });
  }

  async navigateToJobTracker() {
    await expect(this.jobTrackerNavigation).toBeVisible({
      timeout: 30000
    });

    await expect(this.jobTrackerNavigation).toBeEnabled();

    await Promise.all([
      this.page.waitForLoadState('domcontentloaded'),
      this.jobTrackerNavigation.click()
    ]);

    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { HomePage };