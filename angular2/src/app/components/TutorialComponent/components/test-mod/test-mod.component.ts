import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Modeler from 'bpmn-js/lib/Modeler';

// import CustomRules from './CustomRules';
import LintModule from 'bpmn-js-bpmnlint';
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";

// import bpmnlintConfig from './.bpmnlintrc';

@Component({
  selector: 'app-test-mod',
  templateUrl: './test-mod.component.html',
  styleUrls: ['./test-mod.component.css']
})

export class TestModComponent implements OnInit {
  modeler: any;

  constructor(private http: HttpClient) {
  }
  
  ngOnInit() {
    const bpmnLintConfig = {
      "extends": "bpmnlint:recommended"
      // "extends": [
      //   "bpmnlint:recommended",
      //   "plugin:playground/recommended"
      // ],
      // "rules": {
      //   "playground/no-manual-task": "warn"
      // }
    }
    
    this.modeler = new Modeler({
      container: '#js-canvas',
      linting: {
        bpmnlint: bpmnLintConfig
      },
      additionalModules: [LintModule]
    });
    
    this.http.get("/assets/fixtures/emptyBPMNAsXML.xml", { responseType: 'text'})
      .subscribe(response => this.modeler.importXML(response));
  
  }
  
  showSolution() {
    //Send Request to DB, load standart Solution, currently not working
    this.modeler.saveXML({ format: true }, function (err, xml) {
      console.log(xml)
    });
    //document.getElementById("solution_container").innerHTML='<object type ="img" data=""></object>';
  }

}
