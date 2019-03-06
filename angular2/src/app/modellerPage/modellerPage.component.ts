import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Model} from '../models/model';
import {ModelerComponent} from '../ModelerComponent/modeler.component';
import {MqttService} from '../services/mqtt.service';
import { IPIM_OPTIONS } from '../modelerConfig.service';
import { SnackBarService } from '../services/snackbar.service';
import { SnackBarMessage } from '../services/snackBarMessage';
import { Router } from '@angular/router';

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
  public snackBarMessages: SnackBarMessage[] = [];
  public snackbarTextPage: string = '';
  public username: string = '';

  constructor(private apiService: ApiService, private router: Router, private mqttService: MqttService, private snackbarService: SnackBarService) {
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
    this.snackbarService.snackBarMessages$.subscribe(
      (data: SnackBarMessage[]) => {
        this.snackBarMessages = data;
      });

    this.apiService.login_status()
      .subscribe(response => {
          if (response.success) {
            this.username = response.email;
            this.mqttService.getClient(response.email);
            this.initMqtt();
            this.permission = parseInt(response.permission);
          } else {
            this.username = '';
            this.snackbarService.error('error while retrieving session');
            this.router.navigate(['/front-page']);
          }
        },
        error => {
          this.username = '';
          this.snackbarService.error('Error could not connect to session management');
          this.router.navigate(['/front-page']);
        });
  }

  public remove(index: number): void {
    console.log(this.models[index]);
    this.mqttService.getClient().unsubscribe('MODEL/model_' + this.models[index].id + '_' + this.models[index].version);
    this.models.splice(index, 1);
    this.page = '+';
  }

  public loadError(error: any): void {
    if (JSON.parse(error._body).status !== 'no permission to read!') {
      this.snackbarService.newSnackBarMessage('Error: ' + JSON.parse(error._body).status, 'red');
    }
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
    !exists
      ?  this.models.push(model)
      : this.loading = false;
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
}