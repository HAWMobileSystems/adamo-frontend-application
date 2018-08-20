import {Component, OnInit, ViewChild, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {Http} from '@angular/http';
import {MqttService} from '../services/mqtt.service';
import {PaletteProvider} from './palette/palette';
import {CustomPropertiesProvider} from './properties/props-provider';
import {BPMNStore, Link} from '../bpmn-store/bpmn-store.service';
import {CommandStack} from './command/CommandStack';
//import {customModdle} from './custom-moddle';
import {camundaModdle} from './camunda-moddle';
import {Observable, Subject} from 'rxjs';
import {ChangeDetectorRef} from '@angular/core';
import * as $ from 'jquery';
import {FileReaderEvent} from './interfaces';
import {TermModal} from './modals/TermModal';
import {InputModal} from './modals/InputModal';
import {VariableModal} from './modals/VariableModal';
import {SubProcessModal} from './modals/SubProcessModal';
import {EvalModal} from './modals/evaluatorModal';
import {TermModal} from './modals/TermModal/TermModal';
import {InputModal} from './modals/InputModal/InputModal';
import {VariableModal} from './modals/VariableModal/VariableModal';
import {SubProcessModal} from './modals/SubProcessModal/SubProcessModal';
import {EvalModal} from './modals/evaluatorModal/evaluatorModal';

import {COMMANDS} from '../bpmn-store/commandstore.service';
import {ApiService} from '../services/api.service';
import {Evaluator} from './evaluator/evaluator.component';
import * as FileSaver from 'file-saver';
import { Model } from '../models/model';

const customPaletteModule = {
  paletteProvider: ['type', PaletteProvider]
};

@Component({
  selector: 'modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.css'],
  providers: [BPMNStore]
})
export class ModelerComponent implements OnInit {
  @Input() public modelId: string;
  @Input() public newDiagramXML: string;
  @Input() public model: any;
  @Output() public exportModel: EventEmitter<object> = new EventEmitter<object>();
  @Output() public loadSubProcess: EventEmitter<Model> = new EventEmitter<Model>();
  @Output() public loadedCompletely: EventEmitter<null> = new EventEmitter<null>();
  private modeler: any = require('bpmn-js/lib/Modeler.js');
  private propertiesPanelModule: any = require('bpmn-js-properties-panel');
  private propertiesProviderModule: any = require('bpmn-js-properties-panel/lib/provider/camunda');
//private originModule: any = require('diagram-js-origin');
  private termsColored: boolean = false;
  private ipimColors: string[] = ['blue', 'red', 'green', 'aquamarine', 'royalblue', 'darkviolet', 'fuchsia', 'crimson'];
  private lastDiagramXML: string = '';
  private url: string;
  private commandStack: any;
  private evaluator: Evaluator;
  private modelerUrls: Link[];
  private extraPaletteEntries: any;
  private commandQueue: Subject<any>;
  private container: JQuery; // = '#js-drop-zone';
  private containerRef: string = '#js-canvas';
  private propsPanelRef: string = '#js-properties-panel';
  private defaultModel: string = '/diagrams/scrum.bpmn';
  private camundaModdleDescriptor: any = require('camunda-bpmn-moddle/resources/camunda.json');
  @ViewChild('variableModal')
  private variableModal: VariableModal;
  @ViewChild('inputModal')
  private inputModal: InputModal;
  @ViewChild('termModal')
  private termModal: TermModal;
  @ViewChild('subProcessModal')
  private subProcessModal: SubProcessModal;
  @ViewChild('evalModal')
  private evaluatorModal: EvalModal;

  private ipimTags: any = {
    META: 'IPIM_meta_',
    VAL: 'IPIM_Val_',
    CALC: 'ipim_calc',
    SUBPROCESS: 'ipim_subprocess'
  };

  private lookup: any = {
    MODELING: 'modeling',
    ELEMENTREGISTRY: 'elementRegistry',
    SELECTION: 'selection',
    VALUES: 'values'
  };
  private hideLoader: boolean = true;

  public onNotify(message: string): void {
    this.hideLoader = true;
    this.openDiagram(message);
  }

  constructor(private apiService: ApiService, private http: Http, private store: BPMNStore,
              private ref: ChangeDetectorRef, private router: Router, private mqttService: MqttService) {

  }

// Extract the following to the separate controler
  public openTermModal = () => {
    this.termModal.setProps(this.modeler, this.getTermList(this.lookup.SELECTION), this);
    this.termModal.modal.open();
  }

  public openInputModal = () => {
    this.inputModal.setProps(this.modeler, this);
    this.inputModal.modal.open();
  }
  public openVariableModal = () => {
    this.variableModal.setProps(this.modeler, this);
    this.variableModal.modal.open();
  }

  public openSubprocessModal = () => {
    this.getSubProcessList(this.lookup.SELECTION);
  }

  public openEvaluatorModal = () => {
    this.modeler.saveXML({format: true}, (err: any, xml: any) => {
    this.evaluator = new Evaluator(this.modelId.split('_')[1], xml, this.apiService, this);
    console.log('ElevatorModal_Clicked!');
    });
  }

  private getSubProcessList = (scope: string) => {
//Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === this.lookup.SELECTION
      ? elements = this.modeler.get(scope).get()
      : elements = this.modeler.get(scope).getAll();
    const terms: string[] = new Array();
    let validSelection = false;
//Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.type === 'bpmn:SubProcess') {
        validSelection = true;
        console.log(element, typeof element.businessObject.extensionElements);
//Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get('values'); // this.lookup.values
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (extras[0].values[i].name.toLowerCase().startsWith(this.ipimTags.SUBPROCESS)) {
              if (terms.indexOf(extras[0].values[i].value) === -1) {
                terms.push(extras[0].values[i].value);
              }
            }
          }
        }
      }
    }
    if (!validSelection) {
      window.alert('No Subprocess selected!');
    } else {
      this.subProcessModal.setProps(this.modeler, terms, this);
      this.subProcessModal.modal.open();
    }
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
    // if (this.lastDiagramXML !== '') {
    const elementRegistry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    this.termsColored
      ? this.toggleTermsNormal(elementRegistry, modeling)
      : this.toggleTermsColored(elementRegistry, modeling);
    this.termsColored = !this.termsColored;
    // } else {
    //   console.error('There is no Diagram to highlight');
    // }
  }

  private resetDiagram = () => {
    this.showOverlay();
    this.apiService.getModel(this.modelId.split('_')[1])
      .subscribe(response => {
          const xml = response.data.modelxml;
          console.info('Reset-Model', xml);
          this.modeler.importXML(xml);
          this.commandStack.stopEvaluateMode();
          this.hideOverlay();
        },
        error => {
          console.log(error);
          this.commandStack.stopEvaluateMode();
          this.hideOverlay();
        });
  }

  private saveToDb = () => {
    console.log('saving to db');
    this.modeler.saveXML({format: true}, (err: any, xml: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(this.model);
      this.apiService.modelUpsert(this.model.id, this.model.name, xml, this.model.version)
        .subscribe(response => {
            console.log(response);
          },
          error => {
            console.log(error);
          });
    });
  }

  private saveDiagram = () => {
    const downloadLink = $('#js-download-diagram');
    this.modeler.saveXML({format: true}, (err: any, xml: any) => {
      const blob = new Blob([xml], {type: 'text/xml;charset=utf-8'});
      FileSaver.saveAs(blob, 'diagramm ' + this.modelId + '.bpmn');
    });
  }

  private saveSVG = () => {
    const downloadSvgLink = $('#js-download-SVG');
    this.modeler.saveSVG((err: any, svg: any) => {
      const blob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
      FileSaver.saveAs(blob, 'diagramm ' + this.modelId + '.svg');
    });

  }

  private openSubProcessModel = () => {
    this.loadSubProcessModel(this.lookup.SELECTION);
  }

  private loadSubProcessModel = (scope: string) => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
        let elements: any;
        scope === this.lookup.SELECTION
          ? elements = this.modeler.get(scope).get()
          : elements = this.modeler.get(scope).getAll();
        const terms: string[] = new Array();
        let validSelection = false;
    //Alle Elemente durchlaufen um Variablen zu finden
        for (const element of elements) {
          if (element.type === 'bpmn:SubProcess') {
            validSelection = true;
            console.log(element, typeof element.businessObject.extensionElements);
    //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
            if (element.businessObject.extensionElements) {
              //Wenn vorhandne die Elemente auslesen
              const extras = element.businessObject.extensionElements.get('values'); // this.lookup.values
              //Schleife über alle Elemente
              for (let i = 0; i < extras[0].values.length; i++) {
                //Prüfen ob der Name des Elementes IPIM_Val entspricht
                if (extras[0].values[i].name.toLowerCase().startsWith(this.ipimTags.SUBPROCESS)) {
                  if (terms.indexOf(extras[0].values[i].value) === -1) {
                    terms.push(extras[0].values[i].value);
                  }
                }
              }
            }
          }
        }
        if (!validSelection) {
          window.alert('No Subprocess selected!');
        } else {
          terms.forEach(element => {
            this.showOverlay();
            if (element !== '') {
              this.apiService.getModel(element)
                .subscribe((response: any) => {
                  const model = new Model();
                    model.xml = response.data.modelxml;
                    model.name = response.data.modelname;
                    model.id = response.data.mid;
                    model.version = response.data.version;
                    console.info(model);
                    this.loadSubProcess.emit(model);
                    this.hideOverlay();
                  },
                  (error: any) => {
                    this.hideOverlay();
                    console.log(error);
                  });

            } else {
              window.alert('Noting selected!');
              return;
            }
          });
        }
      }

  private zoomToFit = () => {
    const canvasObject = this.modeler.get('canvas');
    canvasObject.zoom('fit-viewport');
  }

  private funcMap: any = {
    [COMMANDS.SET_IPIM_VALUES]: this.openVariableModal,
    [COMMANDS.SET_IPIM_VALUES_EVALUATE]: this.openInputModal,
    [COMMANDS.SET_TERM]: this.openTermModal,
    [COMMANDS.HIGHLIGHT]: this.highlightTerms,
    [COMMANDS.RESET]: this.resetDiagram,
    [COMMANDS.TWO_COLUMN]: this.handleTwoColumnToggleClick,
    [COMMANDS.SAVE]: this.saveDiagram,
    [COMMANDS.SAVETODB]: this.saveToDb,
    [COMMANDS.SET_IPIM_SUBPROCESS]: this.openSubprocessModal,
    [COMMANDS.SET_IPIM_EVALUATOR]: this.openEvaluatorModal,
    [COMMANDS.ZOOM_TO_FIT]: this.zoomToFit,
    [COMMANDS.EXPORT_SVG]: this.saveSVG,
    [COMMANDS.OPEN_SUBPROCESS_MODEL]: this.openSubProcessModel
  };

  /**
   * Using fat Arrow function here manipulates binding of this.
   * While do not using openDiagram here the "this.modeler.importXML" gets affected by this..
   * and is no longer recognized as a function
   */
  public ngOnInit() {
    console.log('modelId: ', this.modelId);
    this.commandQueue = new Subject();
    this.store.paletteEntries()
      .do(entries => this.extraPaletteEntries = entries)
      .subscribe(() => {
        return this.createModeler();
      });
    this.commandQueue.subscribe(cmd => {
      const func = this.funcMap[cmd.action];
      console.log(cmd.action, func);
      if (func) {
        func();
      }
    });
    this.exportModel.emit(this);
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

  private initializeModeler() {
    this.modeler = new this.modeler({
      container: '#' + this.modelId + ' ' + this.containerRef,
      propertiesPanel: {
        parent: '#' + this.modelId + ' ' + this.propsPanelRef
      },
      additionalModules: [
        {extraPaletteEntries: ['type', () => this.extraPaletteEntries]},
        {commandQueue: ['type', () => this.commandQueue]},
        this.propertiesPanelModule,
        this.propertiesProviderModule,
        customPaletteModule
      ],
      moddleExtensions: {
        camunda: this.camundaModdleDescriptor
      }
    });
  }

  /**
   * Creates the modeler Object from camunda bpmn-js package.
   * adds the extraPaletteEntries from the bpmn-store
   *
   */
  private createModeler() {
    this.initializeModeler();
    this.commandStack = new CommandStack(this.modeler, this, this.mqttService);
// Start with an empty diagram:
    const linkToDiagram = new Link(this.defaultModel);
    this.url = linkToDiagram.href; //this.urls[0].href;
    this.loadBPMN();
  }

  private registerFileDrop = (container: JQuery, callback: Function) => {
    const handleelect = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer.files;
      const file: File = files[0];
      const reader = new FileReader();
      reader.onload = (onLoadEvent: any) => {
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

    console.log(container);
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

  private createNewDiagram() {
    this.openDiagram(this.newDiagramXML);
  }

// private loadDiagram() {
//   this.apiService.getModel('test')
//     .subscribe(response => {
//         if (response.success) {
//           console.log(response.data);
//           this.openDiagram(response.data.modelxml);
//         } else {
//           console.log(response.error);
//         }
//       },
//       error => {
//         console.log(error);
//       });
// }

  private openDiagram = (xml: string) => {
    this.lastDiagramXML = xml;
    this.modeler.importXML(xml, (err: any) => {
      console.log('import successful');
    });
  }

  /**
   *
   */

  private loadBPMN() {
    this.modeler.importXML(this.newDiagramXML, this.handleError);
    this.loadedCompletely.emit();
    return;

// // console.log('load', this.url, this.store);
// const canvas = this.modeler.get('canvas');
// this.http.get(this.url)
//   .map((response: any) => response.text())
//   .map((data: any) => {
//     this.lastDiagramXML = data;
//     return this.modeler.importXML(data, this.handleError);
//   })
//   .subscribe(x => x ? this.handleError(x) : this.postLoad());
  }

  private postLoad() {
    console.log('publishing');
    this.commandStack.publishXML();
    const canvas = this.modeler.get('canvas');

    canvas.zoom('fit-viewport');
  }

  private handleError(err: any) {
    if (err) {
      console.log('error rendering', err);
    }
  }

  /**
   *
   */
  private getTermList = (scope: string): string[] => {
//Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === this.lookup.SELECTION
      ? elements = this.modeler.get(scope).get()
      : elements = this.modeler.get(scope).getAll();
    const terms: string[] = new Array();
//Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
//console.log(element, typeof element.businessObject.extensionElements);
//Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
//Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values'); // this.lookup.values
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

  private evaluateProcess = () => {
    //Stop MQTT from Publishing
    this.commandStack.startEvaluateMode();

    const elementRegistry = this.modeler.get(this.lookup.ELEMENTREGISTRY);
    const modeling = this.modeler.get(this.lookup.MODELING);
    // this.modeler.saveXML({format: true}, (err: any, xml: string) => {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   this.lastDiagramXML = xml;
    // });
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
            //sichere Sandbox für Eval Auswertung schaffen
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
  }

  private openFileDiagram() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
// Maybe HTML5 File API helps https://w3c.github.io/FileAPI/
      const file = (<HTMLInputElement>document.getElementById('file')).files[0];
      file ? this.getAsFile(file) : console.error('could not reach selected file..', file);
    }
  }

  private getAsFile = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file); // , 'UTF-16')
    reader.onerror = (e: any) => {
      console.log('Error opening File');
    };
    reader.onload = (e: any) => {
      this.lastDiagramXML = reader.result;
      this.openDiagram(this.lastDiagramXML);
    };
  }

  private toggleTermsColored(elementRegistry: any, modeling: any) {

    console.log('toggleTermscolored');
    // if (this.lastDiagramXML === '') {
    //   window.alert('No Diagram loaded!');
    //   return;
    // }

//Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const terms = this.getTermList('elementRegistry');
//Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
//console.log('after elementRegistry');

    const colorelements = this.ipimColors.map(() => []);
    for (const element of elements) {
//Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
//Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        for (let i = 0; i < extras[0].values.length; i++) {
          //Prüfen ob der Name des Elementes IPIM entspricht
          if (extras[0].values[i].name.toLowerCase() === this.ipimTags.CALC) {
            colorelements[terms.indexOf(extras[0].values[i].value) % this.ipimColors.length].push(element);
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
  }

  public showOverlay(): void {
    document.getElementById('overlayLoading').style.display = 'block';
  }

  public hideOverlay(): void {
    document.getElementById('overlayLoading').style.display = 'none';
  }

  public getCommandStack(): CommandStack {
    return this.commandStack;
  }

  public getEvaluator(): Evaluator {
    return this.evaluator;
  }

}