/* global TASK_CONFIG */
const gulp = require("gulp");
const projectPath = require("../../lib/project-path");
const rev = require("gulp-rev");
const revdel = require("gulp-rev-delete-original");

// 1) Add md5 hashes to assets referenced by CSS and JS files
function revAssetsTask() {
  // Ignore files that may reference assets. We'll rev them next.
  const ignoreThese =
    "!" +
    projectPath(TASK_CONFIG.basePaths.dest, "**/*+(css|js|json|html|xml)");

  return gulp
    .src([
      projectPath(
        TASK_CONFIG.basePaths.dest,
        TASK_CONFIG.production.rev.manifestDir,
        "**/*"
      ),
      ignoreThese,
    ])
    .pipe(rev())
    .pipe(
      gulp.dest(
        projectPath(
          TASK_CONFIG.basePaths.dest,
          TASK_CONFIG.production.rev.manifestDir
        )
      )
    )
    .pipe(revdel())
    .pipe(
      rev.manifest(
        projectPath(
          TASK_CONFIG.basePaths.dest,
          TASK_CONFIG.production.rev.manifestDir,
          "rev-manifest.json"
        ),
        {
          base: projectPath(
            TASK_CONFIG.basePaths.dest,
            TASK_CONFIG.production.rev.manifestDir
          ),
          merge: true,
        }
      )
    )
    .pipe(
      gulp.dest(
        projectPath(
          TASK_CONFIG.basePaths.dest,
          TASK_CONFIG.production.rev.manifestDir
        )
      )
    );
}

revAssetsTask.displayName = "rev-assets";
gulp.task(revAssetsTask);
