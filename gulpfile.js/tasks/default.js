/* global TASK_CONFIG */
const gulp = require("gulp");
const getEnabledTasks = require("../lib/getEnabledTasks");

function defaultTask(cb) {
  let tasks = getEnabledTasks("watch");
  const staticTask = TASK_CONFIG.static ? "static" : [];
  const { prebuild, postbuild } = TASK_CONFIG.additionalTasks.development;

  return gulp.series(
    "clean",
    prebuild,
    gulp.parallel(tasks.assetTasks),
    gulp.parallel(tasks.codeTasks),
    staticTask,
    postbuild,
    gulp.parallel("watch", "browserSync")
  )(cb);
}

defaultTask.displayName = "default";
gulp.task(defaultTask);
module.exports = defaultTask;
