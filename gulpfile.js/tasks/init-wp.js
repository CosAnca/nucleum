const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const merge = require('merge-stream');

gulp.task('init-wp', function() {
  const dotfilesStream = gulp.src(['extras/dotfiles/**/*'], { dot: true })
    .pipe(gulp.dest(process.env.PWD));

  const configStream = gulp.src([
    'extras/wordpress/**',
    '!extras/wordpress/wp-setup{,/**}',
    '!extras/wordpress/*.md'
  ]).pipe(gulp.dest(process.env.PWD));

  const srcStream = gulp.src(['src/**/*', '*.gitkeep'])
    .pipe(gulp.dest(path.join(process.env.PWD, PATH_CONFIG.src)));

  gutil.log(gutil.colors.green.bold('Generating Fosterkit Wordpress project configuration files'));
  gutil.log(gutil.colors.green('Please follow the instructions below to setup your Wordpress installation'));
  gutil.log(gutil.colors.yellow(
    `

      1. Open ${gutil.colors.cyan.underline('wp-setup.yml')} and customise.
      2. Open ${gutil.colors.cyan.underline('Vagrantfile')} and add your local domain and IP.
      3. Run: ${gutil.colors.magenta('vagrant up')} and watch the magic!
    `
  ));

  return merge(dotfilesStream, configStream, srcStream);
});
