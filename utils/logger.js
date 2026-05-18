/**
 * Logger Utility
 * Provides consistent logging across the framework with different levels
 * Helps with debugging and CI/CD logs
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

class Logger {
  constructor(name = 'Framework') {
    this.name = name;
    this.level = process.env.LOG_LEVEL || LOG_LEVELS.INFO;
  }
  
  _shouldLog(level) {
    const levels = Object.values(LOG_LEVELS);
    const currentLevelIndex = levels.indexOf(this.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }
  
  _formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.name}] [${level}] ${message}`;
  }
  
  error(message, error = null) {
    if (this._shouldLog(LOG_LEVELS.ERROR)) {
      console.error(this._formatMessage(LOG_LEVELS.ERROR, message));
      if (error) {
        console.error(error);
      }
    }
  }
  
  warn(message) {
    if (this._shouldLog(LOG_LEVELS.WARN)) {
      console.warn(this._formatMessage(LOG_LEVELS.WARN, message));
    }
  }
  
  info(message) {
    if (this._shouldLog(LOG_LEVELS.INFO)) {
      console.log(this._formatMessage(LOG_LEVELS.INFO, message));
    }
  }
  
  debug(message) {
    if (this._shouldLog(LOG_LEVELS.DEBUG)) {
      console.log(this._formatMessage(LOG_LEVELS.DEBUG, message));
    }
  }
  
  step(stepName, details = '') {
    const message = `STEP: ${stepName}${details ? ' - ' + details : ''}`;
    this.info(message);
  }
}

module.exports = Logger;
