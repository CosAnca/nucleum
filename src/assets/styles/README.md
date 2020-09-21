# Stylesheet Assets (Sass)

Sass is the greatest, and libsass (via node-sass) is the fastest! Put your Sass here.

Included Sass libraries:

- [Bourbon](https://bourbon.io)
- [Adaptable](https://github.com/CosAnca/adaptable)

The Sass output is also passed through [PostCSS](https://github.com/postcss/postcss) to allow you to use any PostCSS plugins you may need.

Included PostCSS plugins:

- [postcss-normalize](https://github.com/csstools/postcss-normalize)
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
- [postcss-svg](https://github.com/Pavliko/postcss-svg)

- To use [Normalize.css](https://github.com/necolas/normalize.css) via [postcss-normalize](https://github.com/csstools/postcss-normalize) you have to included it either through `task-config.js` file or using the default import directive `@import-normalize` in the main `style.scss` file.

### Architecture

Project stylesheets should be structured following closely to the principles of [ITCSS](https://medium.com/@jordankoschei/how-i-shrank-my-css-by-84kb-by-refactoring-with-itcss-2e8dafee123a#.7gdzbrk1m), imported in the following order for greater control over re-usability and specificity:

1. **Settings** - Global configuration and variables.
2. **Tools** - Mixins and functions.
3. **Generic** - High-level styles such as resets and [normalize.css](https://github.com/necolas/normalize.css).
4. **Elements** - Base HTML styling.
5. **Objects** - Common non-cosmetic structural design patterns.
6. **Components** - Specific cosmetic elements of UI.
7. **Utilities** - Helpers and overrides.

### Tasks and Files

```
gulpfile.js/tasks/stylesheets
```

Your Sass gets run through Autoprefixer, so don't prefix!
In the `production` task, output is minified with [cssnano](https://github.com/ben-eb/cssnano).

You may also provide additional [`node-sass` options](https://github.com/sass/node-sass#options) to the `sass` property in css task config in `config.json`. By default, we've disabled `indentedSyntax` and added the paths to Bourbon and Adaptable via the `includePaths` option.
