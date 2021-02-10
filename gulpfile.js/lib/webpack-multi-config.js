/* global TASK_CONFIG */
"use strict";

if (!TASK_CONFIG.javascripts) {
  return;
}

const path = require("path");
const pathToUrl = require("./path-to-url");
const projectPath = require("./project-path");
const webpack = require("webpack");
const webpackManifest = require("./webpack-manifest");
const querystring = require("querystring");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function (env) {
  process.env.BABEL_ENV = process.env.BABEL_ENV || process.env.NODE_ENV || env;

  const jsSrc = projectPath(
    TASK_CONFIG.basePaths.src,
    TASK_CONFIG.javascripts.src
  );
  const jsDest = projectPath(
    TASK_CONFIG.basePaths.dest,
    TASK_CONFIG.javascripts.dest
  );
  const publicPath = pathToUrl(
    TASK_CONFIG.javascripts.publicPath || TASK_CONFIG.javascripts.dest,
    "/"
  );
  const rev = TASK_CONFIG.production.rev && env === "production";

  function ensureLeadingDot(string) {
    return string.indexOf(".") === 0 ? string : `.${string}`;
  }
  const extensions = TASK_CONFIG.javascripts.extensions.map(ensureLeadingDot);

  TASK_CONFIG.javascripts.babelLoader.options =
    TASK_CONFIG.javascripts.babelLoader.options ||
    TASK_CONFIG.javascripts.babel;
  TASK_CONFIG.javascripts.babelLoader.test =
    TASK_CONFIG.javascripts.babelLoader.test ||
    new RegExp(`(\\${extensions.join("$|")}$)`);

  const webpackConfig = {
    context: jsSrc,
    entry: TASK_CONFIG.javascripts.entry,
    mode: process.env.BABEL_ENV,
    module: {
      rules: [TASK_CONFIG.javascripts.babelLoader],
    },
    optimization: {
      minimizer: [],
      moduleIds: "hashed",
    },
    output: {
      path: path.normalize(jsDest),
      filename: rev ? "[name]-[contenthash:6].js" : "[name].js",
      chunkFilename: rev ? "[name]-[contenthash:6].js" : "[name].js",
      publicPath,
    },
    plugins: [],
    resolve: {
      extensions,
      alias: TASK_CONFIG.javascripts.alias,
      modules: [jsSrc, projectPath("node_modules")],
    },
  };

  // Provide global objects to imported modules to resolve dependencies (e.g. jquery)
  if (TASK_CONFIG.javascripts.provide) {
    webpackConfig.plugins.push(
      new webpack.ProvidePlugin(TASK_CONFIG.javascripts.provide)
    );
  }

  if (env === "development") {
    webpackConfig.devtool =
      TASK_CONFIG.javascripts.devtool || "eval-cheap-module-source-map";
    webpackConfig.output.pathinfo = true;

    // Create new entry object with webpack-hot-middleware and react-hot-loader (if enabled)
    if (
      !TASK_CONFIG.javascripts.hot ||
      TASK_CONFIG.javascripts.hot.enabled !== false
    ) {
      for (let key in TASK_CONFIG.javascripts.entry) {
        const entry = [];

        const hotMiddleware = `webpack-hot-middleware/client?${querystring.stringify(
          TASK_CONFIG.javascripts.hot
        )}`;

        if (TASK_CONFIG.javascripts.hot.react) {
          entry.push("react-hot-loader/patch");
        }

        TASK_CONFIG.javascripts.entry[key] = entry.concat(
          hotMiddleware,
          TASK_CONFIG.javascripts.entry[key]
        );
      }

      webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
  }

  if (env === "production") {
    if (rev) {
      webpackConfig.plugins.push(
        new webpackManifest(
          TASK_CONFIG.javascripts.dest,
          TASK_CONFIG.basePaths.dest
        )
      );
    }

    const terserConfig = TASK_CONFIG.javascripts.production.terserPlugin;
    webpackConfig.devtool = TASK_CONFIG.javascripts.production.devtool;

    if (webpackConfig.devtool) {
      terserConfig.sourceMap = true;
    }

    webpackConfig.optimization.minimizer.push(new TerserPlugin(terserConfig));

    webpackConfig.plugins.push(
      new webpack.DefinePlugin(TASK_CONFIG.javascripts.production.definePlugin)
    );
  }

  // Add defined plugins and loaders for all environments
  if (TASK_CONFIG.javascripts.plugins) {
    webpackConfig.plugins = webpackConfig.plugins.concat(
      TASK_CONFIG.javascripts.plugins(webpack) || []
    );
  }
  webpackConfig.module.rules = webpackConfig.module.rules.concat(
    TASK_CONFIG.javascripts.loaders || []
  );

  // Additional plugins and loaders according to environment
  if (TASK_CONFIG.javascripts[env]) {
    if (TASK_CONFIG.javascripts[env].plugins) {
      webpackConfig.plugins = webpackConfig.plugins.concat(
        TASK_CONFIG.javascripts[env].plugins(webpack) || []
      );
    }
    webpackConfig.module.rules = webpackConfig.module.rules.concat(
      TASK_CONFIG.javascripts[env].loaders || []
    );
  }

  // Allow full manipulation of the webpack config
  const { customizeWebpackConfig = (w) => w } = TASK_CONFIG.javascripts;
  return customizeWebpackConfig(webpackConfig, env, webpack);
};
