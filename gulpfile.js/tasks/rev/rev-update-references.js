const gulp       = require('gulp');
const path       = require('path');
const revReplace = require('gulp-rev-replace');

// 2) Update asset references with reved filenames in compiled css + js
gulp.task('rev-update-references', function() {
  const manifest = gulp.src(path.resolve(process.env.PWD, PATH_CONFIG.dest, 'rev-manifest.json'));

  return gulp.src(path.resolve(process.env.PWD, PATH_CONFIG.dest,'**/**.{css,js}'))
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest(PATH_CONFIG.dest));
});
