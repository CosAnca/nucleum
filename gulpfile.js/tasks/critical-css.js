/* global PATH_CONFIG TASK_CONFIG */
if (!TASK_CONFIG.stylesheets.criticalCss) {
  return;
}

const gulp = require("gulp");
const handleErrors = require("../lib/handle-errors");
const critical = require("critical");
const projectPath = require("../lib/project-path");

function criticalCssTask(cb) {
  const pages = TASK_CONFIG.stylesheets.criticalCss.pages || [];
  const config = TASK_CONFIG.stylesheets.criticalCss.config || {};
  const paths = {
    siteUrl: PATH_CONFIG.criticalCss.siteUrl,
    src: projectPath(PATH_CONFIG.dest, PATH_CONFIG.criticalCss.src),
    dest: projectPath(PATH_CONFIG.dest, PATH_CONFIG.criticalCss.dest)
  };

  if (pages.length) {
    return pages.map(page => {
      config.src = paths.siteUrl + page.url;
      config.dest = paths.dest + "/" + page.template + "-critical.css";

      return critical.generate(config, err => {
        if (err) {
          handleErrors;
        }
        cb();
      });
    });
  } else {
    return gulp
      .src(paths.src)
      .pipe(critical.stream(config))
      .on("error", handleErrors)
      .pipe(gulp.dest(paths.dest));
  }
}

criticalCssTask.displayName = "criticalCss";
gulp.task(criticalCssTask);
module.exports = criticalCssTask;
