const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const merge = require('merge-stream');

gulp.task('init', function() {
  const dotfilesStream = gulp.src(['extras/dotfiles/**/*'], { dot: true })
    .pipe(gulp.dest(process.env.PWD));

  const configStream = gulp.src(['gulpfile.js/path-config.json', 'gulpfile.js/task-config.js'])
    .pipe(gulp.dest(path.join(process.env.PWD, 'config')));

  const srcStream = gulp.src(['src/**/*', '*.gitkeep'])
    .pipe(gulp.dest(path.join(process.env.PWD, PATH_CONFIG.src)));

  gutil.log(gutil.colors.green('Generating default Fosterkit project files'));
  gutil.log(gutil.colors.yellow(`
    To start the dev server:
  `), gutil.colors.magenta(`
    yarn run fosterkit
  `));

  return merge(dotfilesStream, configStream, srcStream);
});
