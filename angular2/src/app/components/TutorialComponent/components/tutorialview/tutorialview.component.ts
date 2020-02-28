import { Component, OnInit, Output } from '@angular/core';
// import { Level } from '../../models/startview.module';
import { LevelService } from '../../services/level.service';
import { Startview, ModellingTask } from '../../models/startview.module';
import { AuthService } from '../../../../services';
import { Language } from '../../models/language.enum';
import { LanguageService } from '../../services/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorialview',
  templateUrl: './tutorialview.component.html',
  styleUrls: ['./tutorialview.component.css']
})
export class TutorialViewComponent implements OnInit {
  private userID: String
  private lang: Language
  private startview: Startview[] = new Array()

  constructor(
    private catService: LevelService, 
    private authService: AuthService, 
    private langService:LanguageService,
    private router: Router) {
      this.userID = this.authService.getCurrentUser().id
  }
  
  ngOnInit() {
    this.langService.lang$.subscribe(lang => {
      this.lang = lang
      // console.log(this.lang)

      this.router.navigate(["/overview/tutorial/start/", this.lang])
      this.catService.getStartview(this.userID, this.lang).subscribe((view:any) => {
        this.parseIncomingJSON(view)
        // console.log(view)
      })
    })
  }

  parseIncomingJSON(json){

    this.startview = []

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
    // console.log(this.startview)
  }
}
