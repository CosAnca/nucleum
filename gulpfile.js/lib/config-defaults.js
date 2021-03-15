module.exports = {
  basePaths: {
    src: "./src",
    dest: "./public",
  },
  javascripts: {
    src: "assets/js",
    dest: "assets/js",
    extensions: ["js", "jsx"],
    hot: {
      reload: true,
      noInfo: false,
      quiet: true,
      react: false,
    },
    devtool: "eval-cheap-module-source-map",
    babelLoader: {
      // 'test' is derived from TASK_CONFIG.javascripts.extensions
      // 'options' is derived from TASK_CONFIG.javascripts.babel
      loader: "babel-loader",
      exclude: /node_modules/,
    },
    babel: {
      presets: [["@babel/preset-env", { modules: false }]],
      plugins: [
        ["@babel/plugin-proposal-class-properties", { loose: true }],
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-transform-runtime",
      ],
    },
    development: {},
    production: {
      devtool: false,
      uglifyJsPlugin: {},
      definePlugin: {
        "process.env": {
          NODE_ENV: JSON.stringify("production"),
        },
      },
    },
  },

  static: {
    src: "assets/static",
    dest: "./",
  },

  stylesheets: {
    src: "assets/styles",
    dest: "assets/css",
    sass: {
      includePaths: ["./node_modules"],
    },
    extensions: ["sass", "scss", "css"],
  },

  html: {
    src: "views",
    dest: "./",
    extensions: ["pug", "njk", "md", "json", "js"],
  },

  images: {
    src: "assets/images",
    dest: "assets/images",
    extensions: ["jpg", "png", "svg", "gif", "webp", "avif"],
  },

  icons: {
    src: "assets/icons",
    dest: "assets/images",
    svgstore: {},
  },

  fonts: {
    src: "assets/fonts",
    dest: "assets/fonts",
    extensions: ["woff2", "woff", "eot", "ttf", "svg"],
  },

  production: {
    rev: {
      manifestDir: "assets",
    },
  },

  additionalTasks: {
    // eslint-disable-next-line
    initialize(gulp, TASK_CONFIG) {
      // gulp.task('myTask', function() { })
    },
    development: {
      prebuild: [],
      postbuild: [],
    },
    production: {
      prebuild: [],
      postbuild: [],
    },
  },
};
