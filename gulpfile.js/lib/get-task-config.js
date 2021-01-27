const fs = require("fs");
const projectPath = require("./project-path");
const configDefaults = require("./config-defaults");
const mergeWith = require("lodash/mergeWith");

function getConfig() {
  if (process.env.NUCLEUM_CONFIG_PATH) {
    return require(projectPath(
      process.env.NUCLEUM_CONFIG_PATH,
      "nucleum.config.js"
    ));
  }

  const defaultConfigPath = projectPath("nucleum.config.js");

  if (fs.existsSync(defaultConfigPath)) {
    return require(defaultConfigPath);
  }

  return require("../nucleum.config.js");
}

function withDefaults(taskConfig) {
  Object.keys(configDefaults).reduce((config, key) => {
    if (taskConfig[key] !== false) {
      // if true, use default, else merge objects
      config[key] =
        configDefaults[key] === true
          ? configDefaults[key]
          : mergeWith(configDefaults[key], config[key] || {}, replaceArrays);
    }
    return config;
  }, taskConfig);

  return taskConfig;
}

function replaceArrays(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return srcValue;
  }
}

const taskConfig = withDefaults(getConfig());

module.exports = taskConfig;
