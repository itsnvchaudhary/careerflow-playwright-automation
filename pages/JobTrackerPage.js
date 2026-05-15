const { expect } = require('@playwright/test');

class JobTrackerPage {
  constructor(page) {
    this.page = page;

    this.heading = page
      .getByRole('heading', { name: /job tracker|jobs tracker|applications/i })
      .or(page.getByText(/job tracker|applications/i))
      .first();

    this.addJobButton = page
      .getByRole('button', { name: /add job|add new job|new job/i })
      .or(page.getByRole('link', { name: /add job|add new job|new job/i }))
      .first();

    this.appliedSection = page
      .getByRole('heading', { name: /^applied$/i })
      .or(page.getByText(/^applied$/i))
      .first();
  }

  async verifyJobTrackerPageIsLoaded() {
    await this.page.waitForLoadState('networkidle');

    await expect(this.heading).toBeVisible({
      timeout: 30000
    });

    await expect(this.addJobButton).toBeVisible({
      timeout: 30000
    });

    await expect(this.addJobButton).toBeEnabled();

    await this.verifyAppliedSectionExists();
  }

  async verifyAppliedSectionExists() {
    await expect(this.appliedSection).toBeVisible({
      timeout: 30000
    });
  }

  async clickAddJob() {
    await expect(this.addJobButton).toBeVisible();
    await expect(this.addJobButton).toBeEnabled();

    await this.addJobButton.click();

    await this.page.waitForLoadState('networkidle');
  }

  async verifyAddedJobAppearsUnderAppliedStatus(jobDetails) {
    await this.verifyAppliedSectionExists();

    const companyName = this.page.getByText(jobDetails.companyName, { exact: false }).first();
    const jobTitle = this.page.getByText(jobDetails.jobTitle, { exact: false }).first();

    await expect(companyName).toBeVisible({
      timeout: 30000
    });

    await expect(jobTitle).toBeVisible({
      timeout: 30000
    });

    /*
      TODO if required:
      If the UI has multiple status columns and the same company can appear elsewhere,
      replace the generic assertions above with a scoped locator based on your screenshot.

      Example idea:
      const appliedColumn = this.page.locator('[data-testid="applied-column"]');
      await expect(appliedColumn).toContainText(jobDetails.companyName);
      await expect(appliedColumn).toContainText(jobDetails.jobTitle);
    */
  }
}

module.exports = { JobTrackerPage };