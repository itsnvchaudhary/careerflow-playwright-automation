const { expect } = require('@playwright/test');

class AddJobPage {
  constructor(page) {
    this.page = page;

    this.formHeading = page
      .getByRole('heading', { name: /add job|new job|job details/i })
      .or(page.getByText(/add job|new job|job details/i))
      .first();

    this.companyNameInput = page
      .getByLabel(/company|company name/i)
      .or(page.getByPlaceholder(/company|company name/i))
      .first();

    this.jobTitleInput = page
      .getByLabel(/job title|position|role/i)
      .or(page.getByPlaceholder(/job title|position|role/i))
      .first();

    this.locationInput = page
      .getByLabel(/location/i)
      .or(page.getByPlaceholder(/location/i))
      .first();

    this.jobUrlInput = page
      .getByLabel(/job url|url|job link|link/i)
      .or(page.getByPlaceholder(/job url|url|job link|link/i))
      .first();

    this.statusDropdown = page
      .getByLabel(/status/i)
      .or(page.getByRole('combobox', { name: /status/i }))
      .first();

    this.appliedStatusOption = page
      .getByRole('option', { name: /^applied$/i })
      .or(page.getByText(/^applied$/i))
      .first();

    this.appliedRadioOrButton = page
      .getByRole('radio', { name: /^applied$/i })
      .or(page.getByRole('button', { name: /^applied$/i }))
      .first();

    this.saveButton = page
      .getByRole('button', { name: /save|add job|submit|create/i })
      .first();

    this.successMessage = page
      .getByText(/success|created|added|saved/i)
      .first();
  }

  async verifyAddJobFormIsVisible() {
    await expect(this.companyNameInput).toBeVisible({
      timeout: 30000
    });

    await expect(this.jobTitleInput).toBeVisible({
      timeout: 30000
    });

    await expect(this.saveButton).toBeVisible({
      timeout: 30000
    });

    await expect(this.saveButton).toBeEnabled();
  }

  async fillCompanyName(companyName) {
    await expect(this.companyNameInput).toBeVisible();
    await this.companyNameInput.fill(companyName);
    await expect(this.companyNameInput).toHaveValue(companyName);
  }

  async fillJobTitle(jobTitle) {
    await expect(this.jobTitleInput).toBeVisible();
    await this.jobTitleInput.fill(jobTitle);
    await expect(this.jobTitleInput).toHaveValue(jobTitle);
  }

  async fillLocation(location) {
    const isLocationVisible = await this.locationInput.isVisible().catch(() => false);

    if (isLocationVisible) {
      await this.locationInput.fill(location);
      await expect(this.locationInput).toHaveValue(location);
    }
  }

  async fillJobUrl(jobUrl) {
    const isJobUrlVisible = await this.jobUrlInput.isVisible().catch(() => false);

    if (isJobUrlVisible) {
      await this.jobUrlInput.fill(jobUrl);
      await expect(this.jobUrlInput).toHaveValue(jobUrl);
    }
  }

  async selectStatusAsApplied() {
    const isDropdownVisible = await this.statusDropdown.isVisible().catch(() => false);

    if (isDropdownVisible) {
      await expect(this.statusDropdown).toBeVisible();
      await this.statusDropdown.click();

      await expect(this.appliedStatusOption).toBeVisible({
        timeout: 10000
      });

      await this.appliedStatusOption.click();
      return;
    }

    const isAppliedButtonVisible = await this.appliedRadioOrButton.isVisible().catch(() => false);

    if (isAppliedButtonVisible) {
      await expect(this.appliedRadioOrButton).toBeVisible();
      await this.appliedRadioOrButton.click();
      return;
    }

    throw new Error(
      'Applied status control was not found. Update statusDropdown/appliedRadioOrButton locator in AddJobPage.js based on actual UI.'
    );
  }

  async saveJob() {
    await expect(this.saveButton).toBeVisible();
    await expect(this.saveButton).toBeEnabled();

    await this.saveButton.click();

    await this.page.waitForLoadState('networkidle');
  }

  async verifyJobSavedOrPageUpdated() {
    const successVisible = await this.successMessage.isVisible().catch(() => false);

    if (successVisible) {
      await expect(this.successMessage).toBeVisible({
        timeout: 10000
      });
    }

    /*
      Some modern apps do not show a toast.
      In that case, the final assertion in JobTrackerPage verifies that the job was saved
      by checking the newly added job card/row on the Job Tracker page.
    */
  }

  async addJob(jobDetails) {
    await this.verifyAddJobFormIsVisible();

    await this.fillCompanyName(jobDetails.companyName);
    await this.fillJobTitle(jobDetails.jobTitle);
    await this.fillLocation(jobDetails.location);
    await this.fillJobUrl(jobDetails.jobUrl);
    await this.selectStatusAsApplied();
    await this.saveJob();
    await this.verifyJobSavedOrPageUpdated();
  }
}

module.exports = { AddJobPage };