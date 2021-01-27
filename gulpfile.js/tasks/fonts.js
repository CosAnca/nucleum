/* global TASK_CONFIG */
if (!TASK_CONFIG.fonts) {
  return;
}

const browserSync = require("browser-sync");
const changed = require("gulp-changed");
const gulp = require("gulp");
const projectPath = require("../lib/project-path");

function fontsTask() {
  const paths = {
    src: projectPath(
      TASK_CONFIG.basePaths.src,
      TASK_CONFIG.fonts.src,
      "**/*.{" + TASK_CONFIG.fonts.extensions + "}"
    ),
    dest: projectPath(TASK_CONFIG.basePaths.dest, TASK_CONFIG.fonts.dest),
  };

  return gulp
    .src([paths.src, "*!README.md"])
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
}

fontsTask.displayName = "fonts";
gulp.task(fontsTask);
module.exports = fontsTask;
