// import { Inherits } from 'inherits';
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
import { Variable } from '../modals/variable';
import { ModelElement} from './modelElement';
import { Model } from '../../models/model';
import { SnackBarService } from '../../services/snackbar.service';

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
  private xmls : ModelElement[] = [];
  private variables: Variable[] = [];

  private modelerComponent : ModelerComponent;
  private containerRef: string = '#js-canvas';
  private propsPanelRef: string = '#js-properties-panel';

  private propertiesPanelModule: any = require('bpmn-js-properties-panel');
  private propertiesProviderModule: any = require('bpmn-js-properties-panel/lib/provider/camunda');

  private extraPaletteEntries: any;
  private commandQueue: Subject<any>;
  private camundaModdleDescriptor: any = require('camunda-bpmn-moddle/resources/camunda.json');
  private apiService: ApiService;
  private root: any;
  private zipArray: ModelElement[] = [];

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

  //Creates a new hidden modeler for the evaluation process!
  private createNewModeler() {
    this.modeler = new this.modeler({
      container: '#evaluatorCanvas',  //place the modeler in a special predefined hidden div in html
      propertiesPanel: {
        parent: this.propsPanelRef
      },
      additionalModules: [
        {extraPaletteEntries: ['type', () => this.extraPaletteEntries]},
        {commandQueue: ['type', () => this.commandQueue]},
        //this.propertiesPanelModule,
        this.propertiesProviderModule,
        // customPropertiesProviderModule,
        customPaletteModule
      ],
      moddleExtensions: {
        camunda: this.camundaModdleDescriptor
      }
    });
  }

  constructor(id: string, xml: string, apiService : ApiService, root: any) {
    this.apiService = apiService;
    this.rootxml = xml;
    this.rootID = id;
    this.root = root;
    this.zipArray = [];
    this.xmls = [];
    this.xmls.push(new ModelElement(root.model.name, id, xml));
    //Show Overlay to signal the user that the process is running
    this.root.showOverlay();
    //create a new Modeler for evaluation
    this.createNewModeler();
    //special function call to manage the async process
    this.executeAsyncEvaluation(xml);
  }

  public async executeAsyncEvaluation(xml: string) {
    //first get all submodels used by the process or any subprocess and wait until the last request is finished
    await this.getAllSubmodels(xml);
    //after all models are received, extract all terms from it
    await this.getCombinedTermList(this.xmls);
  }

  //Takes all files evaluated and prepares them for a zip download
  public createZipDownload() {
    const zip = new JSZip();

    this.zipArray.forEach((element: ModelElement) => {

    zip.file(element.name + '.bpmn', element.xml);

    });

    zip.generateAsync({type: 'blob'}).then( (blob: Blob) => { // 1) generate the zip file
      FileSaver.saveAs(blob, this.root.model.name + '.zip');  // 2) trigger the download
    }, (err) => {
     this.root.snackbarService.error(err);
    });

  }

  //Central function for evluation ... works through an array but waits for the prior element to finish its callback!
  private async asyncForEach(array: any[], callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  //recursive function that retrievs all subprocesses in a diagram and calls itself again for all new diagramms
  public async getAllSubmodels(xml : string) {
    //Create Array for Subprocesses of current XML
    const currentSubprocesses: string[] = await this.extractSubmodels(xml);
    //Iterate over all Subprocess and see if they were already retrieved from DB
    await this.asyncForEach(currentSubprocesses, async (element: string) => {
        //If the Subprocess has no Key, get XML from DB and add it
        if (this.xmls.some(e => e.id === element)) {
          //We already have it so do nothing!
        } else {
          const tempModelElement = await this.getXMLFromDB(element);
          if (tempModelElement.id !== '') {
            this.xmls.push(tempModelElement);
            //As we just added the XML, we recursively call the function to get all of its Subprocesses
            await this.getAllSubmodels(tempModelElement.xml);
          } else {
            this.root.snackbarService.newSnackBarMessage('Error: Some Subprocesses returned permission denied ', 'red');
          }
        }
    });
  }

  //get the model form the database but wait for it to finish
  public async getXMLFromDB(id : string): Promise<ModelElement> {
     return await this.apiService.getModelAsync(id).then( (value : ModelElement) => {return value; });
  }

  //import a file form the modeler but wait for the function to finish
  public async importFromXML(xml: string): Promise<void> {
    return new Promise<void>( resolve => {
      this.modeler.importXML(xml, (err: any) => {
        resolve();
      });
    });
  }

  //export the xml string form the modeler but wait for it to finish!
  public async exportFromModeler(): Promise<string> {
    return new Promise<string>( resolve => {
      this.modeler.saveXML({format: true}, (err: any, xml: any) => {
        resolve(xml);
      });
    });
  }

  //takes an xml string and tries to find any referenced subprocesses, return them as string array with respective ids
  public async extractSubmodels(xml : string): Promise<string[]> {

    await this.importFromXML(xml);

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

  //walks through an array of xml documents and extracts any variable that is unique, returns them as an array of ModelElement
  public async getCombinedTermList(xmlList: ModelElement[]): Promise<void> {

    this.variables = [];

    await this.asyncForEach(xmlList, async (element: ModelElement) => {

      await this.importFromXML(element.xml);
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
              this.addVar(valueName.replace('IPIM_Val_'.toLowerCase(), ''), extras[0].values[i].value.toLowerCase(), false);
            }
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (valueName.startsWith('IPIM_META_'.toLowerCase())) {
              //Variablen als Key mit Wert in Map übernehmen
              this.addVar(valueName.replace('IPIM_META_'.toLowerCase(), ''), extras[0].values[i].value.toLowerCase(), true);
            }
          }
        }
      }
    });
    //remove Overlay we are ready
    this.root.hideOverlay();
    //prepare modal to edit variables and show it
    this.root.evaluatorModal.setProps(this.modeler, this.root, this.variables);
    this.root.evaluatorModal.modal.open();
  }

  //adds a Variable to the array ... but only if it is unique
  public addVar(name: string, value: string, meta: boolean): void {
    if (this.variables.some(e => e.name === name)) {
      //We already have it so do nothing!
    } else {
      //We do not have it so push it!
    this.variables.push(new Variable(name, value, meta));
    }
  }

  //starts after user finishes variable input, evaluates all models
  public async evaluateProcesses(variables: Variable[]): Promise<void> {

    const varValMap = {};

    variables.forEach(element => {
      varValMap[element.name.toLowerCase()] = element.value.toLowerCase();
    });

    await this.asyncForEach(this.xmls, async (element: ModelElement) => {

      await this.importFromXML(element.xml);
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
                evalterm = evalterm.replace('[' + substr + ']', varValMap[substr]);
              }
              //Sichere Eval Sandbox schaffen
              // const safeEval = require('safe-eval');
              // import Interpreter from 'js-interpreter';
              const jSInterpreter = require('js-interpreter');
              const interpreter = new jSInterpreter(evalterm);

              interpreter.run();
              // Mittels Teufelsmagie(eval) prüfen ob der zugehörige Wert TRUE ist
              const evalResult : boolean = interpreter.value.data;
              console.log('using js-interpreter for: ', evalterm, 'Result: ', evalResult);
              if (!evalResult) {
              // Mittels Teufelsmagie(eval) prüfen ob der zugehörige Wert TRUE ist
                //Element über modeling Objekt löschen
                modeling.removeElements([element]);
              }
            }
          }
        }
      }
      //model is evaluated, push it zip file
      this.zipArray.push(new ModelElement(element.name, element.id, await this.exportFromModeler() ));
    });
    //all models finished, create zip and remove overlay
    this.createZipDownload();
    this.root.hideOverlay();
  }

}