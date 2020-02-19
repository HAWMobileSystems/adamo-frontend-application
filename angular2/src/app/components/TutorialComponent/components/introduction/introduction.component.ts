import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LevelService } from '../../services/level.service'

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})


export class IntroductionComponent implements OnInit {

  private page: number
  private categorie: String
  private content: String

  constructor(
    private route: ActivatedRoute,
    private LevServ: LevelService,
    private router:Router) {}

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
    })
    console.log(this.content)
    // console.log("page: " + this.page)
  }

  clickPrevious(){
    if(this.page > 1){
      this.page--
      console.log(this.page)
      this.LevServ.contentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
        this.content = sub.intro_text
        console.log(this.content)
      })
    }
  }

  clickNext(){
    this.page++
    console.log(this.page)
    this.LevServ.contentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
      if(sub == null){
        this.page--
        return
      } else {
        this.content = sub.intro_text
        console.log(this.content)
      }
    })
  }

}
