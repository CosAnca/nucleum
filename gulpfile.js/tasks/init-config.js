const gulp = require("gulp");
const log = require("fancy-log");
const colors = require("ansi-colors");
const projectPath = require("../lib/project-path");

function initConfigTask() {
  const configStream = gulp
    .src(["gulpfile.js/nucleum.config.js"])
    .pipe(gulp.dest(projectPath()));

  log(colors.green("Adding default nucleum.config.js file"));

  return configStream;
}

initConfigTask.displayName = "init-config";
gulp.task(initConfigTask);
