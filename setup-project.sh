#! /bin/
sudo apt-get install python nginx
sudo apt-get install libtool pkg-config build-essential autoconf automake
sudo apt-get install libzmq-dev

echo Installiere globale npm dependencies
npm install -g node-gyp
npm install -g pm2

#cp .env.example .env
#sed 's/localhost/ipim.lab.if.haw-landshut.de/g' ./API/database.js
#sed 's/<enter URL here>/ipim.lab.if.haw-landshut.de/g' ./API/database.js

# hier neue URL setzen!

sed 's/localhost/ipim.lab.if.haw-landshut.de/g' ./API/database.js
sed 's/<enter URL here>/ipim.lab.if.haw-landshut.de/g' ./API/express.js
sed 's/<enter URL here>/ipim.lab.if.haw-landshut.de/g' ./angular2/src/modelerConfig.service.ts
sed 's/<enter URL here>/ipim.lab.if.haw-landshut.de/g' ./angular2/config/webpack.dev.js


# hier neue URL setzen!
# Bitte <enter URL here> stehen lassen, weil Suchterm!

sed 's/localhost/<!!!enter new URL!!!>/g' ./API/database.js
sed 's/<enter URL here>/<!!!enter new URL!!!>/g' ./API/express.js
sed 's/<enter URL here>/<!!!enter new URL!!!>/g' ./angular2/src/modelerConfig.service.ts
sed 's/<enter URL here>/<!!!enter new URL!!!>/g' ./angular2/config/webpack.dev.js

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