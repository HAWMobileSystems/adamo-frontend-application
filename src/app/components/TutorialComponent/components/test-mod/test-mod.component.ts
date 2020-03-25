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

class Task {
  constructor(){
    this.question_description = ""
    this.question_text = ""
  }
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
  private lang: Language
  private taskid: string
  private user_id: String
  private categorie: string
  private duration: number
  private task: Task
  private welcome:string
  private btn_menu:string
  private reached_score:string

  //todo remove httpclient
  constructor(private http: HttpClient,
    private langService: LanguageService,
    private catService: LevelService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {
      this.task = new Task()
      this.user_id = authService.getCurrentUser().id

  }
  
  ngOnInit() {
    this.duration = Date.now()
    this.langService.lang$.subscribe(lang => {
      this.lang = lang
      
      if(lang=== Language.de){
        this.welcome = "Willkommen zur BPMN Modellierung"
        this.btn_menu ="Zurück zum Menü"
        this.reached_score="Ihre erreichte Punkteanzahl beträgt: "
      }else{
        this.welcome = "Welcome to BPMN Modelling"
        this.btn_menu = "Return to menu"
        this.reached_score="Your reached Score is:"
      }

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

  backToMenu() {
    this.router.navigate(["/overview/tutorial/start", this.lang])
  }

  // pressedAlready:boolean = false;
  async showSolution() {
    // if(!this.pressedAlready){
      this.duration = Date.now() - this.duration
    // }
    let safedXML
    //Send Request to DB, load standart Solution, currently not working
    this.modeler.saveXML({ format: true }, function (err, xml) {
      safedXML = xml
      console.log("Validate")
      console.log(xml)
    });
    let test: any = await this.getAnswerOfPostModQuest(safedXML)
    // console.log(test)
    // console.log(test.svg)
    // console.log(test.score)
    document.getElementById("reached_score").textContent="You reached a score of " + test.score
    document.getElementById("solution_svg").innerHTML=test.svg;
    // this.pressedAlready = true
    this.duration = Date.now()
  }

  getAnswerOfPostModQuest(xml) : Promise<any>{
    return this.catService.postModellingQuestion(xml,this.user_id,this.taskid,this.lang,this.duration).toPromise()
  }

}
