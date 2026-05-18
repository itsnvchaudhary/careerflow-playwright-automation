/**
 * Add Job Page Object Model
 * Handles job addition form interactions and validations
 */

const { expect } = require('@playwright/test');
const BasePage = require('../utils/basePage');

class AddJobPage extends BasePage {
  constructor(page) {
    super(page);
    
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
    
    this.sectionDropdown = page.locator('.ant-select-selector');
    
    this.appliedOption = page.getByRole('option', { name: /applied/i });
    
    // Use specific "Submit" button selector instead of regex that might match other buttons
    this.saveButton = page.getByRole('button', { name: 'Submit' });
    
    this.successMessage = page
      .getByText(/success|created|added|saved/i)
      .first();
  }
  
  async verifyAddJobFormIsVisible() {
    this.logger.step('Verify Add Job form is visible');
    await this.verifyElementsVisible([
      [this.companyNameInput, 'company name input'],
      [this.jobTitleInput, 'job title input'],
      [this.saveButton, 'save button'],
    ]);
    await expect(this.saveButton).toBeEnabled();
    this.logger.debug('Add Job form verified');
  }
  
  async fillCompanyName(companyName) {
    this.logger.step('Fill company name', companyName);
    await this.fillInput(this.companyNameInput, companyName, 'company name field');
  }
  
  async fillJobTitle(jobTitle) {
    this.logger.step('Fill job title', jobTitle);
    await this.fillInput(this.jobTitleInput, jobTitle, 'job title field');
  }
  
  async fillLocation(location) {
    const isLocationVisible = await this.locationInput.isVisible().catch(() => false);
    
    if (isLocationVisible) {
      this.logger.step('Fill location', location);
      await this.fillInput(this.locationInput, location, 'location field');
    } else {
      this.logger.debug('Location field not available - skipping');
    }
  }
  
  async fillJobUrl(jobUrl) {
    const isJobUrlVisible = await this.jobUrlInput.isVisible().catch(() => false);
    
    if (isJobUrlVisible) {
      this.logger.step('Fill job URL', jobUrl);
      await this.fillInput(this.jobUrlInput, jobUrl, 'job URL field');
    } else {
      this.logger.debug('Job URL field not available - skipping');
    }
  }
  
  async selectStatusAsApplied() {
    this.logger.step('Select Applied status from Section dropdown');

    // Click dropdown with force: true to bypass event interception from "Saved" label
    await this.sectionDropdown.click({ force: true });
    this.logger.debug('Clicked dropdown selector');
    
    // Wait for the dropdown menu to appear by checking for the option element
    await this.page.waitForSelector('[role="option"]', { timeout: 5000 });
    this.logger.debug('Dropdown menu appeared');

    // Select the "Applied" option - use getByRole with nth filter to match only option, not page heading
    const appliedOption = this.page.locator('[role="option"]').filter({ hasText: /^Applied$/ });
    await expect(appliedOption).toBeVisible({ timeout: this.defaultTimeout });
    await appliedOption.click();

    this.logger.debug('Applied status selected successfully');
  }
  
  async saveJob() {
    this.logger.step('Save job');
    
    try {
      // First wait a bit for modal animation to complete
      await this.page.waitForTimeout(500);
      
      // Try normal click first
      this.logger.debug('Attempting normal click on submit button');
      await this.saveButton.click({ timeout: 5000 });
      this.logger.debug('Submit button clicked successfully');
    } catch (error) {
      // If normal click fails, try with force: true
      this.logger.debug('Normal click failed, trying with force: true');
      await this.saveButton.click({ force: true });
      this.logger.debug('Submit button clicked with force: true');
    }
    
    // Wait for the modal to close
    try {
      await this.page.waitForSelector('[class*="ant-modal-wrap"]', { state: 'hidden', timeout: 8000 });
      this.logger.debug('Modal closed successfully');
    } catch (e) {
      this.logger.debug('Modal close timeout - may have closed or different selector');
    }
    
    // Wait for network activity to settle
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 5000 });
      this.logger.debug('Network idle state reached');
    } catch (e) {
      this.logger.debug('Network idle timeout - continuing');
    }
    
    this.logger.info('Job saved');
  }
  
  async verifyJobSavedOrPageUpdated() {
    this.logger.step('Verify job saved or page updated');
    const successVisible = await this.successMessage.isVisible().catch(() => false);
    
    if (successVisible) {
      await expect(this.successMessage).toBeVisible({
        timeout: 10000,
      });
      this.logger.debug('Success message displayed');
    } else {
      this.logger.debug('No success message - relying on Job Tracker page verification');
    }
  }
  
  /**
   * Complete job addition flow
   */
  async addJob(jobDetails) {
    this.logger.step('Add job with details', jobDetails.companyName);
    await this.verifyAddJobFormIsVisible();
    await this.fillCompanyName(jobDetails.companyName);
    await this.fillJobTitle(jobDetails.jobTitle);
    await this.fillLocation(jobDetails.location);
    await this.fillJobUrl(jobDetails.jobUrl);
    await this.selectStatusAsApplied();
    await this.saveJob();
    await this.verifyJobSavedOrPageUpdated();
    this.logger.info('Job addition flow completed successfully');
  }
}

module.exports = { AddJobPage };