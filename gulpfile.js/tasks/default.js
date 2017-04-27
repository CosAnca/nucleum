const gulp            = require('gulp');
const gulpSequence    = require('gulp-sequence');
const getEnabledTasks = require('../lib/getEnabledTasks');

const defaultTask = function(cb) {
  var tasks = getEnabledTasks('watch');
  var static = TASK_CONFIG.static ? 'static' : false;
  gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, static, 'watch', cb);
}

gulp.task('default', defaultTask);
module.exports = defaultTask;
