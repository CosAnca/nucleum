/* global PATH_CONFIG */
const gulp = require("gulp");
const projectPath = require("../../lib/project-path");
const rev = require("gulp-rev");
const revdel = require("gulp-rev-delete-original");

// 1) Add md5 hashes to assets referenced by CSS and JS files
function revAssetsTask() {
  // Ignore files that may reference assets. We'll rev them next.
  const ignoreThese =
    "!" + projectPath(PATH_CONFIG.dest, "**/*+(css|js|json|html)");

  return gulp
    .src([projectPath(PATH_CONFIG.dest, "**/*"), ignoreThese])
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

revAssetsTask.displayName = "rev-assets";
gulp.task(revAssetsTask);
