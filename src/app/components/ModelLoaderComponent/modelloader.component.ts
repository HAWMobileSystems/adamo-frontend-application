import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Model } from '../../models/model';

import { AdamoMqttService } from '../../services/mqtt.service';
import { IPIM_OPTIONS } from '../../modelerConfig.service';
import { SnackBarService } from '../../services/snackbar.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EventEmitterService } from '../../services/EventEmitter.service';

@Component({
  selector: 'modelloader',
  templateUrl: './modelloader.template.html',
  // providers: [EventEmitterService]
})
export class ModelLoaderComponent {
  // @Output() public loadModel: EventEmitter<object> = new EventEmitter<Model>();
  @Output() public loadError: EventEmitter<object> = new EventEmitter<any>();
  public selected: any;
  public search: any;
  //defines the structure for a new empty model
  private newModel = {
    mid: '',
    modelname: '',
    modelxml: IPIM_OPTIONS.NEWMODEL,
    version: '',
    lastchange: ''
  };
  public models: any = [];
  private modelDataChangedLast7Days: any;
  private diskModelName: string;
  private diskModelXml: string;
  public newModelName: string;
  public changesLast7Day: any;
  //Simple Empty Model ... taken from Camunda
  private newModelXml: string = IPIM_OPTIONS.NEWMODEL;

  constructor(
    private eventEmitterService: EventEmitterService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackBarService,
    private mqttService: AdamoMqttService
  ) {}

  //Bereitet dem MQTT vor, damit alle kollaborativen Modelle dort an den ExpressJS weitergeleitet werden
  

  // private initMqtt() {
  //   try {
  //     const self = this;
  //     this.mqttService.getClient().subscribe('administration/model/#');
  //     this.mqttService.getClient().on('message', (topic: any, message: any) => {
  //       if (topic.startsWith('administration/model')) {
  //         self.getAllModels();
  //       }
  //     });
  //   } catch(error) {
  //     console.warn("MQTT is not initialized or running")
  //   }
  // }

  public ngOnInit() {
    // this.authService.login_status().subscribe(
    //   (response: { success: any; email: string; status: string }) => {
    //     if (response.success) {
    //       //Only start Working when login was successfull
    //       this.mqttService.getClient(response.email);
    if(!this.authService.getCurrentUser()) {
      this.router.navigate(['']);
    }
          // this.initMqtt();
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
    this.eventEmitterService.emitOnModelSelected(model);
    // this.loadModel.emit(model);
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
    // if (this.selected.mid !== '') {
    //   console.log("modelloader.loadSelected", this.selected)
    //   this.apiService
    //     .getModel(this.selected.id, this.selected.model_version)
    //     .subscribe( 
    //       (response: any) => { // this will be a ModelResponseDTO
    //         model.xml = response.modelXML;
    //         console.info(model);
    //         this.loadModel.emit(model);
    //       },
    //       (error: any) => {
    //         this.snackbarService.error(JSON.parse(error).status);
    //         this.loadError.emit(error);
    //         console.log('Error Loading', error);
    //       }
    //     );
    // } else {
// maybe some conformance checks but better
    this.eventEmitterService.emitOnModelSelected(this.selected);

      // this.loadModel.emit(this.selected);
    // }
  }

  //get a list of all models from DB
  public getAllModels() {
    let userID = this.authService.getCurrentUser().id
    console.log(userID);
    this.apiService.getAllModelsForUser(userID).subscribe(
      (response: Object) => {
          this.models = response;
          this.selected = null;
          console.log("modelloader.getAllModelsForUser",response);
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
