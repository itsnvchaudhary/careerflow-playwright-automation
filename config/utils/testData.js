const testData = require('../testdata/testData.json');

function getCredentials() {
  return {
    email: process.env.CAREERFLOW_EMAIL || testData.credentials.email,
    password: process.env.CAREERFLOW_PASSWORD || testData.credentials.password
  };
}

function getJobDetails() {
  return testData.jobDetails;
}

module.exports = {
  getCredentials,
  getJobDetails
};