/* global TASK_CONFIG */
if (!TASK_CONFIG.html) {
  return;
}

const browserSync = require("browser-sync");
const gulp = require("gulp");
const exec = require("child_process").exec;
const projectPath = require("../lib/project-path");
const handleErrors = require("../lib/handle-errors");

function htmlTask(cb) {
  const cmd = "eleventy";

  exec(
    cmd,
    {
      cwd: projectPath(),
    },
    (err) => {
      if (err) {
        handleErrors(err);
      }
      browserSync.reload();
      cb();
    }
  );
}

htmlTask.displayName = "html";
gulp.task(htmlTask);
module.exports = htmlTask;
