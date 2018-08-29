import {Component} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';
import {MqttService} from '../../services/mqtt.service';

@Component({
  selector: 'model-management',
  templateUrl: './model.template.html'
})

export class ModelComponent {
  private selected: any;
  private newModel: any;
  private models: any;

  constructor(private apiService: ApiService, private alertService: AlertService, private mqttService: MqttService) {
  }

  public ngOnInit() {
    this.newModel = {
      modelname: '',
      version: '',
      lastchange: ''
    };

    this.getAllModels();

    this.mqttService.getClient().subscribe('administration/model/#');
    const i = this;
    this.mqttService.getClient().on('message', (topic: any, message: any) => {
      console.log('Test from remote:' + message.toString());
      i.getAllModels();
    });
  }

  public getAllModels() {
    this.models = [];

    this.apiService.getAllModels()
      .subscribe(response => {
          if (response.success) {
            this.models = response.data;
            this.selected = null;
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          console.log(error);
          this.alertService.error(JSON.parse(error._body).status);
        });
  }

  public modelUpdate() {
    this.apiService.modelUpdate(
      this.selected.mid,
      this.selected.modelname,
      this.selected.lastchange,
      this.selected.modelxml,
      this.selected.version)
      .subscribe(response => {
          if (response.success) {
            this.mqttService.getClient().publish('administration/model/update');
            this.alertService.success(response.status);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  public modelCreate() {
    this.apiService.modelCreate(this.selected.modelname, this.selected.modelxml)  //REMEMBER!
      .subscribe(response => {
          if (response.success) {
            this.mqttService.getClient().publish('administration/model/create');
            this.alertService.success(response.status);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  public modelDelete() {
    this.apiService.modelDelete(this.selected.mid, this.selected.version)
      .subscribe(response => {
          console.log(response);
          if (response.success) {
            this.mqttService.getClient().publish('administration/model/delete', JSON.stringify({
              mid: this.selected.mid,
              version: this.selected.version
            }));
            this.apiService.partModelDelete(this.selected.mid, this.selected.version)
            .subscribe(response => {
              console.log(response);
            });
            this.alertService.success(response.status);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }
}