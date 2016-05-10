var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
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

gulp.task('watch', function () {
  watch('./client/less/**/*.less', function () {
    gulp.start('less');
  });
  watch('./client/www/scripts/modules/**/*.jsx', function () {
    gulp.start('jsx');
  });
});
