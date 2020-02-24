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
  private userID: String
  private startview: Startview[] = new Array()

  constructor(private catService: LevelService, private authService: AuthService) {
    this.userID = this.authService.getCurrentUser().id
  }
  
  ngOnInit() {
    this.catService.getStartview(this.userID).subscribe((view:any) => {
      console.log(view)
      this.parseIncomingJSON(view)
    })
    console.log(this.startview)
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
