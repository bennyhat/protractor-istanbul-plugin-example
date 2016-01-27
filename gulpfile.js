var gulp = require('gulp');
var server = require('gulp-serv');
var gulpIstanbul = require('gulp-istanbul');
var protractor = require('gulp-protractor').protractor;
var webdriverUpdate = require("gulp-protractor").webdriver_update;
var path = require('path');
var through = require('through2');
var istanbul = require('istanbul');
var fs = require('fs');
var rimraf = require('gulp-rimraf');

/* this uses a pretty simple task chain setup to do the following 6 steps:
*/

/* 1. clean out the tmp and coverage directories */
gulp.task('test:clean', function(done) {
  return gulp.src(['tmp','coverage','lcov*'], { read: false })
    .pipe(rimraf({force:true}));
});

/* 2. copy files over from the app to the temporary webserver directory */
gulp.task('test:files', ['test:clean'], function(done) {
  return gulp.src(['app/**'])
    .pipe(gulp.dest('tmp/'));
});

/* 3. instrument all javascript files except for vendor ones and copy to temporary webserver directory */
gulp.task('test:instrument', ['test:files'], function(done) {
  return gulp.src(['app/**/*.js','!app/bower_components/**'])
    .pipe(gulpIstanbul({
        coverageVariable: '__coverage__'
      }))
    .pipe(gulp.dest('tmp/'));
});

/* 4. stand up a temporary web server that serves files out of the temporary directory */
gulp.task('test:server', ['test:instrument'], function(done) {
  server.start({
    root: __dirname + '/tmp',
    host: '0.0.0.0',
    port: 8000
  }, done);
});

/* *. Parrallel task of updating selenium webdriver for protractor */
gulp.task('test:webdriver-update', webdriverUpdate);

/* 5. Run the protractor integration tests, which are configured to use the istanbul coverage plugin */
gulp.task('test:integration',['test:webdriver-update','test:server'], function(done) {
  return gulp.src(["./e2e-tests/**/*.js"])
    .pipe(protractor({
      configFile: "e2e-tests/protractor.conf.js",
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    }))
    .on('error', function(e) { throw e })
});

/* 6. Generate a text-based summary report of the coverage, by scraping in the coverage/*.json files */
gulp.task('test:report-coverage', ['test:integration'], function(done) {
  var collector = new istanbul.Collector();
  var textReport = istanbul.Report.create('text');
  var textSummaryReport = istanbul.Report.create('text-summary');
  var lcovReport = istanbul.Report.create('lcov');

  return gulp.src('./coverage/*.json')
    .pipe(through.obj(function (file, enc, callback) {
        collector.add(JSON.parse(fs.readFileSync(file.path, 'utf8')));
	return callback();
      }))
    .on('end', function () {
    	textReport.writeReport(collector,true);
	textSummaryReport.writeReport(collector, true);
	lcovReport.writeReport(collector, true);

	// stopping of the server, as it doesn't die very gracefully
	server.stop();
    });
});
