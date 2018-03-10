/* global process */
const compress = require('compression');
const config = require('../config');
const express = require('express');
const gulp = require('gulp');
const log = require('fancy-log');
const colors = require('ansi-colors');
const logger = require('morgan');
const open = require('open');
const projectPath = require('../lib/projectPath');

const settings = {
  root: projectPath(config.root.dest),
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

  log('production server started on ' + colors.green(url));
  open(url);
};

gulp.task('server', serverTask);
module.exports = serverTask;
