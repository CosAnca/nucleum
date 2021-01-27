/* global TASK_CONFIG */
const gulp = require("gulp");
const sizereport = require("gulp-sizereport");
const projectPath = require("../lib/project-path");

function sizeReportTask() {
  return gulp
    .src([
      projectPath(TASK_CONFIG.basePaths.dest, "**/*"),
      "*!rev-manifest.json",
    ])
    .pipe(
      sizereport({
        gzip: true,
      })
    );
}

sizeReportTask.displayName = "size-report";
gulp.task(sizeReportTask);
module.exports = sizeReportTask;
