const config = require('../../config');
if (!config.tasks.iconFont) return;

const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const generateIconSass = require('./generateIconSass');
const handleErrors = require('../../lib/handleErrors');
const package = require('../../../package.json');
const path = require('path');
const projectPath = require('../../lib/projectPath');
const url = require('url');

const fontPath = projectPath(config.root.dest, config.tasks.iconFont.dest);
const cssPath = projectPath(config.root.dest, config.tasks.css.dest);

const settings = {
  name: package.name + ' icons',
  src: projectPath(config.root.src, config.tasks.iconFont.src, '*.svg'),
  dest: projectPath(config.root.dest, config.tasks.iconFont.dest),
  sassDest: projectPath(
    config.root.src,
    config.tasks.css.src,
    config.tasks.iconFont.sassDest
  ),
  template: path.normalize('./gulpfile.js/tasks/iconFont/template.sass'),
  sassOutputName: '_icons.sass',
  fontPath: url.resolve('.', path.relative(cssPath, fontPath)),
  className: 'icon',
  options: {
    timestamp: 0, // see https://github.com/fontello/svg2ttf/issues/33
    fontName: 'icons',
    normalize: false,
    formats: config.tasks.iconFont.extensions,
  },
};

const iconFontTask = function() {
  return gulp
    .src(settings.src)
    .pipe(iconfont(settings.options))
    .on('glyphs', generateIconSass(settings))
    .on('error', handleErrors)
    .pipe(gulp.dest(settings.dest));
};

gulp.task('iconFont', iconFontTask);
module.exports = iconFontTask;
