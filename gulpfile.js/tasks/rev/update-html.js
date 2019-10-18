/* global PATH_CONFIG, TASK_CONFIG */
if (!TASK_CONFIG.html) {
  return false;
}

const gulp = require("gulp");
const revReplace = require("gulp-rev-replace");
const projectPath = require("../../lib/project-path");

// 4) Update asset references in HTML
function updateHtmlTask() {
  const manifest = gulp.src(projectPath(PATH_CONFIG.dest, "rev-manifest.json"));
  return gulp
    .src(projectPath(PATH_CONFIG.dest, PATH_CONFIG.html.dest, "**/*.html"))
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.html.dest)));
}

updateHtmlTask.displayName = "update-html";
gulp.task(updateHtmlTask);
