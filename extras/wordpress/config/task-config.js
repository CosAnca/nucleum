module.exports = {
  html       : false,
  images     : true,
  fonts      : true,
  svgSprite  : true,
  static     : true,
  stylesheets: true,

  browserSync: {
    proxy: {
      target: 'mywebsite.dev',
    },
    files: ['public/wp-content/themes/my-theme/**/*.php'],
  },

  javascripts: {
    entry: {
      app: ['./app.js'],
    },
    publicPath: '/wp-content/themes/my-theme/assets/js/',
  },

  production: {
    rev: false,
  },
};
