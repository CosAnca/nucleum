/* global TASK_CONFIG */
if (!TASK_CONFIG.icons) {
  return;
}

const browserSync = require("browser-sync");
const gulp = require("gulp");
const svgstore = require("gulp-svgstore");
const projectPath = require("../lib/project-path");

function iconsTask() {
  const settings = {
    src: projectPath(TASK_CONFIG.basePaths.src, TASK_CONFIG.icons.src, "*.svg"),
    dest: projectPath(TASK_CONFIG.basePaths.dest, TASK_CONFIG.icons.dest),
  };

  return gulp
    .src(settings.src)
    .pipe(svgstore(TASK_CONFIG.icons.svgstore))
    .pipe(gulp.dest(settings.dest))
    .pipe(browserSync.stream());
}

iconsTask.displayName = "icons";
gulp.task(iconsTask);
module.exports = iconsTask;
