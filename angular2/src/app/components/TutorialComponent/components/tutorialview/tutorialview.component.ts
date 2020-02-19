import { Component, OnInit, Output } from '@angular/core';
// import { Level } from '../../models/startview.module';
import { LevelService } from '../../services/level.service';
import { Startview, ModellingTask } from '../../models/startview.module';
import { AuthService } from '../../../../services';
import { User } from '../../../../models/user';

@Component({
  selector: 'app-tutorialview',
  templateUrl: './tutorialview.component.html',
  styleUrls: ['./tutorialview.component.css']
})
export class TutorialViewComponent implements OnInit {

  constructor(private catService: LevelService, private authService: AuthService) {

  }

  user: User
  startview: Startview[] = new Array()


  ngOnInit() {
    this.user = this.authService.getCurrentUser()

    let json_response = [
      {
        "catName:Advanced": {
          "intro_status": [],
          "mult_qs_res": [],
          "modellingtasks": [
            {"id":"c612b6e3-b927-42e8-bf5f-39051c01ad9b",
            "name":"Learn to create a Basic Advanced Diagramm(1/3)",
            "score":0},
            {"id":"8ba455f2-255b-4352-92e3-541b6500f94d",
            "name":"Learn to create a Basic Advanced Diagramm(2/3)",
            "score":0},
            {"id":"2842ee93-3638-441f-a142-251a6975a9f4",
            "name":"Learn to create a Basic Advanced Diagramm(3/3)",
            "score":0}
            ]
        }
      }
    ]

    let json =[
      {
        "catName":"Beginner",
        "id":"id-1-beginner-test",
        "name":"name-1-beginner-test",
        "score":56,
        "intro":"true",
        "mctest":"true"
      },
      {
        "catName":"Beginner",
        "id":"id-2-beginner-test",
        "name":"name-2-beginner-test",
        "score":0,
        "intro":"true",
        "mctest":"true"
      },
      {
        "catName":"Advanced",
        "id":"id-1-advanced-test",
        "name":"name-1-advanced-test",
        "score":0,
        "intro":"false",
        "mctest":"false"
      },
      {
        "catName":"Profi",
        "id":"id-1-profi-test",
        "name":"name-1-profi-test",
        "score":0,
        "intro":"false",
        "mctest":"false"
      },

    ]
    this.parseIncomingJSON(json)
    console.log(this.user.getUid)
    
    console.log(this.startview)

    this.catService.startview(this.user.getUid).subscribe((view:any) => {
      console.log(view)
      this.parseIncomingJSON(view)
    })
  }

  parseIncomingJSON(json){

    let keys_catName = new Set()
    json.forEach(entry => {
      keys_catName.add(entry.catName)
    })

    keys_catName.forEach(key => {
      let help = new Startview(key)
      json.forEach(entry => {
        if(key === entry.catName){
          help.intro_status = entry.intro
          help.mult_qs_res = entry.mctest
          help.tasks.push(new ModellingTask(entry.id, entry.name, entry.score))
        }
      })
      this.startview.push(help)
    })
  }
}
