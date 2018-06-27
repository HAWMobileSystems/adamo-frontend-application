import {Component, Output, EventEmitter} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {ApiService} from "../../services/api.service";
import {Model} from '../../models/model';


const mqtt = require('mqtt');

@Component({
    selector: 'modelloader',
    templateUrl: './modelloader.template.html'
})

export class ModelLoaderComponent {
    @Output() loadModel: EventEmitter<object> = new EventEmitter<Model>();
    private selected: any;
    private newModel: any;
    private models: any;
    private mqtt: any;


    constructor(private apiService: ApiService, private alertService: AlertService) {
    }

    public ngOnInit() {
        this.newModel = {
            mid: '',
            modelname: '',
            modelxml: '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n  <bpmn2:process id="Process_1" isExecutable="false">\n    <bpmn2:startEvent id="StartEvent_1"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>',
            version: '',
            lastchange: ''
        };

        this.getAllModels();


        this.mqtt = mqtt.connect('mqtt://localhost:4711');
        this.mqtt.subscribe('MODEL');
        const i = this;
        this.mqtt.on('message', function (topic: any, message: any) {
            console.log('Test from remote:' + message.toString());
            i.getAllModels();
        });
    }


    public loadSelected() {
        var model = new Model();
        model.xml = this.selected.modelxml;
        model.name = this.selected.modelname;
        model.id = this.selected.mid;
        this.loadModel.emit(model);
        // this.notify.emit({modelxml: this.selected.modelxml, modelname: this.selected.modelname});
    }
    public getAllModels() {
        this.models = [];

        this.apiService.getAllModels()
            .subscribe(response => {
                    if (response.success) {
                        this.models = response.data;
                        this.selected = null;
                    }
                    else {
                        this.alertService.error(response._body)
                    }
                },
                error => {
                    this.alertService.error(JSON.parse(error._body).status);
                    console.log(error);
                });
    }


    public modelUpdate() {
        this.apiService.modelUpdate(this.selected.mid, this.selected.modelname, this.selected.lastchange, this.selected.modelxml, this.selected.version)
            .subscribe(response => {
                    if (response.success) {
                        this.mqtt.publish('MODEL');
                    }
                    else {
                        this.alertService.error(response._body)
                    }
                },
                error => {
                    this.alertService.error(JSON.parse(error._body).status);
                    console.log(error);
                });
    }

    public modelCreate() {
        this.apiService.modelCreate(this.selected.modelname, this.selected.lastchange, this.selected.modelxml, this.selected.version)
            .subscribe(response => {
                    if (response.success) {
                        this.mqtt.publish('MODEL');
                    }
                    else {
                        this.alertService.error(response._body)
                    }
                },
                error => {
                    this.alertService.error(JSON.parse(error._body).status);
                    console.log(error);
                });
    }

    public modelDelete() {
        this.apiService.modelDelete(this.selected.mid)
            .subscribe(response => {
                    console.log(response);
                    if (response.success) {
                        this.mqtt.publish('MODEL');
                    }
                    else {
                        this.alertService.error(response._body)
                    }
                },
                error => {
                    this.alertService.error(JSON.parse(error._body).status);
                    console.log(error);
                });
    }



}
