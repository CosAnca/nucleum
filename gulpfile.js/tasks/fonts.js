if(!TASK_CONFIG.fonts) return

const browserSync = require('browser-sync');
const changed     = require('gulp-changed');
const gulp        = require('gulp');
const path        = require('path');

const fontsTask = function() {

  const paths = {
    src: path.resolve(process.env.PWD, PATH_CONFIG.src, PATH_CONFIG.fonts.src, '**/*.{' + TASK_CONFIG.fonts.extensions + '}'),
    dest: path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.fonts.dest),
  }

  return gulp.src([paths.src, '*!README.md'])
    .pipe(changed(paths.dest)) // Ignore unchanged files
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
};

gulp.task('fonts', fontsTask);
module.exports = fontsTask;
