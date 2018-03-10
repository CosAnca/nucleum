/* global process, PATH_CONFIG */
const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const path = require('path');
const rename = require('gulp-rename');
const merge = require('merge-stream');

gulp.task('init-wp', function() {
  const dotfilesStream = gulp
    .src(['extras/dotfiles/**/*', '!extras/dotfiles/*.txt'], { dot: true })
    .pipe(gulp.dest(process.env.PWD));

  const renameGitIgnore = gulp
    .src(['extras/dotfiles/gitignore.txt'])
    .pipe(rename('.gitignore'))
    .pipe(gulp.dest(process.env.PWD));

  const configStream = gulp
    .src([
      'extras/wordpress/**',
      '!extras/wordpress/wp-setup{,/**}',
      '!extras/wordpress/*.md',
    ])
    .pipe(gulp.dest(process.env.PWD));

  const srcStream = gulp
    .src(['src/**/*', '*.gitkeep'])
    .pipe(gulp.dest(path.join(process.env.PWD, PATH_CONFIG.src)));

  log(
    colors.green.bold(
      'Generating Fosterkit Wordpress project configuration files'
    )
  );
  log(
    colors.green(
      'Please follow the instructions below to setup your Wordpress installation'
    )
  );
  log(
    colors.yellow(
      `

      1. Open ${colors.cyan.underline('wp-setup.yml')} and customise.
      2. Open ${colors.cyan.underline(
    'Vagrantfile'
  )} and add your local domain and IP.
      3. Run: ${colors.magenta('vagrant up')} and watch the magic!
    `
    )
  );

  return merge(dotfilesStream, renameGitIgnore, configStream, srcStream);
});
