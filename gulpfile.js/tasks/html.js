/* global TASK_CONFIG */
if (!TASK_CONFIG.html) {
  return;
}

const browserSync = require("browser-sync");
const gulp = require("gulp");
const exec = require("child_process").exec;
const projectPath = require("../lib/project-path");

function htmlTask(cb) {
  const cmd = "eleventy";

  exec(
    cmd,
    {
      cwd: projectPath(),
    },
    (err) => {
      cb(err);
    }
  );

  browserSync.reload();
}

htmlTask.displayName = "html";
gulp.task(htmlTask);
module.exports = htmlTask;
