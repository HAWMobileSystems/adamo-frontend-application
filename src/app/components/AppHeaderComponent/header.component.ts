import { Component, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
// import { UserService } from "../../services/user.service";
import { TabbarService } from '../../services/tabbar.service';
import { AuthService, AdamoMqttService } from '../../services';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { CollaborationModelEntity } from '../../models/CollaborationModelEntity';
import { NGXLogger } from 'ngx-logger';
// import { RoleType } from "../../../../../adamo-nest-server/src/constants/role-type";

@Component({
  selector: 'app-header',
  templateUrl: './header.template.html',

  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppHeaderComponent {
  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('navMenu') navMenu: ElementRef;

  public models: CollaborationModelEntity[] = [];
  public currentUser;
  public page;
  public showMenu;
  constructor(
    private router: Router,
    private logger: NGXLogger,
    // private userService: UserService,
    private authService: AuthService,
    private tabbarService: TabbarService,
    private mqttService: AdamoMqttService,
    public translate: TranslateService,
  ) {
    try {
      this.currentUser = this.authService.getCurrentUser();
    } catch (error) {
      this.router.navigate['/'];
    }
    this.tabbarService.getModelTabs().subscribe((data) => {
      this.models = data;
      console.log('this.models ', this.models);
    });
    // this.models = tabbarService.getModelTabs();
  }
  onBurgerClicked() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }

  ngOnDestroy() {
    this.logger.debug('ngOnDestroy: AppHeaderComponent');
    for (let index = 0; index <= this.models.length; index++) {
      this.unsubscribefromMQTT(index);
      this.tabbarService.removeTab(index);
    }
    this.models = [];
  }

  onLanguageChanged(language): void {
    this.translate.use(language);
  }
  public isAdmin() {
    // console.log('isAdmin() : ',this.currentUser, RoleType.Admin, this.currentUser.role === RoleType.Admin )
    if (!this.currentUser) {
      this.router.navigate['/'];
      return false;
    }
    // return this.currentUser.role === RoleType.Admin; TODO!
    return this.currentUser.role === 'ADMIN';
  }

  public remove(index: number): void {
    console.log(this.models[index]);
    this.unsubscribefromMQTT(index);
    this.tabbarService.removeTab(index);
    this.router.navigate['/overview'];
  }
  unsubscribefromMQTT(index: number) {
    const currentModel = this.models[index];
    try {
      this.mqttService
        // .getClient()
        //  const topic = 'MODEL/model_' + model.id + '_' + model.model_version;
        .unsubscribe(`MODEL/model_${currentModel.id}_${currentModel.model_version}`);
    } catch (error) {
      console.error('could not unsubscribe from index', index, this.models[index]);
      console.error('error', error);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate['/#'];
  }
}
