/**
 * Playwright Configuration
 * Enterprise-grade configuration with CI/CD support
 * Includes retry logic, comprehensive reporting, and parallel execution
 */

const { defineConfig, devices } = require('@playwright/test');
const config = require('./config/config');

config.logConfig();

module.exports = defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.js', '**/*.spec.ts', '**/*.test.js', '**/*.test.ts'],
  
  // Global timeout for all tests
  timeout: config.timeouts.page,
  
  // Expectation timeout
  expect: {
    timeout: config.timeouts.expect,
  },
  
  // Parallel execution settings
  fullyParallel: config.parallel.fullyParallel,
  workers: config.parallel.workers,
  
  // Retry configuration
  retries: config.retries.maxRetries,
  
  // Reporter configuration for comprehensive reporting
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  // Global browser configuration
  use: {
    baseURL: config.baseURL,
    ignoreHTTPSErrors: true,
    
    // Browser automation settings
    headless: config.browser.headless,
    actionTimeout: config.timeouts.action,
    navigationTimeout: config.timeouts.navigation,
    
    // Test recording and debugging
    screenshot: config.report.screenshot,
    video: config.report.video,
    trace: config.report.trace,
  },
  
  // Browser projects configuration
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: config.browser.headless,
      },
    },
    
    // Uncomment for full cross-browser testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  
  // Web Server for local development (optional)
  // Uncomment if you need a local server running during tests
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
