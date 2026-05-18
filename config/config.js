/**
 * Centralized Configuration Management
 * Loads environment variables and validates required configurations
 * Supports multiple environment profiles (dev, staging, prod, ci)
 */

require('dotenv').config();

// Environment validation
const requiredEnvVars = [
  'CAREERFLOW_EMAIL',
  'CAREERFLOW_PASSWORD',
];

const validateEnvVars = () => {
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please create a .env file with these variables or set them in your CI/CD environment.`
    );
  }
};

class Config {
  constructor() {
    validateEnvVars();
    
    this.environment = process.env.ENVIRONMENT || 'dev';
    this.baseURL = process.env.BASE_URL || 'https://app.careerflow.ai';
    this.loginPath = process.env.LOGIN_PATH || '/login';
    
    // Credentials (from environment only - NO DEFAULTS TO JSON)
    this.credentials = {
      email: process.env.CAREERFLOW_EMAIL,
      password: process.env.CAREERFLOW_PASSWORD,
    };
    
    // Timeouts
    this.timeouts = {
      page: parseInt(process.env.PAGE_TIMEOUT || '110000'),
      action: parseInt(process.env.ACTION_TIMEOUT || '30000'),
      navigation: parseInt(process.env.NAVIGATION_TIMEOUT || '60000'),
      expect: parseInt(process.env.EXPECT_TIMEOUT || '90000'),
    };
    
    // Retry configuration
    this.retries = {
      maxRetries: parseInt(process.env.MAX_RETRIES || '0'),
      retryOnFailure: process.env.RETRY_ON_FAILURE === 'true' || this.environment === 'ci',
    };
    
    // Browser configuration
    this.browser = {
      headless: process.env.HEADLESS === 'true' || this.environment === 'ci',
      slowMo: parseInt(process.env.SLOW_MO || '0'),
      args: [],
    };
    
    // Report configuration
    this.report = {
      screenshot: process.env.SCREENSHOT_ON_FAILURE || 'only-on-failure',
      video: process.env.VIDEO_ON_FAILURE || 'retain-on-failure',
      trace: process.env.TRACE_ON_FAILURE || 'retain-on-failure',
    };
    
    // Parallel execution
    this.parallel = {
      workers: parseInt(process.env.WORKERS || '1'),
      fullyParallel: process.env.FULLY_PARALLEL === 'true',
    };
  }
  
  /**
   * Get full URL for a given path
   */
  getUrl(path = '') {
    return this.baseURL + path;
  }
  
  /**
   * Log configuration for debugging (without exposing secrets)
   */
  logConfig() {
    console.log('\n=== Framework Configuration ===');
    console.log(`Environment: ${this.environment}`);
    console.log(`Base URL: ${this.baseURL}`);
    console.log(`Headless: ${this.browser.headless}`);
    console.log(`Workers: ${this.parallel.workers}`);
    console.log(`Max Retries: ${this.retries.maxRetries}`);
    console.log('==============================\n');
  }
  
  /**
   * Validate credentials are set
   */
  validateCredentials() {
    if (!this.credentials.email || !this.credentials.password) {
      throw new Error(
        'Credentials not configured. Ensure CAREERFLOW_EMAIL and CAREERFLOW_PASSWORD are set.'
      );
    }
  }
}

module.exports = new Config();
