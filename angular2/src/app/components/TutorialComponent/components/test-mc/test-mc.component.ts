import { Component, OnInit } from '@angular/core';
//import { Level, Helper } from '../../models/level.module';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from '../../services/level.service';
import { AuthService } from '../../../../services/auth.service';
import { MultipleChoiceQuest, KeyValuePair } from '../../models/multiplechoice.module';

@Component({
  selector: 'app-test-mc',
  templateUrl: './test-mc.component.html',
  styleUrls: ['./test-mc.component.css']
})
export class TestMCComponent implements OnInit {

  private user_id: String
  private categorie: String
  private question: MultipleChoiceQuest

  constructor(private route: ActivatedRoute, private catService: LevelService, private authService: AuthService) {
    this.user_id = authService.getCurrentUser().id
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categorie = params['cat']
    })
    this.catService.getMultipleChoice(this.user_id, this.categorie).subscribe((view: any) => {
      this.transform(view)
    })
  }

  transform(json) {
    this.question = new MultipleChoiceQuest(json[0].id, json[0].question)

    json.forEach(entry => {
      this.question.answers.push({key: entry.answerID,value: entry.answer})
    })
  }

  CheckCorrectness() {
    var userChoice: KeyValuePair[] = new Array
    var ansid:number = 1
    userChoice.push({key:"userid",value:this.user_id})
    userChoice.push({key:"questionid", value:this.question.id})
    var elements = (<HTMLInputElement[]><any>document.getElementsByName("user_answers"))
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].type == "checkbox") {
        if (elements[i].checked) {
          // console.log(this.question.answers[i].key)
          userChoice.push({key:ansid+"",value:this.question.answers[i].key})
          ansid++
        }
      }
    }
    console.log(userChoice)
  }

}
