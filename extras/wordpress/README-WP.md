## Nucleum and WordPress

## Dependencies

- Front-end stack
  - [yarn]
- WordPress
  - [Docker]
  - [docker-compose]

[docker]: https://www.docker.com/products/docker-desktop
[docker-compose]: https://docs.docker.com/compose/install/#install-compose

## Quick start on a fresh project (empty directory) for creating a WordPress based website

```zsh
yarn init
yarn add nucleum
yarn run nucleum init-wp
```

This will generate the default src (`src`) and config (`config`) files for the front-end build and backend.

Next, run the following command:

```zsh
sh bin/setup.sh
```

## Setup

Follow the steps prompted by the command line to set up your WordPress installation.

**Note:**

If you want to use a domain other than http://localhost, you'll need to:

1. Add an entry to your hosts file. Ex: `127.0.0.1 docker.localhost`
2. Update _WordPress Address (URL)_ and _Site Address (URL)_.

## Behind the scenes

The shell scripts will do all the work for you when setting up a new WordPress project. With this setup it won't take longer than 5 minutes until you can start working on a new WordPress project.

## Additional info

### Database

Default MySQL connection information (from within PHP-FPM container):

| --------- | ----------- |
| Database | wordpress |
| --------- | ----------- |
| Username | wordpress |
| --------- | ----------- |
| Password | password |
| --------- | ----------- |
| Host | mysql |
| ----- | ------- |

Default WordPress admin credentials:

| --------- | ----------- |
| Username | admin |
| --------- | ----------- |
| Password | password |

**Note:** If you provided details different to the above during setup, use those instead.

### Themes

Nucleum allows you to quickly scaffold an "\_s" theme or to install a theme from an URL or local `.zip` file.

### Filenames revision (hashing) for production builds

If you set `rev` to `true` in your `task-config.js` file, filenames will be hashed (file.css -> file-a8908d9io20.css) so your server may cache them indefinitely. A `rev-manifest.json` file is output to the root of your assets `dest` directory in your theme (`assets` by default), and maps original filenames to hashed ones. CSS files read this file and string-replace filenames automatically.

For WordPress to read this file and automatically update filenames in your project, make sure you include the following snippet in your `functions.php` file:

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

Once you have this snippet included into your `functions.php` file, you can reference the assets filenames in your `.php` files, in one of the following ways:

```php
wp_enqueue_style( "cache-bust-style", get_template_directory_uri() . get_asset_path("style/style.css"), array(), null, false );
```

or

```php
<?php echo get_template_directory_uri() . get_asset_path("img/filename.jpg") ?>
```

### Windows Support

Windows support will come in a future version.
