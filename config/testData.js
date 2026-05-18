/**
 * Static Test Data
 * Contains only non-sensitive test data
 * Credentials must come from environment variables
 */

const testData = {
  jobDetails: {
    companyName: 'Microsoft',
    jobTitle: 'QA Automation Engineer',
    location: 'Remote',
    jobStatus: 'Applied',
    jobUrl: 'https://careers.microsoft.com/',
  },
  
  // Alternative test data for parameterized tests
  altJobDetails: {
    companyName: 'Google',
    jobTitle: 'Software Quality Engineer',
    location: 'Mountain View, CA',
    jobStatus: 'Applied',
    jobUrl: 'https://careers.google.com/',
  },
};

module.exports = testData;
