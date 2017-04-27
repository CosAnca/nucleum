const compress = require('compression');
const config   = require('../config');
const express  = require('express');
const gulp     = require('gulp');
const gutil    = require('gulp-util');
const logger   = require('morgan');
const open     = require('open');
const path     = require('path');

const settings = {
  root: path.resolve(process.env.PWD, config.root.dest),
  port: process.env.PORT || 5000,
  logLevel: process.env.NODE_ENV ? 'combined' : 'dev',
  staticOptions: {
    extensions: ['html'],
    maxAge: '31556926',
  },
};

const serverTask = function() {
  const url = 'http://localhost:' + settings.port;

  express()
    .use(compress())
    .use(logger(settings.logLevel))
    .use('/', express.static(settings.root, settings.staticOptions))
    .listen(settings.port);

  gutil.log('production server started on ' + gutil.colors.green(url));
  open(url);
};

gulp.task('server', serverTask);
module.exports = serverTask;
