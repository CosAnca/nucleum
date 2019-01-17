/* global PATH_CONFIG */
const gulp = require("gulp");
const sizereport = require("gulp-sizereport");
const projectPath = require("../lib/projectPath");

const sizeReportTask = function() {
  return gulp
    .src([projectPath(PATH_CONFIG.dest, "**/*"), "*!rev-manifest.json"])
    .pipe(
      sizereport({
        gzip: true
      })
    );
};

sizeReportTask.displayName = "size-report";
gulp.task(sizeReportTask);
module.exports = sizeReportTask;
