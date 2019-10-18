const gulp = require("gulp");
const log = require("fancy-log");
const colors = require("ansi-colors");
const projectPath = require("../lib/project-path");

function initConfigTask() {
  const configStream = gulp
    .src(["gulpfile.js/path-config.json", "gulpfile.js/task-config.js"])
    .pipe(gulp.dest(projectPath("config")));

  log(
    colors.green(
      "Adding default path-config.json and task-config.js files to ./config/"
    )
  );

  return configStream;
}

initConfigTask.displayName = "init-config";
gulp.task(initConfigTask);
