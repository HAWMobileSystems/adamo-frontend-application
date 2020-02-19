import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { LevelService } from '../../services/level.service'

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})


export class IntroductionComponent implements OnInit {

  private page: Number
  private categorie: String
  private content: String

  constructor(private route: ActivatedRoute, private LevServ: LevelService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.categorie = params['cat']
        this.page = params['id']
      }
    )
    console.log(this.categorie + ", page: " + this.page)
    this.LevServ.contentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
      console.log(sub)
      this.content = sub.intro_text
      console.log(this.content)
    })
  }

  clickPrevious(){
    this.LevServ.contentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
      this.content = sub.intro_text
    })
  }

  clickNext(){
    this.LevServ.contentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
      this.content = sub.intro_text
    })
  }

}
