import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import LintModule from 'bpmn-js-bpmnlint';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import bpmnlintrc from './../../../../../assets/packedLintrc';

// import CustomRules from './CustomRules';
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';
import { LanguageService } from '../../services/language.service';
import { LevelService } from '../../services/level.service';
import { Language } from '../../models/language.enum';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

class Task {
  constructor() {
    this.question_description = '';
    this.question_text = '';
  }
  public question_description: string;
  public question_text: string;
}

@Component({
  selector: 'app-test-mod',
  templateUrl: './test-mod.component.html',
  styleUrls: ['./test-mod.component.css'],
})
export class TestModComponent implements OnInit {
  public modeler: any;
  public lang: string;
  private taskid: string;
  private user_id: string;
  private categorie: string;
  private duration: number;
  public task: Task;
  public welcome: string;
  public btn_menu: string;
  private reached_score: string;

  //todo remove httpclient
  constructor(
    private http: HttpClient,
    private langService: LanguageService,
    private translateService: TranslateService,
    private catService: LevelService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.task = new Task();
    this.user_id = authService.getCurrentUser().id;
  }

  public ngOnInit() {
    this.duration = Date.now();

    this.lang = this.translateService.currentLang;
    this.onLanguageChanged();
    // this.langService.lang$.subscribe(lang => {

    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.onLanguageChanged(event);
    });

    this.modeler = new BpmnModeler({
      additionalModules: [LintModule],
      linting: {
        bpmnlint: bpmnlintrc,
        active: true,
      },
      keyboard: {
        bindTo: document,
      },
      container: '#js-canvas',
    });
    const linting = this.modeler.get('linting');
    console.log(linting);
    linting.setLinterConfig(bpmnlintrc);

    this.http
      .get('/assets/fixtures/emptyBPMNAsXML.xml', { responseType: 'text' })
      .subscribe((response) => this.modeler.importXML(response));
  }

  private onLanguageChanged(event?: LangChangeEvent): void {
    if (event) {
      this.lang = event.lang;
    }
    if (this.lang === Language.de) {
      this.welcome = 'Willkommen zur BPMN Modellierung';
      this.btn_menu = 'Zurück zum Menü';
      this.reached_score = 'Ihre erreichte Punkteanzahl beträgt: ';
    } else {
      this.welcome = 'Welcome to BPMN Modelling';
      this.btn_menu = 'Return to menu';
      this.reached_score = 'Your reached Score is:';
    }

    this.route.params.subscribe((params) => {
      this.taskid = params.id;
      this.categorie = params.cat;
    });
    this.router.navigate(['overview/tutorial/modelling/', this.lang, this.categorie, this.taskid]);
    this.catService.getModellingTask(this.taskid, this.lang).subscribe((sub: any) => {
      this.task = JSON.parse(JSON.stringify(sub));
      console.log(this.task.question_description);
    });
  }

  public backToMenu() {
    this.router.navigate(['/overview/tutorial/start', this.lang]);
  }

  // pressedAlready:boolean = false;
  public async showSolution() {
    // if(!this.pressedAlready){
    //this.duration = Date.now() - this.duration;
    console.log(this.duration, Date.now(), Date.now() - this.duration);
    const solutionDuration = Date.now() - this.duration;
    console.log(solutionDuration);
    // }
    let safedXML;
    //Send Request to DB, load standart Solution, currently not working
    this.modeler.saveXML({ format: true }, async (err, xml) => {
      safedXML = xml;
      console.log('Validate');
      console.log(xml);
      // this.pressedAlready = true
      const test: any = await this.getAnswerOfPostModQuest(safedXML, solutionDuration);

      document.getElementById('reached_score').textContent = 'You reached a score of ' + test.score;
      document.getElementById('solution_svg').innerHTML = test.svg;
    });

    this.duration = Date.now();
  }

  public async getAnswerOfPostModQuest(xml, duration): Promise<any> {
    return this.catService.postModellingQuestion(xml, this.user_id, this.taskid, this.lang, duration).toPromise();
  }
}
