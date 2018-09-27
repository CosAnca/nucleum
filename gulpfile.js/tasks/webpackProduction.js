if (!TASK_CONFIG.javascripts) {
  return;
}

const gulp = require("gulp");
const logger = require("../lib/compileLogger");
const webpack = require("webpack");

const webpackProductionTask = function(callback) {
  const webpackConfig = require("../lib/webpack-multi-config")("production");

  webpack(webpackConfig, function(err, stats) {
    logger(err, stats);
    callback();
  });
};

gulp.task("webpack:production", webpackProductionTask);
module.exports = webpackProductionTask;
