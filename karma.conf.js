var webpackConfig = require('./webpack.qa.config');
// Karma configuration
// Generated on Tue Dec 27 2016 13:08:07 GMT+0800 (中国标准时间)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'qa/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    
    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {  
     'qa/**/*.spec.js': ['webpack', 'sourcemap'], 
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'progress', 'coverage'],


    // The coverage reporter set to the following values.
    coverageReporter: {
      type : 'html',
      dir : 'qa/coverage/'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,


    webpack: webpackConfig,
    webpackMiddleware: {
      // webpack-dev-middleware configuration 
      // i. e. 
      stats: 'errors-only',
      noInfo: true 
    },
    plugins: [
      'karma-chrome-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-coverage',
      'karma-mocha-reporter'
    ]
  })
}
