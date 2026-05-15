const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',

  timeout: 110000,

  expect: {
    timeout: 90000
  },

  fullyParallel: false,

  //retries: 1,

  workers: 1,

  reporter: [
    ['list'],
    ['html']
  ],

  use: {
    
  baseURL: process.env.BASE_URL || 'https://app2.careerflow.ai',
  ignoreHTTPSErrors: true,

    headless: false,

    actionTimeout: 30000,
    navigationTimeout: 60000,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: {
      
        browserName: 'chromium'
      }
    }
  ]
});