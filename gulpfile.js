const gulp = require('gulp');
const connect = require('gulp-connect');

gulp.task('connect', ()=> {
  connect.server({
    port: 8000
  });
});

gulp.task('default', ['connect']);