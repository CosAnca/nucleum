if (!TASK_CONFIG.html) return false;

const gulp = require('gulp');
const revReplace = require('gulp-rev-replace');
const projectPath = require('../../lib/projectPath');

// 4) Update asset references in HTML
gulp.task('update-html', function() {
  const manifest = gulp.src(projectPath(PATH_CONFIG.dest, 'rev-manifest.json'));
  return gulp
    .src(projectPath(PATH_CONFIG.dest, PATH_CONFIG.html.dest, '**/*.html'))
    .pipe(revReplace({ manifest }))
    .pipe(gulp.dest(projectPath(PATH_CONFIG.dest, PATH_CONFIG.html.dest)));
});
