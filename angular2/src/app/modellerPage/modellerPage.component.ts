import {Component, OnInit} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Model} from '../models/model';
import {ModelerComponent} from '../ModelerComponent/modeler.component';
import {MqttService} from '../services/mqtt.service';

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
  public xml: string = '' +
    '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/D' +
    'I" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schem' +
    'aLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://b' +
    'pmn.io/schema/bpmn">\n  <bpmn2:process id="Process_1" isExecutable="false">\n    <bpmn2:startEvent id="StartEven' +
    't_1"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bp' +
    'mnElement="Process_1">\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n      ' +
    '  <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane' +
    '>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>';
  public models: Model[] = [];

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
    this.apiService.modelClose(this.models[index].id, this.models[index].version)
      .subscribe(response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
    this.models.splice(index, 1);
    this.page = '+';
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
}