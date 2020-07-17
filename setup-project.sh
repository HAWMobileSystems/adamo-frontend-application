#! /bin/
sudo apt-get install python nginx
sudo apt-get install libtool pkg-config build-essential autoconf automake
sudo apt-get install libzmq-dev

echo Installiere globale npm dependencies
npm install -g node-gyp
npm install -g pm2

#cp .env.example .env
#cp .env.example .env.dev

echo Installiere Frontend
cd angular2
npm install --silent

echo Baue Frontend
npm run build

cd ..

echo Installiere Backend
cd API
npm install --silent
 
echo Kopiere Artefakte an die richtigen Orte
cd ..
sudo cp adamo.nginx.conf /etc/nginx/sites-enabled/adamo
sudo cp -r angular/dist/* /var/www/adamo 
sudo service nginx restart