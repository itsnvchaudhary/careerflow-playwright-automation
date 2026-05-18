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
      .first();
    
    this.appliedSection = page
      .getByRole('heading', { name: /^applied$/i })
      .or(page.getByText(/^applied$/i))
      .first();
  }
  
  async verifyJobTrackerPageIsLoaded() {
    this.logger.step('Verify Job Tracker page is loaded');
    
    // Just wait for the heading to be visible - don't wait for network idle
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
    await expect(deleteButton).toBeVisible({ timeout: this.defaultTimeout });
    await expect(deleteButton).toBeEnabled({ timeout: this.defaultTimeout });
    await deleteButton.click({ force: true, timeout: this.actionTimeout });
    this.logger.debug('Clicked delete button with force: true');

    const confirmButton = this.page.getByRole('button', { name: /^OK$/i }).first();
    if (await confirmButton.isVisible().catch(() => false)) {
      await expect(confirmButton).toBeEnabled({ timeout: this.defaultTimeout });
      await confirmButton.click({ force: true, timeout: this.actionTimeout });
      this.logger.debug('Clicked delete confirmation button with force: true');
    }

    const jobDetailsDialog = this.page.getByRole('dialog', { name: /Job Details/i }).first();
    await jobDetailsDialog.waitFor({ state: 'hidden', timeout: this.defaultTimeout }).catch(() => {
      this.logger.debug('Job Details dialog did not hide immediately after delete');
    });

    const appliedHeading = this.page.getByRole('heading', { name: /^Applied$/i }).first();
    await expect(appliedHeading).toBeVisible({ timeout: this.defaultTimeout });

    this.logger.info('Delete action triggered for job details');
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