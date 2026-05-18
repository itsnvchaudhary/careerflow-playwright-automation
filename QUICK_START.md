# 🚀 Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Setup Environment Variables
```bash
# Copy template
cp .env.example .env

# Edit .env and add your credentials
CAREERFLOW_EMAIL=your-email@example.com
CAREERFLOW_PASSWORD=your-password
```

### 3. Run Tests
```bash
# Run in headed mode (you'll see the browser)
npm run test:headed

# Or run in headless mode
npm test
```

### 4. View Results
```bash
# Open HTML report
npm run report
```

---

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run tests in headless mode |
| `npm run test:headed` | Run with browser visible |
| `npm run test:debug` | Run with debugger |
| `npm run test:ui` | Run with interactive UI |
| `npm run report` | View HTML report |

---

## Environment Variables Reference

```bash
# Required (must set in .env)
CAREERFLOW_EMAIL=your-email@example.com
CAREERFLOW_PASSWORD=your-password

# Optional (defaults provided)
BASE_URL=https://app2.careerflow.ai
HEADLESS=false
LOG_LEVEL=INFO
```

---

## Common Issues

### Issue: Missing environment variables error
**Solution**: Make sure `.env` file exists and has `CAREERFLOW_EMAIL` and `CAREERFLOW_PASSWORD`

### Issue: Tests fail with timeout
**Solution**: Check if the website is accessible, increase `PAGE_TIMEOUT` in `.env`

### Issue: Can't see browser during test
**Solution**: Set `HEADLESS=false` in `.env` to see browser during execution

---

## Next Steps

1. Read `README_ENTERPRISE.md` for comprehensive guide
2. Explore `REFACTORING_SUMMARY.md` for architecture details
3. Check `config/config.js` for configuration options
4. Review test file: `tests/jobTracker.spec.js`

---

## Need Help?

- See full documentation: [README_ENTERPRISE.md](README_ENTERPRISE.md)
- See architecture details: [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)
- Check configuration: [config/config.js](config/config.js)

---

Enjoy testing! 🎉
