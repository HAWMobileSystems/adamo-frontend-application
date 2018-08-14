import { Inherits } from 'inherits';
import {Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';

import {PaletteProvider} from '../palette/palette';
import {CustomPropertiesProvider} from '../properties/props-provider';
import {Http} from '@angular/http';

import {Observable, Subject} from 'rxjs';
import {ModelerComponent} from '../../ModelerComponent/modeler.component';

import {ApiService} from '../../services/api.service';

import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { resolve } from 'q';

const customPaletteModule = {
  paletteProvider: ['type', PaletteProvider]
};

const customPropertiesProviderModule = {
  __init__: ['propertiesProvider'],
  propertiesProvider: ['type', CustomPropertiesProvider]
};

export class Evaluator {
  private modeler: any = require('bpmn-js/lib/Modeler.js');
  private rootxml : string;
  private rootID : string;
  //private xmls : String[];
  private xmls : Map<string, string> = new Map<string, string>();
  private varValMap : any = {};

  private modelerComponent : ModelerComponent;
  private containerRef: string = '#js-canvas';
  private propsPanelRef: string = '#js-properties-panel';

  private propertiesPanelModule: any = require('bpmn-js-properties-panel');
  private propertiesProviderModule: any = require('bpmn-js-properties-panel/lib/provider/camunda');

  private extraPaletteEntries: any;
  private commandQueue: Subject<any>;
  private camundaModdleDescriptor: any = require('camunda-bpmn-moddle/resources/camunda.json');
  private apiService: ApiService;

  private lookup: any = {
    MODELING: 'modeling',
    ELEMENTREGISTRY: 'elementRegistry',
    SELECTION: 'selection',
    VALUES: 'values'
  };

  private ipimTags: any = {
    META: 'IPIM_meta_',
    VAL: 'IPIM_Val_',
    CALC: 'ipim_calc',
    SUBPROCESS: 'ipim_subprocess'
  };

  private createNewModeler() {
    this.modeler = new this.modeler({
      container: this.containerRef,
      propertiesPanel: {
        parent: this.propsPanelRef
      },
      additionalModules: [
        {extraPaletteEntries: ['type', () => this.extraPaletteEntries]},
        {commandQueue: ['type', () => this.commandQueue]},
        this.propertiesPanelModule,
        this.propertiesProviderModule,
        // customPropertiesProviderModule,
        customPaletteModule
      ],
      moddleExtensions: {
        camunda: this.camundaModdleDescriptor
      }
    });
  }

  constructor(rootID : string, rootXML : string, apiService : ApiService) {
    this.apiService = apiService;
    this.rootxml = rootXML;
    this.rootID = rootID;
    this.xmls.set(rootID, rootXML);
    this.createNewModeler();
    this.getAllSubmodels(rootXML);
  }

  public createZipDownload() {
    const zip = new JSZip();

    this.xmls.forEach((value: string, key: string) => {

    zip.file(key + '.bpmn', value);

    });

    zip.generateAsync({type: 'blob'}).then( (blob: Blob) => { // 1) generate the zip file
      FileSaver.saveAs(blob, this.rootID + '.zip');                          // 2) trigger the download
    }, (err) => {
      console.log('could not create zip');
    });

  }

  private async asyncForEach(array: string[], callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  public async getAllSubmodels(xml : string) {
    //Create Array for Subprocesses of current XML
    const currentSubprocesses: string[] = this.extractSubmodels(xml);
    //Iterate over all Subprocess and see if they were already retrieved from DB
    await this.asyncForEach(currentSubprocesses, async (element: string) => {
      //If the Subprocess has no Key, get XML from DB and add it
      if (!this.xmls.has(element)) {
        const tempXML = await this.getXMLFromDB(element);
        this.xmls.set(element, tempXML);
        //As we just added the XML, we recursively call the function to get all of its Subprocesses
        this.getAllSubmodels(tempXML);
      }
    });
    console.log(this.xmls);
  }

  public async getXMLFromDB(id : string): Promise<string> {
     return await this.apiService.getModelAsync(id).then( (value : string) => {return value; });
  }

  private async getDataFromDB(id: number): Promise<String> {
    const response = await fetch('http://localhost:3000/model/getmodel/' + id);
    const data = await response.json();
    return data;
  }

  public extractSubmodels(xml : string): string[] {
    this.modeler.importXML(xml);
    const elementRegistry = this.modeler.get(this.lookup.ELEMENTREGISTRY);
    const modeling = this.modeler.get(this.lookup.MODELING);
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const subprocesses: string[] = new Array();
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.type === 'bpmn:SubProcess') {
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get('values'); // this.lookup.values
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (extras[0].values[i].name.toLowerCase().startsWith(this.ipimTags.SUBPROCESS)) {
              if (subprocesses.indexOf(extras[0].values[i].value) === -1) {
                subprocesses.push(extras[0].values[i].value);
              }
            }
          }
        }
      }
    }
    return subprocesses;
  }

  private getCombinedTermList = () => {
    this.xmls.forEach((value: string, key: string) => {

      this.modeler.import(value);
      const elementRegistry = this.modeler.get(this.lookup.ELEMENTREGISTRY);
      const modeling = this.modeler.get(this.lookup.MODELING);
      //Alle Elemente der ElementRegistry holen
      const elements = elementRegistry.getAll();

      //Alle Elemente durchlaufen um Variablen zu finden
      // elements.forEach((element: any) => {
      for (const element of elements) {
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get('values');
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            const valueName = extras[0].values[i].name.toLowerCase();
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (valueName.startsWith('IPIM_Val_'.toLowerCase())) {
              //Variablen als Key mit Wert in Map übernehmen
              this.varValMap[valueName.replace('IPIM_Val_'.toLowerCase(), '')] = extras[0].values[i].value.toLowerCase();
            }
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (valueName.startsWith('IPIM_META_'.toLowerCase())) {
              //Variablen als Key mit Wert in Map übernehmen
              this.varValMap[valueName.replace('IPIM_META_'.toLowerCase(), '')] = extras[0].values[i].value.toLowerCase();
            }
          }
        }
      }
    });
  }

  private evaluateProcesses = () => {
    this.xmls.forEach((value: string, key: string) => {

      this.modeler.import(value);
      const elementRegistry = this.modeler.get(this.lookup.ELEMENTREGISTRY);
      const modeling = this.modeler.get(this.lookup.MODELING);
      //Alle Elemente der ElementRegistry holen
      const elements = elementRegistry.getAll();

      //Alle Elemente durchlaufen um Evaluationsterme auszuwerten
      for (const element of elements) {
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (typeof element.businessObject.extensionElements !== 'undefined') {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get('values');
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM entspricht
            if (extras[0].values[i].name.toLowerCase() === this.ipimTags.CALC) {
              //Stringoperationen um den Wert anzupassen.
              let evalterm = extras[0].values[i].value.toLowerCase();
              //Solange ein [ Zeichen vorkommt, String nach Variablen durchszuchen und ersetzen mit VarValMap einträgen
              while (evalterm.includes('[')) {
                // [ ist vorhanden, daher String nach Substrings durchsuchen
                const substr = evalterm.substring(evalterm.indexOf('[') + '['.length, evalterm.indexOf(']'));
                //evalterm mit String.replace veränderun und variablenwert einsetzen.
                evalterm = evalterm.replace('[' + substr + ']', this.varValMap[substr]);
              }
              //Sichere Eval Sandbox schaffen
              const safeEval = require('safe-eval');
              // Mittels Teufelsmagie(eval) prüfen ob der zugehörige Wert TRUE ist
              if (!eval(evalterm)) {
                //Element über modeling Objekt löschen
                modeling.removeElements([element]);
              }
            }
          }
        }
      }
    });
  }
}