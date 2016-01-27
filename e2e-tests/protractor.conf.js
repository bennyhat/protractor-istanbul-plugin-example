exports.config = {
  allScriptsTimeout: 110000,

  // inclusion of the istanbul plugin. will fail and log any coverage collection failures
  plugins : [{
    package: 'protractor-istanbul-plugin',
    logAssertions: true,
    failAssertions: true
  }],

  specs: [
    '*.js'
  ],

  // change the browser if desired
  capabilities: {
    'browserName': 'firefox'
  },

  // webdriver does not play nice with older protractors if this is not set
  directConnect: true,

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
