rm -f Makefile
rm -rf ./frontend/www/assets
mkdir ./frontend/www/assets
chmod 777 ./frontend/www/assets
curl -u voyanga:rabotakipit -L http://voyanga.com/site/deploy/key/kasdjnfkn24r2wrn2efk > /dev/null
make