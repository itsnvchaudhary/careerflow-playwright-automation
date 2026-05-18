const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { JobTrackerPage } = require('../pages/JobTrackerPage');
const { AddJobPage } = require('../pages/AddJobPage');
const { getCredentials, getJobDetails } = require('../utils/testData.js');

test.describe('Careerflow.ai Job Tracker E2E Flow', () => {
  let loginPage;
  let homePage;
  let jobTrackerPage;
  let addJobPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    jobTrackerPage = new JobTrackerPage(page);
    addJobPage = new AddJobPage(page);
  });

  test('Verify user can add a job with Applied status in Careerflow Job Tracker', async ({page}) => {
    /*
      Business value:
      This is a critical user journey because Careerflow.ai helps job seekers track applications.
      The Job Tracker feature must reliably allow users to create, save, and verify job applications
      with the correct status so users can manage their job search accurately.
    */
   
   page.pause();
    const credentials = getCredentials();
    const jobDetails = getJobDetails();

    await test.step('Navigate to Careerflow.ai login/signup page', async () => {
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

    await test.step('Verify added job appears under Applied section/status', async () => {
      await jobTrackerPage.verifyJobTrackerPageIsLoaded();
      await jobTrackerPage.verifyAddedJobAppearsUnderAppliedStatus(jobDetails);
    });
  });
});