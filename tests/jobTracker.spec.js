/**
 * Careerflow.ai Job Tracker E2E Tests
 * Tests the complete job tracker workflow
 */

const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { JobTrackerPage } = require('../pages/JobTrackerPage');
const { AddJobPage } = require('../pages/AddJobPage');
const { getCredentials, getJobDetails } = require('../utils/testData');
const Logger = require('../utils/logger');

test.describe('Careerflow.ai Job Tracker E2E Flow', () => {
  let logger;
  let loginPage;
  let homePage;
  let jobTrackerPage;
  let addJobPage;
  
  test.beforeEach(async ({ page }) => {
    logger = new Logger('JobTrackerTests');
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    jobTrackerPage = new JobTrackerPage(page);
    addJobPage = new AddJobPage(page);
  });
  
  test('Verify user can add a job with Applied status, verify it appears, and delete it from Careerflow Job Tracker', async ({ page }) => {
    /**
     * Business Value:
     * This is a critical user journey because Careerflow.ai helps job seekers track applications.
     * The Job Tracker feature must reliably allow users to create, save, verify, and delete job applications
     * with the correct status so users can manage their job search accurately.
     * 
     * Test Flow:
     * 1. Navigate to login page
     * 2. Login with credentials from environment variables
     * 3. Verify dashboard loads
     * 4. Navigate to Job Tracker
     * 5. Click Add Job
     * 6. Fill job details and select Applied status
     * 7. Verify job appears in Applied section
     * 8. Open job details and verify information
     * 9. Delete the job
     * 10. Verify job is removed
     * 11. Logout
     */
    
    logger.info('Starting Job Tracker E2E test');
    const credentials = getCredentials();
    const jobDetails = getJobDetails();
    
    await test.step('Navigate to Careerflow.ai login page', async () => {
      await loginPage.navigateToLoginPage();
      await loginPage.verifyLoginPageIsVisible();
    });
    
    await test.step('Login using valid credentials', async () => {
      await loginPage.login(credentials.email, credentials.password);
    });
    
    await test.step('Verify dashboard/home page is loaded', async () => {
      await homePage.verifyDashboardIsLoaded();
    });
    
    await test.step('Navigate to Job Tracker page', async () => {
      await homePage.navigateToJobTracker();
    });
    
    await test.step('Verify Job Tracker page is loaded', async () => {
      await jobTrackerPage.verifyJobTrackerPageIsLoaded();
    });
    
    await test.step('Click Add Job and verify form is visible', async () => {
      await jobTrackerPage.clickAddJob();
      await addJobPage.verifyAddJobFormIsVisible();
    });
    
    await test.step('Fill job details and select Applied status', async () => {
      await addJobPage.addJob(jobDetails);
    });
    
    await test.step('Verify added job appears under Applied section', async () => {
      // Wait for page to stabilize after job creation
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
        logger.debug('Network idle timeout - continuing');
      });
      await jobTrackerPage.verifyAddedJobAppearsUnderAppliedStatus(jobDetails);
    });
    
    await test.step('Open matching Applied job, verify details, and delete it', async () => {
      await jobTrackerPage.openAppliedJobCard(jobDetails);
      await jobTrackerPage.verifyJobDetailsPageOpened(jobDetails);
      await jobTrackerPage.deleteJobFromDetailsPage(jobDetails);
      await jobTrackerPage.verifyJobDoesNotExistInApplied(jobDetails);
    });
    
    await test.step('Logout from application', async () => {
      await homePage.logout();
      await homePage.verifyLoggedOut();
    });
    
    logger.info('Job Tracker E2E test completed successfully');
  });
});

