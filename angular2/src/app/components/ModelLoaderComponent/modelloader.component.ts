import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Model } from '../../models/model';

import { AdamoMqttService } from '../../services/mqtt.service';
import { IPIM_OPTIONS } from '../../modelerConfig.service';
import { SnackBarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'modelloader',
  templateUrl: './modelloader.template.html'
})
export class ModelLoaderComponent {
  @Output() public loadModel: EventEmitter<object> = new EventEmitter<Model>();
  @Output() public loadError: EventEmitter<object> = new EventEmitter<any>();
  private selected: any;
  //defines the structure for a new empty model
  private newModel = {
    mid: '',
    modelname: '',
    modelxml: IPIM_OPTIONS.NEWMODEL,
    version: '',
    lastchange: ''
  };
  private models: any = [];
  private modelDataChangedLast7Days: any;
  private diskModelName: string;
  private diskModelXml: string;
  private newModelName: string;
  //Simple Empty Model ... taken from Camunda
  private newModelXml: string = IPIM_OPTIONS.NEWMODEL;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackBarService,
    private mqttService: AdamoMqttService
  ) {}

  //Bereitet dem MQTT vor, damit alle kollaborativen Modelle dort an den ExpressJS weitergeleitet werden
  

  private initMqtt() {
    try {
      const self = this;
      this.mqttService.getClient().subscribe('administration/model/#');
      this.mqttService.getClient().on('message', (topic: any, message: any) => {
        if (topic.startsWith('administration/model')) {
          self.getAllModels();
        }
      });
    } catch(error) {
      console.log(error)
    }
  }

  public ngOnInit() {
    // this.authService.login_status().subscribe(
    //   (response: { success: any; email: string; status: string }) => {
    //     if (response.success) {
    //       //Only start Working when login was successfull
    //       this.mqttService.getClient(response.email);
          this.initMqtt();
          this.getAllModels();
          this.getLatestChanges();
    //     } else {
    //       this.snackbarService.error(response.status);
    //       console.error('Error while retrieving session');
    //       this.router.navigate(['/front-page']);
    //     }
    //   },
    //   (error: any) => {
    //     console.error(error);
    //     this.snackbarService.error(
    //       'Error could not connect to session management'
    //     );
    //     this.router.navigate(['/front-page']);
    //   }
    // );
   
  }

  //Create an empty model in the database
  public createEmpty() {
    this.apiService.modelCreate(this.newModelName, this.newModelXml).subscribe(
      (response: any) => {
        this.snackbarService.success(response);
        console.log(response);
      },
      (error: any) => {
        this.snackbarService.error(JSON.parse(error).status);
        console.log(error);
      }
    );
  }
  //import a model from harddisk to database
  public createLoaded() {
    this.apiService
      .modelCreate(this.diskModelName, this.diskModelXml)
      .subscribe(
        (response: any) => {
          this.snackbarService.success(response);
          console.log(response);
        },
        (error: any) => {
          this.snackbarService.error(JSON.parse(error).status);
          console.log(error);
        }
      );
  }

  //create a new model without anything
  public createNew() {
    const model = new Model(this.newModel);
    // model.xml = this.newModel.modelxml;
    // model.name = this.newModel.modelname;
    // model.id = Number(this.newModel.mid);
    // model.collaborator = [];
    this.loadModel.emit(model);
  }

  //gets the event when the select file dialog finishes
  public changeListener($event: any): void {
    this.loadFromDisk($event.target);
  }

  //reads a file from disk
  public loadFromDisk(inputValue: any) {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();
    //event is called when file is loaded from disk
    myReader.onloadend = e => {
      this.diskModelName = file.name.split('.')[0];
      this.diskModelXml = myReader.result as string;
      this.createLoaded();
    };
    //read File as textfile
    myReader.readAsText(file);
  }

  //Selected model from list will be loaded as new tabbed modeler
  public loadSelected() {
    const model = new Model(this.selected);
    // model.xml = this.selected.modelxml;
    // model.name = this.selected.modelname;
    // model.id = this.selected.mid;
    // model.version = this.selected.version;
    // model.read = this.selected.read;
    // model.write = this.selected.write;
    // model.collaborator = [];

    //if model has empty data get the model first else directly emit the event
    if (this.selected.mid !== '') {
      this.apiService
        .getModel(this.selected.mid, this.selected.version)
        .subscribe( 
          (response: any) => { // this will be a ModelResponseDTO
            model.xml = response.modelXML;
            console.info(model);
            this.loadModel.emit(model);
          },
          (error: any) => {
            this.snackbarService.error(JSON.parse(error).status);
            this.loadError.emit(error);
            console.log('Error Loading', error);
          }
        );
    } else {
      this.loadModel.emit(model);
    }
  }

  //get a list of all models from DB
  public getAllModels() {
    // this.models = [];
    this.apiService.getAllModels().subscribe(
      (response: Object) => {
          this.models = response;
          this.selected = null;
      },
      (error: any) => {
        this.snackbarService.error(error._body);
        console.log(error);
      }
    );
  }

  //Get latest changes to models from database
  public getLatestChanges() {
    this.apiService.getModelsChangedLast7Days().subscribe(
      (response: any) => { // Change to ModelResponseDTO[]
          this.modelDataChangedLast7Days = response;
      },
      (error: any) => {
        this.snackbarService.error(error._body);
        console.log(error);
      }
    );
  }
}
