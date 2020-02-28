import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelService } from '../../services/level.service';
import { AuthService } from '../../../../services/auth.service';
import { MultipleChoiceQuest, KeyValuePair } from '../../models/multiplechoice.module';
import { LanguageService } from './../../services/language.service'
import { Language } from '../../models/language.enum';

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

  constructor(private route: ActivatedRoute,
    private catService: LevelService,
    private authService: AuthService,
    private langService: LanguageService,
    private router: Router) {
    this.question = new MultipleChoiceQuest()
    this.user_id = authService.getCurrentUser().id
  }

  ngOnInit() {
    this.langService.lang$.subscribe(lang => {
      this.lang = lang

      this.question.answers = []

      this.route.params.subscribe(params => {
        this.categorie = params['cat']
      })
      this.router.navigate(['overview/tutorial/multiplechoice/', this.lang, this.categorie])
      this.catService.getMultipleChoice(this.user_id, this.categorie, this.lang).subscribe((view: any) => {
        this.transform(view)
      })
    })
  }

  transform(json) {

    this.question.setIDandQuest(json[0].id, json[0].question)

    json.forEach(entry => {
      this.question.answers.push({ key: entry.answerID, value: entry.answer })
    })
  }

  async CheckCorrectness() {
    this.removeSolutionDiv()

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
    let correct
    correct = await this.getData(userChoice)

    //first in correct
    //Object { key: "9c49de1b-55ac-4d90-b5e1-0e1ea74466bb", value: true }

    // console.log(correct)
    let element = document.getElementById("solution")
    let counter = 0
    correct.forEach(response => {
      // console.log(response)
      userChoice.forEach(userresp => {
        // console.log(userresp)
        // console.log(userresp.key)
        if (response.value == true) {
          if (userresp.key == response.key) {
            // var node = document.createElement("div")
            // node.setAttribute("style", "width: fit-content;background-color: #00CB28;");
            // let text = this.question.answers.find(x => x.key == response.key).value
            // node.appendChild(document.createTextNode(String(text)))
            // element.appendChild(node)
            // counter++


            // console.log(response.key)
            var test = document.getElementById(response.key)
            // console.log(test)
            test.setAttribute("style", "background-color:#00CB28;")
          }
        } else {
          if (userresp.key == response.key) {
            // var node = document.createElement("div")
            // node.setAttribute("style", "width: fit-content;background-color: #FE0000;");
            // let text = this.question.answers.find(x => x.key == response.key).value
            // node.appendChild(document.createTextNode(String(text)))
            // element.appendChild(node)


            var test = document.getElementById(response.key)
            test.setAttribute("style", "background-color:#FE0000;")
          }
        }
      })
    })
    // if(counter == correct.length){
    //   alert("Sie haben diese Frage richtig beantwortet. Sie können zur nächsten Frage weiter")
    //   console.log(document.getElementById("nextButton").getAttribute("disabled").valueOf())
    //   document.getElementById("nextButton").setAttribute("disabled", "false")
    //   console.log(document.getElementById("nextButton").getAttribute("disabled").valueOf())
    // } else {
    //   alert("Sie haben diese Frage false beantwortet. Probieren sie es erneut")
    // }
  }
  getData(userChoice): Promise<any> {
    return this.catService.postMultipleChoice(userChoice).toPromise();
  }

  removeSolutionDiv(){
    const myNode = document.getElementById("solution");
    myNode.innerHTML = '';
  }

  NextQuestion() {
    this.question.answers = []
    this.removeSolutionDiv()
    this.ngOnInit()
  }

}
