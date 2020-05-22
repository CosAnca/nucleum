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

  return {
    dir: {
      input: "src",
      data: "data",
      includes: "includes",
      layouts: "layouts",
      output: "public",
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: false,
  };
};
