/* global TASK_CONFIG */
if (!TASK_CONFIG.javascripts) {
  return;
}

const gulp = require("gulp");
const logger = require("../lib/compile-logger");
const webpack = require("webpack");

function webpackProductionTask(callback) {
  const webpackConfig = require("../lib/webpack-multi-config")("production");

  webpack(webpackConfig, function(err, stats) {
    logger(err, stats);
    callback();
  });
}

webpackProductionTask.displayName = "webpack:production";
gulp.task(webpackProductionTask);
module.exports = webpackProductionTask;
