exports.config = {
  allScriptsTimeout: 110000,

  plugins : [{
    package: 'protractor-istanbul-plugin',
    logAssertions: true,
    failAssertions: true
  }],

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'firefox'
  },

  directConnect: true,

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
