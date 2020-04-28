/* global PATH_CONFIG */
const fs = require("fs");
const gulp = require("gulp");
const log = require("fancy-log");
const colors = require("ansi-colors");
const projectPath = require("../lib/project-path");
const rename = require("gulp-rename");
const merge = require("merge-stream");
const path = require("path");
const pkg = require(projectPath("package.json"));

function initWPTask() {
  const dotfilesStream = gulp
    .src(["extras/dotfiles/**/*", "!extras/dotfiles/*.txt"], { dot: true })
    .pipe(gulp.dest(projectPath()));

  const renameGitIgnore = gulp
    .src(["extras/dotfiles/gitignore.txt"])
    .pipe(rename(".gitignore"))
    .pipe(gulp.dest(projectPath()));

  const configStream = gulp
    .src(["extras/wordpress/**", "!extras/wordpress/*.md"])
    .pipe(gulp.dest(projectPath()));

  const srcStream = gulp
    .src(["src/**/*", "*.gitkeep"])
    .pipe(gulp.dest(projectPath(PATH_CONFIG.src)));

  // Setup the script rules
  pkg.scripts = {
    start: "yarn run nucleum",
    build: "yarn run nucleum build",
  };

  // Setup browserslist config
  pkg.browserslist = [">0.2%", "not dead", "ie >= 11", "not op_mini all"];

  // Update the package.json file
  fs.writeFileSync(
    path.join(projectPath(), "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  log(
    colors.green.bold(
      "Generating new WordPress project structure and configuration files"
    )
  );
  log(
    colors.green(
      "Please follow the instructions below to start your WordPress installation"
    )
  );
  log(
    colors.yellow(
      `

      1. Run ${colors.magenta("docker-compose up")}.
      2. Run ${colors.magenta(
        "sh bin/setup.sh"
      )} and add follow the command line steps.
    `
    )
  );

  return merge(dotfilesStream, renameGitIgnore, configStream, srcStream);
}

initWPTask.displayName = "init-wp";
gulp.task(initWPTask);
