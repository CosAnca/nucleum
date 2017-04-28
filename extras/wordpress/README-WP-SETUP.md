# The configuration file in detail

In this section, we will go through the `config.yml` step by step as I will explain the options available.

The configuration file is split into five sections:

* Installation
* Wordpress
* Theme
* Plugins
* Setup

## Installation

* In **`wpfolder`** you define the folder containing WordPress. Within the current version of Scotch Box this is `public` by default.
* In **`wpversion`** you can define what WordPress version to install.
* With **`wplocale`** you can select what language to download and install WordPress. Use language Codes like `en_US` or `en_GB`.
* Add your timezone as string to **`timezone`**. See [List of Supported Timezones](http://php.net/manual/en/timezones.php).
* **`admin`** defines the default admin user. Set your preferred username, password and email.
* **`db`** contains the access data to connect WordPress to the database on the Virtual Machine. By default (when using ScotchBox) no changes are needed here. Although you can create multiple databases with ScotchBox the one that the machine connects to must have the details provided in this object.
* **`webdb`** contains the access data to connect WordPress to the "LIVE" database.

```yaml
# INSTALLATION
##############################################################

# WordPress folder
wpfolder: public

# WordPress version
wpversion: latest

# language/timezone
wplocale: en_GB
timezone: Europe/London

# admin user settings
admin:
  user: admin
  password: admin
  email: mail@service.com
  first_name: ""
  last_name: ""

# scotch box db access
db:
  name: scotchbox
  user: root
  pass: root
  prefix: wp_

webdb:
  name: mydatabase
  user: myusername
  pass: mypassword
  prefix: mywp_
```

## Settings

* In **`wpsettings`** you can define WP-Options like url, title, description, the permalink_structure or edit the default image sizes.
* Set **`page_on_front`** to true to set **`frontpage_name`** as default front page.
* If you set **`convert_smilies`** false, smilies won't be converted to image-smilies automatically.
* Note: To edit the url you use to access the website within your browser edit `config.vm.hostname` in the Vagrantfile.

```yaml
# SETTINGS
##############################################################

wpsettings:
  url: mywebsite.dev
  title: Example
  description: Example Description
  permalink_structure: /%postname%/
  # default image sizes
  thumbnail_width: 150
  thumbnail_height: 150
  medium_width: 300
  medium_height: 300
  large_width: 1024
  large_height: 1024
  # use page as frontpage
  page_on_front: true
    frontpage_name: Example Front Page
  # automatic converttion of smilies
  convert_smilies: false
```

## Theme
Now you can install a (starter-) theme if you want. Simply add the name yuo'd like for the theme. The script will then scaffold, install and activate a barebones _s theme.

```yaml
# THEME
##############################################################

# theme to install, choose new name in 'rename' or leave empty
theme:
  name: My theme
  slug: my-theme
  author: Author name
  author_url: ""
```

## Plugins
You can select what plugins you want to install.

```yaml
# PLUGINS
##############################################################

# plugins to install & activate
plugins_active:
  - active-custom-fields
```

If you want to install custom or premium plugins you can simply write down the download-url instead of the name. Make sure to add quotes:

```yaml
plugins_active:
  - "https://example.com/plugins/awesome_plugin.zip&key=31071988"
```

## Setup
Maybe you don't want to install a theme? Or you prefer keeping the default posts and files it comes with? Within the setup options at the bottom of the file you can tell which tasks to perform. Simply set those you wan't to skip to `false`.

* **`wp`**: install WordPress core
* **`settings`**: set custom WordPress settings (Note: the value defined **`timezone`** is also considered a setting)
* **`theme`**: install and activate a theme
* **`plugins`**: install the plugins listed
* **`cleanup`**: delete WordPress defaults as followed
  * **`comment`**: the default comment
  * **`posts`**: the default post
  * **`files`**: `readme.html`, `license.txt`
  * **`themes`**: the twentyfourteen, twentyfifteen and twentysixteen theme.


```yaml
# SETUP
#################################################################
# if you don't want the setup to run all tasks set them to false

setup:
  wp: true
  settings: true
  theme: true
  plugins: true
  cleanup: true
    comment: true
    posts: true
    files: true
    themes: true
```
