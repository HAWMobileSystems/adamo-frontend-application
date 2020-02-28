import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelService } from '../../services/level.service';
import { AuthService } from '../../../../services/auth.service';
import { MultipleChoiceQuest, KeyValuePair } from '../../models/multiplechoice.module';
import { LanguageService } from './../../services/language.service'
import { Language } from '../../models/language.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-test-mc',
  templateUrl: './test-mc.component.html',
  styleUrls: ['./test-mc.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TestMCComponent implements OnInit {

  private user_id: String
  private categorie: String
  private question: MultipleChoiceQuest
  private lang: Language
  private subLang: Subscription
  private subQuestion: Subscription

  constructor(private route: ActivatedRoute,
    private catService: LevelService,
    private authService: AuthService,
    private langService: LanguageService,
    private router: Router) {
    this.question = new MultipleChoiceQuest()
    this.user_id = authService.getCurrentUser().id
  }

  ngOnInit() {
    console.log("ngOnInit()")
    this.subLang = this.langService.lang$.subscribe(lang => {
      this.lang = lang

      this.question.answers = []

      this.route.params.subscribe(params => {
        this.categorie = params['cat']
      }).unsubscribe()
      this.router.navigate(['overview/tutorial/multiplechoice/', this.lang, this.categorie])
      this.subQuestion = this.catService.getMultipleChoice(this.user_id, this.categorie, this.lang).subscribe((view: any) => {
        console.log(view)
        this.transform(view)
      })
    })
  }

  ngOnDestroy() {
    console.log("ngOnDestroy()")
    this.subQuestion.unsubscribe()
    this.subLang.unsubscribe()
  }

  transform(json) {
    console.log(json)
    this.question.setIDandQuest(json[0].id, json[0].question)

    json.forEach(entry => {
      this.question.answers.push({ key: entry.answerID, value: entry.answer })
    })
  }

  async CheckCorrectness() {

    var userChoice: KeyValuePair[] = new Array
    userChoice.push({ key: "userid", value: this.user_id })
    userChoice.push({ key: "questionid", value: this.question.id })
    var elements = (<HTMLInputElement[]><any>document.getElementsByName("user_answers"))
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "checkbox") {
        if (elements[i].checked) {
          userChoice.push({ key: this.question.answers[i].key, value: 'true' })
        } else {
          userChoice.push({ key: this.question.answers[i].key, value: 'false' })
        }
      }
    }

    let correct = await this.getData(userChoice)

    correct.forEach(response => {
      userChoice.forEach(userresp => {
        if (response.value == true) {
          if (userresp.key == response.key) {
            var test = document.getElementById(response.key)
            test.setAttribute("style", "background-color:#00CB28;")
          }
        } else {
          if (userresp.key == response.key) {
            var test = document.getElementById(response.key)
            test.setAttribute("style", "background-color:#FE0000;")
          }
        }
      })
    })
  }
  getData(userChoice): Promise<any> {
    return this.catService.postMultipleChoice(userChoice).toPromise();
  }

  NextQuestion() {
    this.question.answers = []
    this.question.question = ""
    this.question.id = ""

    this.subQuestion.unsubscribe()
    this.subQuestion = this.catService.getMultipleChoice(this.user_id, this.categorie, this.lang).subscribe((view: any) => {
      this.transform(view)
    })

    if (this.question.answers.length == 0 && this.question.question == "" && this.question.id == "") {
      alert("Finished all Multiplechoice Questions")
      this.router.navigate(['overview/tutorial/start', this.lang])
      this.subQuestion.unsubscribe()
      return
    }
  }

}
