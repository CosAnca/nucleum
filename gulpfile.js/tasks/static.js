/* global TASK_CONFIG */
if (!TASK_CONFIG.static) {
  return;
}

// const changed = require('gulp-changed');
const gulp = require("gulp");
const path = require("path");
const projectPath = require("../lib/project-path");

function staticTask() {
  const srcPath = projectPath(
    TASK_CONFIG.basePaths.src,
    TASK_CONFIG.static.src
  );
  const defaultSrcOptions = { dot: true };
  const options = Object.assign(
    defaultSrcOptions,
    TASK_CONFIG.static.srcOptions || {}
  );

  const paths = {
    src: path.join(srcPath, "**/*"),
    dest: projectPath(TASK_CONFIG.basePaths.dest, TASK_CONFIG.static.dest),
  };

  return gulp.src(paths.src, options).pipe(gulp.dest(paths.dest));
}

staticTask.displayName = "static";
gulp.task(staticTask);
module.exports = staticTask;
