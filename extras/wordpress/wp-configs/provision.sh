#!/usr/bin/env bash
#
# Wordpress setup provisioning file
#
# Author: Flurin Dürst
# URL: https://wpdistillery.org
# Modified by: Cos Anca

# update WP-CLI
echo "== Update WP CLI =="
sudo wp cli update --yes --allow-root

# set upload size to 64MB
echo "== Update Max Filesize =="
sudo sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/g' /etc/php5/apache2/php.ini
sudo sed -i 's/post_max_size = 8M/post_max_size = 64M/g' /etc/php5/apache2/php.ini
sudo service apache2 restart

# run Wordpress setup
echo "== Run Wordpress setup =="
cd ../../var/www/wp-configs
sudo -u vagrant bash wpsetup.sh
