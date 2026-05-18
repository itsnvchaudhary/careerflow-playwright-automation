# Careerflow.ai Playwright Automation Framework

**Enterprise-Grade UI Automation Framework | Production-Ready | SDET Best Practices**

## 📋 Project Overview

A comprehensive Playwright automation framework for Careerflow.ai's Job Tracker feature. Built following enterprise SDET architecture patterns with security-first design, CI/CD integration, and production-ready deployment capabilities.

### Key Features

✅ **Security First**: Zero hardcoded credentials, environment variable management  
✅ **Enterprise Architecture**: Base page classes, centralized config, proper separation of concerns  
✅ **CI/CD Ready**: GitHub Actions integration, parallel execution support, comprehensive reporting  
✅ **Production Grade**: Error handling, retry logic, detailed logging, flaky test prevention  
✅ **Maintainable Code**: Clean POM, modular helpers, comprehensive documentation  
✅ **Professional Testing**: Business-focused scenarios, step-based test organization  

---

## 🏗️ Framework Architecture

### Project Structure

```
careerflow-playwright-automation/
├── config/                          # Centralized configuration
│   ├── config.js                   # Environment & config management
│   └── testData.js                 # Static test data (NO secrets)
│
├── pages/                           # Page Object Models
│   ├── LoginPage.js
│   ├── HomePage.js
│   ├── JobTrackerPage.js
│   └── AddJobPage.js
│
├── tests/                           # Test specifications
│   └── jobTracker.spec.js
│
├── utils/                           # Reusable utilities
│   ├── basePage.js                 # Base class for all pages
│   ├── logger.js                   # Logging utility
│   └── testData.js                 # Test data helper
│
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD pipeline
│
├── .env                            # Environment variables (local, gitignored)
├── .env.example                    # Environment template
├── .gitignore                      # Git exclusions
├── playwright.config.js            # Playwright configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🔒 Security & Credentials Management

### Security Implementation

**CRITICAL: No Hardcoded Credentials**

✅ All credentials stored in environment variables only  
✅ `.env` file is gitignored (never committed)  
✅ Test data JSON contains only static data (no credentials)  
✅ Configuration validates credentials on startup  

### Local Development Setup

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Add your credentials to `.env`**:
   ```bash
   CAREERFLOW_EMAIL=your-email@example.com
   CAREERFLOW_PASSWORD=your-password
   ```

3. **Never commit `.env` file** (already in `.gitignore`)

### CI/CD with GitHub Secrets

For GitHub Actions, credentials are set via repository secrets:

1. Go to Settings → Secrets and variables → Actions
2. Add:
   - `CAREERFLOW_EMAIL`
   - `CAREERFLOW_PASSWORD`

The workflow automatically injects these as environment variables.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd careerflow-playwright-automation

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Configuration

Create `.env` file from template:

```bash
cp .env.example .env
```

Edit `.env` with your test environment details:

```env
BASE_URL=https://app.careerflow.ai
LOGIN_PATH=/login
ENVIRONMENT=dev
HEADLESS=false
WORKERS=1
LOG_LEVEL=INFO
CAREERFLOW_EMAIL=your-email@example.com
CAREERFLOW_PASSWORD=your-password
```

---

## ▶️ Running Tests

### Run All Tests

```bash
npm test
```

### Run with Browser Visible (Headed Mode)

```bash
npm run test:headed
```

### Run in Debug Mode

```bash
npm run test:debug
```

### Run with UI Mode

```bash
npm run test:ui
```

### View Test Report

```bash
npm run report
```

---

## 🏛️ Architecture Deep Dive

### Base Page Class

All page objects extend `BasePage` providing:

- Consistent wait strategies
- Error handling & logging
- Common element interactions
- Screenshot capabilities
- URL navigation & verification

**Benefits**:
- Reduces code duplication
- Ensures consistent timeouts
- Enables centralized logging
- Improves maintainability

### Configuration Management

`config/config.js` handles:

- Environment variable validation
- Timeout configuration
- Browser settings
- Report settings
- Parallel execution settings

**Key Feature**: Automatic validation of required credentials on startup

### Logger Utility

`utils/logger.js` provides:

- Structured logging with timestamps
- Multiple log levels (ERROR, WARN, INFO, DEBUG)
- Step tracking for test flow visibility
- CI/CD compatible output

### Page Objects

Each page object:
- Extends `BasePage`
- Defines locators with multiple fallbacks
- Implements business logic methods
- Uses logger for transparency
- Includes comprehensive comments

---

## 🧪 Test Design

### Test Structure

Tests use Playwright's test.step() for detailed reporting:

```javascript
await test.step('Step Name', async () => {
  // Business logic
});
```

### Test Flow

1. **Setup**: Initialize page objects
2. **Business Steps**: Follow user journey
3. **Verification**: Assert expected outcomes
4. **Cleanup**: Handled automatically

### Best Practices Implemented

✅ Descriptive test names  
✅ Business-value comments  
✅ Step-based organization  
✅ Clear assertions  
✅ No test interdependencies  
✅ Retry-safe logic  

---

## 🔧 Configuration Reference

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `BASE_URL` | `https://app.careerflow.ai` | Application URL |
| `LOGIN_PATH` | `/login` | Login page path |
| `ENVIRONMENT` | `dev` | Execution environment |
| `PAGE_TIMEOUT` | `110000` | Page load timeout (ms) |
| `ACTION_TIMEOUT` | `30000` | Action timeout (ms) |
| `NAVIGATION_TIMEOUT` | `60000` | Navigation timeout (ms) |
| `HEADLESS` | `false` | Run in headless mode |
| `WORKERS` | `1` | Parallel workers |
| `MAX_RETRIES` | `2` | Retry attempts |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `CAREERFLOW_EMAIL` | *(required)* | Test user email |
| `CAREERFLOW_PASSWORD` | *(required)* | Test user password |

### playwright.config.js

Key features:

- Multi-browser support (Chromium configured, Firefox/Safari ready)
- Comprehensive reporters (HTML, JSON, JUnit)
- Screenshot/video/trace on failure
- Retry configuration
- Parallel execution settings

---

## 📊 Reporting

### Test Reports

**HTML Report** (interactive):
```bash
npm run report
```

**Report Location**: `playwright-report/index.html`

### Report Contents

- Test execution summary
- Individual test results
- Screenshots on failure
- Video recordings (retain-on-failure)
- Trace files for debugging

### CI/CD Reports

GitHub Actions generates:
- Artifact uploads (reports, traces)
- Test artifacts (30-day retention)
- Test Reporter integration

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**File**: `.github/workflows/playwright.yml`

**Triggers**:
- Push to main/master/develop
- Pull requests
- Daily schedule (2 AM UTC)

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Install browsers
5. Run tests (with secrets)
6. Upload reports
7. Comment on PR (if applicable)

### Environment for CI/CD

Automatically set when running in CI:
- `ENVIRONMENT=ci`
- `HEADLESS=true`
- `MAX_RETRIES=2`
- Secrets injected as env vars

---

## 🛡️ Error Handling & Retry Logic

### Retry Configuration

```javascript
// playwright.config.js
retries: config.retries.maxRetries  // 2 by default
```

### Flaky Test Prevention

Implemented strategies:

✅ Generous timeouts with explicit waits  
✅ Network idle detection  
✅ Multiple locator fallbacks  
✅ Visibility checks before actions  
✅ Enable/disable validation  
✅ Graceful error handling  

### Logging

Every action is logged:

```
[2026-05-15T10:30:45.123Z] [LoginPage] [INFO] STEP: Perform login flow - email: user@example.com
[2026-05-15T10:30:46.456Z] [LoginPage] [DEBUG] Filled email field with value: user@example.com
[2026-05-15T10:30:47.789Z] [LoginPage] [DEBUG] Clicked login button
```

---

## 📈 Improvements Made (From Original)

### Security
- ❌ Removed hardcoded credentials from testData.json
- ❌ Removed credentials from .env.example
- ✅ Implemented environment-only credential management
- ✅ Added configuration validation

### Architecture
- ❌ No base page class (code duplication)
- ✅ Created BasePage with common functionality
- ❌ No centralized config
- ✅ Created config/config.js
- ❌ Test data mixed with credentials
- ✅ Separated static data and secrets

### Code Quality
- ❌ page.pause() in tests (production blocker)
- ✅ Removed all debugging calls
- ❌ Minimal logging
- ✅ Comprehensive structured logging
- ❌ Inconsistent error handling
- ✅ Added error handling utilities

### CI/CD
- ❌ Basic GitHub workflow
- ✅ Production-grade CI/CD with:
  - Concurrency controls
  - Artifact retention
  - Test reporters
  - Secret management
  - Scheduled runs

### Testing
- ❌ No retry configuration
- ✅ Added retry strategy
- ❌ Limited reporting
- ✅ HTML, JSON, JUnit reporters
- ❌ No trace files
- ✅ Traces, screenshots, videos

---

## 🎯 Enterprise Best Practices

### Applied Patterns

✅ **Page Object Model**: Clean separation of locators & logic  
✅ **DRY Principle**: BasePage eliminates duplication  
✅ **Configuration Management**: Externalized config  
✅ **Logging**: Comprehensive audit trail  
✅ **Error Handling**: Graceful failure management  
✅ **CI/CD Integration**: Production-ready pipeline  
✅ **Security**: No secrets in code  
✅ **Maintainability**: Clear structure & documentation  

### Scalability Considerations

**To scale this framework**:

1. **More Tests**: Add more files to `tests/` folder
2. **More Pages**: Create new page objects extending `BasePage`
3. **Parameterized Tests**: Use `test.describe.each()` for data-driven testing
4. **Parallel Execution**: Increase `WORKERS` in `.env`
5. **Cross-Browser**: Add browsers to `playwright.config.js`
6. **Fixtures**: Create custom fixtures in `tests/fixtures.js`

---

## 🐛 Debugging

### Enable Debug Logging

```bash
LOG_LEVEL=DEBUG npm test
```

### Run with Debugger

```bash
npm run test:debug
```

### Check Screenshots/Videos

After failed tests:
- Screenshots: `test-results/` (if configured)
- Videos: `test-results/` (if configured)
- Traces: `test-results/` (if configured)

### Inspect Traces

```bash
npx playwright show-trace test-results/trace.zip
```

---

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Advanced Assertions](https://playwright.dev/docs/test-assertions)

---

## 📝 Environment Configuration Examples

### Local Development

```bash
ENVIRONMENT=dev
HEADLESS=false
LOG_LEVEL=DEBUG
WORKERS=1
MAX_RETRIES=1
```

### Staging Testing

```bash
BASE_URL=https://staging.careerflow.ai
ENVIRONMENT=staging
HEADLESS=true
LOG_LEVEL=INFO
WORKERS=2
MAX_RETRIES=2
```

### Production CI/CD

```bash
ENVIRONMENT=ci
HEADLESS=true
LOG_LEVEL=INFO
WORKERS=1
MAX_RETRIES=3
RETRY_ON_FAILURE=true
```

---

## ✅ Quality Checklist

- [x] Security: No hardcoded credentials
- [x] Architecture: Clean POM & base classes
- [x] Code Quality: Comprehensive logging
- [x] Error Handling: Graceful failures
- [x] Testing: Retry & flaky prevention
- [x] Documentation: Complete README
- [x] CI/CD: Production-grade pipeline
- [x] Maintainability: Clear structure
- [x] Scalability: Modular design
- [x] Reporting: Multiple formats

---

## 🤝 Contributing

When contributing:

1. Follow POM pattern
2. Extend BasePage for page objects
3. Use logger for transparency
4. Add meaningful comments
5. Validate credentials in config
6. Update documentation
7. Test locally before committing

---

## 📄 License

ISC

---

**Framework Version**: 2.0 (Enterprise)  
**Last Updated**: May 15, 2026  
**Status**: Production Ready ✅
