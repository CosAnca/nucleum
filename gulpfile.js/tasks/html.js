/* global PATH_CONFIG, TASK_CONFIG */
if (!TASK_CONFIG.html) {
  return;
}

const browserSync = require("browser-sync");
const changed = require("gulp-changed");
const data = require("gulp-data");
const gulp = require("gulp");
const gulpif = require("gulp-if");
const handleErrors = require("../lib/handle-errors");
const htmlmin = require("gulp-htmlmin");
const projectPath = require("../lib/project-path");
const pug = require("gulp-pug");
const fs = require("fs");

function htmlTask() {
  const exclude =
    "!" +
    projectPath(
      PATH_CONFIG.src,
      PATH_CONFIG.html.src,
      "**/{" + TASK_CONFIG.html.excludeFolders.join(",") + "}/**"
    );

  const paths = {
    src: [
      projectPath(
        PATH_CONFIG.src,
        PATH_CONFIG.html.src,
        "**/*.{" + TASK_CONFIG.html.extensions + "}"
      ),
      exclude
    ],
    dest: projectPath(PATH_CONFIG.dest, PATH_CONFIG.html.dest)
  };

  const dataFunction =
    TASK_CONFIG.html.dataFunction ||
    function() {
      const dataPath = projectPath(
        PATH_CONFIG.src,
        PATH_CONFIG.html.src,
        TASK_CONFIG.html.dataFile
      );
      return JSON.parse(fs.readFileSync(dataPath, "utf8"));
    };

  return gulp
    .src(paths.src)
    .pipe(
      changed(paths.dest, {
        extension: ".html"
      })
    )
    .pipe(data(dataFunction))
    .on("error", handleErrors)
    .pipe(
      pug({
        pretty: true
      })
    )
    .on("error", handleErrors)
    .pipe(gulpif(global.production, htmlmin(TASK_CONFIG.html.htmlmin)))
    .pipe(gulp.dest(paths.dest))
    .on("end", browserSync.reload);
}

htmlTask.displayName = "html";
gulp.task(htmlTask);
module.exports = htmlTask;
