import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AdamoMqttService } from '../services/mqtt.service';
import { PaletteProvider } from './palette/palette';
import { CustomPropertiesProvider } from './properties/props-provider';
import { BPMNStore, Link } from '../bpmn-store/bpmn-store.service';
import { CommandStack } from './command/CommandStack';
//import {customModdle} from './custom-moddle';
import { camundaModdle } from './camunda-moddle';
import { Observable, Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from 'jquery';
import { FileReaderEvent } from './interfaces';

import LintModule from 'bpmn-js-bpmnlint';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import bpmnlintrc from './../../assets/packedLintrc';
import { TermModal } from './modals/TermModal/TermModal';
import { InputModal } from './modals/InputModal/InputModal';
import { VariableModal } from './modals/VariableModal/VariableModal';
import { SubProcessModal } from './modals/SubProcessModal/SubProcessModal';
import { EvalModal } from './modals/evaluatorModal/evaluatorModal';
import { SaveModal } from './modals/SaveModal/SaveModal';
import { UsageModal } from './modals/UsageModal/UsageModal';

import { COMMANDS } from '../bpmn-store/commandstore.service';
import { ApiService } from '../services/api.service';
import { Evaluator } from './evaluator/evaluator.component';
import * as FileSaver from 'file-saver';
import { Model } from '../models/model';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { SnackBarService } from '../services/snackbar.service';
import * as propertiesPanelModule from 'bpmn-js-properties-panel';
import * as propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';

import minimapModule from 'diagram-js-minimap';

import { NGXLogger } from 'ngx-logger';
import { tap } from 'rxjs/operators';
import { ModelDto } from '../entities/interfaces/ModelDto';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AuthService } from '../services';

const customPaletteModule = {
  paletteProvider: ['type', PaletteProvider],
};

@Component({
  selector: 'modeler',
  templateUrl: './modeler.component.html',
  styleUrls: ['./modeler.component.css'],
  providers: [BPMNStore],
})
export class ModelerComponent implements OnInit {
  @Input() public modelId: string;
  @Input() public newDiagramXML: string;
  @Input() public model: ModelDto;
  // @Output() public exportModel: EventEmitter<object> = new EventEmitter<
  //   object
  // >();
  @Output() public loadSubProcess: EventEmitter<Model> = new EventEmitter<Model>();
  @Output() public loadedCompletely: EventEmitter<null> = new EventEmitter<null>();
  public modeler: any = require('bpmn-js/lib/Modeler.js');
  // private propertiesPanelModule: any = require('bpmn-js-properties-panel');
  // private propertiesProviderModule: any = require('bpmn-js-properties-panel/lib/provider/camunda');
  //private originModule: any = require('diagram-js-origin');  //not useable with webpack 1 as it contains inline functions
  private termsColored = false;
  private ipimColors: string[] = IPIM_OPTIONS.COLORS;
  private lastDiagramXML = '';
  private url: string;
  private commandStack: any;
  private evaluator: Evaluator;
  private hideLoader = true;
  private modelerUrls: Link[];
  private snackbarText: string;
  private extraPaletteEntries: any;
  private commandQueue: Subject<any>;
  private container: Element; // = '#js-drop-zone';
  private containerRef = '#js-canvas';
  private propsPanelRef = '#js-properties-panel';
  private defaultModel = '/diagrams/scrum.bpmn';
  private camundaModdleDescriptor: any = require('camunda-bpmn-moddle/resources/camunda.json');
  private modelXML: string;
  //viewchilds import the html part of the modals and links them

  @ViewChild('ref') private el: ElementRef;
  @ViewChild('variableModal')
  private variableModal: VariableModal;
  @ViewChild('inputModal')
  private inputModal: InputModal;
  // @ViewChild("termModal")
  // private termModal: TermModal;
  @ViewChild('subProcessModal')
  private subProcessModal: SubProcessModal;
  @ViewChild('evalModal')
  private evaluatorModal: EvalModal;
  @ViewChild('saveModal')
  private saveModal: SaveModal;
  @ViewChild('usageModal')
  private usageModal: UsageModal;

  public modelVersion;
  public modelID;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private store: BPMNStore,
    private ref: ChangeDetectorRef,
    private snackbarService: SnackBarService,
    private router: Router,
    private mqttService: AdamoMqttService,
    private logger: NGXLogger,
    private authService: AuthService,
  ) {
    const splittedUrl = this.router.url.split('/');
    this.modelID = splittedUrl[splittedUrl.length - 2];
    this.modelVersion = splittedUrl[splittedUrl.length - 1];

    //  this.modelXML =
    this.apiService.getModel(this.modelID, this.modelVersion).subscribe((modelResponse: any) => {
      console.log(modelResponse);
      this.model = modelResponse;
      this.modelXML = modelResponse.modelXML;
      this.loadBPMN(this.modelXML);
    });
  }

  public ngOnDestroy(): void {
    this.modeler.destroy();
  }
  public importError?: Error;

  // diagramUrl = this.newDiagramXML;
  public handleImported(event) {
    const { type, error, warnings } = event;

    if (type === 'success') {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === 'error') {
      this.logger.debug(this.newDiagramXML);
      console.error('Failed to render diagram', error);
    }

    this.importError = error;
  }

  public ngOnInit() {
    this.logger.debug('modelId: ', this.modelId);

    //create custom commanqueue and pallete entries
    this.commandQueue = new Subject();
    this.store
      .paletteEntries()
      .pipe(tap((entries: any) => (this.extraPaletteEntries = entries)))
      .subscribe(() => {
        return this.initializeModeler();
      });
    //link everything with the function map
    this.commandQueue.subscribe((cmd: { action: string | number }) => {
      const func = this.funcMap[cmd.action];
      this.logger.debug(cmd.action, func);
      if (func) {
        func();
      }
    });
    //export this to create a new tab
    // this.exportModel.emit(this);
  }

  public ngAfterViewInit(): void {
    this.modeler.attachTo(this.el.nativeElement);
    //test if its a modern browser ...
    this.container = document.querySelector('js-drop-zone');
    if (!window.FileList || !window.FileReader) {
      window.alert(
        'Looks like you use an older browser that does not support drag and drop. ' +
          'Try using Chrome, Firefox or the Internet Explorer > 10.',
      );
    } else {
      this.logger.debug(this.container);
      this.registerFileDrop(this.container, this.openDiagram);
    }
  }

  //Notification when the modeler finished loading
  public onNotify(message: string): void {
    this.hideLoader = true;
    this.openDiagram(message);
  }

  // Prepare Modals and open them
  public openVariableModal = () => {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = { modeler: this.modeler };
    const variableModalRef = this.dialog.open(VariableModal, dialogConfig);
    // this.termModal.modal.open();

    variableModalRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log('termmodal confirmed');
        this.getCommandStack().publishXML(null);
        // snack.dismiss();
        // const a = document.createElement('a');
        // a.click();
        // a.remove();
        // snack.dismiss();
        // this.snackBar.open('Closing snack bar in a few seconds', 'Fechar', {
        //   duration: 2000,
        // });
      }
    });
    // this.variableModal.setProps(this.modeler, this);
    // this.variableModal.modal.open();
  };

  public openTermModal = () => {
    // this.termModal = new TermModal(this)
    // this.termModal.setProps(
    //   this.modeler,
    //   this.getTermList(this.lookup.SELECTION),
    //   this
    // );
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      terms: this.getTermList('elementRegistry'),
      modeler: this.modeler,
    };
    const termModalRef = this.dialog.open(TermModal, dialogConfig);
    // this.termModal.modal.open();

    termModalRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log('termmodal confirmed');
        // this.openDiagram();
        this.getCommandStack().publishXML(null);
        // snack.dismiss();
        // const a = document.createElement('a');
        // a.click();
        // a.remove();
        // snack.dismiss();
        // this.snackBar.open('Closing snack bar in a few seconds', 'Fechar', {
        //   duration: 2000,
        // });
      }
    });
  };

  public openInputModal = () => {
    // this.inputModal.setProps(this.modeler, this);
    // this.inputModal.modal.open();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = { modeler: this.modeler };
    const inputModalRef = this.dialog.open(InputModal, dialogConfig);
    // this.termModal.modal.open();

    inputModalRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log('evaluateProcessModalRef confirmed');

        this.evaluateProcess();
        // this.getCommandStack().publishXML();
        // snack.dismiss();
        // const a = document.createElement('a');
        // a.click();
        // a.remove();
        // snack.dismiss();
        // this.snackBar.open('Closing snack bar in a few seconds', 'Fechar', {
        //   duration: 2000,
        // });
      }
    });
    // this.variableModal.setProps(this.modeler, this);
    // this.variableModal.modal.open();
  };

  public openUsageModal = () => {
    this.usageModal.setProps(this.modeler, this, this.apiService);
    this.usageModal.modal.open();
  };

  public openSubprocessModal = () => {
    this.getSubProcessList(this.lookup.SELECTION);
  };

  public async openEvaluatorModal() {
    //before we can open the modal we have a lot of work to do so start with the current xml!
    try {
      const result = await this.modeler.saveXML({ format: true });
      const { xml } = result;
      console.log(xml);
      this.evaluator = new Evaluator(
        this.modelID,
        // this.modelId.split("_")[1],
        xml,
        this.apiService,
        this,
      );
      this.logger.debug('ElevatorModal_Clicked!');
    } catch (err) {
      console.log(err);
    }
  }

  //gets all subprocesses and loads the subprocess modal
  private getSubProcessList = (scope: string) => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === BPMNJSModelerLookupTablesEnum.SELECTION
      ? (elements = this.modeler.get(scope).get())
      : (elements = this.modeler.get(scope).getAll());
    const terms: string[] = [];
    let validSelection = false;
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.type === 'bpmn:SubProcess') {
        validSelection = true;
        this.logger.debug(element, typeof element.businessObject.extensionElements);
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get('values'); // this.lookup.values
          if (extras[0].values) {
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
              //Prüfen ob der Name des Elementes IPIM_Val entspricht
              if (extras[0].values[i].name.toLowerCase().startsWith(ModelerEvaluationTagsEnum.SUBPROCESS)) {
                if (terms.indexOf(extras[0].values[i].value) === -1) {
                  terms.push(extras[0].values[i].value);
                }
              }
            }
          }
        }
      }
    }
    if (!validSelection) {
      // window.alert('No Subprocess selected!');
      this.snackbarService.newSnackBarMessage('No Subprocess selected!', 'red');
    } else {
      this.subProcessModal.setProps(this.modeler, terms, this);
      this.subProcessModal.modal.open();
    }
  };

  //returns an array with all ids of processes referenced in this model
  private returnSubProcessList = (scope: string): string[] => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === BPMNJSModelerLookupTablesEnum.SELECTION
      ? (elements = this.modeler.get(scope).get())
      : (elements = this.modeler.get(scope).getAll());
    const terms: string[] = [];
    let validSelection = false;
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.type === 'bpmn:SubProcess') {
        validSelection = true;
        this.logger.debug(element, typeof element.businessObject.extensionElements);
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get('values'); // this.lookup.values
          if (extras[0].values) {
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
              //Prüfen ob der Name des Elementes IPIM_Val entspricht
              if (extras[0].values[i].name.toLowerCase().startsWith(ModelerEvaluationTagsEnum.SUBPROCESS)) {
                if (terms.indexOf(extras[0].values[i].value) === -1) {
                  terms.push(extras[0].values[i].value);
                }
              }
            }
          }
        }
      }
    }
    return terms;
  };

  //expands the left palette to 2 rows
  private expandToTwoColumns = (palette: JQuery) => {
    palette.addClass('two-column');
    palette.find('.glyphicon-th-large').removeClass('glyphicon-th-large').addClass('glyphicon-stop');
  };

  //collapses the left palette to 1 row
  private shrinkToOneColumn = (palette: JQuery) => {
    palette.removeClass('two-column');
    palette.find('.glyphicon-stop').removeClass('glyphicon-stop').addClass('glyphicon-th-large');
  };

  //toggles the palette between 1 and 2 rows ... works by adding classes to it or removing it
  private handleTwoColumnToggleClick = () => {
    const palette = $('.djs-palette');
    palette.hasClass('two-column') ? this.shrinkToOneColumn(palette) : this.expandToTwoColumns(palette);
  };

  //highlights all elements with a term .. or turns them back to black
  private highlightTerms = () => {
    this.logger.info('toggleTerms', this.termsColored);
    const elementRegistry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    //if colored return to black else color
    this.termsColored
      ? this.toggleTermsNormal(elementRegistry, modeling)
      : this.toggleTermsColored(elementRegistry, modeling);
    this.termsColored = !this.termsColored;
  };

  //resets the diagram back to before it was evaluated
  private resetDiagram = () => {
    //show loading overlay
    this.showOverlay();
    this.logger.debug(this.model);
    //get latest version from expressjs (can be database or collaborativ)
    this.apiService.getModel(this.model.id, this.model.modelVersion).subscribe(
      (response: any) => {
        const xml = response.modelXML;
        console.info('Reset-Model', xml);
        //Import Model
        this.modeler.importXML(xml);
        //reconnect mqtt
        this.commandStack.stopEvaluateMode();
        //hide overlay
        this.hideOverlay();
      },
      (error: any) => {
        this.logger.debug(error);
        //in any case reconect to mqtt and hide overlay
        this.commandStack.stopEvaluateMode();
        this.hideOverlay();
      },
    );
  };

  //saves the current model to DB
  private async saveToDb() {
    this.logger.debug('saving to db');
    //extract xml from modeler
    try {
      const result = await this.modeler.saveXML({ format: true });
      const { xml } = result;

      this.logger.debug(this.model);
      //upsert the current model
      this.apiService.modelUpsert(this.model.id, this.model.modelName, xml, this.model.modelVersion).subscribe(
        (response: any) => {
          this.logger.debug(response);
          //if version exists, show save modal else save it with new version+1
          if (response.status === 'Next Version already exists') {
            // this.saveModal.setModel(this.model, xml, this.apiService, this);
            // this.saveModal.modal.open();
          } else if (response.status === 'Model upserted successfully') {
            //show snackbar for success
            this.snackbarService.newSnackBarMessage('saved successfully', 'limegreen');
            //also save alls partmodels for later evaluation
            const partmodels = this.returnSubProcessList(BPMNJSModelerLookupTablesEnum.ELEMENTREGISTRY);
            partmodels.forEach((pmid) => {
              this.apiService
                .partModelCreate(this.modelId.split('_')[1], this.modelId.split('_')[2], pmid)
                .subscribe((response: any) => {
                  this.logger.debug(response);
                });
            });
          } else if (response.status === 'Model has no changes to save') {
            //show snackbar for success
            this.snackbarService.newSnackBarMessage('no changes to save', 'grey');
          } else {
            this.snackbarService.newSnackBarMessage('unknown error while saving', 'red');
          }
        },
        (error: { _body: string }) => {
          this.logger.debug(error);
          //somethig went wrong .. have a snack..
          this.snackbarService.newSnackBarMessage('Error: ' + JSON.parse(error._body).status, 'red');
        },
      );
    } catch (err) {
      console.log(err);
    }
  }

  //prepare diagram for file downlaod

  public async saveXMLWrapper() {
    let xmlResponse = '';
    try {
      const result = await this.modeler.saveXML({ format: true });
      const { xml } = result;
      console.log(xml);
      xmlResponse = xml;
      return xml;
    } catch (err) {
      console.log(err.message, err.warnings);
      return '';
    }
  }

  private async saveDiagram() {
    const downloadLink = $('#js-download-diagram');
    try {
      const result = await this.modeler.saveXML({ format: true });
      const { xml } = result;
      console.log(xml);
      const blob = new Blob([xml], { type: 'text/xml;charset=utf-8' });
      FileSaver.saveAs(blob, 'diagramm ' + this.modelId + '.bpmn');
    } catch (err) {
      console.log(err.message, err.warnings);
    }
  }

  //prepare diagram for svg download
  private async saveSVG() {
    const downloadSvgLink = $('#js-download-SVG');
    try {
      const result = await this.modeler.saveSVG();
      const { svg } = result;
      console.log(svg);
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      FileSaver.saveAs(blob, 'diagramm ' + this.modelId + '.svg');
    } catch (err) {
      console.log(err.message, err.warnings);
    }
    // this.modeler.s
  }

  private async exportToEngine() {
    try {
      const result = await this.modeler.saveXML({ format: true });
      const { xml } = result;
      console.log(xml);

      this.apiService.uploadToEngine(this.model.modelName + '.bpmn', xml);
    } catch (err) {
      console.log(err.message, err.warnings);
    }
  }

  //loads the currently selected subprocess in a new tab
  private openSubProcessModel = () => {
    this.loadSubProcessModel(BPMNJSModelerLookupTablesEnum.SELECTION);
  };

  //loads the currently selected subprocess in a new tab
  private loadSubProcessModel = (scope: string) => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === BPMNJSModelerLookupTablesEnum.SELECTION
      ? (elements = this.modeler.get(scope).get())
      : (elements = this.modeler.get(scope).getAll());
    const terms: string[] = [];
    let validSelection = false;
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.type === 'bpmn:SubProcess') {
        validSelection = true;
        this.logger.debug(element, typeof element.businessObject.extensionElements);
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get('values'); // this.lookup.values
          if (extras[0].values) {
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
              //Prüfen ob der Name des Elementes IPIM_Val entspricht
              if (extras[0].values[i].name.toLowerCase().startsWith(ModelerEvaluationTagsEnum.SUBPROCESS)) {
                if (terms.indexOf(extras[0].values[i].value) === -1) {
                  terms.push(extras[0].values[i].value);
                }
              }
            }
          }
        }
      }
    }
    //if selecton is valid show processes
    if (!validSelection) {
      this.snackbarService.newSnackBarMessage('No Subprocess selected!', 'red');
    } else {
      //get through each element and open it in new tab
      terms.forEach((element) => {
        this.showOverlay();
        if (element !== '') {
          this.apiService.getModel(element).subscribe(
            (response: any) => {
              const model = new Model(response.data);
              console.info(model);
              //emit event for new model
              this.loadSubProcess.emit(model);
              //remove overlay in any case
              this.hideOverlay();
              this.snackbarService.newSnackBarMessage('successfully loaded', 'limegreen');
            },
            (error: any) => {
              //remove overlay in any case
              this.snackbarService.newSnackBarMessage('Error: ' + JSON.parse(error._body).status, 'red');
              this.hideOverlay();
              this.logger.debug(error);
            },
          );
        } else {
          window.alert('Noting selected!');
          return;
        }
      });
    }
  };

  //resets zoom, so that whole diagram fits
  private zoomToFit = () => {
    const canvasObject = this.modeler.get('canvas');
    canvasObject.zoom(BPMNJSModelerLookupTablesEnum.FIT_VIEWPORT);
  };

  //functionmap to link the palette buttons with an actual function
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
    [COMMANDS.OPEN_USAGE_MODEL]: this.openUsageModal,
    [COMMANDS.ZOOM_TO_FIT]: this.zoomToFit,
    [COMMANDS.EXPORT_SVG]: this.saveSVG,
    [COMMANDS.EXPORT_ENGINE]: this.exportToEngine,
    [COMMANDS.OPEN_SUBPROCESS_MODEL]: this.openSubProcessModel,
  };

  //initializes a new moderler with custom props and palette
  private initializeModeler() {
    this.modeler = new BpmnModeler({
      // container: '#' + this.modelId ,//+ ' > ' ,//+ this.containerRef,
      // container: "#canvas", //+ ' > ' ,//+ this.containerRef,

      linting: {
        bpmnlint: bpmnlintrc,
        active: true,
      },
      keyboard: {
        bindTo: document,
      },
      propertiesPanel: {
        parent: this.propsPanelRef,

        // parent: '#' + this.modelId + ' ' + this.propsPanelRef
      },
      additionalModules: [
        // {
        //   __init__: ["eventBusLogger"],
        //   eventBusLogger: ["type", EventBusLogger]
        // },
        { extraPaletteEntries: ['type', () => this.extraPaletteEntries] },
        { commandQueue: ['type', () => this.commandQueue] },
        propertiesPanelModule,
        propertiesProviderModule,
        customPaletteModule,
        LintModule,
        minimapModule,
      ],
      moddleExtensions: {
        camunda: this.camundaModdleDescriptor,
      },
    });

    this.commandStack = new CommandStack(this.modeler, this, this.mqttService, this.authService);
    const commandStack = this.modeler.get(BPMNJSModelerLookupTablesEnum.COMMANDSTACK);

    document.addEventListener('keypress', function (event) {
      if (event.key === BPMNJSModelerLookupTablesEnum.UNDO) {
        commandStack.undo();
      } else if (event.key === BPMNJSModelerLookupTablesEnum.REDO) {
        commandStack.redo();
      }
    });
  }

  /**
   * Creates the modeler Object from camunda bpmn-js package.
   * adds the extraPaletteEntries from the bpmn-store
   *
   */
  //register the filedrop ... no longer working as we use tabbed modeling now
  private registerFileDrop = (container: Element, callback: Function) => {
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
        this.logger.debug(file.name);
        reader.readAsText(file);
      }
    };

    //drop function ... no longer enabled as we use tabbed
    const handleDragOver = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    this.logger.debug(container);
    const firstElementInContainer = container.get(0);

    if (firstElementInContainer) {
      container.get(0).addEventListener('dragover', handleDragOver, false);
      container.get(0).addEventListener('drop', handleelect, false);
    } else {
      console.error('firstElementInContainer is undefined', container);
    }
  };

  //retruns the color of all elements in the modeler back to black
  private toggleTermsNormal = (elementRegistry: any, modeling: any) => {
    this.logger.debug('toggleTermsNormal');
    modeling.setColor(elementRegistry.getAll(), { stroke: 'black' });
  };

  //create a new digagramm .. no longer used as we tab now
  private createNewDiagram() {
    this.openDiagram(this.newDiagramXML);
  }

  //opens a diagram, mostly capsules the modeler import function
  private async openDiagram(xml: string) {
    try {
      const result = await this.modeler.importXML(xml);
      const { warnings } = result;
      console.log(warnings);
      this.lastDiagramXML = xml;
    } catch (err) {
      console.log(err.message, err.warnings);
    }
  }

  //laods the bpmn and emit an event when the laoding is finished
  private async loadBPMN(modelXML: any) {
    console.log(modelXML);
    try {
      const result = await this.modeler.importXML(modelXML);
      const { warnings } = result;
      console.log(warnings);
      this.loadedCompletely.emit();
      //show snackbar for successfull loading!
      this.snackbarService.newSnackBarMessage('loaded successfully', 'limegreen');

      const palette = $('.djs-palette');
      this.expandToTwoColumns(palette);
    } catch (err) {
      console.log(err.message, err.warnings);
    }
    return;
  }

  //update as soon as loading is finished
  private postLoad() {
    this.logger.debug('publishing');
    this.commandStack.publishXML();
    const canvas = this.modeler.get(BPMNJSModelerLookupTablesEnum.CANVAS);

    canvas.zoom(BPMNJSModelerLookupTablesEnum.FIT_VIEWPORT.toString());
  }

  //returns a list of all terms of selected elements
  public getTermList = (scope: string): string[] => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === BPMNJSModelerLookupTablesEnum.SELECTION
      ? (elements = this.modeler.get(scope).get())
      : (elements = this.modeler.get(scope).getAll());
    const terms: string[] = [];
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
        //Wenn vorhanden die Elemente auslesen
        const extras = element.businessObject.extensionElements.get(BPMNJSModelerLookupTablesEnum.VALUES); // this.lookup.values
        if (extras[0].values) {
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (extras[0].values[i].name.toLowerCase().startsWith(ModelerEvaluationTagsEnum.CALC)) {
              if (terms.indexOf(extras[0].values[i].value) === -1) {
                terms.push(extras[0].values[i].value);
              }
            }
          }
        }
      }
    }
    return terms;
  };

  //Evaluates an process and stops the mqtt from publishing
  private evaluateProcess = () => {
    //Stop MQTT from Publishing
    this.commandStack.startEvaluateMode();

    const elementRegistry = this.modeler.get(BPMNJSModelerLookupTablesEnum.ELEMENTREGISTRY);
    const modeling = this.modeler.get(BPMNJSModelerLookupTablesEnum.MODELING);
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    const varValMap = {};
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        if (extras[0].values) {
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            const valueName = extras[0].values[i].name.toLowerCase();
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (valueName.startsWith('IPIM_Val_'.toLowerCase())) {
              //Variablen als Key mit Wert in Map übernehmen
              varValMap[valueName.replace(ModelerEvaluationTagsEnum.VAL.toLowerCase(), '')] = extras[0].values[
                i
              ].value.toLowerCase();
            }
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (valueName.startsWith(ModelerEvaluationTagsEnum.META.toLowerCase())) {
              //Variablen als Key mit Wert in Map übernehmen
              varValMap[valueName.replace(ModelerEvaluationTagsEnum.META.toLowerCase(), '')] = extras[0].values[
                i
              ].value.toLowerCase();
            }
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
        if (extras[0].values) {
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM entspricht
            if (extras[0].values[i].name.toLowerCase() === ModelerEvaluationTagsEnum.CALC) {
              //Stringoperationen um den Wert anzupassen.
              let evalterm = extras[0].values[i].value.toLowerCase();
              //Solange ein [ Zeichen vorkommt, String nach Variablen durchszuchen und ersetzen mit VarValMap einträgen
              while (evalterm.includes('[')) {
                // [ ist vorhanden, daher String nach Substrings durchsuchen
                const substr = evalterm.substring(evalterm.indexOf('[') + '['.length, evalterm.indexOf(']'));
                //evalterm mit String.replace veränderun und variablenwert einsetzen.
                evalterm = evalterm.replace('[' + substr + ']', varValMap[substr]);
              }

              // import Interpreter from 'js-interpreter';
              const jSInterpreter = require('js-interpreter');
              const interpreter = new jSInterpreter(evalterm);

              interpreter.run();
              // Mittels Teufelsmagie(eval) prüfen ob der zugehörige Wert TRUE ist
              const evalResult: boolean = interpreter.value.data;
              this.logger.debug('using js-interpreter for: ', evalterm, 'Result: ', evalResult);
              if (!evalResult) {
                // Mittels Teufelsmagie(eval) prüfen ob der zugehörige Wert TRUE ist
                // if (!eval(evalterm)) {
                //Element über modeling Objekt löschen
                modeling.removeElements([element]);
              }
            }
          }
        }
      }
    }
  };

  //colors elements of the modeler based on their terms colors are received from palette
  private toggleTermsColored(elementRegistry: any, modeling: any) {
    this.logger.debug('toggleTermscolored');
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const terms = this.getTermList(BPMNJSModelerLookupTablesEnum.ELEMENTREGISTRY);
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    console.log(elements);

    const colorelements = this.ipimColors.map(() => []);
    for (const element of elements) {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get('values');
        if (extras[0].values) {
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM entspricht
            if (extras[0].values[i].name.toLowerCase() === ModelerEvaluationTagsEnum.CALC) {
              console.log(element);
              colorelements[terms.indexOf(extras[0].values[i].value) % this.ipimColors.length].push(element);
            }
          }
        }
      }
    }
    //maps the color of the term bases on the IPIM color palette
    this.logger.info('Color Element list, ', colorelements);
    this.ipimColors.map((elem, index) => {
      if (colorelements[index].length > 0) {
        console.log(colorelements[index]);
        this.highlightElement(colorelements[index], index);
      }
    });
  }

  private highlightElement(elements: any, index: number) {
    // const registry = this.modeler.get('elementRegistry');
    const modeling = this.modeler.get('modeling');
    // for (const element of elements) {
    //
    //   this.logger.info('elements', elements, '[elements]', [elements], 'registry.get(element.id)', registry.get(element.id), 'element', element)
    //   // modeling.setColor( registry.get(element.id), { stroke: this.ipimColors[index] });
    //   // modeling.setColor(elements, { stroke: this.ipimColors[index] });
    // }
    modeling.setColor(elements, { stroke: this.ipimColors[index] });
  }

  //shows an Overlay for loading purposes
  public showOverlay(): void {
    const x = (document.getElementById('overlayLoading-' + this.modelId).style.display = 'block');
  }

  //hides the Overlay again
  public hideOverlay(): void {
    const x = (document.getElementById('overlayLoading-' + this.modelId).style.display = 'none');
  }

  //gets the commandstack for publishing on the mqtt
  public getCommandStack(): CommandStack {
    return this.commandStack;
  }

  //gets the evaluator for acces to zip download evaluation
  public getEvaluator(): Evaluator {
    return this.evaluator;
  }
}
