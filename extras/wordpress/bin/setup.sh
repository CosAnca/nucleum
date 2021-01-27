#!/usr/bin/env bash

# DEFINE COLORS
RED='\033[0;31m' # error
GRN='\033[0;32m' # success
BLU='\033[0;34m' # task
PRL='\033[0;35m' # command
BRN='\033[0;33m' # headline
NC='\033[0m' # no color

# EXECUTIVE SETUP
printf "${BRN}========== WordPress setup start ==========${NC}\n"

if [ -f "./public/wp-config.php" ]; then
  printf "${BLU}>>> WordPress config file found.{$NC}\n"

  echo "Do you want to reinstall? [y/N]: \c"
  read REINSTALL
  if [[ "$REINSTALL" == Y* ]] || [[ "$REINSTALL" == y* ]]; then
    docker-compose exec phpfpm su -s /bin/bash www-data -c "wp db reset --yes"
  else
    printf "\n${BLU}>>> Installation aborted.${NC}\n"
    exit 1
  fi
fi

# Ask for the type of installation
echo "Do you want a multisite installation? [y/N]: \c"
read MULTISITE

# Install WordPress
printf "${BLU}>>> Downloading WordPress...${NC}\n"
docker-compose exec phpfpm su -s /bin/bash www-data -c "wp core download --force"
printf "${BLU}>>> Creating wp-config...${NC}\n"
docker-compose exec -T phpfpm su -s /bin/bash www-data -c "wp core config --force"

if [[ "$MULTISITE" == Y* ]] || [[ "$MULTISITE" == y* ]]; then
  printf "${BLU}>>> Install multisite WordPress${NC}\n"
  docker-compose exec phpfpm su -s /bin/bash www-data -c "wp core multisite-install --prompt"
else
  printf "${BLU}>>> Install WordPress${NC}\n"
  docker-compose exec phpfpm su -s /bin/bash www-data -c "wp core install --prompt"
fi

# Adjust settings
printf "${BLU}>>> Adjusting permalink structure...${NC}\n"
docker-compose exec phpfpm su -s /bin/bash www-data -c "wp rewrite structure "/%postname%/""
docker-compose exec phpfpm su -s /bin/bash www-data -c "wp rewrite flush"

# Ask to generate an _s theme
echo "Do you want to generate an _s theme? [y/N]: \c"
read UNDERSCORES_THEME
if [[ "$UNDERSCORES_THEME" == Y* ]] || [[ "$UNDERSCORES_THEME" == y* ]]; then
  echo "Please set a theme slug: \c"
  read UNDERSCORES_THEME_SLUG
  if [ -z "$UNDERSCORES_THEME_SLUG" ]; then
    printf "${BLU}>>> Generating _s sample-theme...${NC}\n"
    docker-compose exec phpfpm su -s /bin/bash www-data -c "wp scaffold _s sample-theme --activate"
  else
    printf "${BLU}>>> Generating _s $UNDERSCORES_THEME_SLUG theme...${NC}\n"
    docker-compose exec phpfpm su -s /bin/bash www-data -c "wp scaffold _s '${UNDERSCORES_THEME_SLUG}' --prompt --activate"
  fi
else
  printf "${BLU}>>> Scaffolding _s theme skipped.${NC}\n"
fi

# Ask to install theme from url
echo "Do you want to install a custom theme? [Y/n]: \c"
read CUSTOM_THEME
if [[ "$CUSTOM_THEME" == Y* ]] || [[ "$CUSTOM_THEME" == y* ]] || [ -z "$CUSTOM_THEME" ]; then
  echo "Please enter the theme URL or local ZIP path: \c "
  read CUSTOM_THEME_URL
  echo "Please enter the theme slug: \c"
  read CUSTOM_THEME_SLUG
  # THEME RENAMING VARIABLES
  theme_text_domain="'${CUSTOM_THEME_SLUG}'"
  theme_functions="${CUSTOM_THEME_SLUG//-/_}_"
  theme_style_text_domain="Text Domain: ${CUSTOM_THEME_SLUG}"
  theme_doc_blocks=" ${CUSTOM_THEME_SLUG// /_}"
  theme_handle="${CUSTOM_THEME_SLUG}-"
  printf "${BLU}>>> Installing $CUSTOM_THEME_SLUG theme...${NC}\n"
  docker-compose exec phpfpm su -s /bin/bash www-data -c "wp theme install '${CUSTOM_THEME_URL}'"
  if [[ $CUSTOM_THEME_URL == *"fosterpress"* ]]; then
    printf "${BLU}>>> renaming fosterpress theme to $CUSTOM_THEME_SLUG...${NC}\n"
    sed -i "" "s/'fosterpress'/${theme_text_domain}/g" public/wp-content/themes/fosterpress/{,**}/*.php
    sed -i "" "s/fosterpress_/${theme_functions}/g" public/wp-content/themes/fosterpress/{,**}/*.php
    sed -i "" "s/Text Domain: fosterpress/${theme_style_text_domain}/g" public/wp-content/themes/fosterpress/style.css
    sed -i "" "s/ FosterPress/${theme_doc_blocks}/g" public/wp-content/themes/fosterpress/style.css
    sed -i "" "s/ FosterPress/${theme_doc_blocks}/g" public/wp-content/themes/fosterpress/{,**}/*.php
    sed -i "" "s/fosterpress-/${theme_handle}/g" public/wp-content/themes/fosterpress/{,**}/*.php
    mv public/wp-content/themes/fosterpress public/wp-content/themes/$CUSTOM_THEME_SLUG
    docker-compose exec phpfpm su -s /bin/bash www-data -c "wp theme activate '${CUSTOM_THEME_SLUG}'"
  fi
else
  printf "${BLU}>>> Custom theme installation skipped.${NC}\n"
fi

# Ask to remove default content
echo "Do you want to remove the default content? [Y/n]: \c"
read EMPTY_CONTENT
if [[ "$EMPTY_CONTENT" == Y* ]] || [[ "$EMPTY_CONTENT" == y* ]] || [ -z "$EMPTY_CONTENT" ]; then
  # Remove all posts, comments, and terms
  printf "${BLU}>>> Removing all posts, comments and terms...${NC}\n"
  docker-compose exec phpfpm su -s /bin/bash www-data -c "wp site empty --yes"

  # Remove plugins and themes
  printf "${BLU}>>> Removing all plugins and themes...${NC}\n"
  docker-compose exec phpfpm su -s /bin/bash www-data -c "wp plugin delete hello akismet"
  docker-compose exec phpfpm su -s /bin/bash www-data -c "wp theme delete twentyfifteen twentysixteen twentyseventeen"

  # Remove widgets
  printf "${BLU}>>> Removing widgets...${NC}\n"
  docker-compose exec phpfpm su -s /bin/bash www-data -c "wp widget delete search-2 recent-posts-2 recent-comments-2 archives-2 categories-2 meta-2"
fi

printf "${BRN}========== WordPress setup finished ==========${NC}\n"
printf "${BLU}Your website is available at: ${PRL}http://localhost${NC}\n"
printf "${BLU}To enable watch mode and start static assets compilation please first update${NC}\n"
printf "${BLU}the theme name on the paths inside ${PRL}nucleum.config.js${BLU} file${NC}\n"
printf "${BLU}and then run: ${PRL}yarn dev${NC}\n"
printf "${BRN}=============== Happy Coding! ================${NC}\n"
