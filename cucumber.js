module.exports = {
  default: {
    require: [
      'tests/step-definitions/**/*.ts',
    ],
    requireModule: ['ts-node/register'],
    format: ['progress', 'html:reports/cucumber-report.html'],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
  }
}