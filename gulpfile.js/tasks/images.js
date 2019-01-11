/* global PATH_CONFIG, TASK_CONFIG */
if (!TASK_CONFIG.images) {
  return;
}

const browserSync = require("browser-sync");
const changed = require("gulp-changed");
const gulp = require("gulp");
const projectPath = require("../lib/projectPath");

function imagesTask() {
  const paths = {
    src: projectPath(
      PATH_CONFIG.src,
      PATH_CONFIG.images.src,
      "**/*.{" + TASK_CONFIG.images.extensions + "}"
    ),
    dest: projectPath(PATH_CONFIG.dest, PATH_CONFIG.images.dest)
  };

  return gulp
    .src([paths.src, "*!README.md"])
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
}

imagesTask.displayName = "images";
gulp.task(imagesTask);
module.exports = imagesTask;
