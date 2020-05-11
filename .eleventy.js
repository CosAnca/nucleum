module.exports = function(config) {
  config.setPugOptions({
    pretty: true
  });

  return {
    dir: {
      input: "src/views",
      data: "data",
      includes: "includes",
      layouts: "layouts",
      output: "public"
    },
    templateFormats: ["pug"],
    htmlTemplateEngine: "pug",
    markdownTemplateEngine: "pug"
  }
}
