const gulp = require('gulp');
const fs   = require('fs-extra');
const del  = require('del');
const path = require('path');

const replaceFiles = function(cb) {
  const temp = path.resolve(process.env.PWD, PATH_CONFIG.dest);
  const dest = path.resolve(process.env.PWD, PATH_CONFIG.finalDest);
  const delPatterns = (TASK_CONFIG.clean && TASK_CONFIG.clean.patterns) ? TASK_CONFIG.clean.patterns : dest;

  fs.copySync(temp, dest);
  del.sync(temp, { force: true });

  cb();
};

gulp.task('replaceFiles', replaceFiles);

module.exports = replaceFiles;
