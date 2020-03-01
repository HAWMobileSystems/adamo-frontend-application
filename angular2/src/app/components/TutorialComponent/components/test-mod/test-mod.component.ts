import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Modeler from 'bpmn-js/lib/Modeler';
import BpmnModeler from 'bpmn-js/lib/Modeler';

// import CustomRules from './CustomRules';
import LintModule from 'bpmn-js-bpmnlint';
import "bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css";
import { LanguageService } from '../../services/language.service';
import { LevelService } from '../../services/level.service';
import { Language } from '../../models/language.enum';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

// import bpmnlintConfig from './.bpmnlintrc';

interface Task {
  question_description: string;
  question_text: string;
}

@Component({
  selector: 'app-test-mod',
  templateUrl: './test-mod.component.html',
  styleUrls: ['./test-mod.component.css']
})

export class TestModComponent implements OnInit {
  modeler: any
  lang: Language
  taskid: string
  private user_id: String
  categorie: string

  private task: Task

  //todo remove httpclient
  constructor(private http: HttpClient,
    private langService: LanguageService,
    private catService: LevelService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {
      // this.task.question_description=""
      // this.task.question_text=""
      this.user_id = authService.getCurrentUser().id
  }
  
  ngOnInit() {
    this.langService.lang$.subscribe(lang => {
      this.lang = lang
      
      this.route.params.subscribe(params => {
        this.taskid = params['id']
        this.categorie = params['cat']
      })
      this.router.navigate(['overview/tutorial/modelling/', this.lang, this.categorie, this.taskid])
      this.catService.getModellingTask(this.taskid, this.lang).subscribe((sub: any) => {
        this.task = JSON.parse(JSON.stringify(sub))
        console.log(this.task.question_description)
      })
    })

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
    
    this.modeler = new BpmnModeler({
      container: '#js-canvas',
      linting: {
        bpmnlint: bpmnLintConfig
      },
      additionalModules: [LintModule]
    });
    
    this.http.get("/assets/fixtures/emptyBPMNAsXML.xml", { responseType: 'text'})
      .subscribe(response => this.modeler.importXML(response));
    
  }
  
  async showSolution() {
    let safedXML
    //Send Request to DB, load standart Solution, currently not working
    this.modeler.saveXML({ format: true }, function (err, xml) {
      safedXML = xml
      console.log("Validate")
      console.log(xml)
    });
    let test: any = await this.getAnswerOfPostModQuest(safedXML)
    console.log(test)
    //document.getElementById("solution_container").innerHTML='<object type ="img" data=""></object>';
  }

  getAnswerOfPostModQuest(xml) : Promise<any>{
    return this.catService.postModellingQuestion(xml,this.user_id,this.taskid,this.lang).toPromise()
  }

}
