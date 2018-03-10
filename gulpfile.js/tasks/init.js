/* global process, PATH_CONFIG */
const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const path = require('path');
const rename = require('gulp-rename');
const merge = require('merge-stream');

gulp.task('init', function() {
  const dotfilesStream = gulp
    .src(['extras/dotfiles/**/*', '!extras/dotfiles/*.txt'], { dot: true })
    .pipe(gulp.dest(process.env.PWD));

  const renameGitIgnore = gulp
    .src(['extras/dotfiles/gitignore.txt'])
    .pipe(rename('.gitignore'))
    .pipe(gulp.dest(process.env.PWD));

  const configStream = gulp
    .src(['gulpfile.js/path-config.json', 'gulpfile.js/task-config.js'])
    .pipe(gulp.dest(path.join(process.env.PWD, 'config')));

  const srcStream = gulp
    .src(['src/**/*', '*.gitkeep'])
    .pipe(gulp.dest(path.join(process.env.PWD, PATH_CONFIG.src)));

  log(colors.green('Generating default Fosterkit project files'));
  log(
    colors.yellow(`
    To start the dev server:
  `),
    colors.magenta(`
    yarn run fosterkit
  `)
  );

  return merge(dotfilesStream, renameGitIgnore, configStream, srcStream);
});
