## WordPress build with Nucleum

## Dependencies

- Frontend stack
  - [yarn]
- WordPress
  - [Docker]
  - [docker-compose]

[yarn]: https://yarnpkg.com
[docker]: https://www.docker.com/products/docker-desktop
[docker-compose]: https://docs.docker.com/compose/install/#install-compose

## Quick start on a fresh project (empty directory) for creating a WordPress based website

```zsh
yarn init
yarn add nucleum
yarn run nucleum init-wp
```

This will generate a WordPress ready boilerplate containing frontend source structure and base files.

Next, to install and configure your WordPress instance, run:

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

The core server functionality is based on docker-compose. By default, the following containers are started: PHP-FPM, MySQL, nginx and Memcached. The `./public` directory is the web root which is mapped to the nginx container.

You can directly edit PHP and nginx configuration files from within the `./config` folder as they are mapped to the correct locations in containers.

A custom phpfpm image is used for this environment that adds a few extra things to the PHP-FPM image.

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

### WP-CLI

Add this alias to `~/.bash_profile` or `~/.zshrc` file to easily run WP-CLI command.

```zsh
alias dcwp="docker-compose exec --user www-data phpfpm wp"
```

Instead of running a command like `wp plugin install` you run `dcwp plugin install` from anywhere inside the
project directory, and it runs the command inside of the php container.

### SSH Access

You can easily access the WordPress/PHP container with `docker-compose exec`:

```zsh
docker-compose exec --user root phpfpm bash
```

### Useful Bash Aliases

To increase efficiency with WP Local Docker, the following bash aliases can be added to `~/.bash_profile` or `~/.zshrc`:

1. WP-CLI:
   ```zsh
   alias dcwp='docker-compose exec --user www-data phpfpm wp'
   ```
2. SSH into container:
   ```zsh
   alias dcbash='docker-compose exec --user root phpfpm bash'
   ```
3. Multiple instances cannot be run simultaneously. In order to switch projects, you'll need to kill all Docker containers first:
   ```zsh
   docker-stop() { docker stop $(docker ps -a -q); }
   ```
4. Combine the stop-all command with `docker-compose up` to easily start up an instance with one command:
   ```zsh
   alias dup="docker-stop && docker-compose up -d"
   ```

### MailCatcher

MailCatcher runs a simple local SMTP server which catches any message sent to it, and displays it in its built-in web interface. All emails sent by WordPress will be intercepted by MailCatcher. To view emails in the MailCatcher web interface, navigate to `http://localhost:1080` in your web browser of choice.

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
echo get_template_directory_uri() . get_asset_path("img/filename.jpg")
```

### Windows Support

Windows support will land in a future version.
