var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var path = require('path');

gulp.task('less', function () {
  return gulp.src('./client/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('./client/www/style/'));
});

gulp.task('watch', function () {
  watch('./client/less/**/*.less', function () {
    gulp.start('less');
  });
});
