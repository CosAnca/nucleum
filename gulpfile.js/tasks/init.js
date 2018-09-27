/* global PATH_CONFIG */
const fs = require("fs");
const gulp = require("gulp");
const log = require("fancy-log");
const colors = require("ansi-colors");
const projectPath = require("../lib/projectPath");
const rename = require("gulp-rename");
const merge = require("merge-stream");
const path = require("path");
const pkg = require(projectPath("package.json"));

gulp.task("init", function() {
  const dotfilesStream = gulp
    .src(["extras/dotfiles/**/*", "!extras/dotfiles/*.txt"], { dot: true })
    .pipe(gulp.dest(projectPath()));

  const renameGitIgnore = gulp
    .src(["extras/dotfiles/gitignore.txt"])
    .pipe(rename(".gitignore"))
    .pipe(gulp.dest(projectPath()));

  const configStream = gulp
    .src(["gulpfile.js/path-config.json", "gulpfile.js/task-config.js"])
    .pipe(gulp.dest(projectPath("config")));

  const srcStream = gulp
    .src(["src/**/*", "*.gitkeep"])
    .pipe(gulp.dest(projectPath(PATH_CONFIG.src)));

  // Setup the script rules
  pkg.scripts = {
    start: "yarn run nucleum",
    build: "yarn run nucleum build",
  };

  // Setup browserlist config
  pkg.browserslist = [
    "> 1%",
    "last 2 versions",
    "not ie < 11",
  ];

  // Update the package.json file
  fs.writeFileSync(
    path.join(projectPath(), "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  log(colors.green("Generating default Nucleum project files"));
  log(
    colors.yellow(`
    To start the dev server:
  `),
    colors.magenta(`
    yarn run nucleum
  `)
  );

  return merge(dotfilesStream, renameGitIgnore, configStream, srcStream);
});
