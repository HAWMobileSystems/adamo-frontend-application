
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Http } from '@angular/http';

import { PaletteProvider } from './palette/palette';
import { CustomPropertiesProvider } from './properties/props-provider';
import { BPMNStore, Link } from '../bpmn-store/bpmn-store.service';
import { CustomModdle } from './custom-moddle';
import { CamundaModdle } from './camunda-moddle';
import { Observable, Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { FileReaderEvent } from './interfaces';

import { COMMANDS } from './../bpmn-store/commandstore.service';
const customPaletteModule = {
  paletteProvider: ['type', PaletteProvider]
};
const customPropertiesProviderModule = {
  __init__: ['propertiesProvider'],
  propertiesProvider: ['type', CustomPropertiesProvider]
};

@Component({
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.css'],
  providers: [BPMNStore]
})
export class ModelerComponent implements OnInit {
  private modeler: any = require('bpmn-js/lib/Modeler.js');
  private propertiesPanelModule = require('bpmn-js-properties-panel');
  private propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');
  private termsColored: boolean = false;
  private ipimColors: string[] = ['blue', 'red', 'green', 'aquamarine', 'royalblue', 'darkviolet', 'fuchsia', 'crimson']
  private lastDiagramXML: string = '';
  private url: string;
  private _urls: Link[];
  private extraPaletteEntries: any;
  private commandQueue: Subject<any>;
  private container: JQuery; // = '#js-drop-zone';
  private containerRef: string = '#js-canvas';
  private propsPanelRef: string = '#js-properties-panel';
  private newDiagramXML: string = '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n  <bpmn2:process id="Process_1" isExecutable="false">\n    <bpmn2:startEvent id="StartEvent_1"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>';
  private camundaModdleDescriptor: any = require('camunda-bpmn-moddle/resources/camunda.json');
  @ViewChild('variableModal')
  private variableModal: ModalComponent;
  @ViewChild('inputModal')
  private inputModal: ModalComponent;
  @ViewChild('termModal')
  private termModal: ModalComponent;
  private ipimTags: any = {
    META: 'IPIM_meta_',
    VAL: 'IPIM_Val_',
    CALC: 'ipim_calc'
  };

  private lookup: any = {
    MODELING: 'modeling',
    ELEMENTREGISTRY: 'elementRegistry',
    SELECTION: 'selection'
  };

  constructor(private http: Http, private store: BPMNStore, private ref: ChangeDetectorRef) { }

  get urls(): Link[] {
    return this._urls;
  }

  set urls(u: Link[]) {
    console.log('urls: ', u);
    this._urls = u;
    this.url = u[0].href;
  }

  // Extract the following to the separate controler
  public openTermModal = () => {
    this.fillTermModal();
    this.termModal.open();
  }

  public openInputModal = () => {
    this.fillInputModal();
    this.inputModal.open();
  }
  public openVariableModal = () => {
    this.fillVariableModal();
    this.variableModal.open();
  }

  public closeTermController = () => {
    this.termModal.close();
  }
  private expandToTwoColumns = (palette: JQuery) => {
    palette.addClass('two-column');
    palette.find('.fa-th-large').removeClass('fa-th-large').addClass('fa-square');
  }
  private shrinkToOneColumn = (palette: JQuery) => {
    palette.removeClass('two-column');
    palette.find('.fa-square').removeClass('fa-square').addClass('fa-th-large');
  }

  private handleTwoColumnToggleClick = () => {
    const palette = $('.djs-palette');
    palette.hasClass('two-column')
      ? this.shrinkToOneColumn(palette)
      : this.expandToTwoColumns(palette);
  }

  private highlightTerms = () => {
    if (this.lastDiagramXML !== '') {
      const elementRegistry = this.modeler.get('elementRegistry');
      const modeling = this.modeler.get('modeling');
      this.termsColored
        ? this.toggleTermsNormal(elementRegistry, modeling)
        : this.toggleTermsColored(elementRegistry, modeling);
      this.termsColored = !this.termsColored;
    } else {
      console.error('There is no Diagram to highlight');
    }
  }

  private resetDiagram = () => {
    if (this.lastDiagramXML === '') { window.alert('No Diagram loaded!'); };
    this.openDiagram(this.lastDiagramXML);
  }
  private saveDiagram = () => {
    console.log('savediagram')
    const downloadLink = $('#js-download-diagram');
    this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
      console.log('xml:', xml, 'err', err);
      setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
    });

    function setEncoded(link: any, name: any, data: any) {
      const encodedData = encodeURIComponent(data);

      if (data) {
        link.addClass('active').attr({
          href: 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
          download: name
        });
      } else {
        link.removeClass('active');
      }
    }
  }
  private funcMap: any = {
    [COMMANDS.SET_IPIM_VALUES]: this.openInputModal,
    [COMMANDS.SET_IPIM_VALUES_EVALUATE]: this.openVariableModal,
    [COMMANDS.SET_TERM]: this.openTermModal,
    [COMMANDS.HIGHLIGHT]: this.highlightTerms,
    [COMMANDS.RESET]: this.resetDiagram,
    [COMMANDS.TWO_COLUMN]: this.handleTwoColumnToggleClick,
    [COMMANDS.SAVE]: this.saveDiagram
  };

  /**
   * Using fat Arrow function here manipulates binding of this. 
   * While do not using openDiagram here the "this.modeler.importXML" gets affected by this..
   * and is no longer recognized as a function
   */
  public ngOnInit() {
    this.commandQueue = new Subject();
    this.store.listDiagrams()
      .do(links => this.urls = links)
      .flatMap(() => this.store.paletteEntries())
      .do(entries => this.extraPaletteEntries = entries)
      .subscribe(() => this.createModeler());
    this.commandQueue.subscribe(cmd => {
      const func = this.funcMap[cmd.action];
      console.log(cmd.action, func);
      if (func) {
        func();
      }
    });

    // this.commandQueue
    //   .filter(cmd => COMMANDS.SAVE === cmd.action)
    //   .do(cmd => console.log('Received SUPER SPECIAL SAVE command: ', cmd))
    //   .subscribe(() => this.modeler.saveXML((err: any, xml: any) => console.log('xml!?!', err, xml)));
  }

  public ngAfterViewInit(): void {
    // this is scary as fuck -.-
    $(document).ready(() => {
      this.container = $('#js-drop-zone');
      if (!window.FileList || !window.FileReader) {
        window.alert(
          'Looks Flike you use an older browser that does not support drag and drop. ' +
          'Try using Chrome, Firefox or the Internet Explorer > 10.');
      } else {
        console.log(this.container);
        this.registerFileDrop(this.container, this.openDiagram);
      }
    });
  }

  // openBPMN() {
  //   $('#IPIM-Load').addClass('IPIM').attr({
  //     'href': 'data:application/bpmn20-xml;charset=UTF-8,',
  //     'download': 'Openfile'
  //   });

  //   $('#IPIM-Load').click(function () {
  //     //Zurücksetzten des HTML File Values, da Ereignis sonst nicht ausgelöst wird
  //     (<HTMLInputElement>document.getElementById('')).value = '';
  //     document.getElementById('').click();
  //   });
  // }

  private registerFileDrop = (container: JQuery, callback: Function) => {
    // let containerJQ = $(this.containerID);
    const handleelect = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer.files;
      const file: File = files[0];
      const reader = new FileReader();
      reader.onload = (onLoadEvent : any) => {
        const xml = (<FileReaderEvent>onLoadEvent).target.result;
        callback(xml);
      };

      if (file.name.indexOf('.bpmn') !== -1) {
        console.log(file.name);
        reader.readAsText(file);
      }
    };

    const handleDragOver = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };
    // TODO: Fixme

    const firstElementInContainer = container.get(0);

    if (firstElementInContainer) {
      container.get(0).addEventListener('dragover', handleDragOver, false);
      container.get(0).addEventListener('drop', handleelect, false);
    } else {
      console.error('firstElementInContainer is undefined', container);
    }
  }

  private toggleTermsNormal = (elementRegistry: any, modeling: any) => {
    console.log('toggleTermsNormal');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    modeling.setColor(elements, {
      stroke: 'black'
    });
  }

  // import {debounce} from 'lodash';
  // const exportArtifacts = debounce(() => {

  // this.modeler.on('commandStack.changed', this.exportArtifacts);
  //   const downloadLink = $('#js-download-diagram');
  //   const downloadSvgLink = $('#js-download-svg');
  //   //saveSVG((err : any, svg : any) => {
  //   // setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
  //   // });

  //   this.saveDiagram((err: any, xml: any) => {
  //     this.modeler.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
  //   });
  // }, 500);

  private createNewDiagram() {
    this.openDiagram(this.newDiagramXML);
  }

  private openDiagram = (xml: string) => {
    this.lastDiagramXML = xml;
    this.modeler.importXML(xml, (err: any) => {
      // if (err) {
      //   this.container
      //     .removeClass('with-diagram')
      //     .addClass('with-error');
      //   this.container.find('.error pre').text(err.message);
      //   console.error(err);
      // } else {
      //   this.container
      //     .removeClass('with-error')
      //     .addClass('with-diagram');
      // }
    });
  }

/**
 * Creates the modeler Object from camunda bpmn-js package. 
 * adds the extraPaletteEntries from the bpmn-store
 * 
 */
  private createModeler() {
    // console.log('Creating this.modeler, injecting extraPaletteEntries: ', this.extraPaletteEntries);
    this.modeler = new this.modeler({
      container: this.containerRef,
      propertiesPanel: {
        parent: this.propsPanelRef
      },
      additionalModules: [
        { extraPaletteEntries: ['type', () => this.extraPaletteEntries] },
        { commandQueue: ['type', () => this.commandQueue] },
        this.propertiesPanelModule,
        this.propertiesProviderModule,
        // customPropertiesProviderModule,
        customPaletteModule
      ],
      moddleExtensions: {
        camunda: this.camundaModdleDescriptor
        // ne: CustomModdle
      }
    });

    // Start with an empty diagram:
    this.url = this.urls[0].href;
    // this.loadBPMN();
  }
/**
 * 
 */
  // private loadBPMN() {
  //   const canvas = this.modeler.get('canvas');
  //   this.http.get('/diagrams/scrum.bpmn')
  //   // this.http.get(this.url)
  //     .map(response => response.text())
  //     .map(data => this.modeler.importXML(data, this.handleError))
  //     .subscribe(x => x ? this.handleError(x) : this.postLoad());
  // }

  private loadBPMN() {
    // console.log('load', this.url, this.store);
    const canvas = this.modeler.get('canvas');
    this.http.get(this.url)
      .map((response: any) => response.text())
      .map((data: any) => {
        this.lastDiagramXML = data;
        return this.modeler.importXML(data, this.handleError);
      })
      .subscribe(x => x ? this.handleError(x) : this.postLoad());
  }

  private postLoad() {
    const canvas = this.modeler.get('canvas');
    canvas.zoom('fit-viewport');
  }

  private handleError(err: any) {
    if (err) {
      console.log('error rendering', err);
    }
  }

  private writeInputModalValues() {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    //Alle Elemente durchlaufen um Variablen zu finden
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM_Val entspricht
          if (extras[0].values[i].name.toLowerCase().startsWith('IPIM_Val_'.toLowerCase())) {
            const inpelement = 'Input_' + extras[0].values[i].name;
            //Variablen aus Inputfeld zurückschreiben
            extras[0].values[i].value = (<HTMLInputElement>document.getElementById(inpelement.toLowerCase())).value;
          }
        }
      }
    });
  }

  private fillVariableModal() {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    const element = elements[0];
    //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
    if (typeof element.businessObject.extensionElements !== 'undefined') {
      //Wenn vorhandne die Elemente auslesen
      const extras = element.businessObject.extensionElements.get('values');
      //Schleife über alle Elemente
      for (let i = 0; i < extras[0].values.length; i++) {
        //Prüfen ob der Name des Elementes IPIM_Val entspricht
        const extrasValues = extras[0].values[i];
        const extrasValueNameLowerCase = extrasValues.name.toLowerCase();
        const ipimVal: boolean = extrasValueNameLowerCase.startsWith(this.ipimTags.VAL + '_'.toLowerCase());
        const ipimMeta: boolean = extrasValueNameLowerCase.startsWith(this.ipimTags.META + '_'.toLowerCase());

        if (ipimVal) {
          this.insertVariableField(
            extrasValues.name.toLowerCase().replace('IPIM_Val_'.toLowerCase(), ''),
            extrasValues.value.toLowerCase(),
            'variablefset',
            false);
        }

        if (ipimMeta) {
          this.insertVariableField(
            extrasValues.name.toLowerCase().replace('IPIM_META_'.toLowerCase(), ''),
            extrasValues.value.toLowerCase(),
            'variablefset',
            true);
        }
      }
    }
  }

  private fillInputModal() {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.businessObject.extensionElement) {
        const extras = element.businessObject.extensionElements.get(this.lookup.VALUES); //'values');
        extras[0].values.map((extra: any, index: number) => {
          if (extras[0].values[index].name.toLowerCase().startsWith(this.ipimTags.VAL + '_'.toLowerCase())) {
            this.insertInputField(
              extras[0].values[index].name.toLowerCase().replace(this.ipimTags.VAL + '_'.toLowerCase(), ''),
              extras[0].values[index].value.toLowerCase(),
              'inputfset');
          }
        }
        );
      }
    }
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {

          //Prüfen ob der Name des Elementes IPIM_Val entspricht
          if (extras[0].values[i].name.toLowerCase().startsWith('IPIM_Val_'.toLowerCase())) {
            this.insertInputField(
              extras[0].values[i].name.toLowerCase().replace('IPIM_Val_'.toLowerCase(), ''),
              extras[0].values[i].value.toLowerCase(),
              'inputfset');
            //Variablen als Key mit Wert in Map übernehmen
            //VarValMap[extras[0].values[i].name.toLowerCase().replace("IPIM_Val_".toLowerCase(),"")]
            // = extras[0].values[i].value.toLowerCase();
          }
        }
      }
    });
  }

  private writeVariableModalValues() {
    //get moddle Object
    const elementRegistry = this.modeler.get('elementRegistry');
    const moddle = this.modeler.get('moddle');

    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elements = elementRegistry.getAll();
    const element = elements[0];
    //reset camunda extension properties
    element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
    const extras = element.businessObject.extensionElements.get('values');
    extras.push(moddle.create('camunda:Properties'));
    extras[0].values = [];

    //Alle Elemente des Eingabefeldes durchlaufen um Variablen zu finden und dem Root Element hinzuzufügen
    //const fieldset= document.getElementById('variablefset');
    const fields = document.getElementsByName('textbox');
    const checkboxes = document.getElementsByName('checkbox');
    const valueboxes = document.getElementsByName('valuebox');
    for (let fieldi = 0; fieldi < fields.length; fieldi++) {
      if ((<HTMLInputElement>fields[fieldi]).value !== '') {
        extras[0].values.push(moddle.create('camunda:Property'));
        (<HTMLInputElement>checkboxes[fieldi]).checked
          ? extras[0].values[fieldi].name = this.ipimTags.META + '_' + (<HTMLInputElement>fields[fieldi]).value.trim()
          : extras[0].values[fieldi].name = this.ipimTags.VAL + + '_' + (<HTMLInputElement>fields[fieldi]).value.trim();

        (<HTMLInputElement>valueboxes[fieldi]).value !== ''
          ? extras[0].values[fieldi].value = (<HTMLInputElement>valueboxes[fieldi]).value.trim()
          : extras[0].values[fieldi].value = ' ';
      }
    }
  }

  private writeTermModalValues() {
    //get moddle Object
    const moddle = this.modeler.get('moddle');
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const elements = this.modeler.get('selection').get();
    //Alle Elemente durchlaufen um Variablen zu finden
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM_Calc entspricht
          if (extras[0].values[i].name.toLowerCase().startsWith('IPIM_Calc'.toLowerCase())) {
            if ((<HTMLInputElement>document.getElementById('inputFieldTerm')).value !== '') {
              extras[0].values[i].value = (<HTMLInputElement>document.getElementById('inputFieldTerm')).value;
            } else {
              extras[0].values.splice(i, 1);
            }
            break;
          }
        }
      } else {
        if ((<HTMLInputElement>document.getElementById('inputFieldTerm')).value !== '') {
          element.businessObject.extensionElements = moddle.create('bpmn:ExtensionElements');
          const extras = element.businessObject.extensionElements.get('values');
          extras.push(moddle.create('camunda:Properties'));
          extras[0].values = [];
          extras[0].values.push(moddle.create('camunda:Property'));
          extras[0].values[0].name = 'IPIM_Calc';
          extras[0].values[0].value = (<HTMLInputElement>document.getElementById('inputFieldTerm')).value;
        }
      }
    });

    // this.termsColored
    //   ? this.toggleTermsColored()
    //   : this.toggleTermsNormal();
  }

  private getTermList = (scope: string) => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === this.lookup.SELECTION
      ? elements = this.modeler.get(scope).get()
      : elements = this.modeler.get(scope).getAll();
    const terms: string[] = new Array();
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      console.log(element, typeof element.businessObject.extensionElements);
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM_Val entspricht
          if (extras[0].values[i].name.toLowerCase().startsWith(this.ipimTags.CALC)) {
            if (terms.indexOf(extras[0].values[i].value) === -1) {
              terms.push(extras[0].values[i].value);
            }
          }
        }
      }
    }
    return terms;
  }

  private fillTermModal() {
    const terms = this.getTermList(this.lookup.SELECTION);
    if (terms.length > 1) {
      window.alert('Attention selected Elements already have different Terms!');
    }
    const element = <HTMLInputElement>document.getElementById('inputFieldTerm');
   !element
      ? console.error('no such element')
      : (terms.length > 0)
        ? element.value = terms[0]
        : element.value = '';
  }

  private clearVariableModal() {
    //Bereich zum löschen per getElement abfragen
    const inpNode = document.getElementById('variablefset');
    //Solange es noch ein firstChild gibt, wird dieses entfernt!
    while (inpNode.firstChild) {
      inpNode.removeChild(inpNode.firstChild);
    }
  }

  private clearInputModal() {
    //Bereich zum löschen per getElement abfragen
    const inpNode = document.getElementById('inputfset');
    //Solange es noch ein firstChild gibt, wird dieses entfernt!
    while (inpNode.firstChild) {
      inpNode.removeChild(inpNode.firstChild);
    }
  }

  private evaluateProcess = () => {
    if (this.lastDiagramXML === '') {
      window.alert('No Diagram loaded!');
    }
    debugger;
    const elementRegistry = this.modeler.get(this.lookup.ELEMENTREGISTRY);
    const modeling = this.modeler.get(this.lookup.MODELING);
    this.modeler.saveXML({ format: true }, (err: any, xml: string) => {
      if (err) {
        console.error(err);
        return;
      }
      this.lastDiagramXML = xml;
    });
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    const varValMap = {};
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
            varValMap[valueName.replace('IPIM_Val_'.toLowerCase(), '')] = extras[0].values[i].value.toLowerCase();
          }
          //Prüfen ob der Name des Elementes IPIM_Val entspricht
          if (valueName.startsWith('IPIM_META_'.toLowerCase())) {
            //Variablen als Key mit Wert in Map übernehmen
            varValMap[valueName.replace('IPIM_META_'.toLowerCase(), '')] = extras[0].values[i].value.toLowerCase();
          }
        }
      }
    }
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
            // Mittels Teufelsmagie(eval) prüfen ob der zugehörige Wert TRUE ist
            if (!eval(evalterm)) {
              //Element über modeling Objekt löschen
              modeling.removeElements([element]);
            }
          }
        }
      }
    }
  }

  private getAsFile = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file); // , 'UTF-16')
    reader.onerror = (err: ErrorEvent) => {
      console.error('error during reading file');
    };
    reader.onload = (e: any) => {
      this.lastDiagramXML = reader.result;
      this.openDiagram(this.lastDiagramXML);
    };
  }

  private toggleTermsColored( elementRegistry : any, modeling: any) {

    console.log('toggleTermscolored');
    if (this.lastDiagramXML === '') {
      window.alert('No Diagram loaded!');
      return;
    }

    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.

    //const ipimcolors = $('.ipimcolors').css('color');    //CSS auslesen

    const terms = this.getTermList('elementRegistry');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    console.log('after elementRegistry');

    const colorelements = this.ipimColors.map(() => []);
    for (const element of elements) {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
        // if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        console.log('extras ' + extras);
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM entspricht
          if (extras[0].values[i].name.toLowerCase() === this.ipimTags.CALC) {
            console.log( colorelements,
              'values[i].value' + extras[0].values[i].value, 'i ' + i,
              'length' + this.ipimColors.length,
              'terms' + terms,
              'indexOf' + terms.indexOf(extras[0].values[i].value),
              'indexOf % length' + terms.indexOf(extras[0].values[i].value) % this.ipimColors.length);
            colorelements[terms.indexOf(extras[0].values[i].value) % this.ipimColors.length].push(element);
            // const endEventNode = document.querySelector('[data-element-id="sid-52EB1772-F36E-433E-8F5B-D5DFD26E6F26"]');
            // endEventNode.setAttribute('title', "HELPT!");
            // const children = endEventNode.children;
            // for (const i = 0; i < children.length; i++) {
            // children[i].setAttribute('title', "HELPT!");
            // }
          }
        }
      }
    }
    this.ipimColors.map((elem, index) => {
      if (colorelements[index].length > 0) {
        modeling.setColor(colorelements[index], {
          stroke: this.ipimColors[index]
        });
      }
    });
    // for (let i = 0; i < this.ipimColors.length; i++) {
    //   if (colorelements[i].length > 0) {
    //     modeling.setColor(colorelements[i], {
    //       stroke: this.ipimColors[i]
    //     });
    //   }
    // }
  }

  // <div>
  //   <label value="Variable + {{pname}}: ">
  //   <input type="text" name={{pname}} value={{inpval}} id={{generateID(inputVal, pname)}}/>
  //   <br>
  // </div>
  private insertInputField(pname: string, inpval: string, pform: string) {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('name', pname);
    inputField.setAttribute('value', inpval);
    inputField.setAttribute('id', 'Input_IPIM_Val_'.toLowerCase() + pname.toLowerCase());
    const br = document.createElement('br');

    const node = document.createTextNode('Variable ' + pname + ':     ');

    document.getElementById(pform).appendChild(node);
    document.getElementById(pform).appendChild(document.createElement('br'));
    document.getElementById(pform).appendChild(inputField);
    //document.getElementById(pform).appendChild(br);
    document.getElementById(pform).appendChild(br);

  }

  // TODO: FIxme in a template?
  private insertVariableField = (pname: string, inpval: string, pform: string, meta: boolean) => {
    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'text');
    inputField.setAttribute('name', 'textbox');
    inputField.setAttribute('value', pname);
    inputField.setAttribute('id', 'Variable_IPIM_Val_'.toLowerCase() + pname.toLowerCase());

    const valueField = document.createElement('input');
    valueField.setAttribute('type', 'text');
    valueField.setAttribute('name', 'valuebox');
    valueField.setAttribute('value', inpval);
    valueField.setAttribute('class', 'maxwid');
    valueField.setAttribute('id', 'Variable_IPIM_Val_'.toLowerCase() + pname.toLowerCase());

    // (<HTMLElement> checkingBox).attr({"data-test-1":'num1', "data-test-2": 'num2'});
    // $('#pform').append('<input>').attr({});

    const checkingbox = document.createElement('input');
    // checkingbox.attributes;
    checkingbox.setAttribute('type', 'checkbox');
    checkingbox.setAttribute('name', 'checkbox');
    checkingbox.setAttribute('value', 'Meta?');
    if (meta) {
      checkingbox.setAttribute('checked', meta.toString());
    }
    checkingbox.setAttribute('id', 'Variable_IPIM_'.toLowerCase() + pname.toLowerCase());

    const br = document.createElement('br');

    const node = document.createTextNode('Variable:     ');

    document.getElementById(pform).appendChild(node);
    document.getElementById(pform).appendChild(inputField);
    document.getElementById(pform).appendChild(document.createTextNode('    Meta?:'));
    document.getElementById(pform).appendChild(checkingbox);
    document.getElementById(pform).appendChild(document.createElement('br'));
    document.getElementById(pform).appendChild(document.createTextNode('    Default:'));
    document.getElementById(pform).appendChild(valueField);
    //document.getElementById(pform).appendChild(br);
    document.getElementById(pform).appendChild(br);
    document.getElementById(pform).appendChild(document.createElement('hr'));
  }
}