module.exports = {
  html: false,
  images: true,
  fonts: true,
  svgSprite: true,
  static: true,
  stylesheets: {
    purgecss: {
      content: ["public/wp-content/themes/nucleum/**/*.php"],
      extensions: ["php"],
    },
    criticalCss: {
      config: {
        base: "./public/wp-content/themes/nucleum",
        width: 1200,
        height: 1200,
      },
    },
  },

  browserSync: {
    proxy: {
      target: "localhost",
    },
    files: ["public/wp-content/themes/nucleum/**/*.php"],
  },

  javascripts: {
    entry: {
      app: ["./app.js"],
    },
    publicPath: "/wp-content/themes/nucleum/assets/js/",
  },

  production: {
    rev: false,
  },
};
