/* global TASK_CONFIG */
if (global.production) {
  return;
}

const browserSync = require("browser-sync");
const gulp = require("gulp");
const webpack = require("webpack");
const webpackMultiConfig = require("../lib/webpack-multi-config");
const pathToUrl = require("../lib/path-to-url");
const projectPath = require("../lib/project-path");

function browserSyncTask(cb) {
  const webpackConfig = webpackMultiConfig("development");
  const compiler = webpack(webpackConfig);
  const proxyConfig = TASK_CONFIG.browserSync.proxy || null;

  if (typeof proxyConfig === "string") {
    TASK_CONFIG.browserSync.proxy = {
      target: proxyConfig,
    };
  }

  // Resolve path from project
  if (
    TASK_CONFIG.browserSync.server &&
    TASK_CONFIG.browserSync.server.baseDir
  ) {
    TASK_CONFIG.browserSync.server.baseDir = projectPath(
      TASK_CONFIG.browserSync.server.baseDir
    );
  }

  // Resolve files from project
  if (TASK_CONFIG.browserSync.files) {
    TASK_CONFIG.browserSync.files = TASK_CONFIG.browserSync.files.map(function (
      glob
    ) {
      return projectPath(glob);
    });
  }

  const server =
    TASK_CONFIG.browserSync.proxy || TASK_CONFIG.browserSync.server;

  server.middleware =
    server.middleware ||
    [
      require("webpack-dev-middleware")(compiler, {
        stats: "errors-only",
        watchOptions: TASK_CONFIG.browserSync.watchOptions || {},
        publicPath: pathToUrl("/", webpackConfig.output.publicPath),
      }),
      require("webpack-hot-middleware")(compiler),
    ].concat(server.extraMiddlewares || []);

  browserSync.init(TASK_CONFIG.browserSync);
  cb();
}

browserSyncTask.displayName = "browserSync";
gulp.task(browserSyncTask);
module.exports = browserSyncTask;
