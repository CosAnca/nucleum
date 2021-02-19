/* global TASK_CONFIG */
const gulp = require("gulp");
const projectPath = require("../../lib/project-path");
const rev = require("gulp-rev");
const revdel = require("gulp-rev-delete-original");

// 3) Rev and compress CSS files (this is done after assets, so that if a
//    referenced asset hash changes, the parent hash will change as well
function revCSSTask() {
  return gulp
    .src(projectPath(TASK_CONFIG.basePaths.dest, "**/*.css"))
    .pipe(rev())
    .pipe(gulp.dest(projectPath(TASK_CONFIG.basePaths.dest)))
    .pipe(revdel())
    .pipe(
      rev.manifest(
        projectPath(TASK_CONFIG.basePaths.dest, "rev-manifest.json"),
        {
          base: projectPath(TASK_CONFIG.basePaths.dest),
          merge: true,
        }
      )
    )
    .pipe(gulp.dest(projectPath(TASK_CONFIG.basePaths.dest)));
}

revCSSTask.displayName = "rev-css";
gulp.task(revCSSTask);
