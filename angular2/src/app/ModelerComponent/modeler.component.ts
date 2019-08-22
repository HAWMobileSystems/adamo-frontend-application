import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { Router } from "@angular/router";
import { Http, Jsonp } from "@angular/http";
import { AdamoMqttService } from "../services/mqtt.service";
import { PaletteProvider } from "./palette/palette";
import { CustomPropertiesProvider } from "./properties/props-provider";
import { BPMNStore, Link } from "../bpmn-store/bpmn-store.service";
import { CommandStack } from "./command/CommandStack";
//import {customModdle} from './custom-moddle';
import { camundaModdle } from "./camunda-moddle";
import { Observable, Subject } from "rxjs";
import { ChangeDetectorRef } from "@angular/core";
import * as $ from "jquery";
import { FileReaderEvent } from "./interfaces";

import BpmnModeler from "bpmn-js/lib/Modeler";
import { TermModal } from "./modals/TermModal/TermModal";
import { InputModal } from "./modals/InputModal/InputModal";
import { VariableModal } from "./modals/VariableModal/VariableModal";
import { SubProcessModal } from "./modals/SubProcessModal/SubProcessModal";
import { EvalModal } from "./modals/evaluatorModal/evaluatorModal";
import { SaveModal } from "./modals/SaveModal/SaveModal";
import { UsageModal } from "./modals/UsageModal/UsageModal";

import { COMMANDS } from "../bpmn-store/commandstore.service";
import { ApiService } from "../services/api.service";
import { Evaluator } from "./evaluator/evaluator.component";
import * as FileSaver from "file-saver";
import { Model } from "../models/model";
import { IPIM_OPTIONS } from "../modelerConfig.service";
import { SnackBarService } from "../services/snackbar.service";
import * as propertiesPanelModule from "bpmn-js-properties-panel";

import * as propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

import { NGXLogger } from "ngx-logger";
import { tap } from "rxjs/operators";

const customPaletteModule = {
  paletteProvider: ["type", PaletteProvider]
};

@Component({
  selector: "modeler",
  templateUrl: "./modeler.component.html",
  styleUrls: ["./modeler.component.css"],
  providers: [BPMNStore]
})
export class ModelerComponent implements OnInit {
  @Input() public modelId: string;
  @Input() public newDiagramXML: string;
  @Input() public model: any;
  @Output() public exportModel: EventEmitter<object> = new EventEmitter<
    object
  >();
  @Output() public loadSubProcess: EventEmitter<Model> = new EventEmitter<
    Model
  >();
  @Output() public loadedCompletely: EventEmitter<null> = new EventEmitter<
    null
  >();
  private modeler: any = require("bpmn-js/lib/Modeler.js");
  // private propertiesPanelModule: any = require('bpmn-js-properties-panel');
  // private propertiesProviderModule: any = require('bpmn-js-properties-panel/lib/provider/camunda');
  //private originModule: any = require('diagram-js-origin');  //not useable with webpack 1 as it contains inline functions
  private termsColored: boolean = false;
  private ipimColors: string[] = IPIM_OPTIONS.COLORS;
  private lastDiagramXML: string = "";
  private url: string;
  private commandStack: any;
  private evaluator: Evaluator;
  private hideLoader: boolean = true;
  private modelerUrls: Link[];
  private snackbarText: string;
  private extraPaletteEntries: any;
  private commandQueue: Subject<any>;
  private container: JQuery; // = '#js-drop-zone';
  private containerRef: string = "#js-canvas";
  private propsPanelRef: string = "#js-properties-panel";
  private defaultModel: string = "/diagrams/scrum.bpmn";
  private camundaModdleDescriptor: any = require("camunda-bpmn-moddle/resources/camunda.json");

  //viewchilds import the html part of the modals and links them

  @ViewChild("ref") private el: ElementRef;
  @ViewChild("variableModal")
  private variableModal: VariableModal;
  @ViewChild("inputModal")
  private inputModal: InputModal;
  @ViewChild("termModal")
  private termModal: TermModal;
  @ViewChild("subProcessModal")
  private subProcessModal: SubProcessModal;
  @ViewChild("evalModal")
  private evaluatorModal: EvalModal;
  @ViewChild("saveModal")
  private saveModal: SaveModal;
  @ViewChild("usageModal")
  private usageModal: UsageModal;

  //definitions for IPIM background texts
  private ipimTags: any = {
    META: "IPIM_meta_",
    VAL: "IPIM_Val_",
    CALC: "ipim_calc",
    SUBPROCESS: "ipim_subprocess"
  };

  //definitions for modeler parts
  private lookup: any = {
    MODELING: "modeling",
    ELEMENTREGISTRY: "elementRegistry",
    SELECTION: "selection",
    VALUES: "values"
  };

  constructor(
    private apiService: ApiService,
    private http: Http,
    private store: BPMNStore,
    private ref: ChangeDetectorRef,
    private snackbarService: SnackBarService,
    private router: Router,
    private mqttService: AdamoMqttService,
    private logger: NGXLogger
  ) {}

  ngOnDestroy(): void {
    this.modeler.destroy();
  }
  importError?: Error;

  diagramUrl = this.newDiagramXML;
  handleImported(event) {
    const { type, error, warnings } = event;

    if (type === "success") {
      console.log(`Rendered diagram (%s warnings)`, warnings.length);
    }

    if (type === "error") {
      this.logger.debug(this.newDiagramXML);
      console.error("Failed to render diagram", error);
    }

    this.importError = error;
  }

  public ngOnInit() {
    this.logger.debug("modelId: ", this.modelId);

    //create custom commanqueue and pallete entries
    this.commandQueue = new Subject();
    this.store
      .paletteEntries()
      .pipe(tap((entries: any) => (this.extraPaletteEntries = entries)))
      .subscribe(() => {
        return this.createModeler();
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
    this.exportModel.emit(this);
  }

  public ngAfterViewInit(): void {
    this.modeler.attachTo(this.el.nativeElement);
    // this is scary as fuck -.-
    //test if its a modern browser ...
    $(document).ready(() => {
      this.container = $("#js-drop-zone");
      if (!window.FileList || !window.FileReader) {
        window.alert(
          "Looks like you use an older browser that does not support drag and drop. " +
            "Try using Chrome, Firefox or the Internet Explorer > 10."
        );
      } else {
        this.logger.debug(this.container);
        this.registerFileDrop(this.container, this.openDiagram);
      }

      //get ipim logo and append it to camunda logo
      // const img = document.getElementById('ipimlogo-' + this.modelId);
      // this.modeler.container.append(img);
    });
  }

  //Notification when the modeler finished loading
  public onNotify(message: string): void {
    this.hideLoader = true;
    this.openDiagram(message);
  }

  // Prepare Modals and open them
  public openTermModal = () => {
    this.termModal.setProps(
      this.modeler,
      this.getTermList(this.lookup.SELECTION),
      this
    );
    this.termModal.modal.open();
  };

  public openInputModal = () => {
    this.inputModal.setProps(this.modeler, this);
    this.inputModal.modal.open();
  };
  public openVariableModal = () => {
    this.variableModal.setProps(this.modeler, this);
    this.variableModal.modal.open();
  };

  public openUsageModal = () => {
    this.usageModal.setProps(this.modeler, this, this.apiService);
    this.usageModal.modal.open();
  };

  public openSubprocessModal = () => {
    this.getSubProcessList(this.lookup.SELECTION);
  };

  public openEvaluatorModal = () => {
    //before we can open the modal we have a lot of work to do so start with the current xml!
    this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
      this.evaluator = new Evaluator(
        this.modelId.split("_")[1],
        xml,
        this.apiService,
        this
      );
      this.logger.debug("ElevatorModal_Clicked!");
    });
  };

  //gets all subprocesses and loads the subprocess modal
  private getSubProcessList = (scope: string) => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === this.lookup.SELECTION
      ? (elements = this.modeler.get(scope).get())
      : (elements = this.modeler.get(scope).getAll());
    const terms: string[] = new Array();
    let validSelection = false;
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.type === "bpmn:SubProcess") {
        validSelection = true;
        this.logger.debug(
          element,
          typeof element.businessObject.extensionElements
        );
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get("values"); // this.lookup.values
          if (extras[0].values) {
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
              //Prüfen ob der Name des Elementes IPIM_Val entspricht
              if (
                extras[0].values[i].name
                  .toLowerCase()
                  .startsWith(this.ipimTags.SUBPROCESS)
              ) {
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
      this.snackbarService.newSnackBarMessage("No Subprocess selected!", "red");
    } else {
      this.subProcessModal.setProps(this.modeler, terms, this);
      this.subProcessModal.modal.open();
    }
  };

  //returns an array with all ids of processes referenced in this model
  private returnSubProcessList = (scope: string): string[] => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === this.lookup.SELECTION
      ? (elements = this.modeler.get(scope).get())
      : (elements = this.modeler.get(scope).getAll());
    const terms: string[] = new Array();
    let validSelection = false;
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.type === "bpmn:SubProcess") {
        validSelection = true;
        this.logger.debug(
          element,
          typeof element.businessObject.extensionElements
        );
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get("values"); // this.lookup.values
          if (extras[0].values) {
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
              //Prüfen ob der Name des Elementes IPIM_Val entspricht
              if (
                extras[0].values[i].name
                  .toLowerCase()
                  .startsWith(this.ipimTags.SUBPROCESS)
              ) {
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
    palette.addClass("two-column");
    palette
      .find(".glyphicon-th-large")
      .removeClass("glyphicon-th-large")
      .addClass("glyphicon-stop");
  };

  //collapses the left palette to 1 row
  private shrinkToOneColumn = (palette: JQuery) => {
    palette.removeClass("two-column");
    palette
      .find(".glyphicon-stop")
      .removeClass("glyphicon-stop")
      .addClass("glyphicon-th-large");
  };

  //toggles the palette between 1 and 2 rows ... works by adding classes to it or removing it
  private handleTwoColumnToggleClick = () => {
    const palette = $(".djs-palette");
    palette.hasClass("two-column")
      ? this.shrinkToOneColumn(palette)
      : this.expandToTwoColumns(palette);
  };

  //highlights all elements with a term .. or turns them back to black
  private highlightTerms = () => {
    //get modeler objects
    const elementRegistry = this.modeler.get("elementRegistry");
    const modeling = this.modeler.get("modeling");
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
    this.apiService.getModel(this.model.id, this.model.version).subscribe(
      (response: { data: { modelxml: any } }) => {
        const xml = response.data.modelxml;
        console.info("Reset-Model", xml);
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
      }
    );
  };

  //saves the current model to DB
  private saveToDb = () => {
    this.logger.debug("saving to db");
    //extract xml from modeler
    this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
      if (err) {
        console.error(err);
        return;
      }
      this.logger.debug(this.model);
      //upsert the current model
      this.apiService
        .modelUpsert(this.model.id, this.model.name, xml, this.model.version)
        .subscribe(
          (response: { status: string }) => {
            this.logger.debug(response);
            //if version exists, show save modal else save it with new version+1
            if (response.status === "Next Version already exists") {
              this.saveModal.setModel(this.model, xml, this.apiService, this);
              this.saveModal.modal.open();
            } else if (response.status === "Model upserted successfully") {
              //show snackbar for success
              this.snackbarService.newSnackBarMessage(
                "saved successfully",
                "limegreen"
              );
              //also save alls partmodels for later evaluation
              const partmodels = this.returnSubProcessList(
                this.lookup.ELEMENTREGISTRY
              );
              partmodels.forEach(pmid => {
                this.apiService
                  .partModelCreate(
                    this.modelId.split("_")[1],
                    this.modelId.split("_")[2],
                    pmid
                  )
                  .subscribe((response: any) => {
                    this.logger.debug(response);
                  });
              });
            } else if (response.status === "Model has no changes to save") {
              //show snackbar for success
              this.snackbarService.newSnackBarMessage(
                "no changes to save",
                "grey"
              );
            } else {
              this.snackbarService.newSnackBarMessage(
                "unknown error while saving",
                "red"
              );
            }
          },
          (error: { _body: string }) => {
            this.logger.debug(error);
            //somethig went wrong .. have a snack..
            this.snackbarService.newSnackBarMessage(
              "Error: " + JSON.parse(error._body).status,
              "red"
            );
          }
        );
    });
  };

  //prepare diagram for file downlaod
  private saveDiagram = () => {
    const downloadLink = $("#js-download-diagram");
    this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
      const blob = new Blob([xml], { type: "text/xml;charset=utf-8" });
      FileSaver.saveAs(blob, "diagramm " + this.modelId + ".bpmn");
    });
  };

  //prepare diagram for svg download
  private saveSVG = () => {
    const downloadSvgLink = $("#js-download-SVG");
    this.modeler.saveSVG((err: any, svg: any) => {
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      FileSaver.saveAs(blob, "diagramm " + this.modelId + ".svg");
    });
  };

  private exportToEngine = () => {
    this.modeler.saveXML({ format: true }, (err: any, xml: any) => {
      this.apiService.uploadToEngine(this.model.name + ".bpmn", xml);
      // .subscribe(response => {
      //   this.logger.debug(response);
      // });
    });
  };

  //loads the currently selected subprocess in a new tab
  private openSubProcessModel = () => {
    this.loadSubProcessModel(this.lookup.SELECTION);
  };

  //loads the currently selected subprocess in a new tab
  private loadSubProcessModel = (scope: string) => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === this.lookup.SELECTION
      ? (elements = this.modeler.get(scope).get())
      : (elements = this.modeler.get(scope).getAll());
    const terms: string[] = new Array();
    let validSelection = false;
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      if (element.type === "bpmn:SubProcess") {
        validSelection = true;
        this.logger.debug(
          element,
          typeof element.businessObject.extensionElements
        );
        //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
        if (element.businessObject.extensionElements) {
          //Wenn vorhandne die Elemente auslesen
          const extras = element.businessObject.extensionElements.get("values"); // this.lookup.values
          if (extras[0].values) {
            //Schleife über alle Elemente
            for (let i = 0; i < extras[0].values.length; i++) {
              //Prüfen ob der Name des Elementes IPIM_Val entspricht
              if (
                extras[0].values[i].name
                  .toLowerCase()
                  .startsWith(this.ipimTags.SUBPROCESS)
              ) {
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
      this.snackbarService.newSnackBarMessage("No Subprocess selected!", "red");
    } else {
      //get through each element and open it in new tab
      terms.forEach(element => {
        this.showOverlay();
        if (element !== "") {
          this.apiService.getModel(element).subscribe(
            (response: any) => {
              const model = new Model(response.data);
              // model.xml = response.data.modelxml;
              // model.name = response.data.modelname;
              // model.id = response.data.mid;
              // model.version = response.data.version;
              console.info(model);
              //emit event for new model
              this.loadSubProcess.emit(model);
              //remove overlay in any case
              this.hideOverlay();
              this.snackbarService.newSnackBarMessage(
                "successfully loaded",
                "limegreen"
              );
            },
            (error: any) => {
              //remove overlay in any case
              this.snackbarService.newSnackBarMessage(
                "Error: " + JSON.parse(error._body).status,
                "red"
              );
              this.hideOverlay();
              this.logger.debug(error);
            }
          );
        } else {
          window.alert("Noting selected!");
          return;
        }
      });
    }
  };

  //resets zoom, so that whole diagram fits
  private zoomToFit = () => {
    const canvasObject = this.modeler.get("canvas");
    canvasObject.zoom("fit-viewport");
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
    [COMMANDS.OPEN_SUBPROCESS_MODEL]: this.openSubProcessModel
  };

  //initializes a new moderler with custom props and palette
  private initializeModeler() {
    this.logger.debug("customPaletteModule", customPaletteModule);
    this.logger.debug("modelId", this.modelId);
    this.logger.debug("containerRef", this.containerRef);
    this.logger.debug("camundamoddledescriptor", this.camundaModdleDescriptor);
    this.logger.debug("extraPaletteEntries", this.extraPaletteEntries);
    this.logger.debug("commandQueue", this.commandQueue);
    this.logger.debug("propertiesPanelModule", propertiesPanelModule);
    this.logger.debug("propertiesProviderModule", propertiesProviderModule);
    this.modeler = new BpmnModeler({
      // container: '#' + this.modelId ,//+ ' > ' ,//+ this.containerRef,
      // container: "#canvas", //+ ' > ' ,//+ this.containerRef,
      // propertiesPanel: {
      //   parent: '#' + this.modelId + ' ' + this.propsPanelRef
      // },
      additionalModules: [
        { extraPaletteEntries: ["type", () => this.extraPaletteEntries] },
        { commandQueue: ["type", () => this.commandQueue] },
        propertiesPanelModule,
        propertiesProviderModule,
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
    try {
      this.commandStack = new CommandStack(
        this.modeler,
        this,
        this.mqttService
      );
    } catch (error) {
      this.logger.debug("error in commandstack init", error);
    }
    // Start with an empty diagram:
    const linkToDiagram = new Link(this.defaultModel);
    this.url = linkToDiagram.href; //this.urls[0].href;
    this.loadBPMN();
  }

  //register the filedrop ... no longer working as we use tabbed modeling now
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

      if (file.name.indexOf(".bpmn") !== -1) {
        this.logger.debug(file.name);
        reader.readAsText(file);
      }
    };

    //drop function ... no longer enabled as we use tabbed
    const handleDragOver = (e: any) => {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
    };

    this.logger.debug(container);
    const firstElementInContainer = container.get(0);

    if (firstElementInContainer) {
      container.get(0).addEventListener("dragover", handleDragOver, false);
      container.get(0).addEventListener("drop", handleelect, false);
    } else {
      console.error("firstElementInContainer is undefined", container);
    }
  };

  //retruns the color of all elements in the modler back to black
  private toggleTermsNormal = (elementRegistry: any, modeling: any) => {
    this.logger.debug("toggleTermsNormal");
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    modeling.setColor(elements, {
      stroke: "black"
    });
  };

  //create a new digagramm .. no longer used as we tab now
  private createNewDiagram() {
    this.openDiagram(this.newDiagramXML);
  }

  //opens a diagram, mostly capsules the modeler import function
  private openDiagram = (xml: string) => {
    this.lastDiagramXML = xml;
    this.modeler.importXML(xml, (err: any) => {
      this.logger.debug("import successful");
    });
  };

  //laods the bpmn and emit an event when the laoding is finished
  private loadBPMN() {
    this.modeler.importXML(this.newDiagramXML, this.handleError);
    this.loadedCompletely.emit();
    //show snackbar for successfull loading!
    this.snackbarService.newSnackBarMessage("loaded successfully", "limegreen");
    //set default 2 row palette
    const palette = $(".djs-palette");
    this.expandToTwoColumns(palette);
    return;
  }

  //update as soon as loading is finished
  private postLoad() {
    this.logger.debug("publishing");
    this.commandStack.publishXML();
    const canvas = this.modeler.get("canvas");

    canvas.zoom("fit-viewport");
  }

  private handleError(err: any) {
    if (err) {
      this.logger.debug("error rendering", err);
    }
  }

  //returns a list of all terms of selected elements
  private getTermList = (scope: string): string[] => {
    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    let elements: any;
    scope === this.lookup.SELECTION
      ? (elements = this.modeler.get(scope).get())
      : (elements = this.modeler.get(scope).getAll());
    const terms: string[] = new Array();
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get("values"); // this.lookup.values
        if (extras[0].values) {
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (
              extras[0].values[i].name
                .toLowerCase()
                .startsWith(this.ipimTags.CALC)
            ) {
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

    const elementRegistry = this.modeler.get(this.lookup.ELEMENTREGISTRY);
    const modeling = this.modeler.get(this.lookup.MODELING);
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();
    const varValMap = {};
    //Alle Elemente durchlaufen um Variablen zu finden
    for (const element of elements) {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get("values");
        if (extras[0].values) {
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            const valueName = extras[0].values[i].name.toLowerCase();
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (valueName.startsWith("IPIM_Val_".toLowerCase())) {
              //Variablen als Key mit Wert in Map übernehmen
              varValMap[
                valueName.replace("IPIM_Val_".toLowerCase(), "")
              ] = extras[0].values[i].value.toLowerCase();
            }
            //Prüfen ob der Name des Elementes IPIM_Val entspricht
            if (valueName.startsWith("IPIM_META_".toLowerCase())) {
              //Variablen als Key mit Wert in Map übernehmen
              varValMap[
                valueName.replace("IPIM_META_".toLowerCase(), "")
              ] = extras[0].values[i].value.toLowerCase();
            }
          }
        }
      }
    }
    //Alle Elemente durchlaufen um Evaluationsterme auszuwerten
    for (const element of elements) {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (typeof element.businessObject.extensionElements !== "undefined") {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get("values");
        if (extras[0].values) {
          //Schleife über alle Elemente
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM entspricht
            if (extras[0].values[i].name.toLowerCase() === this.ipimTags.CALC) {
              //Stringoperationen um den Wert anzupassen.
              let evalterm = extras[0].values[i].value.toLowerCase();
              //Solange ein [ Zeichen vorkommt, String nach Variablen durchszuchen und ersetzen mit VarValMap einträgen
              while (evalterm.includes("[")) {
                // [ ist vorhanden, daher String nach Substrings durchsuchen
                const substr = evalterm.substring(
                  evalterm.indexOf("[") + "[".length,
                  evalterm.indexOf("]")
                );
                //evalterm mit String.replace veränderun und variablenwert einsetzen.
                evalterm = evalterm.replace(
                  "[" + substr + "]",
                  varValMap[substr]
                );
              }

              // import Interpreter from 'js-interpreter';
              const jSInterpreter = require("js-interpreter");
              const interpreter = new jSInterpreter(evalterm);

              interpreter.run();
              // Mittels Teufelsmagie(eval) prüfen ob der zugehörige Wert TRUE ist
              const evalResult: boolean = interpreter.value.data;
              this.logger.debug(
                "using js-interpreter for: ",
                evalterm,
                "Result: ",
                evalResult
              );
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
    this.logger.debug("toggleTermscolored");

    //Objekte vom this.modeler holen um nicht immer so viel tippen zu müssen.
    const terms = this.getTermList("elementRegistry");
    //Alle Elemente der ElementRegistry holen
    const elements = elementRegistry.getAll();

    const colorelements = this.ipimColors.map(() => []);
    for (const element of elements) {
      //Prüfen ob erweiterte Eigenschaften für das Objekt existieren
      if (element.businessObject.extensionElements) {
        //Wenn vorhandne die Elemente auslesen
        const extras = element.businessObject.extensionElements.get("values");
        if (extras[0].values) {
          for (let i = 0; i < extras[0].values.length; i++) {
            //Prüfen ob der Name des Elementes IPIM entspricht
            if (extras[0].values[i].name.toLowerCase() === this.ipimTags.CALC) {
              colorelements[
                terms.indexOf(extras[0].values[i].value) %
                  this.ipimColors.length
              ].push(element);
            }
          }
        }
      }
    }
    //maps the color of the term bases on the IPIM color palette
    this.ipimColors.map((elem, index) => {
      if (colorelements[index].length > 0) {
        this.highlightElement(colorelements[index], index);
        // modeling.setColor(colorelements[index], {
        //   stroke: this.ipimColors[index]
        // });
      }
    });
  }

  private normalizeAll() {
    const registry = this.modeler.get("elementRegistry");
    const modelling = this.modeler.get("modeling");
    modelling.setColor(registry.getAll(), { stroke: "black" });
  }

  private highlightElement(element: any, index: number) {
    const registry = this.modeler.get("elementRegistry");
    const modelling = this.modeler.get("modeling");
    // const element = this.modeler.get('elementRegistry').get(elementID);
    modelling.setColor([element], { stroke: this.ipimColors[index] });
  }

  //shows an Overlay for loading purposes
  public showOverlay(): void {
    const x = (document.getElementById(
      "overlayLoading-" + this.modelId
    ).style.display = "block");
  }

  //hides the Overlay again
  public hideOverlay(): void {
    const x = (document.getElementById(
      "overlayLoading-" + this.modelId
    ).style.display = "none");
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
