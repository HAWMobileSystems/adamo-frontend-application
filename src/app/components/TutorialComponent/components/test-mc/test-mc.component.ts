import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LevelService } from "../../services/level.service";
import { AuthService } from "../../../../services/auth.service";
import { MultipleChoiceQuest, KeyValuePair } from "../../models/multiplechoice.module";
import { LanguageService } from "./../../services/language.service";
import { Language } from "../../models/language.enum";
import { Subscription } from "rxjs";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";

@Component({
  selector: "app-test-mc",
  templateUrl: "./test-mc.component.html",
  styleUrls: ["./test-mc.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class TestMCComponent implements OnInit {

  private user_id: String;
  private categorie: String;
  public question: MultipleChoiceQuest;
  public lang: string;
  private subLang: Subscription;
  private subQuestion: Subscription;

  constructor(private route: ActivatedRoute,
    private catService: LevelService,
    private authService: AuthService,
    private langService: LanguageService,

    private translateService: TranslateService,
    private router: Router) {
    this.question = new MultipleChoiceQuest();
    this.user_id = authService.getCurrentUser().id;
  }

  public ngOnInit() {
    console.log("ngOnInit()");
    this.lang = this.translateService.currentLang;

    this.onLanguageChange();
    // console.log(this.lang)
          //   ngOnInit() {
  this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
    // this.subLang = this.langService.lang$.subscribe(lang => {
    //   this.lang = event.lang;

        this.onLanguageChange(event);
    });
  }

  private onLanguageChange(event?: LangChangeEvent) : void {
    if (event) {
        this.lang = event.lang;
    }
//    this.lang = event.lang
    this.question.question = "";
    this.question.id = "";
    this.question.answers = [];

    this.route.params.subscribe(params => {
      this.categorie = params.cat;
    }).unsubscribe();
    this.router.navigate(["overview/tutorial/multiplechoice/", this.lang, this.categorie]);
    this.subQuestion = this.catService.getMultipleChoice(this.user_id, this.categorie, this.lang).subscribe((view: any) => {
      console.log(view);
      this.transform(view);
    });
  }

  public ngOnDestroy() {
    console.log("ngOnDestroy()");
    this.subQuestion.unsubscribe();
    //this.subLang.unsubscribe()
  }

  public transform(json: any[]) {
    console.log(json);
    if (json.length !== 0) {
      // this.question.setIDandQuest(json[0].id, json[0].question)

      json.forEach(entry => {
        this.question.setIDandQuest(entry.id, entry.question);
        this.question.answers.push({ key: entry.answerID, value: entry.answer });
      });
    }
  }

  public async CheckCorrectness() {

    const userChoice: KeyValuePair[] = new Array;
    userChoice.push({ key: "userid", value: this.user_id });
    userChoice.push({ key: "questionid", value: this.question.id });
    const elements = (<HTMLInputElement[]><any>document.getElementsByName("user_answers"));
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type === "checkbox") {
        if (elements[i].checked) {
          userChoice.push({ key: this.question.answers[i].key, value: "true" });
        } else {
          userChoice.push({ key: this.question.answers[i].key, value: "false" });
        }
      }
    }

    const correct = await this.promisePostMultChoice(userChoice);

    correct.forEach(response => {
      userChoice.forEach(userresp => {
        if (response.value === true) {
          if (userresp.key === response.key) {
            const test = document.getElementById(response.key);
            test.setAttribute("style", "background-color:#00CB28;");
          }
        } else {
          if (userresp.key === response.key) {
            const test = document.getElementById(response.key);
            test.setAttribute("style", "background-color:#FE0000;");
          }
        }
      });
    });
  }

  public promisePostMultChoice(userChoice :any ): Promise<any> {
    return this.catService.postMultipleChoice(userChoice).toPromise();
  }

  public async NextQuestion() {
    this.question.answers = [];
    console.log("answers cleared");
    // this.subLang.unsubscribe()
    // this.subQuestion = this.catService.getMultipleChoice(this.user_id, this.categorie, this.lang).subscribe((view: any) => {
    //   console.log(view)
    //   this.transform(view)
    // })
    console.log("before promise get mult choice");
    const newJson: any = await this.promiseGetMultChoice();
    console.log("after promise get mult choice");
    this.transform(newJson);

    // this.ngOnInit()
    console.log("next question - " + this.question.question);
    // document.getElementById("")

    console.log(this.question.answers.length);
    // tslint:disable-next-line:triple-equals
    if (this.question.answers.length === 0) {
      alert("Finished all Multiplechoice Questions");
      this.router.navigate(["overview/tutorial/start", this.lang]);
      this.subQuestion.unsubscribe()
      return;
    }
  }

  public promiseGetMultChoice() : Promise<any> {
    return this.catService.getMultipleChoice(this.user_id, this.categorie, this.lang).toPromise();
  }

}
