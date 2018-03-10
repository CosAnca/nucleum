/* global PATH_CONFIG */
const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const projectPath = require('../lib/projectPath');
const rename = require('gulp-rename');
const merge = require('merge-stream');

gulp.task('init', function() {
  const dotfilesStream = gulp
    .src(['extras/dotfiles/**/*', '!extras/dotfiles/*.txt'], { dot: true })
    .pipe(gulp.dest(projectPath()));

  const renameGitIgnore = gulp
    .src(['extras/dotfiles/gitignore.txt'])
    .pipe(rename('.gitignore'))
    .pipe(gulp.dest(projectPath()));

  const configStream = gulp
    .src(['gulpfile.js/path-config.json', 'gulpfile.js/task-config.js'])
    .pipe(gulp.dest(projectPath('config')));

  const srcStream = gulp
    .src(['src/**/*', '*.gitkeep'])
    .pipe(gulp.dest(projectPath(PATH_CONFIG.src)));

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
