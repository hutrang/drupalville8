'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var globbing = require('gulp-sass-globbing');
var browserSync = require('browser-sync').create();
var bourbon = require('node-bourbon').includePaths;
var neat = require('node-neat').includePaths;


// Minify JS
gulp.task('scripts', function() {
  return gulp
    // sources of js files, any .js but not min.js files
    .src(['js/*.js', '!js/*.min.js'])
    // start stream
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(notify({ message: 'Scripts task complete, BrowserSync reloaded' }));
});

// Styles
// initial task of generating one styles file with all sass imports
gulp.task('glob:sass', function() {
  return gulp
    // path where files should be globbed from
    .src('../sass/**/_*.scss', {cwd: 'sass/'})
    .pipe(globbing({
      // writes new file to the Changed Work Directory declared above
      path: 'styles.scss'
    },
    {
      useSingleQuotes: true
    }
  ))
    .pipe(gulp.dest('sass/'));
});

// converts sass to css with gulp-sass, with dependency of glob:sass task
gulp.task('sass', ['glob:sass'], function() {
  return gulp
    .src('sass/styles.scss')
    .pipe(sass({
      includePaths: bourbon,
      includePaths: neat
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({ stream: true })) // this is where the magic happens
    .pipe(notify({ message: 'Styles task complete, BrowserSync reloaded' }));
});


// Watch
gulp.task('watch', function() {
  gulp.watch('sass/*/*.scss', ['sass']);
  gulp.watch('js/*.js', ['scripts']);
});

// Serve
gulp.task('serve', function() {
  browserSync.init({
    ui: false,
    proxy: 'drupalville8.dev',
    host: 'drupalville8.dev'
  });
  gulp.start('watch').on('change', browserSync.reload);
});

// Default task: command of 'gulp'
gulp.task('default', ['serve'], function() {
  gulp.start(['sass'], ['scripts']);
});
