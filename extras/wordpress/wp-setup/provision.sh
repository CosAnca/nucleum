#!/usr/bin/env bash
#
# WordPress setup provisioning file
#
# Credits: Flurin Dürst
# URL: https://wpdistillery.org

# set upload size to 64MB
echo "== Update Max Filesize =="
sudo sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 64M/g' /etc/php/7.0/fpm/php.ini
sudo sed -i 's/post_max_size = 8M/post_max_size = 64M/g' /etc/php/7.0/fpm/php.ini
sudo sed -i 's/sendfile on/sendfile off/g' /etc/nginx/nginx.conf
sudo service nginx restart

# run WordPress setup
echo "== Run WordPress setup =="
cd ../../var/www/node_modules/nucleum/extras/wordpress/wp-setup
sudo -u vagrant bash wpsetup.sh
