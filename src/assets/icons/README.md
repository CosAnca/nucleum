# Icon Assets

If you are using SVG icons, this is the place to put them. The icons task will generate an SVG sprite that includes all your icons and copy them over to the destination specified in `nucleum.config.js`, and file name will be reved in production builds (if enabled).

If you don't plan using SVG icons, feel free to delete this folder and set the `icons` to false in `nucleum.config.js`.

### Default config

Icons are "bundled" into an SVG sprite are copied from `./src/assets/icons` to `./public/assets/images/icons.svg`.

### Utils

A Nunjucks `{{ icon() }}` macro is available from the [**\_macros.njk**](../../views/includes/_macros.njk) file.

Also a PostCSS function is available to help you use an icon as a background image. Find out more inside Nucleum [documentation](https://github.com/CosAnca/nucleum#icons)
