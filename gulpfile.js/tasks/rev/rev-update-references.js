/* global TASK_CONFIG */
const gulp = require("gulp");
const projectPath = require("../../lib/project-path");
const revReplace = require("gulp-rev-replace");

// 2) Update asset references with reved filenames in compiled css + js
function revUpdateReferencesTask() {
  const manifest = gulp.src(
    projectPath(
      TASK_CONFIG.basePaths.dest,
      TASK_CONFIG.production.rev.manifestDir,
      "rev-manifest.json"
    )
  );

  return gulp
    .src(projectPath(TASK_CONFIG.basePaths.dest, "**/*.{css,js}"))
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest(projectPath(TASK_CONFIG.basePaths.dest)));
}

revUpdateReferencesTask.displayName = "rev-update-references";
gulp.task(revUpdateReferencesTask);
