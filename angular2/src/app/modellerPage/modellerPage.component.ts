import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../services/api.service';
import {Model} from '../models/model';
import {ModelerComponent} from '../ModelerComponent/modeler.component';
import {forEach} from '@angular/router/src/utils/collection';

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
  // tslint:disable-next-line:max-line-length
  public xml: string = '<?xml version="1.0" encoding="UTF-8"?>\n<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">\n  <bpmn2:process id="Process_1" isExecutable="false">\n    <bpmn2:startEvent id="StartEvent_1"/>\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id="BPMNDiagram_1">\n    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">\n      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">\n        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>';
  public models: Model[] = [];

  constructor(private router: Router,
              private apiService: ApiService) {

  }

  //Initialization after ModellerPageComponent component was loaded
  public ngOnInit(): void {
    console.log('ModellerPageComponent initialized.');
  }

  public remove(index: number): void {
    this.models.splice(index, 1);
  }

  //Show previous versions of a model, if the last one was selected
  public onLoadModel(model: Model): void {
    this.loading = true;
    let exists: boolean;
    this.models.forEach((element: any) => {
      if (element.id === model.id && element.version === model.version) {
        exists = true;
      }
    });
    if (!exists) {
      this.models.push(model);
    }
    this.page = model.id + model.version;
  }

  public onExportModel(modelerComponent: ModelerComponent): void {
    this.models[this.models.length - 1].modelerComponent = modelerComponent;
  }

  //Log success message after loading
  public onLoadedCompletely(): void {
    this.loading = false;
    console.log('loading complete');
  }

  public onSaveModel(): void {
    console.log('onSaveModel executed');
  }
}