
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Http } from '@angular/http';

import { PaletteProvider } from './palette';
import { CustomPropertiesProvider } from './props-provider';
import { BPMNStore, Link } from '../bpmn-store/bpmn-store.service';

// import modeler from 'bpmn-js/lib/Modeler.js';

const modeler = require('bpmn-js/lib/Modeler.js');
const propertiesPanelModule = require('bpmn-js-properties-panel');
const propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/bpmn');

import { CustomModdle } from './custom-moddle';
import { Observable, Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';

import { COMMANDS } from './../bpmn-store/commandstore.service';
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
  private modeler: any;
  private termsColored: boolean = false;
  private ipimColors: string[] = ['blue', 'red', 'green', 'aquamarine', 'royalblue', 'darkviolet', 'fuchsia', 'crimson']
  private lastDiagramXML: string = '';
  private url: string;
  private _urls: Link[];
  private extraPaletteEntries: any;
  private commandQueue: Subject<any>;
  private container: any = $('#js-drop-zone');

  @ViewChild('variableModal')
  private variableModal: ModalComponent;
  @ViewChild('inputModal')
  private inputModal: ModalComponent;
  @ViewChild('termModal')
  private termModal: ModalComponent;

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
    this.termModal.open();
  }

  public openInputModal = () => {
    this.inputModal.open();
  }
  public openVariableModal = () => {
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
    this.termsColored
      ? this.toggleTermsColored()
      : this.toggleTermsNormal();
    this.termsColored = !this.termsColored;
  }
  private funcMap: any = {
    [COMMANDS.SET_IPIM_VALUES]: this.openInputModal,
    [COMMANDS.SET_IPIM_VALUES_EVALUATE]: this.openVariableModal,
    [COMMANDS.SET_TERM]: this.openTermModal,
    [COMMANDS.HIGHLIGHT]: this.highlightTerms,
    [COMMANDS.RESET]: this.resetDiagram,
    [COMMANDS.TWO_COLUMN]: this.handleTwoColumnToggleClick
  };

  public ngOnInit() {
    this.commandQueue = new Subject();
    this.store.listDiagrams()
      .do(links => this.urls = links)
      // .do(() => console.log('Got links: ', this.urls))
      .flatMap(() => this.store.paletteEntries())
      .do(entries => this.extraPaletteEntries = entries)
      // .do(() => console.log('Got entries: ', this.extraPaletteEntries))
      .subscribe(() => this.createModeler());
    this.commandQueue
      .subscribe(cmd => {
        const command = COMMANDS[cmd.action];
        const func = this.funcMap[cmd.action];
        if (func) {
          func();
        }
      });

    // this.commandQueue
    //   .filter(cmd => COMMANDS.SET_IPIM_VALUES === cmd.action)
    //   .do(cmd => {
    //     console.log('open modal');
    //     this.openTermModal();

    //     console.log('opened modal');
    //     // if (this.lastDiagramXML === '') {
    //     //   window.alert('No Diagram loaded!');
    //     //   return;

    //     // }
    //     // // Get the modal
    //     // const modal = document.getElementById('InputModal');
    //     // modal.style.display = 'block';
    //     // this.ClearInputModal();
    //     // this.FillInputModal();
    //     // TODO
    //   })
    //   .subscribe(cmd => console.log('Received SUPER SPECIAL two-column command: ', cmd));



    //     this.evaluateProcess();
    //   });

    // this.commandQueue
    //   .filter(cmd => COMMANDS.SAVE === cmd.action)
    //   .do(cmd => console.log('Received SUPER SPECIAL SAVE command: ', cmd))
    //   .subscribe(() => this.modeler.saveXML((err: any, xml: any) => console.log('xml!?!', err, xml)));
  }


  private resetDiagram() {
    if (this.lastDiagramXML === '') { window.alert('No Diagram loaded!'); };
    this.openDiagram(this.lastDiagramXML);
  }

  private toggleTermsNormal() {
    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');

    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();

    modeling.setColor(elements, {
      stroke: 'black' //,
      //fill: 'green'
    });
  }

  private openDiagram(xml: string) {
    this.lastDiagramXML = xml;
    modeler.importXML(xml, (err: any) => {
      if (err) {
        this.container
          .removeClass('with-diagram')
          .addClass('with-error');
        this.container.find('.error pre').text(err.message);
        console.error(err);
      } else {
        this.container
          .removeClass('with-error')
          .addClass('with-diagram');
      }
    });
  }

  private createModeler() {
    // console.log('Creating modeler, injecting extraPaletteEntries: ', this.extraPaletteEntries);
    this.modeler = new modeler({
      container: containerRef,
      propertiesPanel: {
        parent: propsPanelRef
      },
      additionalModules: [
        { extraPaletteEntries: ['type', () => this.extraPaletteEntries] },
        { commandQueue: ['type', () => this.commandQueue] },
        propertiesPanelModule,
        propertiesProviderModule,
        customPropertiesProviderModule,
        customPaletteModule
      ],
      moddleExtensions: {
        ne: CustomModdle
      }
    });

    // Start with an empty diagram:
    this.url = this.urls[0].href;
    this.loadBPMN();
  }

  private loadBPMN() {
    // console.log('load', this.url, this.store);
    const canvas = this.modeler.get('canvas');
    this.http.get(this.url)
      .map(response => response.text())
      .map(data => this.modeler.importXML(data, this.handleError))
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
    //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');
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
    //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');
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
        const ipimVal: boolean = extrasValueNameLowerCase.startsWith('IPIM_Val_'.toLowerCase());

        if (ipimVal) {
          this.insertVariableField(
            extrasValues.name.toLowerCase().replace('IPIM_Val_'.toLowerCase(), ''),
            extrasValues.value.toLowerCase(),
            'variablefset',
            false);
        }

        if (ipimVal) {
          this.insertVariableField(
            extrasValues.name.toLowerCase().replace('IPIM_META_'.toLowerCase(), ''),
            extrasValues.value.toLowerCase(),
            'variablefset',
            true);
        }
      }
    }
  }

  private FillInputModal() {
    //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.
    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');
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
    const elementRegistry = modeler.get('elementRegistry');
    const moddle = modeler.get('moddle');

    //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.
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
        if (!(<HTMLInputElement>checkboxes[fieldi]).checked) {
          extras[0].values[fieldi].name = 'IPIM_Val_' + (<HTMLInputElement>fields[fieldi]).value.trim();
        } else {
          extras[0].values[fieldi].name = 'IPIM_META_' + (<HTMLInputElement>fields[fieldi]).value.trim();
        }
        if ((<HTMLInputElement>valueboxes[fieldi]).value !== '') {
          extras[0].values[fieldi].value = (<HTMLInputElement>valueboxes[fieldi]).value.trim();
        } else {
          extras[0].values[fieldi].value = ' ';
        }
      }
    }
  }

  private writeTermModalValues() {
    //get moddle Object
    const moddle = modeler.get('moddle');
    //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.
    const elements = modeler.get('selection').get();
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

    this.termsColored
      ? this.toggleTermsColored()
      : this.toggleTermsNormal();

  }

  private getTermList = (scope: string) => {
    //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === 'selection'
      ? elements = modeler.get(scope).get()
      : elements = modeler.get(scope).getAll();
    const terms: string[] = new Array();
    //Alle Elemente durchlaufen um Variablen zu finden
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM_Val entspricht
          if (extras[0].values[i].name.toLowerCase().startsWith('IPIM_Calc'.toLowerCase())) {
            if (-1 === terms.indexOf(extras[0].values[i].value)) {
              terms.push(extras[0].values[i].value);
            }
          }
        }
      }
    });
    return terms;
  }

  private fillTermModal() {
    const terms = this.getTermList('selection');
    if (terms.length > 1) {
      window.alert('Attention selected Elements already have different Terms!');
    }
    const element = <HTMLInputElement>document.getElementById('inputFieldTerm');

    terms.length > 0
      ? element.value = terms[0]
      : element.value = '';
  }

  private ClearVariableModal() {
    //Bereich zum löschen per getElement abfragen
    const inpNode = document.getElementById('variablefset');
    //Solange es noch ein firstChild gibt, wird dieses entfernt!
    while (inpNode.firstChild) {
      inpNode.removeChild(inpNode.firstChild);
    }
  }

  private ClearInputModal() {
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
    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');
    modeler.saveXML({ format: true }, (err: any, xml: string) => {
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
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
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
    });
    //Alle Elemente durchlaufen um Evaluationsterme auszuwerten
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM entspricht
          if (extras[0].values[i].name.toLowerCase() === 'IPIM_Calc'.toLowerCase()) {
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
    });
  }

  // private OpenFileDiagram() {
  //   if (window.File && window.FileReader && window.FileList && window.Blob) {

  //     const inpfiles = $('#files')[0].files;

  //     for (const i = 0; i < inpfiles.length; i++) {
  //       const fr = new FileReader();
  //       fr.onload = (e: any) => {
  //         this.openDiagram(e.target.result);
  //         this.lastDiagramXML = e.target.result;
  //       };
  //       fr.readAsText(inpfiles[i]);
  //     }

  //   } else {
  //     alert('The File APIs are not fully supported in this browser.');
  //   }
  // }

  private toggleTermsColored() {
    if (this.lastDiagramXML === '') {
      window.alert('No Diagram loaded!');
    }
    // Daten zuweisen aus Input Boxen.
    //const A = document.getElementById("IPIMuserInputA").value;
    //const B = document.getElementById("IPIMuserInputB").value;
    //const C = document.getElementById("IPIMuserInputC").value;

    //Objekte vom Modeler holen um nicht immer so viel tippen zu müssen.

    //const ipimcolors = $('.ipimcolors').css('color');    //CSS auslesen

    const elementRegistry = modeler.get('elementRegistry');
    const modeling = modeler.get('modeling');
    const terms = this.getTermList('elementRegistry');
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();

    const colorelements: any[] = [];

    for (let i = 0; i < this.ipimColors.length; i++) {
      colorelements.push([]);
    }
    elements.forEach((element: any) => {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== 'undefined') {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        //Schleife über alle Elemente
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM entspricht
          if (extras[0].values[i].name === 'IPIM_Calc') {

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
      //console.timeEnd('someFunction');
    });
    for (let i = 0; i < this.ipimColors.length; i++) {
      if (colorelements[i].length > 0) {
        modeling.setColor(colorelements[i], {
          stroke: this.ipimColors[i] //,
          //fill: 'green'
        });
      }
    }
  }

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

    const checkingbox = document.createElement('input');
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
