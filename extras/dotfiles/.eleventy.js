const pathConfig = require("./config/path-config.json");
const pathConfigSrc = pathConfig.src.split("/")[1];
const pathConfigDest = pathConfig.dest.split("/")[1];
const pathConfigHtmlSrc = pathConfig.html.src;

const beautify = require("simply-beautiful");

module.exports = function (eleventyConfig) {
  // Filters
  eleventyConfig.addNunjucksFilter("absoluteUrl", (href, base) => {
    let { URL } = require("url");
    return new URL(href, base).toString();
  });

  eleventyConfig.addNunjucksFilter("dateFormatISO", (value) => {
    const date = new Date(value);
    return date.toISOString().slice(0, 10);
  });

  // Layouts
  eleventyConfig.addLayoutAlias("base", "_base.njk");

  // Transforms
  eleventyConfig.addTransform("beautify", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let beautifyHTML = beautify.html(content, {
        indent_size: 2,
        indent_scripts: "keep",
      });

      return beautifyHTML;
    }

    return content;
  });

  return {
    dir: {
      input: pathConfigSrc,
      data: "data",
      includes: `${pathConfigHtmlSrc}/includes`,
      layouts: `${pathConfigHtmlSrc}/layouts`,
      output: pathConfigDest,
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: false,
  };
};
