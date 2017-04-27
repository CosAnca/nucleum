const gulp = require('gulp');
const fs   = require('fs');
const del  = require('del');
const path = require('path');

const replaceFiles = function(cb) {
  const temp = path.resolve(process.env.PWD, PATH_CONFIG.dest);
  const dest = path.resolve(process.env.PWD, PATH_CONFIG.finalDest);
  del.sync([ dest ], { force: true });
  fs.renameSync(temp, dest);
  del.sync([ temp ]);
  cb();
};

gulp.task('replaceFiles', replaceFiles);

module.exports = replaceFiles;
