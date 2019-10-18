const path = require("path");
const projectPath = require("./project-path");
const fs = require("fs");

module.exports = function(jsDest, dest, filename) {
  filename = filename || "rev-manifest.json";

  return function() {
    const plugin = { name: "webpackManifest" };

    this.hooks.done.tap(plugin, function(statsObject) {
      const stats = statsObject.toJson();
      const chunks = stats.assetsByChunkName;
      const manifest = {};

      for (let key in chunks) {
        const originalFilename = key + ".js";
        const chunkName =
          typeof chunks[key] === "string" ? chunks[key] : chunks[key][0];
        manifest[path.join(jsDest, originalFilename)] = path.join(
          jsDest,
          chunkName
        );
      }

      fs.writeFileSync(projectPath(dest, filename), JSON.stringify(manifest));
    });
  };
};
