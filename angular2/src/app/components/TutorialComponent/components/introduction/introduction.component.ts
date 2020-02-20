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
  private url:any

  constructor(
    private route: ActivatedRoute,
    private LevServ: LevelService,
    private router:Router) {
      this.url = this.router.url;
      this.url = this.url.slice(0, this.url.lastIndexOf('/'));
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.categorie = params['cat']
        this.page = params['id']
      }
    )
    this.LevServ.contentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
      this.content = sub.intro_text
    })
  }

  clickPrevious(){
    if(this.page > 1){
      this.page--
      this.router.navigate([this.url, this.page])
      this.LevServ.contentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
        this.content = sub.intro_text
      })
    }
  }

  clickNext(){
    this.page++
    this.LevServ.contentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
      if(sub == null){
        this.page--
        return
      } else {
        this.router.navigate([this.url, this.page])
        this.content = sub.intro_text
      }
    })
  }

}
