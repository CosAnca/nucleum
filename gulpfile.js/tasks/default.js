const gulp = require("gulp");
const gulpSequence = require("gulp-sequence");
const getEnabledTasks = require("../lib/getEnabledTasks");

const defaultTask = function(cb) {
  let tasks = getEnabledTasks("watch");
  const static = TASK_CONFIG.static ? "static" : false;
  const { prebuild, postbuild } = TASK_CONFIG.additionalTasks.development;
  gulpSequence(
    "clean",
    prebuild,
    tasks.assetTasks,
    tasks.codeTasks,
    static,
    postbuild,
    "watch",
    cb
  );
};

gulp.task("default", defaultTask);
module.exports = defaultTask;
