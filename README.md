# IPIM Modeler

Der Modeler wird im Rahmen des Teilprojekts "Intelligent kooperative Materialflussysteme" (IntSys) entwickelt. Das Teilprojekt stellt dabei einen Teil des EFRE (Europäischen Fonds für regionale Entwicklung) geförderten Projekt "Intelligente Produktionssysteme" dar. 

Ziel ist es durch Zugriff auf digitalisiertes Expertenwissen und einer (Teil-) Automatisierung von Routineaufgaben 
eine Entlastung für Logistikplaner herbeizuführen.
Dazu wurde die BPMN 2.0, zur Darstellung verschiedener Prozessvarianten erweitert. Diese können über Konfigurationsterme aus dem Gesamtmodell erzeugt werden. 



## Einfacher Start

Fürs einfache loslegen kann derzeit docker-compose genutzt werden. 
Dazu muss jedoch vorher eine Version des Frontends gebaut werden. Da der /dist Ordner direkt in das Image geschoben wird um Speicherplatz zu sparen
```
cd angular2
npm run build
cd ..
docker-compose build 
docker-compose up 
```
Derzeit wird dabei noch eine leere Datenbank erzeugt (diese kann über pgadmin initialisiert werden - username und passwort sind in der .env zu finden)

Achtung: 
```
mv .env.exampe .env 
vi .env // nach belieben anpassen
```

Als bisherige Entwicklungsumgebung diente Visual-Studio-Code, allerdings kann auch problemlos Webstorm genutzt werden. 

## TODO

Nachdem inzwischen Varianten modelliert und extrahiert werden können: 

    - Variante auf Workflow-Engine deployen
    - Beispiel-Implementierung eines Prozesses auf Basis des konfigurierbaren Prozessmodells ausführen

## Abhängigkeiten:

https://github.com/bpmn-io/bpmn-js (https://bpmn.io/)

bpmn-js is a BPMN 2.0 diagram rendering toolkit and web modeler.

## Weiterer Entwicklungsverlauf

Die derzeitige Version im Ordner jQuery nutzt das bpmn-js Tool der Firma Camunda. 
Dieses wird mit jQuery erweitert.

Die weitere Entwicklung wird unter Einsatz aktuellerer Tools geschehen. 
Eine Idee ist die Nutzung von TypeScript in Kombination mit React, um typsicheren Javascript Code zu schreiben und diesen in Komponenten zu gliedern.