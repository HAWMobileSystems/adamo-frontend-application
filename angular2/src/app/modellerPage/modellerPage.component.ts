import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Model} from '../models/model';
import {ModelerComponent} from '../ModelerComponent/modeler.component';
import {MqttService} from '../services/mqtt.service';
import { IPIM_OPTIONS } from '../modelerConfig.service';

//Include components for interface and styling
@Component({
  templateUrl: './modellerPage.component.html',
  styleUrls: ['./modellerPage.component.css']
})

export class ModellerPageComponent implements OnInit {
  public title: string = 'Angular 2 with BPMN-JS';
  public model: any = {};
  public loading: boolean = false;
  public page: string = '+';
  public page2: string = 'User';
  public permission: number;
  public xml: string = IPIM_OPTIONS.NEWMODEL;
  public models: Model[] = [];
  public snackbarTextPage: string = '';

  constructor(private apiService: ApiService, private mqttService: MqttService) {
  }

  private initMqtt() {
    this.mqttService.getClient().subscribe('collaborator/update/+/+');
    this.mqttService.getClient().subscribe('modelupsert');
    this.mqttService.getClient().on('message', (topic: any, message: any) => {
      console.log(topic);
      if (topic === 'modelupsert') {
        const event = JSON.parse(message);
        const idAndVersion = this.page.split('_');
        if (idAndVersion[0] === event.mid.toString() && idAndVersion[1] === event.version) {
          this.page = event.mid + '_' + event.newVersion;
          console.log(this.page);
        }
      } else if (topic.startsWith('collaborator/update')) {
        console.log(topic, JSON.parse(message));
        console.log(this.models);
        this.models.forEach(model => {
          console.log(model.id, parseInt(topic.split('/')[2]), model.version, topic.split('/')[3]);
          if (model.id === parseInt(topic.split('/')[2]) && model.version === topic.split('/')[3]) {
            model.collaborator = JSON.parse(message);
          }
        });
      }
    });
  }

  //Initialization after ModellerPageComponent component was loaded
  public ngOnInit() {
    this.apiService.login_status()
      .subscribe(response => {
          if (response.success) {
            this.mqttService.getClient(response.email);
            this.initMqtt();
            this.permission = parseInt(response.permission);
          } else {
            console.error(response);
          }
        },
        error => {
          console.error(error);
        });
  }

  public remove(index: number): void {
    console.log(this.models[index]);
    this.mqttService.getClient().unsubscribe('MODEL/model_' + this.models[index].id + '_' + this.models[index].version);
    this.models.splice(index, 1);
    this.page = '+';
  }

  public loadError(error: any): void {
    this.showSnackBarPage('Error: ' + JSON.parse(error._body).status, 'red');
  }

  //Show previous versions of a model, if the last one was selected
  public onLoadModel(model: Model): void {
    model.collaborator = [];
    this.loading = true;
    let exists: boolean;
    this.models.forEach(element => {
      if (element.id === model.id && element.version === model.version) {
        exists = true;
      }
    });
    if (!exists) {
      this.models.push(model);
    } else {
      this.loading = false;
    }
    this.page = model.id + '_' + model.version;
  }

  public onExportModel(modelerComponent: ModelerComponent): void {
    this.models[this.models.length - 1].modelerComponent = modelerComponent;
  }

  public onLoadSubProcess(model: Model): void {
    console.log('loadedModel', model);
    this.onLoadModel(model);
  }

  public onLoadedCompletely(): void {
    this.loading = false;
    console.log('loading complected');
  }

  //simple function to show a snackbar with variable text and color
  public showSnackBarPage(text: string, color: string) {
    //set text so the angular component can update
    this.snackbarTextPage = text;
    //get snackbar HTML element
    const x = document.getElementById('snackbarPage');
    //set color and class
    x.style.backgroundColor = color;
    x.className = 'show';
    //show it for 3 seconds
    setTimeout(() => { x.className = x.className.replace('show', ''); }, IPIM_OPTIONS.TIMEOUT_SNACKBAR);
}
}