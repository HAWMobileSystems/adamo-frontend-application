# IPIM Modeler

Der Modeler wird im Rahmen des Teilprojekts "Intelligent kooperative Materialflussysteme" (IntSys) entwickelt. Das Teilprojekt stellt dabei einen Teil des EFRE (Europäischen Fonds für regionale Entwicklung) geförderten Projekt "Intelligente Produktionssysteme" dar. 

Ziel ist es durch Zugriff auf digitalisiertes Expertenwissen und einer (Teil-) Automatisierung von Routineaufgaben 
eine Entlastung für Logistikplaner herbeizuführen.
Dazu wurde die BPMN 2.0, zur Darstellung verschiedener Prozessvarianten erweitert. Diese können über Konfigurationsterme aus dem Gesamtmodell erzeugt werden. 


## Vorbedingungen 

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

nvm install 10
nvm use 10

# Darauf achten, dass die Daten mit /API/database.js übereinstimmen
docker run --name generic-postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres
docker exec -it generic-postgres bash.
psql -U postgres
CREATE DATABASE ipim;


```

Konfiguration zum Starten der Dienste
```
git clone https://github.com/HAWMobileSystems/adamo-frontend-application
git checkout modellierung2020

npm install

# unter angular2/src/app modelerconfig.service.ts
<enter url here> tauschen gegen die URL des Servers auf dem ADAMO laufen soll

npm run build

cd API
npm install

# unter API/express.js
<enter url here> tauschen gegen die URL des Servers auf dem ADAMO laufen soll

cd ..

touch /etc/nginx/sites-enabled/adamo
# copy content from adamo.nginx.conf


cp -r angular/dist/* /var/www/adamo
service nginx restart
# oder  sudo systemctl restart nginx

npm install -g pm2 

pm2 start API/mqttserver.js
pm2 start API/express.js

```


Achtung: 
```
User: admin@demo.com
Passwort: 12341234

```
## Abhängigkeiten:

https://github.com/bpmn-io/bpmn-js (https://bpmn.io/)

bpmn-js is a BPMN 2.0 diagram rendering toolkit and web modeler.

## Weiterer Entwicklungsverlauf

Die derzeitige Version im Ordner jQuery nutzt das bpmn-js Tool der Firma Camunda. 
Dieses wird mit jQuery erweitert.

Die weitere Entwicklung wird unter Einsatz aktuellerer Tools geschehen. 
