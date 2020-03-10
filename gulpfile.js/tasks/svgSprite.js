/* global PATH_CONFIG, TASK_CONFIG */
if (!TASK_CONFIG.svgSprite) {
  return;
}

const browserSync = require("browser-sync");
const gulp = require("gulp");
const svgstore = require("gulp-svgstore");
const projectPath = require("../lib/project-path");

function svgSpriteTask() {
  const settings = {
    src: projectPath(PATH_CONFIG.src, PATH_CONFIG.icons.src, "*.svg"),
    dest: projectPath(PATH_CONFIG.dest, PATH_CONFIG.icons.dest)
  };

  return gulp
    .src(settings.src)
    .pipe(svgstore(TASK_CONFIG.svgSprite.svgstore))
    .pipe(gulp.dest(settings.dest))
    .pipe(browserSync.stream());
}

svgSpriteTask.displayName = "svgSprite";
gulp.task(svgSpriteTask);
module.exports = svgSpriteTask;
