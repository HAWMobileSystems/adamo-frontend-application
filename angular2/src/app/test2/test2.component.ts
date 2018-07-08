import {Component, OnInit} from '@angular/core';
import {Router,} from '@angular/router';

import {ApiService} from '../services/api.service';

import {Model} from '../models/model';
import {ModelerComponent2} from '../ModelerComponent/modeler.component';
import {forEach} from "@angular/router/src/utils/collection";

@Component({
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css']
})
export class Test2Component implements OnInit {
  title: string = 'Angular 2 with BPMN-JS';
  model: any = {};
  loading = false;
  page = 'Model';
  xml: string = '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n  <bpmn2:process id="Process_1" isExecutable="false">\n    <bpmn2:startEvent id="StartEvent_1"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>';
  models: Model[] = [];

  constructor(private router: Router,
              private apiService: ApiService) {

  }

  ngOnInit() {
    // reset login status
    this.apiService.logout()
      .subscribe(response => {
      }, error => {
        console.log(error);
      });
  }

  onLoadModel(model: Model): void {
    this.loading = true;
    let exists: boolean;
    this.models.forEach(function (element) {
      if (element.id === model.id)
        exists = true;
    });
    if (!exists)
      this.models.push(model);
    this.page = model.name;
  }

  onExportModel(modelerComponent: ModelerComponent2): void {
    console.log(modelerComponent);
    this.models[this.models.length - 1].modelerComponent = modelerComponent;
    console.log(this.models);
  }

  onLoadedCompletely(): void {
    this.loading = false;
    console.log('loading compleate');
  }
}