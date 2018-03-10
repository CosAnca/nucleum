/* global process */
const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const path = require('path');
// const merge = require('merge-stream');

gulp.task('init-config', function() {
  const configStream = gulp
    .src(['gulpfile.js/path-config.json', 'gulpfile.js/task-config.js'])
    .pipe(gulp.dest(path.join(process.env.PWD, 'config')));

  log(
    colors.green(
      'Adding default path-config.json and task-config.js files to ./config/'
    )
  );

  return configStream;
});
