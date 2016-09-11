var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var gp_concat = require('gulp-concat');
var gp_rename = require('gulp-rename');
var path = require('path');
var react = require('gulp-react');

gulp.task('jsx', function () {
  return gulp.src('./client/www/scripts/modules/**/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('./client/www/scripts/modules'));
});
gulp.task('less', function () {
  return gulp.src('./client/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('./client/www/style/'));
});


gulp.task('build-vendor', function(){
  return gulp.src([
      './client/www/scripts/vendor/angular/angular.min.js',
      './client/www/scripts/vendor/react/react.min.js',
      './client/www/scripts/vendor/react/react-dom.min.js',
      './client/www/scripts/vendor/d3.min.js',
      './client/www/scripts/vendor/leaflet.js',
    './client/www/scripts/vendor/**/*.js'
  ])
    .pipe(gp_concat('vendor.js'))
    .pipe(gulp.dest('./client/www/dist'));
});

gulp.task('watch', function () {
  watch('./client/less/**/*.less', function () {
    gulp.start('less');
  });
  watch('./client/www/scripts/modules/**/*.jsx', function () {
    gulp.start('jsx');
  });
});
