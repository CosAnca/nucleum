# Stylesheet Assets (Sass)
Sass is the greatest, and libsass (via node-sass) is the fastest! Put your Sass here.

If you're using the Icon Font task, a `generated` folder containing `_icons.sass` will be automatically created. Be sure to `@import generated/icons` in `style.sass`.

[Normalize.css](https://github.com/necolas/normalize.css) is also installed and `@import`'d by default, mostly as an example of how to include css from `node_modules`.

We also include in the same way three other Sass libraries:
* [Bourbon](http://bourbon.io)
* [Neat](http://neat.bourbon.io)
* [Family](https://lukyvj.github.io/family.scss/)

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
In the `production` task, output is minfified with [cssnano](https://github.com/ben-eb/cssnano).

You may also provide additional [`node-sass` options](https://github.com/sass/node-sass#options) to the `sass` property in css task config in `config.json`. By default, we've disabled `indentedSyntax` and added the paths to Normalize.css, Bourbon and Neat via the `includePaths` option.
