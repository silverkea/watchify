module.exports = {
  default: {
    require: [
      'tests/step-definitions/**/*.ts',
      'tests/step-definitions/support/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress', 
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    paths: ['tests/integration/**/*.feature'],
    parallel: 1, // Run tests sequentially for Playwright browser management
    retry: process.env.CI ? 1 : 0,
    timeout: 60000 // 60 seconds timeout for Cucumber steps
  }
}