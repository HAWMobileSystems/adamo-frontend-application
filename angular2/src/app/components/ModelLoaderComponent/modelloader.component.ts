import {Component, Output, EventEmitter} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Model} from '../../models/model';

import {MqttService} from '../../services/mqtt.service';
import { IPIM_OPTIONS } from '../../modelerConfig.service';
import { SnackBarService } from '../../services/snackbar.service';

@Component({
  selector: 'modelloader',
  templateUrl: './modelloader.template.html'
})

export class ModelLoaderComponent {
  @Output() public loadModel: EventEmitter<object> = new EventEmitter<Model>();
  @Output() public loadError: EventEmitter<object> = new EventEmitter<any>();
  private selected: any;
  private newModel: any;
  private models: any = [];
  private changesLast7Day: any;
  private diskModelName: string;
  private diskModelXml: string;
  private newModelName: string;
  //Simple Empty Model ... taken from Camunda
  private newModelXml: string = IPIM_OPTIONS.NEWMODEL;

  constructor(private apiService: ApiService, private snackbarService: SnackBarService, private mqttService: MqttService) {
  }

  //Bereitet dem MQTT vor, damit alle kollaborativen Modelle dort an den ExpressJS weitergeleitet werden
  private initMqtt() {
    const self = this;
    this.mqttService.getClient().subscribe('administration/model/#');
    this.mqttService.getClient().on('message', (topic: any, message: any) => {
      if (topic.startsWith('administration/model')) {
        self.getAllModels();
      }
    });
  }

  public ngOnInit() {
    this.apiService.login_status()
      .subscribe(response => {
          if (response.success) {
            //Only start Working when login was successfull
            this.mqttService.getClient(response.email);
            this.initMqtt();
            this.getAllModels();
            this.getLatestChanges();
          } else {
            console.error(response);
          }
        },
        error => {
          console.error(error);
        });
    //defines the structure for a new empty model
    this.newModel = {
      mid: '',
      modelname: '',
      modelxml: this.newModelXml,
      version: '',
      lastchange: ''
    };
  }

  //Create an empty model in the database
  public createEmpty() {
    this.apiService.modelCreate(this.newModelName, this.newModelXml)
      .subscribe(response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }
  //import a model from harddisk to database
  public createLoaded() {
    this.apiService.modelCreate(this.diskModelName, this.diskModelXml)
      .subscribe(response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }

  //create a new model without anything
  public createNew() {
    const model = new Model();
    model.xml = this.newModel.modelxml;
    model.name = this.newModel.modelname;
    model.id = this.newModel.mid;
    model.collaborator = [];
    this.loadModel.emit(model);
  }

  //gets the event when the select file dialog finishes
  public changeListener($event: any) : void {
    this.loadFromDisk($event.target);
  }

  //reads a file from disk
  public loadFromDisk(inputValue: any) {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    //event is called when file is loaded from disk
    myReader.onloadend = (e) => {
      this.diskModelName = file.name.split('.')[0];
      this.diskModelXml = myReader.result;
      this.createLoaded();
      console.log('loaded successful', file);
    };

    //read File as textfile
    myReader.readAsText(file);
  }

  //Selected model from list will be loaded as new tabbed modeler
  public loadSelected() {
    const model = new Model();
    model.xml = this.selected.modelxml;
    model.name = this.selected.modelname;
    model.id = this.selected.mid;
    model.version = this.selected.version;
    model.collaborator = [];

    //if model has empty data get the model first else directly emit the event
    if (this.selected.mid !== '') {
      this.apiService.getModel(this.selected.mid, this.selected.version)
        .subscribe(response => {
            model.xml = response.data.modelxml;
            console.info(model);
            this.loadModel.emit(model);
          },
          error => {
            this.snackbarService.error(JSON.parse(error._body).status);
            this.loadError.emit(error);
            console.log('Error Loading', error);
          });

    } else {
      this.loadModel.emit(model);
    }
  }

  //get a list of all models from DB
  public getAllModels() {
    this.models = [];

    this.apiService.getAllModels()
      .subscribe(response => {
          if (response.success) {
            this.models = response.data;
            this.selected = null;
          } else {
            this.snackbarService.error(response._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  //Get latest changes to models from database
  public getLatestChanges() {
    this.models = [];

    this.apiService.getModelsChangedLast7Days()
      .subscribe(response => {
          if (response.success) {
             this.changesLast7Day = response.data;
          } else {
            this.snackbarService.error(response._body);
          }
        },
        error => {
          this.snackbarService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }
}
