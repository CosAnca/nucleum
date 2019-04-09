/* global PATH_CONFIG, TASK_CONFIG */
if (!TASK_CONFIG.static) {
  return;
}

// const changed = require('gulp-changed');
const gulp = require("gulp");
const path = require("path");
const projectPath = require("../lib/projectPath");

function staticTask() {
  const srcPath = projectPath(PATH_CONFIG.src, PATH_CONFIG.static.src);
  const defaultSrcOptions = { dot: true };
  const options = Object.assign(
    defaultSrcOptions,
    TASK_CONFIG.static.srcOptions || {}
  );

  const paths = {
    src: path.join(srcPath, "**/*"),
    dest: projectPath(PATH_CONFIG.dest, PATH_CONFIG.static.dest)
  };

  return gulp.src(paths.src, options).pipe(gulp.dest(paths.dest));
}

staticTask.displayName = "static";
gulp.task(staticTask);
module.exports = staticTask;
