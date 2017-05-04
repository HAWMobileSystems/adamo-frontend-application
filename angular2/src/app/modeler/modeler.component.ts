import { Component, OnInit } from '@angular/core';
import { Http } from "@angular/http";

import { PaletteProvider } from './palette/palette';
import { CustomPropertiesProvider } from './properties/props-provider';
import { BPMNStore, Link } from "../bpmn-store/bpmn-store.service";

const modeler = require("bpmn-js/lib/Modeler.js");
const propertiesPanelModule = require('bpmn-js-properties-panel');
const propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/bpmn');

import { CustomModdle } from './custom-moddle';
import { Observable, Subject } from "rxjs";
import { ChangeDetectorRef } from '@angular/core';

// this syntax is recommended because it allows webpack lazy loading
import * as $ from 'jquery';
// import * as _ from 'lodash';
const customPaletteModule = {
    paletteProvider: ['type', PaletteProvider]
};
const customPropertiesProviderModule = {
    __init__: ['propertiesProvider'],
    propertiesProvider: ['type', CustomPropertiesProvider]
};

const containerRef = '#js-canvas';
const propsPanelRef = '#js-properties-panel';

@Component({
    templateUrl: './modeler.component.html',
    styleUrls: ['./modeler.component.css'],
    providers: [BPMNStore]
})
export class ModelerComponent implements OnInit {
    modeler: any;
    lastDiagramXML: any;
    ipimColors: String[];
    url: string;
    _urls: Link[];
    extraPaletteEntries: any;
    commandQueue: Subject<any>;

    constructor(private http: Http, private store: BPMNStore, private ref: ChangeDetectorRef) {

        let termscolored = false;

        this.ipimColors = ['blue', 'red', 'green', 'aquamarine', 'royalblue', 'darkviolet', 'fuchsia', 'crimson'];

    }

    get urls(): Link[] {
        return this._urls;
    }

    set urls(u: Link[]) {
        console.log("urls: ", u);
        this._urls = u;
        this.url = u[0].href;
    }


    ngOnInit() {
        this.commandQueue = new Subject();
        this.commandQueue
            .subscribe(cmd => console.log('Received command: ', cmd));
        this.commandQueue
            .filter(cmd => 'extra' == cmd.action)
            .subscribe(cmd => console.log('Received SUPER SPECIAL EXTRA command: ', cmd));

        this.commandQueue
            .filter(cmd => 'two-column' == cmd.action)
            .do(cmd => {
                console.log('two columns', cmd)
                let palette = $('.djs-palette');
                palette.hasClass('two-column')
                    ? this.shrinkToOneColumn(palette)
                    : this.expandToTwoColumns(palette)
                this.ref.detectChanges
            })
            .subscribe(cmd => console.log('Received SUPER SPECIAL two-column command: ', cmd));
        // .do(cmd =>  console.log('two-column', cmd))

        this.commandQueue
            .filter(cmd => 'save' == cmd.action)
            .do(cmd => console.log('Received SUPER SPECIAL SAVE command: ', cmd))
            .subscribe(() => this.modeler.saveXML((err: any, xml: any) => console.log('xml!?!', err, xml)))
            ;


        this.store.listDiagrams()
            .do(links => this.urls = links)
            .do(() => console.log('Got links: ', this.urls))
            .flatMap(() => this.store.paletteEntries())
            .do(entries => this.extraPaletteEntries = entries)
            .do(() => console.log('Got entries: ', this.extraPaletteEntries))
            .subscribe(() => this.createModeler());

    }

    shrinkToOneColumn = (palette: JQuery) => {
        palette.removeClass('two-column');
        palette.find('.fa-square').removeClass('fa-square').addClass('fa-th-large')
    }

    expandToTwoColumns(palette: JQuery) {
        palette.addClass('two-column')
        palette.find('.fa-th-large').removeClass('fa-th-large').addClass('fa-square')
    }

    createModeler() {
        console.log('Creating modeler, injecting extraPaletteEntries: ', this.extraPaletteEntries);
        this.modeler = new modeler({
            container: containerRef,
            propertiesPanel: {
                parent: propsPanelRef
            },
            additionalModules: [
                { 'extraPaletteEntries': ['type', () => this.extraPaletteEntries] },
                { 'commandQueue': ['type', () => this.commandQueue] },
                propertiesPanelModule,
                propertiesProviderModule,
                customPropertiesProviderModule,
                customPaletteModule,
            ],
            moddleExtensions: {
                ne: CustomModdle
            },
        });

        // Start with an empty diagram:
        this.url = this.urls[0].href;
        this.loadBPMN();
    }

    loadBPMN() {
        console.log('load', this.url, this.store);
        var canvas = this.modeler.get('canvas');
        this.http.get(this.url)
            .map(response => response.text())
            .map(data => this.modeler.importXML(data, this.handleError))
            .subscribe(x => x ? this.handleError(x) : this.postLoad())
            ;
    }

    postLoad() {
        var canvas = this.modeler.get('canvas');
        canvas.zoom('fit-viewport');
    }

    handleError(err: any) {
        if (err) console.log('error rendering', err);
    }

    //ChangeMS
    //Diagramm auf letzten Stand laden
    resetDiagram() {
        if (this.lastDiagramXML == "") { window.alert("No Diagram loaded!"); };
        this.openDiagram(this.lastDiagramXML);
    }

    // //Palette zwischen 1 und 2 Spalten umschalten TODO: Prüfen wieso Notebook Timinger nicht geht
    //  resizePalette() {
    //     var Palette = modeler.get('palette');

    //     if (!Palette.isTwoColumns()) { Palette.setTwoColumn(); } else { Palette.setOneColumn(); };

    // }

    toggleTermsNormal() {
        let elementRegistry = this.modeler.get('elementRegistry');
        let modeling = this.modeler.get('modeling');
        //Alle Elemente der ElementRegistry holen
        var elements = elementRegistry.getAll();
        modeling.setColor(elements, {
            stroke: 'black' //,
            //fill: 'green'
        });
    }

    //ChangeMS 
    toggleTermsColored() {
        if (this.lastDiagramXML == "") { window.alert("No Diagram loaded!"); };
        // Daten zuweisen aus Input Boxen.
        //var A = document.getElementById("IPIMuserInputA").value;
        //var B = document.getElementById("IPIMuserInputB").value;
        //var C = document.getElementById("IPIMuserInputC").value;
        //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.  
        //var ipimcolors = $('.ipimcolors').css('color');    //CSS auslesen
        let elementRegistry = this.modeler.get('elementRegistry');
        let modeling = this.modeler.get('modeling');
        let terms = this.getTermList('elementRegistry');
        //Alle Elemente der ElementRegistry holen
        let elements = elementRegistry.getAll();

        // var colorelements: String[] = [];
        // for (var i = 0; i < this.ipimColors.length; i++) { 
        //     colorelements.push([]:String); 
        // }
        let colorelements = new Array(this.ipimColors.length).fill(new Array)

        for (let element of elements) {
            //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
            if (typeof element.businessObject.extensionElements !== 'undefined') {
                //Wenn vorhandne die Elemente auslesen
                var extras = element.businessObject.extensionElements.get('values');
                //Schleife über alle Elemente
                for (var i = 0; i < extras[0].values.length; i++) {
                    //Prüfen ob der Name des Elementes IPIM entspricht
                    if (extras[0].values[i].name == "IPIM_Calc") {
                        colorelements[terms.indexOf(extras[0].values[i].value) % this.ipimColors.length].push(element);
                        // var endEventNode = document.querySelector('[data-element-id="sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26"]');
                        // endEventNode.setAttribute('title', "HELPT!");
                        // var children = endEventNode.children;
                        // for (var i = 0; i < children.length; i++) {
                        // children[i].setAttribute('title', "HELPT!");

                        // }
                    }
                };
            }
            //console.timeEnd('someFunction');
        };
        for (var i = 0; i < this.ipimColors.length; i++) {
            if (colorelements[i].length > 0) {
                modeling.setColor(colorelements[i], {
                    stroke: this.ipimColors[i] //,
                    //fill: 'green'
                });
            }

        }
    }
    //ChangeMS Diagram wird geladen aus Datei
    // OpenFileDiagram() {
    //     if (window.File && window.FileReader && window.FileList && window.Blob) {

    //         var inpfiles = $("#files")[0].files;

    //         for (var i = 0; i < inpfiles.length; i++) {
    //             var fr = new FileReader();
    //             fr.onload = function (e) {
    //                 this.openDiagram(e.target.result);
    //                 this.lastDiagramXML = e.target.result;
    //             };
    //             fr.readAsText(inpfiles[i]);
    //         }



    //     } else {
    //         alert('The File APIs are not fully supported in this browser.');
    //     }
    // }

    //ChangeMS
    //Funktion um eine Zeile im Modal zu erzuegen
    insertInputField(pname: string, inpval: string, pform: string) {
        var inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", pname);
        inputField.setAttribute("value", inpval);
        inputField.setAttribute("id", "Input_IPIM_Val_".toLowerCase() + pname.toLowerCase());
        var br = document.createElement("br");
        var node = document.createTextNode("Variable " + pname + ":     ");
        document.getElementById(pform).appendChild(node);
        document.getElementById(pform).appendChild(document.createElement("br"));
        document.getElementById(pform).appendChild(inputField);
        //document.getElementById(pform).appendChild(br);
        document.getElementById(pform).appendChild(br);
    }

    insertVariableField(pname: string, inpval: string, pform: string, meta: boolean) {
        var inputField = document.createElement("input");
        inputField.setAttribute("type", "text");
        inputField.setAttribute("name", "textbox");
        inputField.setAttribute("value", pname);
        inputField.setAttribute("id", "Variable_IPIM_Val_".toLowerCase() + pname.toLowerCase());

        var valueField = document.createElement("input");
        valueField.setAttribute("type", "text");
        valueField.setAttribute("name", "valuebox");
        valueField.setAttribute("value", inpval);
        valueField.setAttribute("class", 'maxwid');
        valueField.setAttribute("id", "Variable_IPIM_Val_".toLowerCase() + pname.toLowerCase());

        var checkingbox = document.createElement("input");
        checkingbox.setAttribute("type", "checkbox");
        checkingbox.setAttribute("name", "checkbox");
        checkingbox.setAttribute("value", "Meta?");

        if (meta) { checkingbox.setAttribute("checked", meta.toString()); };
        checkingbox.setAttribute("id", "Variable_IPIM_".toLowerCase() + pname.toLowerCase());
        var br = document.createElement("br");
        var node = document.createTextNode("Variable:     ");
        document.getElementById(pform).appendChild(node);
        document.getElementById(pform).appendChild(inputField);
        document.getElementById(pform).appendChild(document.createTextNode("    Meta?:"));
        document.getElementById(pform).appendChild(checkingbox);
        document.getElementById(pform).appendChild(document.createElement("br"));
        document.getElementById(pform).appendChild(document.createTextNode("    Default:"));
        document.getElementById(pform).appendChild(valueField);
        //document.getElementById(pform).appendChild(br);
        document.getElementById(pform).appendChild(br);
        document.getElementById(pform).appendChild(document.createElement("hr"));
    }
    //CHANGEMS
    //Hier findet die Hauptarbeit statt
    //Erst werden die Variablen eingelesen, dann werden alle Objekte geprüft und ggf. entfernt wenn die Kriterien zutreffen.
    evaluatProcess() {
        if (this.lastDiagramXML == "") { window.alert("No Diagram loaded!"); };
        // Daten zuweisen aus Input Boxen.
        //var A = document.getElementById("IPIMuserInputA").value;
        //var B = document.getElementById("IPIMuserInputB").value;
        //var C = document.getElementById("IPIMuserInputC").value;

        //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.  
        var elementRegistry = this.modeler.get('elementRegistry');
        var modeling = this.modeler.get('modeling');
        this.modeler.saveXML({ format: true }, (err: any, xml: string) => {
            if (err) {
                console.error(err);
                return;
            }
            this.lastDiagramXML = xml;
        });

        //Alle Elemente der ElementRegistry holen
        var elements = elementRegistry.getAll();
        var VarValMap = {};

        //Alle Elemente durchlaufen um Variablen zu finden
        for (let element of elements) {
            //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
            if (typeof element.businessObject.extensionElements !== 'undefined') {
                //Wenn vorhandne die Elemente auslesen
                var extras = element.businessObject.extensionElements.get('values');
                //Schleife über alle Elemente
                for (var i = 0; i < extras[0].values.length; i++) {
                    //Prüfen ob der Name des Elementes IPIM_Val entspricht
                    if (extras[0].values[i].name.toLowerCase().startsWith("IPIM_Val_".toLowerCase())) {
                        //Variablen als Key mit Wert in Map übernehmen
                        VarValMap[extras[0].values[i].name.toLowerCase().replace("IPIM_Val_".toLowerCase(), "")] = extras[0].values[i].value.toLowerCase();
                    }
                    //Prüfen ob der Name des Elementes IPIM_Val entspricht
                    if (extras[0].values[i].name.toLowerCase().startsWith("IPIM_META_".toLowerCase())) {
                        //Variablen als Key mit Wert in Map übernehmen
                        VarValMap[extras[0].values[i].name.toLowerCase().replace("IPIM_META_".toLowerCase(), "")] = extras[0].values[i].value.toLowerCase();
                    }
                };
            }
        };

        //Alle Elemente durchlaufen um Evaluationsterme auszuwerten
        for (let element of elements) {
            //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
            if (typeof element.businessObject.extensionElements !== 'undefined') {
                //Wenn vorhandne die Elemente auslesen
                var extras = element.businessObject.extensionElements.get('values');
                //Schleife über alle Elemente
                for (var i = 0; i < extras[0].values.length; i++) {
                    //Prüfen ob der Name des Elementes IPIM entspricht
                    if (extras[0].values[i].name.toLowerCase() == "IPIM_Calc".toLowerCase()) {
                        //Stringoperationen um den Wert anzupassen.
                        var evalterm = extras[0].values[i].value.toLowerCase();
                        //Solange ein [ Zeichen vorkommt, String nach Variablen durchszuchen und ersetzen mit VarValMap einträgen
                        while (evalterm.includes("[")) {
                            // [ ist vorhanden, daher String nach Substrings durchsuchen
                            var substr = evalterm.substring(evalterm.indexOf("[") + "[".length, evalterm.indexOf("]"));
                            //evalterm mit String.replace veränderun und variablenwert einsetzen.
                            evalterm = evalterm.replace("[" + substr + "]", VarValMap[substr]);
                        }
                        // Mittels Teufelsmagie(eval) prüfen ob der zugehörige Wert TRUE ist
                        if (!eval(evalterm)) {
                            //Element über modeling Objekt löschen
                            modeling.removeElements([element]);
                        }
                    }
                };
            }
        };
    }

    //Hier wird das Modal von den vorherigen Eingaben befreit!
    ClearInputModal() {
        //Bereich zum löschen per getElement abfragen
        var inpNode = document.getElementById("inputfset");
        //Solange es noch ein firstChild gibt, wird dieses entfernt!
        while (inpNode.firstChild) {
            inpNode.removeChild(inpNode.firstChild);
        }
    }

    //Hier wird das Modal von den vorherigen Eingaben befreit!
    ClearVariableModal() {
        //Bereich zum löschen per getElement abfragen
        var inpNode = document.getElementById("variablefset");
        //Solange es noch ein firstChild gibt, wird dieses entfernt!
        while (inpNode.firstChild) {
            inpNode.removeChild(inpNode.firstChild);
        }
    }

    // ChangeMS Terme der Selectierten Modals werdern ausgelesen
    FillTermModal() {
        var terms = this.getTermList('selection');
        if (terms.length > 1) { window.alert("Attention selected Elements already have different Terms!") };
        if (terms.length > 0) { (<HTMLInputElement>document.getElementById('inputFieldTerm')).value = terms[0]; }
        else { (<HTMLInputElement>document.getElementById('inputFieldTerm')).value = "" };
    }

    getTermList(scope: string) {
        //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.  
        if (scope == 'selection') { var elements = this.modeler.get(scope).get(); }
        else { var elements = this.modeler.get(scope).getAll(); }
        let terms: any = [];
        //Alle Elemente durchlaufen um Variablen zu finden
        for (let element of elements) {
            //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
            if (typeof element.businessObject.extensionElements !== 'undefined') {
                //Wenn vorhandne die Elemente auslesen
                var extras = element.businessObject.extensionElements.get('values');
                //Schleife über alle Elemente
                for (var i = 0; i < extras[0].values.length; i++) {
                    //Prüfen ob der Name des Elementes IPIM_Val entspricht
                    if (extras[0].values[i].name.toLowerCase().startsWith("IPIM_Calc".toLowerCase())) {

                        if (-1 == terms.indexOf(extras[0].values[i].value)) {
                            terms.push(extras[0].values[i].value);
                        }
                    }
                };
            }
        };
        return terms;
    }

    // ChangeMS Term wird in Selectierte Elemente zurückgeschreiben
    writeTermModalValues(termscolored: any) {
        var moddle = this.modeler.get('moddle');
        //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.  
        var elements = this.modeler.get('selection').get();

        //Alle Elemente durchlaufen um Variablen zu finden
        for (let element of elements) {
            //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
            if (typeof element.businessObject.extensionElements !== 'undefined') {
                //Wenn vorhandne die Elemente auslesen
                var extras = element.businessObject.extensionElements.get('values');
                //Schleife über alle Elemente
                for (var i = 0; i < extras[0].values.length; i++) {
                    //Prüfen ob der Name des Elementes IPIM_Calc entspricht
                    if (extras[0].values[i].name.toLowerCase().startsWith("IPIM_Calc".toLowerCase())) {

                        if ((<HTMLInputElement>document.getElementById('inputFieldTerm')).value != "") {
                            extras[0].values[i].value = (<HTMLInputElement>document.getElementById('inputFieldTerm')).value;
                        } else { extras[0].values.splice(i, 1); }

                        break;


                    }
                };
            } else {

                if ((<HTMLInputElement>document.getElementById('inputFieldTerm')).value != "") {
                    element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
                    var extras = element.businessObject.extensionElements.get('values');
                    extras.push(moddle.create('camunda:Properties'));
                    extras[0].values = [];
                    extras[0].values.push(moddle.create('camunda:Property'));
                    extras[0].values[0].name = "IPIM_Calc";
                    extras[0].values[0].value = (<HTMLInputElement>document.getElementById('inputFieldTerm')).value;
                }
            }
        };
        if (termscolored) { this.toggleTermsColored(); } else { this.toggleTermsNormal(); }
    }

    // ChangeMS Variablen werden in Element geschrieben
    writeVariableModalValues() {
        //get moddle Object
        var elementRegistry = this.modeler.get('elementRegistry');
        var moddle = this.modeler.get('moddle');

        //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.  
        var elements = elementRegistry.getAll();
        var element = elements[0];
        //reset camunda extension properties
        element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
        var extras = element.businessObject.extensionElements.get('values');
        extras.push(moddle.create('camunda:Properties'));
        extras[0].values = [];

        //Alle Elemente des Eingabefeldes durchlaufen um Variablen zu finden und dem Root Element hinzuzufügen
        //var fieldset= document.getElementById('variablefset');
        var fields = document.getElementsByName("textbox");
        var checkboxes = document.getElementsByName("checkbox");
        var valueboxes = document.getElementsByName("valuebox");
        for (var fieldi = 0; fieldi < fields.length; fieldi++) {

            if ((<HTMLInputElement>fields[fieldi]).value != "") {

                extras[0].values.push(moddle.create('camunda:Property'));
                if (!(<HTMLInputElement>checkboxes[fieldi]).checked) { extras[0].values[fieldi].name = "IPIM_Val_" + (<HTMLInputElement>fields[fieldi]).value.trim(); }
                else { extras[0].values[fieldi].name = "IPIM_META_" + (<HTMLInputElement>fields[fieldi]).value.trim(); };

                if ((<HTMLInputElement>valueboxes[fieldi]).value != "") { extras[0].values[fieldi].value = (<HTMLInputElement>valueboxes[fieldi]).value.trim(); }
                else { extras[0].values[fieldi].value = " "; }
            }
        }
    }

    // ChangeMS Hier werden die Eingabefelder für Werte dynamisch erzeugt
    FillInputModal() {
        //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.  
        var elementRegistry = this.modeler.get('elementRegistry');
        var modeling = this.modeler.get('modeling');

        //Alle Elemente der ElementRegistry holen
        var elements = elementRegistry.getAll();

        //Alle Elemente durchlaufen um Variablen zu finden
        for (let element of elements) {
            //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
            if (typeof element.businessObject.extensionElements !== 'undefined') {
                //Wenn vorhandne die Elemente auslesen
                var extras = element.businessObject.extensionElements.get('values');
                //Schleife über alle Elemente
                for (var i = 0; i < extras[0].values.length; i++) {
                    //Prüfen ob der Name des Elementes IPIM_Val entspricht
                    if (extras[0].values[i].name.toLowerCase().startsWith("IPIM_Val_".toLowerCase())) {

                        this.insertInputField(extras[0].values[i].name.toLowerCase().replace("IPIM_Val_".toLowerCase(), ""), extras[0].values[i].value.toLowerCase(), 'inputfset')
                        //Variablen als Key mit Wert in Map übernehmen
                        //VarValMap[extras[0].values[i].name.toLowerCase().replace("IPIM_Val_".toLowerCase(),"")] = extras[0].values[i].value.toLowerCase(); 
                    }
                };
            }
        };
    }

    // ChangeMS Hier werden die Eingabefelder für Werte dynamisch erzeugt
    FillVariableModal() {
        //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.  
        var elementRegistry = this.modeler.get('elementRegistry');
        var modeling = this.modeler.get('modeling');

        //Alle Elemente der ElementRegistry holen
        var elements = elementRegistry.getAll();
        var element = elements[0];
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (typeof element.businessObject.extensionElements !== 'undefined') {
            //Wenn vorhandne die Elemente auslesen
            var extras = element.businessObject.extensionElements.get('values');
            //Schleife über alle Elemente
            for (var i = 0; i < extras[0].values.length; i++) {
                //Prüfen ob der Name des Elementes IPIM_Val entspricht
                if (extras[0].values[i].name.toLowerCase().startsWith("IPIM_Val_".toLowerCase())) {
                    this.insertVariableField(extras[0].values[i].name.toLowerCase().replace("IPIM_Val_".toLowerCase(), ""), extras[0].values[i].value.toLowerCase(), 'variablefset', false)
                    //Variablen als Key mit Wert in Map übernehmen
                    //VarValMap[extras[0].values[i].name.toLowerCase().replace("IPIM_Val_".toLowerCase(),"")] = extras[0].values[i].value.toLowerCase(); 
                }
                if (extras[0].values[i].name.toLowerCase().startsWith("IPIM_META_".toLowerCase())) {
                    this.insertVariableField(extras[0].values[i].name.toLowerCase().replace("IPIM_META_".toLowerCase(), ""), extras[0].values[i].value.toLowerCase(), 'variablefset', true)
                    //Variablen als Key mit Wert in Map übernehmen
                    //VarValMap[extras[0].values[i].name.toLowerCase().replace("IPIM_Val_".toLowerCase(),"")] = extras[0].values[i].value.toLowerCase(); 
                }
            };
        }
    }

    // ChangeMS Hier werden die Eingabefelder in die Properties zurückgeschreiben
    writeInputModalValues() {
        //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.  
        var elementRegistry = this.modeler.get('elementRegistry');
        var modeling = this.modeler.get('modeling');

        //Alle Elemente der ElementRegistry holen
        var elements = elementRegistry.getAll();

        //Alle Elemente durchlaufen um Variablen zu finden
        for (let element of elements) {
            //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
            if (typeof element.businessObject.extensionElements !== 'undefined') {
                //Wenn vorhandne die Elemente auslesen
                var extras = element.businessObject.extensionElements.get('values');
                //Schleife über alle Elemente
                for (var i = 0; i < extras[0].values.length; i++) {
                    //Prüfen ob der Name des Elementes IPIM_Val entspricht
                    if (extras[0].values[i].name.toLowerCase().startsWith("IPIM_Val_".toLowerCase())) {
                        var inpelement = "Input_" + extras[0].values[i].name;
                        //Variablen aus Inputfeld zurückschreiben
                        extras[0].values[i].value = (<HTMLInputElement>document.getElementById(inpelement.toLowerCase())).value;
                    }
                };
            }
        };
    }

    createNewDiagram() {
        let newDiagramXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\" id=\"sample-diagram\" targetNamespace=\"http://bpmn.io/schema/bpmn\">\n  <bpmn2:process id=\"Process_1\" isExecutable=\"false\">\n    <bpmn2:startEvent id=\"StartEvent_1\"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\">\n      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">\n        <dc:Bounds height=\"36.0\" width=\"36.0\" x=\"412.0\" y=\"240.0\"/>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>";
        this.openDiagram(newDiagramXML);
    }

    openDiagram(xml: String) {
        this.lastDiagramXML = xml;

        this.modeler.importXML(xml, (err: any) => {
            let container = $('.container')
            if (err) {
                container
                    .removeClass('with-diagram')
                    .addClass('with-error');

                container.find('.error pre').text(err.message);
                console.error(err);
            } else {
                container
                    .removeClass('with-error')
                    .addClass('with-diagram');
            }
        });
    }

    //      saveSVG(done) {
    //   bpmnModeler.saveSVG(done);
    // }

    //  saveDiagram(done) {

    //   bpmnModeler.saveXML({ format: true }, function(err, xml) {
    //     done(err, xml);
    //   });
// }

//Schließt das Modal zur Termeingabe und uebernimmt diese
//   $('#SetTermModal').click(function(){
// 	  // Get the modal
//       var modal = document.getElementById('TermModal');
//       modal.style.display = "none";
// 	  writeTermModalValues();
//    });
   
//   //Schließt das Modal zur Termeingabe und uebernimmt diese
//   $('#ToggleMenu').click(function(){
// 	  resizePalette();
//    });
   
//   //Schließt das Modal zur Termeingabe 
//   $('#TermClose').click(function(){
// 	  // Get the modal
//       var modal = document.getElementById('TermModal');
//       modal.style.display = "none";
//    });
   
   
   
//   //Oeffnet das Modal zur Termeingabe
//   $('#IPIMButtonTermSet').click(function(){
//       if (lastDiagramXML == "") { window.alert("No Diagram loaded!");return;};
//       // Get the modal
//       var modal = document.getElementById('TermModal');
//       modal.style.display = "block";
// 	  document.getElementById('inputFieldTerm').value= "";
// 	  FillTermModal();
//    });

//    //Schließt das Modal zur Werteingabe und startet Evaluation
//   $('#EvalModal').click(function(){
// 	  // Get the modal
//       var modal = document.getElementById('InputModal');
//       modal.style.display = "none";
// 	  writeInputModalValues();
// 	  evaluatProcess();
//    });
   
   
//    //Schließt das Modal zur Termeingabe 
//   $('#VariableClose').click(function(){
// 	  // Get the modal
//       var modal = document.getElementById('VariableModal');
//       modal.style.display = "none";
//    });
   
//      //Oeffnet das Modal zur Variableneingabe
//   $('#IPIMButtonVariableSet').click(function(){
//       if (lastDiagramXML == "") { window.alert("No Diagram loaded!");return;};
//       // Get the modal
//       var modal = document.getElementById('VariableModal');
//       modal.style.display = "block";
// 	  ClearVariableModal();
// 	  FillVariableModal();
//    });

//    //Schließt das Modal zur Variableneingabe
//   $('#VariableModalButton').click(function(){
// 	  // Get the modal
//       var modal = document.getElementById('VariableModal');
//       modal.style.display = "none";
// 	  writeVariableModalValues();
//    });
   
//    // Schließt das Modal zur Werteingabe
//   $('#EvalClose').click(function(){
// 	  // Get the modal
//       var modal = document.getElementById('InputModal');
//       modal.style.display = "none";
//    });
   
//    $('#IPIMButtonAddVariable').click(function(){
//        insertVariableField("newField","NewVariable",'variablefset')
//     });
   
   
//   //Oeffnet das Modal zur Werteingabe und fuegt Inhalt dynamisch hinzu
//   $('#IPIMButtonEval2').click(function(){
//       if (lastDiagramXML == "") { window.alert("No Diagram loaded!");return;};
//       // Get the modal
//       var modal = document.getElementById('InputModal');
//       modal.style.display = "block";
// 	  ClearInputModal();
// 	  FillInputModal();
//    });
	
//   //Führt die Evaluation aus --- depricated	
//   $('#IPIMButtonEval').click(function(){
//        evaluatProcess();
//     });
	
//   //Toogled die Farbmarkierung für Elemente die einen Term haben
//   $('#IPIMShowTerms').click(function(){
//        if (termscolored == false){   toggleTermsColored();}
// 	   else {toggleTermsNormal();}
// 	   termscolored = !termscolored;
//     });
	
//   //Setzt Diagramm auf letzten geladenen Zustand zurück
//   $('#IPIMButtonReset').click(function(){
//        resetDiagram();
//     });
	
//   //Ruft den Dialog zum öffnene einer Datei auf
//   $("#files").change(function() { 
// 		OpenFileDiagram(); 
// 	});	

//   //Zwischenevent um von HTML Button auf FileOpen weiterzuleiten
//   $('#OpenFile').click(function(){
// 	   //Zurücksetzten des HTML File Values, da Ereignis sonst nicht ausgelöst wird
// 	   document.getElementById('files').value = "";
//        document.getElementById('files').click();
//     });

// 	//CHANGEMS --- Upload Button freischalten
//   $('#IPIM-Load').addClass('active').attr({
//         'href': 'data:application/bpmn20-xml;charset=UTF-8,',
//         'download': 'Openfile'
//       });

//   $('#IPIM-Load').addClass('IPIM').attr({
//         'href': 'data:application/bpmn20-xml;charset=UTF-8,',
//         'download': 'Openfile'
//       });
	  
//    $('#IPIM-Load').click(function(){
// 	  //Zurücksetzten des HTML File Values, da Ereignis sonst nicht ausgelöst wird
// 	   document.getElementById('files').value = "";
//        document.getElementById('files').click();
//     });
	
	
// //ChangeMS .... alles bis hierher IPIM
	
//   $('#js-create-diagram').click(function(e) {
//     e.stopPropagation();
//     e.preventDefault();

//     createNewDiagram();
//   });

// //   var downloadLink = $('#js-download-diagram');
// //   var downloadSvgLink = $('#js-download-svg');
  
  

//   $('.buttons a').click(function(e) {
//     if (!$(this).is('.active')) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
// 	//CHANGEMS Hier eingefügt damit Standard buttons a Event nicht feuert!
// 	if ($(this).is('.IPIM')) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
// 	//CHANGEMS Ende
//   });

}

