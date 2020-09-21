/* global TASK_CONFIG */
const gulp = require("gulp");
const getEnabledTasks = require("../lib/get-enabled-tasks");

function productionTask(cb) {
  global.production = true;
  process.env.NODE_ENV = "production";

  const tasks = getEnabledTasks("production");
  const rev = TASK_CONFIG.production.rev ? "rev" : [];
  const static = TASK_CONFIG.static ? "static" : [];
  const criticalCss = TASK_CONFIG.stylesheets.criticalCss ? "criticalCss" : [];
  const { prebuild, postbuild } = TASK_CONFIG.additionalTasks.production;

  return gulp.series(
    "clean",
    prebuild,
    gulp.parallel(tasks.assetTasks),
    gulp.parallel(tasks.codeTasks),
    criticalCss,
    rev,
    static,
    "size-report",
    postbuild
  )(cb);
}

productionTask.displayName = "build";
gulp.task(productionTask);
module.exports = productionTask;
