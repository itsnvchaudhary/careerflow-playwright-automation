/**
 * Job Tracker Page Object Model
 * Handles job tracker page interactions and verifications
 */

const { expect } = require('@playwright/test');
const BasePage = require('../utils/basePage');

class JobTrackerPage extends BasePage {
  constructor(page) {
    super(page);
    
    this.heading = page
      .getByRole('heading', { name: /job tracker|jobs tracker|applications/i })
      .or(page.getByText(/job tracker|applications/i))
      .first();
    
    this.addJobButton = page
      .getByRole('button', { name: /add job|add new job|new job/i })
      .or(page.getByRole('link', { name: /add job|add new job|new job/i }))
      .or(page.locator('button').filter({ hasText: /add job|add new job|new job/i }))
      .first();
    
    this.appliedSection = page
      .getByRole('heading', { name: /^applied$/i })
      .or(page.getByText(/^applied$/i))
      .first();
    
    // Main content area
    this.mainContent = page.locator('[role="main"]').or(page.locator('main')).first();
  }
  
  async verifyJobTrackerPageIsLoaded() {
    this.logger.step('Verify Job Tracker page is loaded');
    
    // First, wait for main content to be visible
    await this.verifyElementVisible(this.mainContent, 'main content area');
    
    // Wait for network to be mostly idle to ensure page content is rendered
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      this.logger.debug('Network idle timeout - continuing with verification');
    });
    
    // Now verify key elements
    await this.verifyElementsVisible([
      [this.heading, 'job tracker heading'],
      [this.addJobButton, 'add job button'],
    ]);
    
    await expect(this.addJobButton).toBeEnabled();
    await this.verifyAppliedSectionExists();
    
    this.logger.info('Job Tracker page loaded successfully');
  }
  
  async verifyAppliedSectionExists() {
    this.logger.step('Verify Applied section exists');
    await this.verifyElementVisible(this.appliedSection, 'applied section');
  }
  
  async clickAddJob() {
    this.logger.step('Click Add Job button');
    await this.clickElement(this.addJobButton, 'add job button', true);
    this.logger.info('Add Job page opened');
  }
  
  getAppliedJobCardLocator(jobDetails) {
    return this.page
      .getByRole('button')
      .filter({ hasText: jobDetails.jobTitle })
      .filter({ hasText: jobDetails.companyName });
  }
  
  async verifyJobPresentInApplied(jobDetails) {
    this.logger.step('Traverse Applied cards to verify expected job', `${jobDetails.companyName} / ${jobDetails.jobTitle}`);
    await this.verifyAppliedSectionExists();

    const matchingCard = this.getAppliedJobCardLocator(jobDetails).first();
    await expect(matchingCard).toBeVisible({ timeout: this.defaultTimeout });

    const cardText = (await matchingCard.textContent()) || '';
    if (!cardText.includes(jobDetails.jobTitle) || !cardText.includes(jobDetails.companyName)) {
      throw new Error('Matching job card text does not contain both expected title and company name');
    }

    this.logger.info(`Found matching Applied job card: ${jobDetails.jobTitle} @ ${jobDetails.companyName}`);
    return matchingCard;
  }
  
  async openAppliedJobCard(jobDetails) {
    this.logger.step('Open matching Applied job card', `${jobDetails.companyName} / ${jobDetails.jobTitle}`);
    const matchingCard = await this.verifyJobPresentInApplied(jobDetails);
    await this.clickElement(matchingCard, `Applied job card: ${jobDetails.companyName}`, true);

    const jobDetailsDialog = this.page.getByRole('dialog', { name: /Job Details/i }).first();
    await expect(jobDetailsDialog).toBeVisible({ timeout: this.defaultTimeout });
    this.logger.info('Opened job details page for selected Applied job');
  }
  
  async verifyJobDetailsPageOpened(jobDetails) {
    this.logger.step('Verify job details page opened', `${jobDetails.companyName} / ${jobDetails.jobTitle}`);
    const detailsLabel = this.page.getByLabel('Job Details', { exact: true }).first();
    const jobTitle = this.page.getByText(jobDetails.jobTitle, { exact: false }).first();
    const companyName = this.page.getByText(jobDetails.companyName, { exact: false }).first();

    if (await detailsLabel.isVisible().catch(() => false)) {
      await expect(detailsLabel).toContainText(jobDetails.companyName, { timeout: this.defaultTimeout });
    }

    await expect(jobTitle).toBeVisible({ timeout: this.defaultTimeout });
    await expect(companyName).toBeVisible({ timeout: this.defaultTimeout });

    this.logger.info('Job details page verified successfully');
  }
  
  async deleteJobFromDetailsPage(jobDetails) {
    this.logger.step('Delete job from details page', `${jobDetails.companyName} / ${jobDetails.jobTitle}`);
    
    const deleteButton = this.page.getByRole('button', { name: /^Delete$/i }).first();
    await this.clickElement(deleteButton, 'delete button');

    // Wait for the DELETE confirmation dialog specifically (by accessible name)
    const deleteConfirmDialog = this.page.getByRole('dialog', { name: /Delete job confirmation/i });
    await expect(deleteConfirmDialog).toBeVisible({ timeout: this.defaultTimeout });
    this.logger.debug('Delete confirmation dialog appeared');

    // Find OK button scoped to the delete dialog only
    const okButton = deleteConfirmDialog.getByRole('button', { name: /^OK$/i });
    
    // Click OK and wait for the job card to disappear
    await okButton.click({ timeout: this.actionTimeout });
    this.logger.debug('Clicked OK button on delete confirmation');

    // Wait for delete dialog to close
    await deleteConfirmDialog.waitFor({ state: 'hidden', timeout: this.defaultTimeout }).catch(() => {
      this.logger.debug('Delete dialog did not hide');
    });

    // Wait for network to be idle after deletion
    await this.page.waitForLoadState('networkidle', { timeout: this.defaultTimeout }).catch(() => {
      this.logger.debug('Network idle timeout after delete');
    });

    // Wait for the job card to actually disappear from the Applied section
    const matchingCard = this.page
      .getByRole('button')
      .filter({ hasText: jobDetails.jobTitle })
      .filter({ hasText: jobDetails.companyName });

    await matchingCard.nth(0).waitFor({ state: 'hidden', timeout: this.defaultTimeout }).catch(async () => {
      // If card doesn't hide with locator wait, reload and verify it's gone
      this.logger.debug('Job card did not hide, reloading page to verify deletion');
      await this.page.reload();
      await this.page.waitForLoadState('networkidle', { timeout: this.defaultTimeout }).catch(() => {
        this.logger.debug('Network idle on reload');
      });
    });

    // Final verification
    const count = await matchingCard.count();
    if (count > 0) {
      throw new Error(`Delete failed: job still present (${count} cards found) - ${jobDetails.jobTitle} @ ${jobDetails.companyName}`);
    }

    this.logger.info('Delete action completed and job card removed from Applied section');
  }

  
  async verifyJobDoesNotExistInApplied(jobDetails) {
    this.logger.step('Verify job no longer exists in Applied section', `${jobDetails.companyName} / ${jobDetails.jobTitle}`);

    const appliedHeading = this.page.getByRole('heading', { name: /^Applied$/i }).first();
    await expect(appliedHeading).toBeVisible({ timeout: this.defaultTimeout });

    const matchingCard = this.page
      .getByRole('button')
      .filter({ hasText: jobDetails.jobTitle })
      .filter({ hasText: jobDetails.companyName });

    const count = await matchingCard.count();
    if (count > 0) {
      throw new Error(`Deleted job still present in Applied section: ${jobDetails.jobTitle} @ ${jobDetails.companyName}`);
    }

    this.logger.info('Verified deleted job is no longer present in Applied section');
  }
  
  async verifyAddedJobAppearsUnderAppliedStatus(jobDetails) {
    this.logger.step('Verify added job appears under Applied status', jobDetails.companyName);
    await this.verifyJobPresentInApplied(jobDetails);
    this.logger.info(
      `Job verified in Applied section - Company: ${jobDetails.companyName}, Title: ${jobDetails.jobTitle}`
    );
  }
}

module.exports = { JobTrackerPage };