/* global PATH_CONFIG */
const gulp = require("gulp");
const projectPath = require("../../lib/project-path");
const rev = require("gulp-rev");
const revdel = require("gulp-rev-delete-original");

// 3) Rev and compress CSS and JS files (this is done after assets, so that if a
//    referenced asset hash changes, the parent hash will change as well
function revCSSTask() {
  return gulp
    .src(projectPath(PATH_CONFIG.dest, "**/*.css"))
    .pipe(rev())
    .pipe(gulp.dest(PATH_CONFIG.dest))
    .pipe(revdel())
    .pipe(
      rev.manifest(projectPath(PATH_CONFIG.dest, "rev-manifest.json"), {
        base: projectPath(PATH_CONFIG.dest),
        merge: true,
      })
    )
    .pipe(gulp.dest(PATH_CONFIG.dest));
}

revCSSTask.displayName = "rev-css";
gulp.task(revCSSTask);
