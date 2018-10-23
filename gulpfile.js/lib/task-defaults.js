module.exports = {
  javascripts: {
    extensions: ["js", "jsx"],
    hot: {
      reload: true,
      noInfo: false,
      quiet: true,
      react: false
    },
    devtool: "eval-cheap-module-source-map",
    babelLoader: {
      // 'test' is derived from TASK_CONFIG.javascripts.extensions
      // 'options' is derived from TASK_CONFIG.javascripts.babel
      loader: "babel-loader",
      exclude: /node_modules/
    },
    babel: {
      presets: [["@babel/preset-env", { modules: false }]]
    },
    development: {},
    production: {
      devtool: false,
      uglifyJsPlugin: {},
      definePlugin: {
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      }
    }
  },

  stylesheets: {
    sass: {
      includePaths: ["./node_modules"]
    },
    extensions: ["sass", "scss", "css"]
  },

  html: {
    dataFile: "data/global.json",
    htmlmin: {},
    extensions: ["pug", "json"],
    excludeFolders: ["components", "data", "includes", "layout", "mixins"]
  },

  images: {
    extensions: ["jpg", "png", "svg", "gif"]
  },

  fonts: {
    extensions: ["woff2", "woff", "eot", "ttf", "svg"]
  },

  svgSprite: {
    svgstore: {}
  },

  production: {
    rev: true
  },

  additionalTasks: {
    // eslint-disable-next-line
    initialize(gulp, PATH_CONFIG, TASK_CONFIG) {
      // gulp.task('myTask', function() { })
    },
    development: {
      prebuild: null,
      postbuild: null
    },
    production: {
      prebuild: null,
      postbuild: null
    }
  }
};
