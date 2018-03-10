/* global PATH_CONFIG, TASK_CONFIG */
const gulp = require('gulp');
const path = require('path');
const projectPath = require('../lib/projectPath');
const watch = require('gulp-watch');

const watchTask = function() {
  const watchableTasks = [
    'fonts',
    'iconFont',
    'images',
    'svgSprite',
    'html',
    'stylesheets',
    'static',
  ];

  function getTaskPathFor(taskName) {
    switch (taskName) {
      case 'iconFont':
        return PATH_CONFIG.icons;
      case 'svgSprite':
        return PATH_CONFIG.icons;
      case 'html':
        return PATH_CONFIG.html;
      case 'static':
        return PATH_CONFIG.static;
      default:
        return PATH_CONFIG[taskName];
    }
  }

  watchableTasks.forEach(function(taskName) {
    const taskConfig = TASK_CONFIG[taskName];
    const taskPath = getTaskPathFor(taskName);
    let watchConfig = {};
    if (
      TASK_CONFIG.watch !== undefined &&
      TASK_CONFIG.watch.gulpWatch !== undefined
    ) {
      watchConfig = TASK_CONFIG.watch.gulpWatch;
    }

    if (taskConfig) {
      const srcPath = projectPath(PATH_CONFIG.src, taskPath.src);
      const globPattern =
        '**/*' +
        (taskConfig.extensions ?
          '.{' + taskConfig.extensions.join(',') + '}' :
          '');
      watch(path.join(srcPath, globPattern), watchConfig, function() {
        require('./' + taskName)();
      });
    }
  });
};

gulp.task('watch', ['browserSync'], watchTask);

module.exports = watchTask;
