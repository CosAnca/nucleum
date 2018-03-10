/* global PATH_CONFIG */
const gulp = require('gulp');
const projectPath = require('../../lib/projectPath');
const revReplace = require('gulp-rev-replace');

// 2) Update asset references with reved filenames in compiled css + js
gulp.task('rev-update-references', function() {
  const manifest = gulp.src(projectPath(PATH_CONFIG.dest, 'rev-manifest.json'));

  return gulp
    .src(projectPath(PATH_CONFIG.dest, '**/**.{css,js}'))
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest(PATH_CONFIG.dest));
});
