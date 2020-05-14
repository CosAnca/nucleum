/* global TASK_CONFIG */
if (!TASK_CONFIG.html) {
  return;
}

const browserSync = require("browser-sync");
const gulp = require("gulp");
const exec = require("child_process").exec;

function htmlTask(cb) {
  const cmd = "eleventy";

  exec(cmd, (err) => {
    cb(err);
  });

  browserSync.reload();
}

htmlTask.displayName = "html";
gulp.task(htmlTask);
module.exports = htmlTask;
