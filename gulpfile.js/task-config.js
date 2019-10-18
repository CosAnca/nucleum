module.exports = {
  html: true,
  images: true,
  fonts: true,
  static: true,
  svgSprite: true,
  stylesheets: {
    criticalCss: {
      config: {
        base: "./public",
        inline: true,
        width: 1200,
        height: 1200
      }
    }
  },

  javascripts: {
    entry: {
      // files paths are relative to
      // javascripts.dest in path-config.json
      app: ["./app.js"]
    }
  },

  browserSync: {
    server: {
      // should match `dest` in
      // path-config.json
      baseDir: "public"
    }
  },

  production: {
    rev: true
  }
};
