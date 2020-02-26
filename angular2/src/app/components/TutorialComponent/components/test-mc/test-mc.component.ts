import { Component, OnInit, ViewEncapsulation } from '@angular/core';
//import { Level, Helper } from '../../models/level.module';
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
      
      this.route.params.subscribe(params => {
        this.categorie = params['cat']
      })
      this.router.navigate(['overview/tutorial/multiplechoice/', this.lang, this.categorie])
      this.catService.getMultipleChoice(this.user_id, this.categorie,this.lang).subscribe((view: any) => {
        this.transform(view)
      })
    })
  }

  transform(json) {
    this.question.setIDandQuest(json[0].id, json[0].question)

    json.forEach(entry => {
      this.question.answers.push({key: entry.answerID,value: entry.answer})
    })
  }

  CheckCorrectness() {
    var userChoice: KeyValuePair[] = new Array
    userChoice.push({key:"userid",value:this.user_id})
    userChoice.push({key:"questionid", value:this.question.id})
    var elements = (<HTMLInputElement[]><any>document.getElementsByName("user_answers"))
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "checkbox") {
        if (elements[i].checked) {
          // console.log(this.question.answers[i].key)
          userChoice.push({key:this.question.answers[i].key, value:'true'})
        }else {
          userChoice.push({key:this.question.answers[i].key, value:'false'})
        }
      }
    }
    console.log(userChoice)
    this.catService.postMultipleChoice(userChoice).subscribe(resp => {
      console.log(resp)
    })
    // this.question = null

  }

  NextQuestion(){
    this.catService.getMultipleChoice(this.user_id, this.categorie,this.lang).subscribe((view: any) => {
      this.transform(view)
    })
  }

}
