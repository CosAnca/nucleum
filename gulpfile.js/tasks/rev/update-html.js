/* global TASK_CONFIG */
if (!TASK_CONFIG.html) {
  return false;
}

const gulp = require("gulp");
const revReplace = require("gulp-rev-replace");
const projectPath = require("../../lib/project-path");

// 4) Update asset references in HTML
function updateHtmlTask() {
  const manifest = gulp.src(
    projectPath(
      TASK_CONFIG.basePaths.dest,
      TASK_CONFIG.production.rev.manifestDir,
      "rev-manifest.json"
    )
  );
  return gulp
    .src(
      projectPath(
        TASK_CONFIG.basePaths.dest,
        TASK_CONFIG.html.dest,
        "**/*.html"
      )
    )
    .pipe(revReplace({ manifest }))
    .pipe(
      gulp.dest(projectPath(TASK_CONFIG.basePaths.dest, TASK_CONFIG.html.dest))
    );
}

updateHtmlTask.displayName = "update-html";
gulp.task(updateHtmlTask);
