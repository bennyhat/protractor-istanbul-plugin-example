var gulp = require('gulp');
var server = require('gulp-serv');
var istanbul = require('gulp-istanbul');
var protractor = require('gulp-protractor').protractor;
var webdriverUpdate = require("gulp-protractor").webdriver_update;
var path = require('path');
var data = require('gulp-data');
var gulpFn  = require('gulp-fn');

gulp.task('test:server', function(done) {
  server.start({
    root: __dirname + '/tmp',
    host: '0.0.0.0',
    port: 8000
  }, done);
});

gulp.task('test:files', function(done) {
  return gulp.src(['app/**'])
    .pipe(gulp.dest('tmp/'));
});

gulp.task('test:instrument', function(done) {
  return gulp.src(['app/**/*.js','!app/bower_components/**'])
    .pipe(istanbul({
        coverageVariable: '__coverage__'
      }))
    .pipe(gulp.dest('tmp/'));
});

gulp.task('test:report-coverage', function(done) {
  global['__coverage__'] = {};

  return gulp.src('./coverage/*.json')
    .pipe(gulpFn(function(file) {
        global['__coverage__'][path.resolve(file.path)] = require(file.path);
      }))
    .pipe(istanbul.summarizeCoverage({
      coverageVariable: '__coverage__'
    }));
});

gulp.task('test:webdriver-update', webdriverUpdate);

gulp.task('test:integration',['test:webdriver-update'], function(done) {
  gulp.src(["./e2e-tests/**/*.js"])
    .pipe(protractor({
      configFile: "e2e-tests/protractor.conf.js",
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    }))
    .on('error', function(e) { throw e })
});
