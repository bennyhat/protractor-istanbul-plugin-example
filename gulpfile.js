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

gulp.task('test:clean', function(done) {
  return gulp.src(['tmp','coverage'], { read: false })
    .pipe(rimraf({force:true}));
});

gulp.task('test:files', ['test:clean'], function(done) {
  return gulp.src(['app/**'])
    .pipe(gulp.dest('tmp/'));
});

gulp.task('test:instrument', ['test:files'], function(done) {
  return gulp.src(['app/**/*.js','!app/bower_components/**'])
    .pipe(gulpIstanbul({
        coverageVariable: '__coverage__'
      }))
    .pipe(gulp.dest('tmp/'));
});

gulp.task('test:server', ['test:instrument'], function(done) {
  server.start({
    root: __dirname + '/tmp',
    host: '0.0.0.0',
    port: 8000
  }, done);
});

gulp.task('test:webdriver-update', webdriverUpdate);

gulp.task('test:integration',['test:webdriver-update','test:server'], function(done) {
  return gulp.src(["./e2e-tests/**/*.js"])
    .pipe(protractor({
      configFile: "e2e-tests/protractor.conf.js",
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    }))
    .on('error', function(e) { throw e })
});

gulp.task('test:report-coverage', ['test:integration'], function(done) {
  var collector = new istanbul.Collector();
  var textReport = istanbul.Report.create('text');
  var textSummaryReport = istanbul.Report.create('text-summary');

  return gulp.src('./coverage/*.json')
    .pipe(through.obj(function (file, enc, callback) {
        collector.add(JSON.parse(fs.readFileSync(file.path, 'utf8')));
	return callback();
      }))
    .on('end', function () {
    	textReport.writeReport(collector,true);
	textSummaryReport.writeReport(collector, true);
	server.stop();
    });
});
