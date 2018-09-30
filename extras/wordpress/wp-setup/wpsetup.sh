#!/usr/bin/env bash
#
# WordPress setup file
#
# Creadits: Flurin Dürst
# URL: https://wpdistillery.org

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

# REQUIREMENTS
####################################################################################################

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

printf "${BRN}========== NUCLEUM WP SETUP START ==========${NC}\n\n"

# MOVE TO ROOT
cd ../../../../../

# READ CONFIG
eval $(parse_yaml wp-setup.yml "CONF_")

# THEME RENAMING VARIABLES
theme_text_domain="'${CONF_theme_slug}'"
theme_functions="${CONF_theme_slug//-/_}_"
theme_style_text_domain="Text Domain: ${CONF_theme_slug}"
theme_doc_blocks=" ${CONF_theme_name// /_}"
theme_handle="${CONF_theme_slug}-"
theme_author="Author: ${CONF_theme_author}"
theme_author_url="URL: ${CONF_theme_author_url}"

# CHECK WP FOLDER
if [ ! -d "$CONF_wpfolder" ]; then
  mkdir $CONF_wpfolder
  printf "${BLU}»»» creating $CONF_wpfolder WP Folder...${NC}\n"
fi

cd $CONF_wpfolder

# INSTALL WORDPRESS
if $CONF_setup_wp ; then
  printf "${BRN}[=== INSTALL WORDPRESS ===]${NC}\n"
  printf "${BLU}»»» downloading WordPress...${NC}\n"
  wp core download --locale=$CONF_wplocale --version=$CONF_wpversion
  printf "${BLU}»»» creating new database...${NC}\n"
  mysql -uroot -proot -e "CREATE DATABASE IF NOT EXISTS \`${CONF_db_name}\` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_unicode_ci;"
  if [ $CONF_db_user != 'root' ]; then
    printf "${BLU}»»» creating new database user...${NC}\n"
    mysql -uroot -proot -e "CREATE USER '${CONF_db_user}'@localhost IDENTIFIED BY '${CONF_db_pass}';"
    printf "${BLU}»»» granting schema privileges to the new user...${NC}\n"
    mysql -uroot -proot -e "GRANT ALL PRIVILEGES ON \`${CONF_db_name}\`.* TO '${CONF_db_user}'@'localhost';"
    mysql -uroot -proot -e "FLUSH PRIVILEGES;"
  fi
  printf "${BLU}»»» creating wp-config...${NC}\n"
  wp core config --dbname=$CONF_db_name --dbuser=$CONF_db_user --dbpass=$CONF_db_pass --dbprefix=$CONF_db_prefix --locale=$CONF_wplocale
  printf "${BLU}»»» installing wordpress...${NC}\n"
  wp core install --url=$CONF_wpsettings_url --title="$CONF_wpsettings_title" --admin_user=$CONF_admin_user --admin_password=$CONF_admin_password --admin_email=$CONF_admin_email --skip-email
  wp user update 1 --first_name=$CONF_admin_first_name --last_name=$CONF_admin_last_name
else
  printf "${BLU}>>> skipping WordPress installation...${NC}\n"
fi

if $CONF_setup_settings ; then
  printf "${BLU}»»» configure settings...${NC}\n"
  printf "${BLU}» timezone:${NC}\n"
  wp option update timezone $CONF_timezone
  wp option update timezone_string $CONF_timezone
  printf "${BLU}» permalink structure:${NC}\n"
  wp rewrite structure "$CONF_wpsettings_permalink_structure"
  wp rewrite flush
  printf "${BLU}» description:${NC}\n"
  wp option update blogdescription "$CONF_wpsettings_description"
  printf "${BLU}» image sizes:${NC}\n"
  wp option update thumbnail_size_w $CONF_wpsettings_thumbnail_width
  wp option update thumbnail_size_h $CONF_wpsettings_thumbnail_height
  wp option update medium_size_w $CONF_wpsettings_medium_width
  wp option update medium_size_h $CONF_wpsettings_medium_height
  wp option update large_size_w $CONF_wpsettings_large_width
  wp option update large_size_h $CONF_wpsettings_large_height
  if ! $CONF_wpsettings_convert_smilies ; then
    wp option update convert_smilies 0
  fi
  if $CONF_wpsettings_page_on_front ; then
    printf "${BLU}» front page:${NC}\n"
    # create and set frontpage
    wp post create --post_type=page --post_title="$CONF_wpsettings_page_on_front_frontpage_name" --post_content='Front Page created with Nucleum' --post_status=publish
    wp option update page_on_front $(wp post list --post_type=page --post_status=publish --posts_per_page=1 --pagename="$CONF_wpsettings_page_on_front_frontpage_name" --field=ID --format=ids)
    wp option update show_on_front 'page'
  fi
else
  printf "${BLU}>>> skipping settings...${NC}\n"
fi

# INSTALL THEME
if $CONF_setup_theme ; then
  printf "${BRN}[=== INSTALL $CONF_theme_name theme ===]${NC}\n"
  if $CONF_theme_underscores_generated ; then
    printf "${BLU}»»» scaffolding $CONF_theme_name _s theme...${NC}\n"
    wp scaffold _s $CONF_theme_slug --theme_name="$CONF_theme_name" --author="$CONF_theme_author" --author_uri="$CONF_theme_author_url"
    printf "${BLU}»»» activating $CONF_theme_name theme...${NC}\n"
    wp theme activate $CONF_theme_slug
  else
    printf "${BLU}»»» downloading theme...${NC}\n"
    wp theme install https://github.com/CosAnca/fosterpress/archive/master.zip
    printf "${BLU}»»» renaming fosterpress theme to $CONF_theme_slug...${NC}\n"
    sed -i "s/'fosterpress'/${theme_text_domain}/g" wp-content/themes/fosterpress/{,**}/*.php
    echo ${theme_text_domain}
    sed -i "s/fosterpress_/${theme_functions}/g" wp-content/themes/fosterpress/{,**}/*.php
    sed -i "s/Text Domain: fosterpress/${theme_style_text_domain}/g" wp-content/themes/fosterpress/style.css
    sed -i "s/ FosterPress/${theme_doc_blocks}/g" wp-content/themes/fosterpress/style.css
    sed -i "s/ FosterPress/${theme_doc_blocks}/g" wp-content/themes/fosterpress/{,**}/*.php
    sed -i "s/fosterpress-/${theme_handle}/g" wp-content/themes/fosterpress/{,**}/*.php
    sed -i "s/Author: Cos Anca/${theme_author}/g" wp-content/themes/fosterpress/functions.php
    sed -i "s,URL: http://github.com/CosAnca,${theme_author_url},g" wp-content/themes/fosterpress/functions.php
    mv wp-content/themes/fosterpress wp-content/themes/$CONF_theme_slug
    wp theme activate $CONF_theme_slug
  fi
else
  printf "${BLU}>>> skipping theme installation...${NC}\n"
fi

# CLEANUP
if $CONF_setup_cleanup ; then
  printf "${BRN}[=== CLEANUP ===]${NC}\n"
  if $CONF_setup_cleanup_comment ; then
    printf "${BLU}»»» removing default comment...${NC}\n"
    wp comment delete 1 --force
  fi
  if $CONF_setup_cleanup_posts ; then
    printf "${BLU}»»» removing default posts...${NC}\n"
    wp post delete 1 2 --force
  fi
  if $CONF_setup_cleanup_files ; then
    printf "${BLU}»»» removing WP readme/license files...${NC}\n"
    # delete default WP files
    if [ -f readme.html ];    then rm readme.html;    fi
    if [ -f license.txt ];    then rm license.txt;    fi
    # delete theme folder readme/license files
    if [ -f wp-cotent/themes/${CONF_theme_slug}/readme.txt ]; then
      rm wp-cotent/themes/${CONF_theme_slug}/readme.txt;
    fi
    if [ -f wp-cotent/themes/${CONF_theme_slug}/LICENSE ]; then
      rm wp-cotent/themes/${CONF_theme_slug}/LICENSE;
    fi
    # delete theme folder dot files
    if [ -f wp-cotent/themes/${CONF_theme_slug}/.jscsrc ]; then
      rm wp-cotent/themes/${CONF_theme_slug}/.jscsrc;
    fi
    if [ -f wp-cotent/themes/${CONF_theme_slug}/.jshintignore ]; then
      rm wp-cotent/themes/${CONF_theme_slug}/.jshintignore;
    fi
  fi
  if $CONF_setup_cleanup_themes ; then
    printf "${BLU}»»» removing default themes...${NC}\n"
    wp theme delete twentyfifteen
    wp theme delete twentysixteen
    wp theme delete twentyseventeen
  fi
else
  printf "${BLU}>>> skipping Cleanup...${NC}\n"
fi

# PLUGINS
if $CONF_setup_plugins ; then
  printf "${BRN}[=== PLUGINS ===]${NC}\n"
  printf "${BLU}»»» removing WP default plugins...${NC}\n"
  wp plugin delete akismet
  wp plugin delete hello
  printf "${BLU}»»» installing plugins...${NC}\n"
  for entry in "${CONF_plugins[@]}"
  do
  	wp plugin install $entry --activate
  done
else
  printf "${BLU}>>> skipping Plugin installation...${NC}\n"
fi

# MISC
printf "${BLU}»»» checking wp cli version...${NC}\n"
wp cli check-update

# UPDATE GULP DESTINATION PATHS
printf "${BLU}»»» setting Gulp tasks assets destination path...${NC}\n"
sed -i 's/my-theme/'"${CONF_theme_slug}"'/g' ../config/path-config.json
printf "${BLU}»»» setting BrowserSync server proxy...${NC}\n"
sed -i 's/mywebsite.test/'"${CONF_wpsettings_url}"'/g' ../config/task-config.js
sed -i 's/my-theme/'"${CONF_theme_slug}"'/g' ../config/task-config.js

printf "${BRN}==================== NUCLEUM WP SETUP FINISHED ====================${NC}\n"
printf "${BLU}Your website is available at: ${PRL}http://${CONF_wpsettings_url}${NC}\n"
printf "${BLU}Enable watch mode and/or compile assets with: ${PRL}yarn run nucleum${NC}\n"
if $CONF_theme_underscores_generated ; then
  printf "${BLU}Modify ${PRL}functions.php${BLU} to enque scripts/styles from the ${PRL}/assets ${BLU}folder.${NC}\n"
fi
printf "${BRN}========================== HAPPY CODING!!! ==========================${NC}\n"
