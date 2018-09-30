#!/usr/bin/env bash
#
# Create WordPress database
#
# Author: Cos Anca

# ERROR Handler
# ask user to continue on error
function continue_error {
  read -p "$(echo -e "${RED}Do you want to continue anyway? (y/n) ${NC}")" -n 1 -r
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    printf "\n${RED}»»» aborting Nucleum WP setup! ${NC}\n"
    exit 1
  else
    printf "\n${GRN}»»» continuing Nucleum WP setup... ${NC}\n"
  fi
}
trap 'continue_error' ERR

# YAML PARSER FUNCTION
function parse_yaml() {
    local prefix=$2
    local s
    local w
    local fs
    s='[[:space:]]*'
    w='[a-zA-Z0-9_]*'
    fs="$(echo @|tr @ '\034')"
    sed -ne "s|^\($s\)\($w\)$s:$s\"\(.*\)\"$s\$|\1$fs\2$fs\3|p" \
        -e "s|^\($s\)\($w\)$s[:-]$s\(.*\)$s\$|\1$fs\2$fs\3|p" "$1" |
    awk -F"$fs" '{
    indent = length($1)/2;
    vname[indent] = $2;
    for (i in vname) {if (i > indent) {delete vname[i]}}
        if (length($3) > 0) {
            vn=""; for (i=0; i<indent; i++) {vn=(vn)(vname[i])("_")}
            printf("%s%s%s=(\"%s\")\n", "'"$prefix"'",vn, $2, $3);
        }
    }' | sed 's/_=/+=/g'
}

# DEFINE COLORS
RED='\033[0;31m' # error
GRN='\033[0;32m' # success
BLU='\033[0;34m' # task
PRL='\033[0;35m' # command
BRN='\033[0;33m' # headline
NC='\033[0m' # no color

# EXECUTIVE SETUP
####################################################################################################

# MOVE TO ROOT
cd ../../../../../

# READ CONFIG
eval $(parse_yaml /var/www/wp-setup.yml "CONF_")

# CHANGE DIRECTORY TO WP FOLDER
cd /var/www/$CONF_wpfolder

# CREATE THE DATABASE
printf "${BLU}»»» creating the database...${NC}\n"
mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS \`${CONF_db_name}\` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_unicode_ci;"
if [ $CONF_db_user != 'root' ]; then
  printf "${BLU}»»» creating the database user...${NC}\n"
  mysql -uroot -proot -e "CREATE USER '${CONF_db_user}'@localhost IDENTIFIED BY '${CONF_db_pass}';"
  printf "${BLU}»»» granting schema privileges to the database user...${NC}\n"
  mysql -uroot -proot -e "GRANT ALL PRIVILEGES ON \`${CONF_db_name}\`.* TO '${CONF_db_user}'@'localhost';"
  mysql -uroot -proot -e "FLUSH PRIVILEGES;"
fi
printf "${BLU}»»» installing wordpress...${NC}\n"
wp core install --url=$CONF_wpsettings_url --title="$CONF_wpsettings_title" --admin_user=$CONF_admin_user --admin_password=$CONF_admin_password --admin_email=$CONF_admin_email --skip-email
wp user update 1 --first_name=$CONF_admin_first_name --last_name=$CONF_admin_last_name
printf "${BLU}»»» setting permalink structure...${NC}\n"
wp rewrite structure "$CONF_wpsettings_permalink_structure"
wp rewrite flush
printf "${BLU}»»» activating ${CONF_theme_name} theme...${NC}\n"
wp theme activate $CONF_theme_slug

printf "${BRN}==================== NUCLEUM WP DB SETUP FINISHED ====================${NC}\n"
printf "${BLU}Your website is available at: ${PRL}http://${CONF_wpsettings_url}${NC}\n"
printf "${BLU}Enable watch mode and/or compile assets with: ${PRL}yarn run nucleum${NC}\n"
if $CONF_theme_underscores_generated ; then
  printf "${BLU}Modify ${PRL}functions.php${BLU} to enque scripts/styles from the ${PRL}/assets ${BLU}folder.${NC}\n"
fi
printf "${BRN}========================== HAPPY CODING!!! ==========================${NC}\n"
