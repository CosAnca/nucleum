if(!TASK_CONFIG.indexGen) return

const browserSync  = require('browser-sync');
const changed      = require('gulp-changed');
const data         = require('gulp-data');
const gulp         = require('gulp');
const gulpif       = require('gulp-if');
const handleErrors = require('../lib/handleErrors');
const path         = require('path');
const fs           = require('fs');
const hs           = require('hyperstream');

const indexGenTask = function() {

  const exclude = '!' + path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.html.src, '**/{' + TASK_CONFIG.html.excludeFolders.join(',') + '}/**');

  const paths = {
    src: [path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.html.src, '**/*.{' + TASK_CONFIG.html.extensions + '}'), exclude],
    dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.html.dest),
  };

  const dataFunction = TASK_CONFIG.html.dataFunction || function(file) {
    const dataPath = path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.html.src, TASK_CONFIG.html.dataFile);
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  };

  return gulp.src(paths.src)
    .pipe(changed(paths.dest, {
      extension: '.html',
    }))
    .pipe(data(dataFunction))
    .on('error', handleErrors)
    .pipe(pug({
      pretty: true,
    }))
    .on('error', handleErrors)
    .pipe(gulpif(global.production, htmlmin(TASK_CONFIG.html.htmlmin)))
    .pipe(gulp.dest(paths.dest))
    .on('end', browserSync.reload);

};

gulp.task('html', htmlTask);
module.exports = htmlTask;
