import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LevelService } from '../../services/level.service'
import { AuthService } from '../../../../services/auth.service'

import { Language } from '../../models/language.enum';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

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
  private url: any
  
  private lang: string
  subscription:Subscription;

  constructor(
    private route: ActivatedRoute,
    private catService: LevelService,
    private router: Router,
    private authService: AuthService,
    private translateService: TranslateService, 
    // private langService: LanguageService
    ) {
      this.url = this.router.url
      this.url = this.url.slice(0, this.url.lastIndexOf('/'))
      
  }

  ngOnInit() {
    // this.subscription = this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
        this.lang = this.translateService.currentLang;
    //   this.lang = lang
      this.route.params.subscribe(params => {
        this.categorie = params['cat']
        this.page = params['id']
      })
      console.log(this.lang, this.categorie, this.page)
      this.router.navigate(["/overview/tutorial/intro/",this.lang, this.categorie, this.page])
      this.catService.getContentOfIntro(this.lang, this.categorie, this.page).subscribe((sub: any) => {
        this.content = sub.intro_text
      })
    // })
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  clickPrevious() {
    console.log(this.lang)
    if (this.page > 1) {
      this.page--
      this.router.navigate(["/overview/tutorial/intro/",this.lang, this.categorie, this.page])
      this.catService.getContentOfIntro(this.lang, this.categorie, this.page).subscribe((sub: any) => {
        this.content = sub.intro_text
      })
    }
  }

  clickNext() {
    console.log(this.lang)
    this.page++
    this.catService.getContentOfIntro(this.lang, this.categorie, this.page).subscribe((sub: any) => {
      if (sub == null) {
        this.page--
        this.finish = true
        return
      } else {
        this.router.navigate(["/overview/tutorial/intro/",this.lang, this.categorie, this.page])
        this.content = sub.intro_text
      }
    })
  }

  cancelIntro() {
    this.router.navigate(["/overview/tutorial/"])
  }

  finishIntro() {
    var userid = this.authService.getCurrentUser().id
    this.catService.postIntroFinish(userid, this.categorie)
    this.router.navigate(["/overview/tutorial/start", this.lang])
  }

}
