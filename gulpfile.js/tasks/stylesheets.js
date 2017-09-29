if(!TASK_CONFIG.stylesheets) return

const gulp         = require('gulp');
const gulpif       = require('gulp-if');
const browserSync  = require('browser-sync');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const handleErrors = require('../lib/handleErrors');
const autoprefixer = require('gulp-autoprefixer');
const path         = require('path');
const combineMq    = require('gulp-combine-mq');
const cssnano      = require('gulp-cssnano');

const stylesheetsTask = function() {

  const paths = {
    src: path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.stylesheets.src, '**/*.{' + TASK_CONFIG.stylesheets.extensions + '}'),
    dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.stylesheets.dest),
  };

  if (TASK_CONFIG.stylesheets.sass && TASK_CONFIG.stylesheets.sass.includePaths) {
    TASK_CONFIG.stylesheets.sass.includePaths = TASK_CONFIG.stylesheets.sass.includePaths.map(function(includePath) {
      return path.resolve(process.env.PWD, includePath);
    });
  }

  const cssnanoConfig = TASK_CONFIG.stylesheets.cssnano || {};
  cssnanoConfig.autoprefixer = false; // this should always be false, since we're autoprefixing separately

  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(sass(TASK_CONFIG.stylesheets.sass))
    .on('error', handleErrors)
    .pipe(autoprefixer(TASK_CONFIG.stylesheets.autoprefixer))
    .pipe(gulpif(global.production, cssnano(cssnanoConfig)))
    .pipe(gulpif(!global.production, sourcemaps.write()))
    .pipe(gulpif(global.production, combineMq(TASK_CONFIG.stylesheets.combinemq || { beautify: false })))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
};

gulp.task('stylesheets', stylesheetsTask);
module.exports = stylesheetsTask;
