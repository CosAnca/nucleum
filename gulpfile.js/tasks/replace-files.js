/* global PATH_CONFIG, TASK_CONFIG */
const gulp = require("gulp");
const fs = require("fs-extra");
const del = require("del");
const projectPath = require("../lib/project-path");

function replaceFiles(cb) {
  const temp = projectPath(PATH_CONFIG.dest);
  const dest = projectPath(PATH_CONFIG.finalDest);
  const delPatterns =
    TASK_CONFIG.clean && TASK_CONFIG.clean.patterns
      ? TASK_CONFIG.clean.patterns
      : dest;

  del.sync(delPatterns, { force: true });
  fs.copySync(temp, dest);
  del.sync(temp, { force: true });

  cb();
}

gulp.task(replaceFiles);
module.exports = replaceFiles;
