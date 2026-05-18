# Careerflow.ai Playwright Automation Framework

## Assignment Context

This repository contains a submission-ready UI automation framework for the Careerflow.ai technical assignment.

The automation is implemented using Playwright with JavaScript and follows the Page Object Model design pattern.

## Automated Flow Summary

The automated end-to-end flow covers:

1. Navigate to Careerflow.ai login/signup page
2. Login using valid user credentials
3. Verify successful landing on the dashboard/home page
4. Navigate to the Job Tracker page
5. Verify Job Tracker page loads successfully
6. Click Add Job
7. Fill required job details
8. Set job status as Applied
9. Save/add the job
10. Verify the newly added job appears under the Applied section/status

## Business Value of Selected Flow

This is a critical user journey because Careerflow.ai helps job seekers track applications. The Job Tracker feature must reliably allow users to create, save, and verify job applications with the correct status so users can manage their job search accurately.

## Tech Stack

- Playwright
- JavaScript
- Node.js
- Page Object Model
- GitHub Actions
- Jenkins Pipeline

## Folder Structure

```text
careerflow-playwright-automation/
│
├── pages/
│   ├── LoginPage.js
│   ├── HomePage.js
│   ├── JobTrackerPage.js
│   └── AddJobPage.js
│
├── tests/
│   └── jobTracker.spec.js
│
├── testData/
│   └── testData.json
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── .gitignore
├── Jenkinsfile
├── package.json
├── playwright.config.js
└── README.md