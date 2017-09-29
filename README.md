# ![Fosterkit](extras/default/fosterkit-cover.png)

**Fosterkit** is a friendly [Gulp](http://gulpjs.com/) starter kit that integrates well into any environment to form a full-featured modern asset pipeline. It can be used as-is as a static site builder, or can be configured and integrated into many development environments and sites or apps structure. The [extras](./extras) folder contains configuration details for **Wordpress** which is currently bundled with Fosterkit in order to give you quick start for any new project based on this CMS.

## Dependencies

* Front-end stack
  * [yarn]
* Wordpress (assuming you already have [Vagrant] and [Virtualbox])
  * [Vagrant Hostsupdater] (`vagrant plugin install vagrant-hostsupdater`)

[yarn]: https://yarnpkg.com/lang/en/
[Vagrant]: https://www.vagrantup.com/
[Virtualbox]: https://www.virtualbox.org/wiki/Downloads
[Vagrant Hostsupdater]: https://github.com/cogitatio/vagrant-hostsupdater

## Quick start on a fresh project (empty directory) for creating a Wordpress based website
```zsh
yarn init
yarn add fosterkit
yarn run fosterkit -- init-wp
```

This will generate a WordPress configuration file (`wp-setup.yml`) alongside the default src (`src`) and config (`config`) files for the front-end build.

Follow the steps prompted by the command line to set up your WordPress installation.

Read [Fosterkit and WordPress](extras/wordpress/README-WP.md) documentation to find out more details.

## Building a static website?

**Replace** line 3 above with:

```zsh
yarn run fosterkit -- init
```

This will create default `src` and `config` files in your directory and start compiling and live-updating files! Try editing them and watch your browser auto-update!

## Adding to an existing project?

You can generate basic *config* files with:

```zsh
yarn run fosterkit -- init-config
```

Then edit the configs to match the needs of your project.

## Recommended Setup

#### [Node Version Manager](https://github.com/creationix/nvm)
**Fosterkit requires at least Node 6**. While you can install Node a variety of ways, we highly recommend using [nvm](https://github.com/creationix/nvm) to install and manage Node versions.

#### [Yarn](https://yarnpkg.com/en/docs/install)
We recommend `yarn` over `npm` for a few reasons: `yarn.lock` files are a lifesaver, modules install way faster, and [`yarn run`](https://yarnpkg.com/en/docs/cli/run) for running `package.json` `scripts` and `node_modules/.bin` executables is a nice convenience. It's just better.

# Commands
All commands should be run through `yarn run`. If you haven't switched to [yarn](https://yarnpkg.com/) yet, now's a great time!

```zsh
yarn run fosterkit
```

This is where the magic happens. The perfect workflow. This runs the development task, which starts compiling, watching, and live updating all our files as we change them. BrowserSync will start a server on port 3000, or do whatever you've configured it to do. You'll be able to see live changes in all connected browsers. Don't forget about the additional BrowserSync tools available on port 3001!

```zsh
yarn run fosterkit -- build
```
Compiles files for production to your destination directory. JS files are built with Webpack 3 with standard production optimizations (Uglify, etc.). CSS is run through CSSNano. If `rev` is set to `true` in your `task-config.js` file, filenames will be hashed (file.css -> file-a8908d9io20.css) so your server may cache them indefinitely.

**NOTE:** By default filenames revision is set to `false` for WordPress production builds. Please refer to [Fosterkit and Wordpress](extras/wordpress/README-WP.md) documentation if you'd like to [enable revision](extras/wordpress/README-WP.md#filenames-revision-hashing-for-production-builds).

```zsh
yarn run fosterkit -- ghPages
```
If you are building a static site, and would like to preview it on GitHub pages, this handy script does just that using [gulp-gh-pages](https://www.npmjs.com/package/gulp-gh-pages). Be sure to add or update the `homepage` property in your `package.json` to point to your gh-pages url.

It's a good idea to add aliases for these commands to your `package.json` `scripts` object.

```json
// package.json
  "scripts": {
    "start": yarn run fosterkit,
    "build": yarn run fosterkit -- build
  }
```
```zsh
# Command line
yarn start
yarn run build
```

# Configuration
You may override the default configuration by creating a `config` folder with the following two files in it: `path-config.json` and `task-config.js`. These files will be created by any of the `-- init` tasks, or you can generate *only* the config files with the following command:

```zsh
yarn run fosterkit -- init-config
```

By default, Fosterkit expects these files to live in a `./config` a the root of your project. You may specify an alternative relative location by setting an environment variable:

```json
// package.json
"scripts": {
  "fosterkit": "FOSTERKIT_CONFIG_PATH='./some/location' fosterkit"
}
```
```zsh
# command line
yarn run fosterkit
```

The files must be named `path-config.json` and `task-config.js`.

## path-config.json
This file specifies the `src` and `dest` root directories, and `src` and `dest` for each task, relative to the configured root. For example, if your source files live in a folder called `app`, and your compiled files should be output to a folder called `static`, you'd update the `src` and `dest` properties here to reflect that.

## task-config.js
This file exposes per-task configuration and overrides. At minimum, you just need to set the task to `true` to enable the task with its default configuration. If you wish to configure a task, provide a configuration object instead.

- Any task may be disabled by setting the value to `false`. For example, if your project has its own handling HTML and templating (Wordpress, Craft, etc), you'll want to set `html` to `false` in your task-config.
- All asset tasks have an `extensions` option that can be used to overwrite the ones that are processed and watched.

See [task config defaults](gulpfile.js/lib/task-defaults.js) for a closer look. All configuration objects will be merged with these defaults. Note that `array` options are replaced rather than merged or concatenated.

### browserSync
Options to pass to [browserSync](https://browsersync.io/docs/options).

**If you're using Pug (built in) to compile a static site**, you'll want to use the `server` and tell it which server to serve up via the `baseDir` option.
```js
browserSync: {
  server: {
    baseDir: 'public'
  }
}
```

**If you're running another server (Vagrant for example, built in with Wordpress config)**, you'll want to use the `proxy` option, along with `files` to tell browserSync to watch additional files (like your templates).
```js
browserSync: {
  proxy: {
    target: 'mywebsite.dev'
  },
  files: ['public/wp-content/themes/my-theme/**/*.php']
}
```

### javascripts
Under the hood, JS is compiled with Webpack 3 with a heavily customized Webpack file to get you up and running with little to no configuration. An API for configuring some of the most commonly accessed options are exposed, along with some other helpers for scoping to environment. Additionally, you can get full access to modify Fosterkit's `webpackConfig` via the [`customizeWebpackConfig`](#customizeWebpackConfig) option.

#### `entry` (required)
Discrete js bundle entry points. A js file will be bundled for each item. Paths are relative to the `js` folder. This maps directly to `webpackConfig.entry`.

#### `publicPath`
The public path to your assets on your server. Only needed if this differs from the result of `path.join(PATH_CONFIG.dest, PATH_CONFIG.javascripts.dest)`. Maps directly to `webpackConfig.publicPath`

#### `devtool`
Sets the webpack devtool option in development mode. Defaults to `eval-cheap-module-source-map`, one of the fastest source map options. To enable sourcemaps in production builds, use [`customizeWebpackConfig`](#customizeWebpackConfig).

#### `babel`
Object to overwrite the default Babel loader config object. This defaults to `{ presets:  [["es2015", { "modules": false }], 'stage-1'] }`. Same format as a `.babelrc` file.

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
]
```

#### `plugins`
Define additional webpack plugins that should be used in all environments.

#### `loaders`
Define additional webpack loaders that should be used in all environments. Adds to `webpackConfig.module.rules`

#### `development`, `production`
Define additional webpack plugins and loaders for development or production environments.
```js
development: {
  plugins: (webpack) => { return [ new webpack.IgnorePlugin(/jsdom$/) ] },
  loaders: [] // Adds to `webpackConfig.module.rules`
}
```

By default, the `env` will be `"development"` when running `yarn run fosterkit`, and `"production"` when running `yarn run fosterkit -- build`.

#### `hot`
By default, webpack HMR will simply do a full browser refresh when your js files change. If your code takes advantage of [hot module replacement methods](https://webpack.github.io/docs/hot-module-replacement.html), modules will be hot loaded.

*Defaults to:*
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
In the event that an option you need is not exposed, you may access, modify and return a futher customized webpackConfig by providing this option as a function. The function will recieve the Fosterkit `webpackConfig`, `env` and `webpack` as params. The `env` value will be either `development` (`yarn run fosterkit`) or `production` (`yarn run fosterkit -- build`).

```js
customizeWebpackConfig: function (webpackConfig, env, webpack) {
  if(env === 'production') {
    webpackConfig.devtool = "nosources-source-map"
  }

  return webpackConfig
}
```

**CAUTION!** Avoid overwriting `webpackConfig.entry` or `webpackConfig.plugins` via this function, and rely on the `entry` and `plugins` options above to avoid breaking Fosterkit's hot-loading and file revisioning setup ([view source](gulpfile.js/lib/webpack-multi-config.js)).

### stylesheets

#### `autoprefixer`
Your Sass gets run through [Autoprefixer](https://github.com/postcss/autoprefixer), so don't prefix! Use this option to pass configuration. Defaults to `{ browsers: ["last 3 versions"] }`.

#### `sass`
Options to pass to [node-sass](https://github.com/sass/node-sass#options).

Defaults to `{ includePaths: ["./node_modules"] }` so you can `@import` files installed to `node_modules`.

### html
**Note:** If you are on a platform that's already handling html (Wordpress), set `html: false` or delete the configuration object completely from `task-config.js`. If that's the case, don't forget to use the BrowserSync [`files` option](https://browsersync.io/docs/options#option-file) in the `browserSync` config object to start watching yout templates folder.

Robust templating with [Pug](https://pugjs.org/api/getting-started.html).

#### `dataFunction`
[gulp-data](https://github.com/colynb/gulp-data) `dataFunction` used provide data to templates. Defaults to reading a in a global JSON, specified by the `dataFile` option.

#### `dataFile`
A path to a JSON file containing data to use in your Nunjucks templates via [`gulp-data`](https://github.com/colynb/gulp-data).

#### `htmlmin`
[Options](https://github.com/kangax/html-minifier#options-quick-reference) to pass to [`gulp-htmlmin`](https://github.com/jonschlinkert/gulp-htmlmin.

#### `excludeFolders`
You'll want to exclude some folders from being compiled directly. This defaults to: `["data", "includes", "layout", "mixins", "modules"]`.

### static
There are some files that belong in your root destination directory that you won't want to process or revision in production. Things like [favicons, app icons, etc.](http://realfavicongenerator.net), should go in `src/static`, and will get copied over to `public` as a last step (after revisioning in production). *Nothing* should ever go directly in `public`, since it gets completely trashed and re-build when running the `default` or `production` tasks.

#### `scrOptions`
Options passed to `gulp.src`. See [gulp documentation](https://github.com/gulpjs/gulp/blob/master/docs/API.md#options) for details. Defaults to:
```js
static: {
  srcOptions: {
    dot: true // include dotfiles
  }
}
```

### fonts, images
These tasks simply copy files from `src` to `dest` configured in `path-config.json`. Nothing to configure here other that specifying extensions or disabling the task.

### ghPages
You can deploy the contents your `dest` directly to a remote branch (`gh-pages` by default) with `yarn run fosterkit -- ghPages`. Options specified here will get passed directly to [gulp-gh-pages](https://github.com/shinnn/gulp-gh-pages#ghpagesoptions).

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

I've included a helper to generate the required svg markup in `src/views/mixins/_mixins.pug`, so you can just do:
```pug
+sprite('my-icon')
```
Which spits out:
```html
<span class="u-sprite icon-my-icon">
  <svg viewBox="0 0 1 1"><use xlink:href="img/icons.svg#my-icon"></use></svg>
</span>
```

This particular setup allows styling 2 different colors from your CSS. You can have unlimited colors hard coded into your svg.

In the following example, the first path will be `red`, the second will be `white`, and the third will be `blue`. Paths **without a fill attribute** will inherit the `fill` property from CSS. Paths with `fill="currentColor"` will inherit the current CSS `color` value, and hard-coded fills will not be overwritten, since inline styles trump CSS values.
```scss
.sprite {
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

I recommend setting up your SVGs on a 500 x 500 canvas, centering your artwork, and expanding/combining any shapes of the same color. This last step is important. [Read more on SVG optimization here!](https://www.viget.com/articles/5-tips-for-saving-svg-for-the-web-with-illustrator)

### production
By default, filenames are revisioned when running the production `build` task. If you want to disable this behavior, you can set `rev` to false.

```js
production: {
  rev: false
}
```

# FAQ

## Can I customize and add Gulp tasks?
You could clone this repo, copy over the gulpfile.js folder and package.json dependencies and run `gulp` instead of installing it as a modules directly, or you could fork and maintain your own custom setup.

## I don't see JS files in my dest directory during development
JS files are compiled and live-update via BrowserSync + WebpackDevMiddleware + WebpackHotMiddleware. That means, that you won't actually see `.js` files output to your destination directory during development, but they will be available to your browser running on the BrowserSync port.

## What's under the hood?
Gulp tasks! Built combining the following:

Feature | Packages Used
------ | -----
**CSS** | [Sass](http://sass-lang.com/) ([Libsass](http://sass-lang.com/libsass) via [node-sass](https://github.com/sass/node-sass)), [Autoprefixer](https://github.com/postcss/autoprefixer), [CSSNano](https://github.com/ben-eb/cssnano), [CombineMQ](https://github.com/frontendfriends/gulp-combine-mq), Source Maps
**JavaScript** | [Babel](http://babeljs.io/), [Webpack 3](https://webpack.js.org/)
**HTML** | [Pug](https://pugjs.org/api/getting-started.html), [gulp-data](https://github.com/colynb/gulp-data)
**Images** | Folder for including your project's images
**Icons** | Auto-generated [SVG Sprites](https://github.com/w0rm/gulp-svgstore)
**Fonts** | Folder for including WebFonts
**Live Updating** | [BrowserSync](http://www.browsersync.io/), [Webpack Dev Middleware](https://github.com/webpack/webpack-dev-middleware), [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware)
**Production Builds** | CSS is [minified](http://cssnano.co/), JS is compressed and optimized with various Webpack plugins, [filename md5 hashing (reving)](https://github.com/sindresorhus/gulp-rev), [file size reporting](https://github.com/jaysalvat/gulp-sizereport).
**Deployment** | Quickly deploy `public` folder to gh-pages with [`gulp-gh-pages`](https://github.com/shinnn/gulp-gh-pages)

Extras:

Feature | Packages Used
------- | -------------
**Wordpress** | [Vagrant](https://www.vagrantup.com/), [ScotchBox](https://box.scotch.io/)
**Sass** | [Bourbon](http://bourbon.io/), [Neat](http://neat.bourbon.io/)
**IconFonts** | Generate icons fonts from SVGs
**Test server** | Local production [Express](http://expressjs.com) server for your static websites

***

### Credits:
**Fosterkit** has been inspired by [Gulp Starter](https://github.com/vigetlabs/gulp-starter), [WPDistillery](https://wpdistillery.org/) and [Sky UK Styleguide](https://github.com/sky-uk/css).
