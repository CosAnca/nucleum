/* global TASK_CONFIG */
if (!TASK_CONFIG.stylesheets.criticalCss) {
  return;
}

const gulp = require("gulp");
const handleErrors = require("../lib/handle-errors");
const critical = require("critical");
const projectPath = require("../lib/project-path");

function criticalCssTask(cb) {
  const siteUrl = TASK_CONFIG.stylesheets.criticalCss.siteUrl || "";
  const pages = TASK_CONFIG.stylesheets.criticalCss.pages || [];
  const config = TASK_CONFIG.stylesheets.criticalCss.config || {};
  const paths = {
    src: projectPath(TASK_CONFIG.stylesheets.criticalCss.src),
    dest: projectPath(TASK_CONFIG.stylesheets.criticalCss.dest)
  };

  console.log(paths.src);
  console.log(paths.dest);

  if (pages.length) {
    return pages.map(page => {
      config.src = siteUrl + page.url;
      config.dest = paths.dest + "/" + page.template + "-critical.css";

      return critical.generate(config, err => {
        if (err) {
          handleErrors(err);
        }
        cb();
      });
    });
  }

  return gulp
    .src(paths.src)
    .pipe(critical.stream(config))
    .on("error", handleErrors)
    .pipe(gulp.dest(paths.dest));
}

criticalCssTask.displayName = "criticalCss";
gulp.task(criticalCssTask);
module.exports = criticalCssTask;
