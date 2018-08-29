import {Component, Output, EventEmitter} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from '../../services/api.service';
import {Model} from '../../models/model';

import {MqttService} from '../../services/mqtt.service';

@Component({
  selector: 'modelloader',
  templateUrl: './modelloader.template.html'
})

export class ModelLoaderComponent {
  @Output() public loadModel: EventEmitter<object> = new EventEmitter<Model>();
  private selected: any;
  private newModel: any;
  private models: any = [];
  private changesLast7Day: any;
  private diskModelName: string;
  private diskModelXml: string;
  private newModelName: string;
  private newModelXml: string = '' +
  '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instanc' +
  'e" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/201005' +
  '24/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi' +
  ':schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="' +
  'http://bpmn.io/schema/bpmn">\n  <bpmn2:process id="Process_1" isExecutable="false">\n    <bpmn2:startEvent id=' +
  '"StartEvent_1"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPM' +
  'NPlane_1" bpmnElement="Process_1">\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEve' +
  'nt_1">\n        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n      </bpmndi:BPMNShape>\n    </' +
  'bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>';

  constructor(private apiService: ApiService, private alertService: AlertService, private mqttService: MqttService) {
  }

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

    this.newModel = {
      mid: '',
      modelname: '',
      modelxml: '' +
      '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instanc' +
      'e" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/201005' +
      '24/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi' +
      ':schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="' +
      'http://bpmn.io/schema/bpmn">\n  <bpmn2:process id="Process_1" isExecutable="false">\n    <bpmn2:startEvent id=' +
      '"StartEvent_1"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPM' +
      'NPlane_1" bpmnElement="Process_1">\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEve' +
      'nt_1">\n        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n      </bpmndi:BPMNShape>\n    </' +
      'bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>',
      version: '',
      lastchange: ''
    };
  }

  public createEmpty() {
    this.apiService.modelCreate(this.newModelName, this.newModelXml)
      .subscribe(response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }

  public createLoaded() {
    this.apiService.modelCreate(this.diskModelName, this.diskModelXml)
      .subscribe(response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }

  public createNew() {
    const model = new Model();
    model.xml = this.newModel.modelxml;
    model.name = this.newModel.modelname;
    model.id = this.newModel.mid;
    model.collaborator = [];
    this.loadModel.emit(model);
  }

  public changeListener($event: any) : void {
    this.loadFromDisk($event.target);
  }

  public loadFromDisk(inputValue: any) {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.diskModelName = file.name.split('.')[0];
      this.diskModelXml = myReader.result;
      this.createLoaded();

      // you can perform an action with readed data here
      // const model = new Model();
      // model.xml = myReader.result;
      // model.name = file.name;
      // model.id = this.newModel.mid;
      // this.loadModel.emit(model);
      console.log('loaded successful', file);
    };

    myReader.readAsText(file);
  }

  public loadSelected() {
    const model = new Model();
    model.xml = this.selected.modelxml;
    model.name = this.selected.modelname;
    model.id = this.selected.mid;
    model.version = this.selected.version;
    model.collaborator = [];
    if (this.selected.mid !== '') {
      this.apiService.getModel(this.selected.mid, this.selected.version)
        .subscribe(response => {
            model.xml = response.data.modelxml;
            console.info(model);
            this.loadModel.emit(model);
          },
          error => {
            this.alertService.error(JSON.parse(error._body).status);
            console.log(error);
          });

    } else {
      this.loadModel.emit(model);
    }
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
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }

  public getLatestChanges() {
    this.models = [];

    this.apiService.getModelsChangedLast7Days()
      .subscribe(response => {
          if (response.success) {
             this.changesLast7Day = response.data;
            // this.selected = null;
          } else {
            this.alertService.error(response._body);
          }
        },
        error => {
          this.alertService.error(JSON.parse(error._body).status);
          console.log(error);
        });
  }
}
