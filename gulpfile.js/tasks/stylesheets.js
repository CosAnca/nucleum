/* global TASK_CONFIG */
if (!TASK_CONFIG.stylesheets) {
  return;
}

const gulp = require("gulp");
const gulpif = require("gulp-if");
const browserSync = require("browser-sync");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const handleErrors = require("../lib/handle-errors");
const projectPath = require("../lib/project-path");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const postcssPresetEnv = require("postcss-preset-env");
const postcssNormalize = require("postcss-normalize");
const postcssSVG = require("postcss-svg");
const purgecss = require("@fullhuman/postcss-purgecss");

function stylesheetsTask() {
  const isProduction =
    global.production !== undefined ? global.production : false;

  const paths = {
    src: projectPath(
      TASK_CONFIG.basePaths.src,
      TASK_CONFIG.stylesheets.src,
      "**/*.{" + TASK_CONFIG.stylesheets.extensions + "}"
    ),
    dest: projectPath(TASK_CONFIG.basePaths.dest, TASK_CONFIG.stylesheets.dest),
  };

  if (
    TASK_CONFIG.stylesheets.sass &&
    TASK_CONFIG.stylesheets.sass.includePaths
  ) {
    TASK_CONFIG.stylesheets.sass.includePaths = TASK_CONFIG.stylesheets.sass.includePaths.map(
      function (includePath) {
        return projectPath(includePath);
      }
    );
  }

  const postcssNormalizeConfig = TASK_CONFIG.stylesheets.normalize || {};

  const postcssPresetEnvConfig = TASK_CONFIG.stylesheets.presetEnv || {};
  postcssPresetEnvConfig.stage = postcssPresetEnvConfig.stage || 0;

  const postcssSVGPath = projectPath(
    TASK_CONFIG.basePaths.dest,
    TASK_CONFIG.images.dest
  );

  const cssnanoConfig = TASK_CONFIG.stylesheets.cssnano || {};
  cssnanoConfig.autoprefixer = false; // this should always be false, since we're autoprefixing separately

  const nucleumPurgeCssDefaultExtractor = (content) => {
    // eslint-disable-next-line no-useless-escape
    return content.match(/[A-z0-9@\-\:\/]+/g) || [];
  };

  const purgecssConfig = TASK_CONFIG.stylesheets.purgecss || {};

  if (TASK_CONFIG.stylesheets.purgecss) {
    purgecssConfig.defaultExtractor = nucleumPurgeCssDefaultExtractor;
  }

  const postcssPlugins = [
    postcssNormalize(postcssNormalizeConfig),
    postcssPresetEnv(postcssPresetEnvConfig),
    postcssSVG({
      dirs: postcssSVGPath,
    }),
    isProduction ? cssnano(cssnanoConfig) : false,
    isProduction && TASK_CONFIG.stylesheets.purgecss
      ? purgecss(purgecssConfig)
      : false,
  ].filter(Boolean);

  // Add defined plugins
  if (TASK_CONFIG.stylesheets.postcssPlugins) {
    postcssPlugins.concat(TASK_CONFIG.stylesheets.postcssPlugins || []);
  }

  return gulp
    .src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(sass(TASK_CONFIG.stylesheets.sass))
    .on("error", handleErrors)
    .pipe(postcss(postcssPlugins))
    .pipe(gulpif(!global.production, sourcemaps.write()))
    .pipe(gulp.dest(paths.dest))
    .pipe(browserSync.stream());
}

stylesheetsTask.displayName = "stylesheets";
gulp.task(stylesheetsTask);
module.exports = stylesheetsTask;
