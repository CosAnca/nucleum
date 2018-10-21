module.exports = {
  html: false,
  images: true,
  fonts: true,
  svgSprite: true,
  static: true,
  stylesheets: true,

  browserSync: {
    proxy: {
      target: "localhost"
    },
    files: ["public/wp-content/themes/nucleum/**/*.php"]
  },

  javascripts: {
    entry: {
      app: ["./app.js"]
    },
    publicPath: "/wp-content/themes/nucleum/assets/js/"
  },

  production: {
    rev: false
  }
};
