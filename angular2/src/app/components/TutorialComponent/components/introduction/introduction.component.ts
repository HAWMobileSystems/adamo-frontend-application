import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LevelService } from '../../services/level.service'
import { AuthService } from '../../../../services/auth.service'

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css'],
  encapsulation: ViewEncapsulation.None,
})


export class IntroductionComponent implements OnInit {

  private page: number
  private categorie: String
  private content: String
  private finish: boolean = false
  private url:any

  constructor(
    private route: ActivatedRoute,
    private catService: LevelService,
    private router:Router,
    private authService: AuthService) {
      this.url = this.router.url;
      this.url = this.url.slice(0, this.url.lastIndexOf('/'));
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.categorie = params['cat']
        this.page = params['id']
      }
    )
    this.catService.getContentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
      this.content = sub.intro_text
      console.log(this.content)
    })
  }

  clickPrevious(){
    if(this.page > 1){
      this.page--
      this.router.navigate([this.url, this.page])
      this.catService.getContentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
        this.content = sub.intro_text
      })
    }
  }

  clickNext(){
    this.page++
    this.catService.getContentOfIntro(this.categorie, this.page).subscribe((sub:any) => {
      if(sub == null){
        this.page--
        this.finish = true
        return
      } else {
        this.router.navigate([this.url, this.page])
        this.content = sub.intro_text
      }
    })
  }

  cancelIntro(){
    this.router.navigate(["/overview/tutorial/"])
  }

  finishIntro(){
    var userid = this.authService.getCurrentUser().id
    this.catService.postIntroFinish(userid, this.categorie)
    this.router.navigate(["/overview/tutorial/"])
  }

}
