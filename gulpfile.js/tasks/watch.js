/* global TASK_CONFIG */
const gulp = require("gulp");
const path = require("path");
const projectPath = require("../lib/project-path");

function watchTask(cb) {
  const watchableTasks = [
    "fonts",
    "images",
    "icons",
    "html",
    "stylesheets",
    "static",
  ];

  function getTaskPathFor(taskName) {
    switch (taskName) {
      case "icons":
        return TASK_CONFIG.icons;
      case "html":
        return TASK_CONFIG.html;
      case "static":
        return TASK_CONFIG.static;
      default:
        return TASK_CONFIG[taskName];
    }
  }

  watchableTasks.forEach(function (taskName) {
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
      const srcPath = projectPath(TASK_CONFIG.basePaths.src, taskPath.src);
      const globPattern =
        "**/*" +
        (taskConfig.extensions
          ? ".{" + taskConfig.extensions.join(",") + "}"
          : "");

      gulp.watch(
        path.join(srcPath, globPattern),
        watchConfig,
        gulp.series(taskName)
      );
    }
  });
  cb();
}

watchTask.displayName = "watch";
gulp.task(watchTask);
module.exports = watchTask;
