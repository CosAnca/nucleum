# HTML Assets
If you are using Nucleum with another platform that handles markup, delete this folder and set the `html` config to `false` in `gulpfile.js/task-config.json`, and don't forget to [configure BrowserSync to watch your platform's template files](https://browsersync.io/docs/options/#option-files) for changes!

If you are using Nucleum as a standalone static site builder, this is where your markup goes. I've provided a few [Pug](https://pugjs.org/api/getting-started.html) folders and files to get you started:

### Architecture

- **data:** Contains a `global.json` file where you can put data that will be made accessible to your templates
- **includes:** Common parts of the pages structure pre-populated with favicon links, meta tags and Google Analytics code
- **layout:** A basic Pug layout file
- **mixins:** Contains a helpers file with a `sprite` mixin for use with the SVG Sprite task.
- **modules:** A folder to put project modules
- **index.pug:** Hello world! Uses `layouts/_layout.pug`.

### Tasks and Files
```
gulpfile.js/tasks/html
```
Robust templating with [Pug](https://pugjs.org/api/getting-started.html). Pug is a high performance template engine heavily influenced by Haml and implemented with JavaScript for node and browsers.

A global data file is set up at [src/views/data/global.json](src/views/data/global.json), is read in by the `html` task, and exposes the properties to your html templates. See [index.pug](src/views/index.pug) for example usage.
