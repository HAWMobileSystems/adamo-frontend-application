import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import BpmnModeler from 'bpmn-js/lib/Modeler';

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
    this.modeler = new BpmnModeler({
      container: '#js-canvas'
    });
    
    this.http.get("/assets/fixtures/emptyBPMNAsXML.xml", { responseType: 'text'})
      .subscribe(response => this.modeler.importXML(response));
  
  }
  
  showSolution() {
    //Send Request to DB, load standart Solution, currently not working
    document.getElementById("solution_container").innerHTML='<object type ="img" data=""></object>';
  }

}
