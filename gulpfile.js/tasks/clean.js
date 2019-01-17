/* global PATH_CONFIG, TASK_CONFIG */
const gulp = require("gulp");
const del = require("del");
const projectPath = require("../lib/projectPath");

function cleanTask() {
  const patterns =
    TASK_CONFIG.clean && TASK_CONFIG.clean.patterns
      ? TASK_CONFIG.clean.patterns
      : projectPath(PATH_CONFIG.dest);

  return del(patterns, { force: true });
}

cleanTask.displayName = "clean";
gulp.task(cleanTask);
module.exports = cleanTask;
