import {Component, ViewChild, ElementRef} from '@angular/core';
import { UserService } from '../../services/user.service';
import { TabbarService } from '../../services/tabbar.service';
import { AuthService } from '../../services';
import { Router } from '@angular/router';

import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'frontpage-header',
  templateUrl: './frontpage-header.template.html'
})
export class FrontpageHeaderComponent {

  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('navMenu') navMenu: ElementRef;

  constructor(
    private router: Router,
    private translate: TranslateService,
    // private userService: UserService,
    // private authService: AuthService,
    // private tabbarService: TabbarService,
    
  ){
   
  }
  
  onBurgerClicked() {
        this.navBurger.nativeElement.classList.toggle('is-active');
        this.navMenu.nativeElement.classList.toggle('is-active');
    }
}
