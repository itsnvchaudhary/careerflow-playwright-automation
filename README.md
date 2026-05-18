# Careerflow.ai Playwright Automation Framework

Enterprise-grade, interview-ready UI automation framework for Careerflow.ai Job Tracker using Playwright, JavaScript, and Page Object Model (POM) design pattern.

## Table of Contents

- [Assignment Context](#assignment-context)
- [Automated Flow Overview](#automated-flow-overview)
- [Business Value](#business-value)
- [Tech Stack](#tech-stack)
- [Framework Architecture](#framework-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setup Instructions](#setup-instructions)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Framework Highlights](#framework-highlights)
- [Assumptions](#assumptions)
- [Tools & Versions](#tools--versions)
- [CI/CD Integration](#cicd-integration)

## Assignment Context

This is a production-grade automation framework built for the Careerflow.ai QA automation technical assignment. The project demonstrates SDET best practices, clean code architecture, maintainability, and scalability.

**Role**: AI-Augmented QA Engineer / SDET Automation Engineer

## Automated Flow Overview

The end-to-end automation flow implements all 16 steps from the requirements:

1. **Navigate to Careerflow.ai login page** - Launch the application in browser
2. **Login using environment variables** - Use CAREERFLOW_EMAIL and CAREERFLOW_PASSWORD from .env
3. **Verify successful login** - Assert dashboard loads with meaningful assertions
4. **Navigate to Job Tracker page** - Click Job Tracker navigation
5. **Verify Job Tracker page loaded** - Assert page elements are visible
6. **Click Add Job button** - Initiate job creation flow
7. **Fill job form with details**:
   - Job Title: SDET
   - Company Name: Apple
   - Location: Remote
   - Status: Applied
8. **Submit job** - Save the newly created job
9. **Verify job appears in Applied section** - Assert job is listed correctly
10. **Traverse job cards dynamically** - Search and find the added job
11. **Open job details** - Click on job card to view full details
12. **Assert company name and job details** - Verify data integrity
13. **Delete the created job** - Click delete button
14. **Confirm deletion popup** - Click OK to confirm
15. **Verify job is removed** - Assert job no longer exists
16. **Logout** - Cleanup by logging out from the application

## Business Value

Careerflow.ai helps job seekers effectively manage their applications. The Job Tracker is a mission-critical feature that allows users to:
- Track job applications and their status
- Organize applications by status (Applied, Interview, Offer, etc.)
- Maintain accurate records of where they've applied
- Monitor the job search process efficiently

This automation ensures the Job Tracker works reliably, protecting the core value Careerflow.ai provides to its users.

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Test Runner** | Playwright | ^1.56.0 |
| **Language** | JavaScript (Node.js) | >=16.0.0 |
| **Design Pattern** | Page Object Model (POM) | - |
| **Assertion Library** | Playwright expect | Built-in |
| **Reporting** | HTML, JSON, JUnit | Built-in |
| **Configuration** | Environment variables (.env) | dotenv ^16.4.7 |
| **CI/CD** | GitHub Actions | Native |

## Framework Architecture

```
careerflow-playwright-automation/
│
├── pages/                          # Page Object Models
│   ├── LoginPage.js               # Login page interactions
│   ├── HomePage.js                # Dashboard and navigation
│   ├── JobTrackerPage.js          # Job Tracker page logic
│   └── AddJobPage.js              # Job creation form
│
├── tests/                          # Test Specifications
│   └── jobTracker.spec.js         # E2E test scenarios
│
├── utils/                          # Shared Utilities
│   ├── basePage.js                # Base class for all Page Objects
│   ├── logger.js                  # Logging utility
│   └── testData.js                # Test data management
│
├── testdata/                       # Test Data Files
│   └── testData.json              # Job details and fixtures
│
├── config/                         # Configuration
│   ├── config.js                  # Centralized configuration
│   ├── package.json               # Config-specific dependencies
│   └── playwright.config.js        # Legacy config reference
│
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI/CD workflow
│
├── playwright-report/              # Test Reports (generated)
├── test-results/                   # Test Results (generated)
├── screenshots/                    # Debug Screenshots (generated)
│
├── .env                           # Environment variables (⚠️ NOT in git)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
├── playwright.config.js           # Playwright configuration
└── README.md                      # This file
```

## Prerequisites

Before setting up this framework, ensure you have:

- **Node.js**: v16.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For version control
- **Careerflow.ai Account**: Valid test credentials
- **Modern Browser**: Chrome/Chromium (Playwright handles browser installation)
- **Terminal/Command Line**: For running commands
- **Text Editor/IDE**: VS Code recommended

### System Requirements

- **macOS**: 10.14 or higher
- **Windows**: Windows 10/11
- **Linux**: Ubuntu 18.04 or higher
- **Disk Space**: ~500 MB for node_modules and Playwright browsers

## Installation

### 1. Clone or Extract Repository

```bash
cd /path/to/careerflow-playwright-automation
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `@playwright/test` - Playwright testing framework
- `dotenv` - Environment variable loader

### 3. Install Browsers

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers (one-time setup).

### 4. Verify Installation

```bash
npx playwright --version
npm --version
node --version
```

## Setup Instructions

### Step 1: Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
BASE_URL=https://app.careerflow.ai
LOGIN_PATH=/login

# Careerflow.ai Test Credentials
CAREERFLOW_EMAIL=your-test-email@example.com
CAREERFLOW_PASSWORD=your-test-password

# Optional Configuration
ENVIRONMENT=dev
HEADLESS=true
LOG_LEVEL=INFO
WORKERS=1
MAX_RETRIES=0
```

### Step 2: Verify .gitignore

Ensure `.env` is in `.gitignore` to prevent credential leaks:

```bash
cat .gitignore | grep ".env"  # Should show: .env
```

### Step 3: Update Test Data (if needed)

Edit `testdata/testData.json` if you want to use different job details:

```json
{
  "jobDetails": {
    "companyName": "Apple",
    "jobTitle": "SDET",
    "location": "Remote",
    "jobStatus": "Applied"
  }
}
```

### Step 4: Verify Configuration

```bash
npm test -- --dry-run  # Verify test structure without executing
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Headed Mode (visible browser)

```bash
npm run test:headed
```

### Run Tests in Debug Mode (interactive debugging)

```bash
npm run test:debug
```

### Run Tests in UI Mode (test explorer)

```bash
npm run test:ui
```

### Run Tests for CI/CD

```bash
npm run test:ci
```

### View Test Report

```bash
npm run report
```

### Run Specific Test

```bash
npx playwright test tests/jobTracker.spec.js
```

### Run with Custom Configuration

```bash
# Run with custom timeout
EXPECT_TIMEOUT=120000 npm test

# Run with debug logging
LOG_LEVEL=DEBUG npm test

# Run on Firefox
npx playwright test --project=firefox
```

## Project Structure Deep Dive

### pages/ - Page Object Models

Each page class extends `BasePage` and encapsulates page-specific locators and methods:

- **LoginPage.js**: Login form, credential entry, login verification
- **HomePage.js**: Dashboard verification, navigation, logout
- **JobTrackerPage.js**: Job list, job cards, job operations
- **AddJobPage.js**: Job form, field validation, form submission

**Key Principle**: All element interactions go through page objects, not directly in tests.

### tests/ - Test Specifications

- **jobTracker.spec.js**: Main E2E test covering complete user journey
- Uses `test.step()` for detailed test reporting
- Organized with clear test structure and assertions

### utils/ - Utilities

- **basePage.js**: Common methods (navigate, click, fill, verify, screenshot)
- **logger.js**: Structured logging with levels (INFO, DEBUG, WARN, ERROR)
- **testData.js**: Loads test data from JSON and environment

### config/ - Configuration

- **config.js**: Centralized environment configuration
- Validates required environment variables
- Handles timeouts, retries, browser settings

## Framework Highlights

### ✅ Best Practices Implemented

1. **No Hardcoded Waits** - Uses `waitForLoadState()`, `waitForResponse()`, and locator synchronization
2. **Proper Async/Await** - All async operations properly await results
3. **Page Object Model** - Clean separation of concerns
4. **Retry = 0** - Tests run once; failures are reported immediately
5. **Environment Variables** - All configuration from `.env`
6. **Meaningful Assertions** - Each assertion has clear business meaning
7. **Network Synchronization** - Waits for network idle instead of hardcoded timeouts
8. **Stable Locators** - Semantic locators over brittle XPath/CSS
9. **Screenshot on Failure** - Automatic debugging artifacts
10. **Structured Logging** - Clear, timestamped log output

### 🔒 Security

- Credentials never committed (`.env` in `.gitignore`)
- Credentials loaded from environment at runtime
- Passwords not logged
- HTTPS only for production URLs

### 📊 Reporting

Playwright generates multiple report formats:

- **HTML Report**: Interactive visual report
- **JSON Report**: Machine-readable results
- **JUnit Report**: CI/CD integration (Jenkins, GitHub Actions)

View HTML report:
```bash
npm run report
```

### 🔍 Debugging

Enable debug logging:
```bash
LOG_LEVEL=DEBUG npm test
```

Screenshots and traces saved to:
- `screenshots/` - Manual screenshots
- `playwright-report/` - Full traces on failure

### ⚡ Performance

- Parallel execution support (configured for 1 worker by default)
- Network idle waits prevent flakiness
- Proper timeout configuration
- Efficient locator strategies

## Assumptions

This framework was built with the following assumptions:

1. **Careerflow.ai URL**: `https://app.careerflow.ai` is the target environment
2. **Test Account**: Valid credentials required in `.env` file
3. **Browser**: Chrome/Chromium (default; Firefox/Safari available)
4. **Network**: Stable internet connection for app access
5. **Application State**: Test account can create/delete jobs freely
6. **No Rate Limiting**: Application doesn't block rapid test execution
7. **Dynamic Selectors**: Application uses semantic HTML (role-based selectors)
8. **Single User**: Tests run with one logged-in user at a time
9. **Cleanup**: Previous test runs may leave jobs (cleanup in test steps)
10. **HTTPS**: Application is secure and uses HTTPS

## Tools & Versions

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | >=16.0.0 | JavaScript runtime |
| npm | Latest | Package manager |
| Playwright | ^1.56.0 | Browser automation |
| @playwright/test | ^1.56.0 | Test runner and assertions |
| dotenv | ^16.4.7 | Environment variable loading |
| Chromium | Latest | Browser for automation |

## CI/CD Integration

### GitHub Actions

The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`):

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install
      - run: npm run test:ci
      - uses: actions/upload-artifact@v4
        if: failure()
```

**Usage**:
- Tests run automatically on every push and PR
- Artifacts uploaded on failure
- Reports accessible via GitHub Actions

### Jenkins Integration

For Jenkins, use:

```bash
npm run test:ci
```

Junit reports available at: `test-results/junit.xml`

### Local Pre-commit Verification

```bash
# Before committing
npm test

# If tests fail, fix issues and retry
```

## Troubleshooting

### Tests Fail with "Element Not Visible"

**Solution**: Check if the application UI has changed. Update locators in page objects:

```bash
# Use Playwright Inspector to find new selectors
npx playwright codegen https://app.careerflow.ai
```

### Timeout Errors

**Solution**: Increase timeouts in `.env`:

```env
PAGE_TIMEOUT=120000
NAVIGATION_TIMEOUT=90000
EXPECT_TIMEOUT=120000
```

### Authentication Fails

**Solution**: Verify credentials in `.env`:

```bash
echo $CAREERFLOW_EMAIL
echo $CAREERFLOW_PASSWORD
```

### Browser Installation Issues

**Solution**: Reinstall browsers:

```bash
npx playwright install
npx playwright install-deps
```

## Best Practices for Maintenance

1. **Update Selectors Regularly**: Careerflow.ai may update their UI
2. **Rotate Test Credentials**: Change password periodically
3. **Monitor Test Results**: Check for flaky tests
4. **Review Logs**: Enable DEBUG logging for insights
5. **Update Dependencies**: Keep Playwright and Node.js current

## Contributing

When contributing to this framework:

1. Follow existing code patterns
2. Add meaningful comments for complex logic
3. Use semantic locators (role-based over CSS/XPath)
4. Test locally before committing
5. Update this README if adding new pages or utilities

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Careerflow.ai](https://www.careerflow.ai)

## Interview Notes

This framework demonstrates:

✅ **Professional Code Quality** - Clean, readable, maintainable code  
✅ **SDET Skills** - Proper test architecture and best practices  
✅ **Problem Solving** - Robust locators and wait strategies  
✅ **Documentation** - Clear README and inline comments  
✅ **Security** - No hardcoded credentials, proper .gitignore  
✅ **CI/CD Ready** - GitHub Actions and Jenkins integration  
✅ **Scalability** - Framework supports adding more tests easily  
✅ **Production Grade** - Suitable for real-world use  

---

**Last Updated**: May 2026  
**Playwright Version**: ^1.56.0  
**Status**: ✅ Production Ready
