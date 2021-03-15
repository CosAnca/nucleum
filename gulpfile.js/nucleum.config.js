module.exports = {
  html: true,
  images: true,
  fonts: true,
  static: true,
  icons: true,
  stylesheets: {
    criticalCss: {
      src: "./**/*.html",
      dest: "./",
      config: {
        base: "./public",
        inline: true,
        width: 1280,
        height: 800,
      },
    },
    purgecss: {
      content: ["./src/**/*.{njk,md}"],
    },
  },

  javascripts: {
    entry: {
      // files paths are relative to
      // javascripts.dest
      app: ["./app.js"],
    },
  },

  browserSync: {
    open: false,
    server: {
      // should match `dest`
      // from `basePaths` object
      baseDir: "public",
    },
  },
};
