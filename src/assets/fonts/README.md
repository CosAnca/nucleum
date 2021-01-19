# Font Assets

If you are providing web font files, this is the place to put them. The fonts task will copy them over to the destination specified in `nucleum.config.js`, and file names will be reved in production builds (if enabled).

If you don't plan using web fonts, or are relying on an external service like Google Fonts, feel free to delete this folder and set the `fonts` to false in `nucleum.config.js`.

### Tasks and Files

```
gulpfile.js/tasks/fonts
```

All this task does is copy fonts from `./src/fonts` to `./public/fonts`.

A sass `@include font-face` mixin is available via [Bourbon](http://bourbon.io/docs/#font-face).
