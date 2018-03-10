/* global PATH_CONFIG */
const gulp = require('gulp');
const projectPath = require('../lib/projectPath');
const rev = require('gulp-rev');
const revNapkin = require('gulp-rev-napkin');

// 1) Add md5 hashes to assets referenced by CSS and JS files
gulp.task('rev-assets', function() {
  // Ignore files that may reference assets. We'll rev them next.
  const ignoreThese =
    '!' + projectPath(PATH_CONFIG.dest, '**/*+(css|js|json|html)');

  return gulp
    .src([projectPath(PATH_CONFIG.dest, '**/*'), ignoreThese])
    .pipe(rev())
    .pipe(gulp.dest(PATH_CONFIG.dest))
    .pipe(revNapkin({ verbose: false, force: true }))
    .pipe(
      rev.manifest(projectPath(PATH_CONFIG.dest, 'rev-manifest.json'), {
        merge: true,
      })
    )
    .pipe(gulp.dest(''));
});
