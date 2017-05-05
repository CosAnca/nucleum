if(global.production) return

const browserSync       = require('browser-sync');
const gulp              = require('gulp');
const webpack           = require('webpack');
const webpackMultiConfig = require('../lib/webpack-multi-config');
const pathToUrl         = require('../lib/pathToUrl');
const path              = require('path');

const browserSyncTask = function() {

  const webpackConfig = webpackMultiConfig('development');
  const compiler = webpack(webpackConfig);
  const proxyConfig = TASK_CONFIG.browserSync.proxy || null;

  if (typeof proxyConfig === 'string') {
    TASK_CONFIG.browserSync.proxy = {
      target: proxyConfig,
    };
  }

  // Resolve path from PWD
  if (TASK_CONFIG.browserSync.server && TASK_CONFIG.browserSync.server.baseDir) {
    TASK_CONFIG.browserSync.server.baseDir = path.resolve(process.env.PWD, TASK_CONFIG.browserSync.server.baseDir);
  }

  // Resolve files from PWD
  if (TASK_CONFIG.browserSync.files) {
    TASK_CONFIG.browserSync.files = TASK_CONFIG.browserSync.files.map(function(glob) {
      return path.resolve(process.env.PWD, glob);
    });
  }

  const server = TASK_CONFIG.browserSync.proxy || TASK_CONFIG.browserSync.server;

  server.middleware = [
    require('webpack-dev-middleware')(compiler, {
      stats: 'errors-only',
      watchOptions: TASK_CONFIG.browserSync.watchOptions || {},
      publicPath: pathToUrl('/', webpackConfig.output.publicPath),
    }),
    require('webpack-hot-middleware')(compiler),
  ];

  browserSync.init(TASK_CONFIG.browserSync);
};

gulp.task('browserSync', browserSyncTask);
module.exports = browserSyncTask;
