const gulp         = require('gulp');
const sizereport   = require('gulp-sizereport');
const path         = require('path');

gulp.task('size-report', function() {
  return gulp.src([path.resolve(process.env.PWD, PATH_CONFIG.dest, '**/*'), '*!rev-manifest.json'])
    .pipe(sizereport({
      gzip: true,
    }));
});
