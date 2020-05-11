const gulp = require("gulp");
const exec = require("child_process").exec;

function generateTask(cb) {
  const cmd = "eleventy";
  exec(cmd, (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
}

generateTask.displayName = "generate";
gulp.task(generateTask);
module.exports = generateTask;
