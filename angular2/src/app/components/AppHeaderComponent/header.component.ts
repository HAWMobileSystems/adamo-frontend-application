import {Component} from '@angular/core';
import { UserService } from '../../services/user.service';
import { TabbarService } from '../../services/tabbar.service';
import { AuthService } from '../../services';
import { Router } from '@angular/router';
import { RoleType } from '../../../../../../adamo-nest-server/src/constants/role-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.template.html'
})
export class AppHeaderComponent {

  private models; 
  private currentUser;
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private tabbarService: TabbarService,
    
  ){
    this.currentUser = this.authService.getCurrentUser();
    this.models = tabbarService.getModelTabs();
  }

  protected isAdmin() {
    // console.log('isAdmin() : ',this.currentUser, RoleType.Admin, this.currentUser.role === RoleType.Admin )
    if(!this.currentUser) {
      this.router.navigate['/']
      return false
    }

    return this.currentUser.role === RoleType.Admin;
  }
}
