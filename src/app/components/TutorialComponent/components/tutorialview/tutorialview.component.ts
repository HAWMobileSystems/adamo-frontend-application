import { Component, OnInit, Output } from "@angular/core";
// import { Level } from '../../models/startview.module';
import { LevelService } from "../../services/level.service";
import { Startview, ModellingTask } from "../../models/startview.module";
import { AuthService } from "../../../../services";
import { Language } from "../../models/language.enum";
import { LanguageService } from "../../services/language.service";
import { Router } from "@angular/router";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";

@Component({
  selector: "app-tutorialview",
  templateUrl: "./tutorialview.component.html",
  styleUrls: ["./tutorialview.component.css"]
})
export class TutorialViewComponent implements OnInit {
  private user: any;
  private lang: string;
  public startview: Startview[] = new Array();

  //Strings for accordion
  private BPMN: string;
  private Intro: string;
  private Test: string;
  private Model: string;

  constructor(
    private catService: LevelService,
    private authService: AuthService,
    private langService: LanguageService,

    private translateService: TranslateService,
    private router: Router
  ) {
    this.user = this.authService.getCurrentUser();
    if (!this.user) {
      router.navigate(["/"]);
    }
  }

  // this.langService.lang$.subscribe(lang => {
  // console.log(this.lang)
  public ngOnInit() {
    this.lang = this.translateService.currentLang;
    this.onLanguageChange();
    this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.onLanguageChange(event);
    });
  }

  private onLanguageChange(event?: LangChangeEvent) : void {
    if (event) {
        this.lang = event.lang;
    }
    if (this.lang === Language.de) {
        this.BPMN = "BPMN für";
        this.Intro = "Einführung für";
        this.Test = "Teste dein Wissen für";
        this.Model = "Modellierung";
      } else {
        this.BPMN = "BPMN for";
        this.Intro = "Introduction into";
        this.Test = "Test your knowledge of the";
        this.Model = "Modelling";
      }
    this.router.navigate(["/overview/tutorial/start/", this.lang]);
    this.catService
      .getStartview(this.user.id, this.lang)
      .subscribe((view: any) => {
        this.parseIncomingJSON(view);
      });
  }

  public parseIncomingJSON(json) {
    console.log(json);
    this.startview = [];

    const keys_catName = new Set();
    json.forEach((entry) => {
      keys_catName.add(entry.catName);
    });

    keys_catName.forEach((key) => {
      const help = new Startview(key);
      json.forEach((entry) => {
        if (key === entry.catName) {
          help.catIdentifier = entry.catIdentifier;
          help.intro_status = entry.intro;
          const test = entry.mctest.split("/");
          help.mult_qs_cor = test[0];
          help.mult_qs_all = test[1];
          help.tasks.push(
            new ModellingTask(
              entry.id,
              entry.name,
              entry.score,
              entry.identifier
            )
          );
        }
      });
      help.tasks = help.tasks.sort((a, b) => a.identifier - b.identifier);

      this.startview.push(help);
    });
    this.startview.sort((a, b) => a.catIdentifier - b.catIdentifier);

    this.startview.forEach((entry) => {
      console.log(entry.catName + " mit id: " + entry.catIdentifier);
    });
    console.log(this.startview);
  }
}
