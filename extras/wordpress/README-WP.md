Fosterkit on Wordpress
----------------------

## Dependencies
- [ScotchBox](https://box.scotch.io) (using [Vagrant](https://vagrantup.com) & [Virtualbox](https://virtualbox.org))
- [Vagrant Hostsupdater](https://github.com/cogitatio/vagrant-hostsupdater) (`vagrant plugin install vagrant-hostsupdater`)

## Setup
To setup a new project running Scotch Box and WordPress, simply follow these steps:

1. Customize `config.yml` to suit your project needs (see [configuration file documentation](README-WP-SETUP.md)).
2. In `Vagrantfile` add your local development IP at `config.vm.network ip:` and the domain name at `config.vm.hostname` (This should be the same as `wpsettings:url:` in `config.yml`).
3. Run `vagrant up` inside your project root.

## Behind the scenes
The shell scripts will do all the work for you when setting up a new WordPress project. Simply add your preferred theme, plugins, options etc. into `config.yml` and you're good to go. With this setup it won't take longer than 5 minutes until you can start working on a new WordPress project.

One command will:
- install Scotch Box
- install/update requirements on the local webserver
- download/install/configure WordPress
- set WordPress options
- scaffold/install/activate an Underscores theme
- install/activate the plugins you defined in the config
- clean WordPress defaults (contents, plugins, themes, unused files)

## Additional info

### Auto Update WordPress and Plugins
If you want to automatically update WordPress and all Plugins on every vagrant up you can uncomment line 26 inside the Vagrantfile.

### Windows Support
Using Windows? No Problem! The provision script will detect if you're using Windows and if so, automatically convert all files using dos2unix.

This setup is based on [WPDistillery](https://github.com/flurinduerst/WPDistillery)

## Thank you to author and contributors of WPDistillery

* Author: Flurin Dürst ([Website](https://flurinduerst.ch), [Mail](mailto:flurin@flurinduerst.ch), [Twitter](https://twitter.com/flurinduerst))
* Contributors:
  * [@ShaneShipston](https://github.com/ShaneShipston)
  * [@drawcard](https://github.com/drawcard)
