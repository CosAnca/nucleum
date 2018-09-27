Nucleum and WordPress
-----------------------

## Dependencies
- [ScotchBox](https://box.scotch.io) (using [Vagrant](https://vagrantup.com) & [Virtualbox](https://virtualbox.org))
- [Vagrant Hostsupdater](https://github.com/cogitatio/vagrant-hostsupdater) (`vagrant plugin install vagrant-hostsupdater`)

## Setup
To setup a new project running Scotch Box and WordPress, simply follow these steps:

1. Customize `wp-setup.yml` to suit your project needs (see [configuration file documentation](README-WP-SETUP.md)).
2. In `Vagrantfile` add your local development IP at `config.vm.network ip:` and the domain name at `config.vm.hostname` (This should be the same as `wpsettings:url:` in `wp-setup.yml`).
3. Run `vagrant up` inside your project root.

## Behind the scenes
The shell scripts will do all the work for you when setting up a new WordPress project. Simply add your preferred theme, plugins, options etc. into `wp-setup.yml` and you're good to go. With this setup it won't take longer than 5 minutes until you can start working on a new WordPress project.

One command will:
- install Scotch Box
- install/update requirements on the local webserver
- download/install/configure WordPress
- set WordPress options
- scaffold/install/activate [FosterPress] or an [Underscores] theme
- install/activate the plugins you defined in the config
- clean WordPress defaults (contents, plugins, themes, unused files)

[FosterPress]: https://github.com/CosAnca/fosterpress
[Underscores]: https://underscores.me

## Additional info

### Themes
The default theme bundled with Nucleum is called FosterPress, which is a minimal starter theme for WordPress.

If you want to scaffold and '_s' theme set `underscores_generated: true` under theme section in wp-setup.yml file.

### Auto Update WordPress and Plugins
If you want to automatically update WordPress and all Plugins on every vagrant up you can uncomment line 26 inside the Vagrantfile.

### Filenames revision (hashing) for production builds
If you set `rev` to `true` in your `task-config.js` file, filenames will be hashed (file.css -> file-a8908d9io20.css) so your server may cache them indefinitely. A `rev-manifest.json` file is output to the root of your assets `dest` directory in your theme (`assets` by default), and maps original filenames to hashed ones. CSS files read this file and string-replace filenames automatically.

This functionality comes by default with [FosterPress] theme, otherwise if an '_s' theme is used, for WordPress to read this file and automatically update filenames in your project, make sure you include the following snippet in your `functions.php` file:

```php
/**
 * Get cache-busting hashed filename from rev-manifest.json.
 *
 * @param  string $filename Original name of the file.
 * @return string Current cache-busting hashed name of the file.
 */
function get_asset_path( $filename ) {

  // Cache the decoded manifest so that we only read it in once.
  static $manifest = null;
  if ( null === $manifest ) {
    $active_theme_slug = get_template();
    $manifest_path = 'wp-content/themes/' . $active_theme_slug . '/assets/rev-manifest.json';
    $manifest = file_exists( $manifest_path )
      ? json_decode( file_get_contents( $manifest_path ), true )
      : [];
  }

  // If the manifest contains the requested file, return the hashed name.
  if ( array_key_exists( $filename, $manifest ) ) {
    return '/assets/' . $manifest[ $filename ];
  }

  // Assume the file has not been hashed or it was not found within the
  // manifest.
  return '/assets/' . $filename;
}
```

Once you have this snippet included into your `functions.php` file, you can reference the assets filenames in your `.php` files, like this:

```php
wp_enqueue_style( 'cache-bust-style', get_template_directory_uri() . get_asset_path('style/style.css'), array(), null, false );
```

or

```php
<?php echo get_template_directory_uri() . get_asset_path('img/filename.jpg') ?>
```

### Windows Support
Using Windows? No Problem! The provision script will detect if you're using Windows and if so, automatically convert all files using dos2unix.

This setup is based on [WPDistillery](https://github.com/flurinduerst/WPDistillery)

## Thank you to author and contributors of WPDistillery

* Author: Flurin Dürst ([Website](https://flurinduerst.ch), [Mail](mailto:flurin@flurinduerst.ch), [Twitter](https://twitter.com/flurinduerst))
* Contributors:
  * [@ShaneShipston](https://github.com/ShaneShipston)
  * [@drawcard](https://github.com/drawcard)
