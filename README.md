# ![Nucleum](./src/img/nucleum-banner.png)

**Nucleum** is an opinionated, performance oriented web starter kit. It can be used as-is as a static site builder, or can be configured and integrated into many different development environments and sites or apps structures.

The [extras](./extras) folder contains configuration details for **WordPress** projects. Check the [WordPress with Nucleum](./extras/wordpress/README-WP.md) documentation to learn more about how to set up Nucleum for WordPress based projects.

## Dependencies

- Front-end stack
  - [yarn]

[yarn]: https://yarnpkg.com/lang/en/

## Quick start on a fresh project (empty directory)

```zsh
yarn init
yarn add nucleum
yarn run nucleum init
```

This will create default `src` and `config` files in your directory and start compiling and live-updating files! Try editing them and watch your browser auto-update!

The init command also updates your `package.json` file to include `start` and `build` scripts for Nucleum, as well as browserslist configuration that you can customise based on your project needs.

```json
// package.json
"scripts": {
  "start": "yarn run nucleum",
  "build": "yarn run nucleum -- build"
}
```

## Adding to an existing project?

You can generate basic _config_ files with:

```zsh
yarn run nucleum init-config
```

Then edit the configs to match the needs of your project.

## Recommended Setup

#### [Node Version Manager](https://github.com/creationix/nvm)

**Nucleum requires at least Node 7**. While you can install Node a variety of ways, we highly recommend using [nvm](https://github.com/creationix/nvm) to install and manage Node versions.

#### [Yarn](https://yarnpkg.com/en/docs/install)

We recommend `yarn` over `npm` for a few reasons: `yarn.lock` files are a lifesaver, modules install way faster, and [`yarn run`](https://yarnpkg.com/en/docs/cli/run) for running `package.json` `scripts` and `node_modules/.bin` executables is a nice convenience. It's just better.

# Commands

All commands should be run through `yarn run`.

```zsh
yarn run nucleum
```

or

```zsh
yarn start
```

This is where the magic happens. The perfect workflow. This runs the development task, which starts compiling, watching, and live updating all our files as we change them. BrowserSync will start a server on port 3000, or do whatever you've configured it to do. You'll be able to see live changes in all connected browsers. Don't forget about the additional BrowserSync tools available on port 3001!

```zsh
yarn run nucleum build
```

or

```zsh
yarn build
```

Compiles files for production to your destination directory. JS files are built using Webpack with standard production optimisations (Uglify, etc.). CSS is run through CSSNano and PurgeCSS. If `rev` is set to `true` in your `task-config.js` file, filenames will be hashed (file.css -> file-a8908d9io20.css) so your server may cache them indefinitely.

# Configuration

You may override the default configuration by creating a `config` folder with the following two files in it: `path-config.json` and `task-config.js`. These files will be created by any of the `init` tasks, or you can generate _only_ the config files with the following command:

```zsh
yarn run nucleum init-config
```

By default, Nucleum expects these files to live in a `./config` at the root of your project. You may specify an alternative relative location by setting an environment variable:

```json
// package.json
"scripts": {
  "nucleum": "NUCLEUM_CONFIG_PATH='./some/location' nucleum"
}
```

```zsh
# command line
yarn run nucleum
```

The files must be named `path-config.json` and `task-config.js`.

### Configuring file structure

`path-config.json`

This file specifies the `src` and `dest` root directories, and `src` and `dest` for each task, relative to the configured root. For example, if your source files live in a folder called `app`, and your compiled files should be output to a folder called `static`, you'd update the `src` and `dest` properties here to reflect that.

### Configuring tasks

`task-config.js`

This file exposes per-task configuration and overrides. At minimum, you just need to set the task to `true` to enable the task with its default configuration. If you wish to configure a task, provide a configuration object instead.

- Any task may be disabled by setting the value to `false`. For example, if your project has its own handling HTML and template engine (WordPress, Craft, etc), you'll want to set `html` to `false` in your task-config.
- All asset tasks have an `extensions` option that can be used to overwrite the ones that are processed and watched.

See [task config defaults](./gulpfile.js/lib/task-defaults.js) for a closer look. All configuration objects will be merged with these defaults. Note that `array` options are replaced rather than merged or concatenated.

### browserSync

Options to pass to [browserSync](https://browsersync.io/docs/options).

**If you're using Pug (built in) to compile a static site**, you'll want to use the `server` and tell it which server to serve up via the `baseDir` option.

```js
browserSync: {
  server: {
    baseDir: "public";
  }
}
```

**If you're running another server (Vagrant for example, built in with WordPress config)**, you'll want to use the `proxy` option, along with `files` to tell browserSync to watch additional files (like your templates).

```js
browserSync: {
  proxy: {
    target: 'mywebsite.test'
  },
  files: ['public/wp-content/themes/my-theme/**/*.php']
}
```

**If you need to turn on polling within webpack-dev-middleware**, specify `watchOptions` within this section, too.

```js
browserSync: {
  watchOptions: {
    poll: true,
    aggregateTimeout: 300
  }
}
```

**If you need to add extra middlewares**, specify `extraMiddlewares` within the `server` subsection of this section.

```js
browserSync: {
  server: {
    extraMiddlewares: [historyApiFallbackMiddleware],
  },
},
```

**If you need to override completely all server's middleware**, specify `middleware` within the `server` subsection of this section.

```js
browserSync: {
  server: {
    middleware: [/* On your own! Note that default 'webpack-dev-middleware' will not be enabled using this option */],
  },
}
```

### javascripts

Under the hood, JS is compiled with Webpack with a heavily customised Webpack file to get you up and running with little to no configuration. An API for configuring some of the most commonly accessed options are exposed, along with some other helpers for scoping to environment. Additionally, you can get full access to modify Nucleum's `webpackConfig` via the [`customizeWebpackConfig`](#customizeWebpackConfig) option.

#### `entry` (required)

Discrete js bundle entry points. A js file will be bundled for each item. Paths are relative to the `js` folder. This maps directly to `webpackConfig.entry`.

#### `publicPath`

The public path to your assets on your server. Only needed if this differs from the result of `path.join(PATH_CONFIG.dest, PATH_CONFIG.javascripts.dest)`. Maps directly to `webpackConfig.publicPath`

#### `devtool`

Sets the webpack devtool option in development mode. Defaults to `eval-cheap-module-source-map`, one of the fastest source map options. To enable sourcemaps in production builds, use [`customizeWebpackConfig`](#customizeWebpackConfig).

#### `babel`

Object to overwrite the default Babel loader config object. This defaults to `{ presets: [["@babel/preset-env", { "modules": false }] }`. Same format as a `.babelrc` file.

#### `babelLoader`

Object to extend the default config for _entire_ Babel loader object. See [Webpack loader documentation](https://webpack.js.org/concepts/loaders/) for details.

#### `provide`

Key value list of variables that should be provided for modules to resolve dependencies on import using [webpack.ProvidePlugin](https://webpack.github.io/docs/list-of-plugins.html#provideplugin). A common example is making jQuery available to all modules (jQuery plugins need this). In that scenario, with `jquery` installed via `yarn`, add this to your javascripts config:

```js
provide: {
  $: "jquery",
  jQuery: "jquery"
}
```

Under the hood, this gets passed directly to [webpack.ProvidePlugin](https://webpack.github.io/docs/list-of-plugins.html#provideplugin) in the webpack config.

```js
plugins: [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  })
];
```

#### `plugins`

Define additional webpack plugins that should be used in all environments.

#### `loaders`

Define additional webpack loaders that should be used in all environments. Adds to `webpackConfig.module.rules`

#### `development`, `production`

Specify additional environment specific configuration to be merged in with Nucleum's defaults

- [`devtool`](https://webpack.js.org/configuration/devtool/#devtool)
- [`plugins`](https://webpack.js.org/concepts/plugins/)
- [`loaders`](https://webpack.js.org/concepts/loaders/)

_Production Only:_

- [`definePlugin`](https://webpack.js.org/plugins/define-plugin)

**Example:**

```js
production: {
  devtool: 'hidden-source-map',
  definePlugin: {
    SOME_API_KEY: 'abcdefg'
  },
  plugins: (webpack) => { return [ new webpack.IgnorePlugin(/jsdom$/) ] },
  loaders: [] // Adds to `webpackConfig.module.rules`
}
```

By default, the `env` will be `"development"` when running `yarn run nucleum`, and `"production"` when running `yarn run nucleum build`.

#### `hot`

By default, webpack HMR will simply do a full browser refresh when your js files change. If your code takes advantage of [hot module replacement methods](https://webpack.github.io/docs/hot-module-replacement.html), modules will be hot loaded.

_Defaults to:_

```js
hot: {
  enabled: true,
  reload: true,
  quiet: true,
  react: false
}
```

**If you're using React** `yarn add react-hot-loader@next` and set `react: true` to enable [react-hot-loader 3](https://github.com/gaearon/react-hot-loader/tree/next). [Follow the docs](https://github.com/gaearon/react-hot-loader/tree/next/docs#webpack-2) and update your React app to take advantage.

#### `customizeWebpackConfig`

In the event that an option you need is not exposed, you may access, modify and return a further customized webpackConfig by providing this option as a function. The function will receive the Nucleum `webpackConfig`, `env` and `webpack` as params. The `env` value will be either `development` (`yarn run nucleum`) or `production` (`yarn run nucleum -- build`).

```js
customizeWebpackConfig: function (webpackConfig, env, webpack) {
  if(env === 'production') {
    webpackConfig.devtool = "nosources-source-map"
  }

  return webpackConfig
}
```

**CAUTION!** Avoid overwriting `webpackConfig.entry` or `webpackConfig.plugins` via this function, and rely on the `entry` and `plugins` options above to avoid breaking Nucleum's hot-loading and file revisioning setup ([view source](./gulpfile.js/lib/webpack-multi-config.js)).

### stylesheets

#### `autoprefixer`

Your Sass gets run through [Autoprefixer](https://github.com/postcss/autoprefixer), so don't prefix! Use this option to pass configuration. Defaults to `{ browsers: ["last 3 versions"] }`.

#### `sass`

Options to pass to [node-sass](https://github.com/sass/node-sass#options).

Defaults to `{ includePaths: ["./node_modules"] }` so you can `@import` files installed to `node_modules`.

### html

**Note:** If you are on a platform that's already handling html (WordPress), set `html: false` or delete the configuration object completely from `task-config.js`. If that's the case, don't forget to use the BrowserSync [`files` option](https://browsersync.io/docs/options#option-file) in the `browserSync` config object to start watching your templates folder.

Robust templating with [Pug](https://pugjs.org/api/getting-started.html).

#### `dataFunction`

[gulp-data](https://github.com/colynb/gulp-data) `dataFunction` is used to provide data to templates. Defaults to reading in a global JSON, specified by the `dataFile` option.

#### `dataFile`

A path to a JSON file containing data to use in your templates via [`gulp-data`](https://github.com/colynb/gulp-data).

#### `htmlmin`

[Options](https://github.com/kangax/html-minifier#options-quick-reference) to pass to [`gulp-htmlmin`](https://github.com/jonschlinkert/gulp-htmlmin.

#### `excludeFolders`

You'll want to exclude some folders from being compiled directly. This defaults to: `["data", "includes", "layout", "mixins", "modules"]`.

### static

There are some files that belong in your root destination directory that you won't want to process or revision in production. Things like [favicons, app icons, etc.](http://realfavicongenerator.net), should go in `src/static`, and will get copied over to `public` as a last step (after revisioning in production). _Nothing_ should ever go directly in `public`, since it gets completely trashed and re-build when running the `default` or `production` tasks.

#### `scrOptions`

Options passed to `gulp.src`. See [gulp documentation](https://github.com/gulpjs/gulp/blob/master/docs/API.md#options) for details. Defaults to:

```js
static: {
  srcOptions: {
    dot: true; // include dotfiles
  }
}
```

### fonts, images

These tasks simply copy files from `src` to `dest` configured in `path-config.json`. Nothing to configure here other that specifying extensions or disabling the task.

### svgSprite

Generates an SVG Sprite from svg files in `src/icons`. You can either include the created SVG directly on the page and reference the icon by id like this:

```html
<svg viewBox="0 0 1 1"><use xlink:href="#my-icon"></use></svg>
```

or reference the image remotely:

```html
<svg viewBox="0 0 1 1"><use xlink:href="img/icons.svg#my-icon"></use></svg>
```

If you reference the sprite remotely, be sure to include something like [svg4everybody](https://github.com/jonathantneal/svg4everybody) to ensure external loading works on Internet Explorer.

Nucleum includes a helper which generates the required svg markup in `src/views/mixins/_mixins.pug`, so you can just do:

```pug
+icon("my-icon")
```

Which spits out:

```html
<svg class="c-icon">
  <use xlink:href="img/icons.svg#my-icon"></use>
</svg>
```

This particular setup allows styling 2 different colors from your CSS. You can have unlimited colors hard coded into your svg.

In the following example, the first path will be `red`, the second will be `white`, and the third will be `blue`. Paths **without a fill attribute** will inherit the `fill` property from CSS. Paths with `fill="currentColor"` will inherit the current CSS `color` value, and hard-coded fills will not be overwritten, since inline styles trump CSS values.

```scss
.c-icon {
  fill: red;
  color: white;
}
```

```svg
<svg xmlns="http://www.w3.org/2000/svg">
  <path d="..."/>
  <path fill="currentColor" d="..."/>
  <path fill="blue" d="..."/>
</svg>
```

We recommend setting up your SVGs on a 500 x 500 canvas, center your artwork, and expanding/combining any shapes of the same color. This last step is important. [Read more on SVG optimisation here!](https://www.viget.com/articles/5-tips-for-saving-svg-for-the-web-with-illustrator)

### clean

```js
clean: {
  patterns: [
    path.resolve(process.env.PWD, "dist/assets"),
    path.resolve(process.env.PWD, "dist/templates")
  ];
}
```

By default, the entire `dest` directory is deleted before each build. By setting the `clean.patterns` option, you can specify which directory or directories (using globbing syntax) should be deleted instead. Use this if you have subdirectories within the `dest` directory that should be left alone (media uploaded through a CMS, say).

### production

Filenames can be revisioned when running the production `build` task. If you want to enable this behaviour, you can set `rev` to true.

```js
production: {
  rev: true;
}
```

### additionalTasks

If you wish to define additional gulp tasks, and have them run at a certain point in the build process, you may use this configuration to do so via the following config object:

```js
additionalTasks: {
  initialize(gulp, PATH_CONFIG, TASK_CONFIG) {
    // Add gulp tasks here
  },
  development: {
    prebuild: null,
    postbuild: null
  },
  production: {
    prebuild: null,
    postbuild: null
  }
}
```

Nucleum will call `initialize`, passing in `gulp`, along with the path and task configs. Use this method to define or `require` additional gulp tasks. You can specify when and in what order your custom tasks should run in the `production` and `development` `prebuild` and `postbuild` options.

For example, say you had a sprite task you wanted to run before your css compiled, and in production, you wanted to run an image compression task you had after all assets had been compiled. Your configuration might look something like this:

```js
additionalTasks: {
  initialize(gulp, PATH_CONFIG, TASK_CONFIG) {
    gulp.task('createPngSprite', function() {
      // do stuff
    })
    gulp.task('compressImages', function() {
      // compress all the things
    })
  },
  development: {
    prebuild: ['createPngSprite'],
    postbuild: null
  },
  production: {
    prebuild: ['createPngSprite'],
    postbuild: ['compressImages']
  }
}
```

# FAQ

## Can I customise and add Gulp tasks?

Yep! See [additionalTasks](#additionaltasks).

You can also clone this repo, copy over the gulpfile.js folder and package.json dependencies and run `gulp` instead of installing it as a modules directly, or you could fork and maintain your own custom setup.

## I don't see JS files in my dest directory during development

JS files are compiled and live-update via BrowserSync + WebpackDevMiddleware + WebpackHotMiddleware. That means, that you won't actually see `.js` files output to your destination directory during development, but they will be available to your browser running on the BrowserSync port.

## What's under the hood?

Gulp tasks! Built combining the following:

| Feature               | Packages Used                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **CSS**               | [Sass](http://sass-lang.com/) ([Libsass](http://sass-lang.com/libsass) via [node-sass](https://github.com/sass/node-sass)), |
|                       | [Autoprefixer](https://github.com/postcss/autoprefixer),                                                                    |
|                       | [CSSNano](https://github.com/ben-eb/cssnano),                                                                               |
|                       | Source Maps                                                                                                                 |
| **JavaScript**        | [Babel](http://babeljs.io/), [Webpack](https://webpack.js.org/)                                                             |
| **HTML**              | [Pug](https://pugjs.org/api/getting-started.html), [gulp-data](https://github.com/colynb/gulp-data)                         |
| **Images**            | Folder for including your project's images                                                                                  |
| **Icons**             | Auto-generated [SVG Sprites](https://github.com/w0rm/gulp-svgstore)                                                         |
| **Fonts**             | Folder for including WebFonts                                                                                               |
| **Live Updating**     | [BrowserSync](http://www.browsersync.io/),                                                                                  |
|                       | [Webpack Dev Middleware](https://github.com/webpack/webpack-dev-middleware),                                                |
|                       | [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware)                                               |
| **Production Builds** | CSS is [minified](http://cssnano.co/),                                                                                      |
|                       | JS is compressed and optimized with various Webpack plugins,                                                                |
|                       | [filename md5 hashing (reving)](https://github.com/sindresorhus/gulp-rev),                                                  |
|                       | [file size reporting](https://github.com/jaysalvat/gulp-sizereport).                                                        |

Extras:

| Feature         | Packages Used                                      |
| --------------- | -------------------------------------------------- |
| **WordPress**   | [Vagrant](https://www.vagrantup.com/),             |
|                 | [ScotchBox](https://box.scotch.io/)                |
| **Sass Mixins** | [Bourbon](http://bourbon.io/),                     |
|                 | [Adaptable](https://github.com/CosAnca/adaptable/) |

---

### Credits:

[Blendid](https://github.com/vigetlabs/blendid),
[WPDistillery](https://wpdistillery.org/),
[Sky UK](https://github.com/sky-uk/css).
