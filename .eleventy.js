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
      input: "src",
      data: "data",
      includes: "views/includes",
      layouts: "views/layouts",
      output: "public",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: false,
  };
};
