if(!TASK_CONFIG.html) return false

const gulp       = require('gulp');
const revReplace = require('gulp-rev-replace');
const path       = require('path');

// 5) Update asset references in HTML
gulp.task('update-html', function() {
  const manifest = gulp.src(path.resolve(process.env.PWD, PATH_CONFIG.dest, 'rev-manifest.json'))
  return gulp.src(path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.html.dest, '**/*.html'))
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest(path.resolve(process.env.PWD, PATH_CONFIG.dest, PATH_CONFIG.html.dest)));
});
