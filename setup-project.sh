#! /bin/
echo Installiere PM2 Global
npm install -g pm2

cp .env.example .env
cp .env.example .env.dev

echo Installiere Frontend
cd angular2
npm install

echo Baue Frontend
npm run build

cd ..

echo Installiere Backend
cd API
npm install 
 
echo Kopiere Artefakte an die richtigen Orte
cd ..
mv adamo.nginx.conf /etc/nginx/sites-enabled/adamo
cp -r angular/dist/* /var/www/adamo 
service nginx restart