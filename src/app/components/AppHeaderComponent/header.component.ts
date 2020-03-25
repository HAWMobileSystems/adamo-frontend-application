import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from "@angular/core";
// import { UserService } from "../../services/user.service";
import { TabbarService } from "../../services/tabbar.service";
import { AuthService, AdamoMqttService } from "../../services";
import { Router } from "@angular/router";
// import { RoleType } from "../../../../../adamo-nest-server/src/constants/role-type";

@Component({
  selector: "app-header",
  templateUrl: "./header.template.html",

  changeDetection: ChangeDetectionStrategy.Default
})
export class AppHeaderComponent {

  @ViewChild("navBurger") navBurger: ElementRef;
  @ViewChild("navMenu") navMenu: ElementRef;

  public models; 
  public currentUser;
  public page;
  public showMenu;
  constructor(
    private router: Router,
    // private userService: UserService,
    private authService: AuthService,
    private tabbarService: TabbarService,
    private mqttService: AdamoMqttService
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.tabbarService.getModelTabs().subscribe(data => {
      this.models = data;
      console.log("this.models ", this.models);
    });
    // this.models = tabbarService.getModelTabs();
  }
  onBurgerClicked() {
    this.navBurger.nativeElement.classList.toggle("is-active");
    this.navMenu.nativeElement.classList.toggle("is-active");
  }

  public isAdmin() {
    // console.log('isAdmin() : ',this.currentUser, RoleType.Admin, this.currentUser.role === RoleType.Admin )
    if (!this.currentUser) {
      this.router.navigate["/"];
      return false;
    }
    // return this.currentUser.role === RoleType.Admin; TODO!
    return this.currentUser.role === 'ADMIN';
  }

  public remove(index: number): void {
    console.log(this.models[index]);
    // this.unsubscribefromMQTT(index);
    this.tabbarService.removeTab(index);
    this.router.navigate["/overview"];
  }
  unsubscribefromMQTT(index: number) {
    try {
      this.mqttService
        .getClient()
        .unsubscribe(
          "MODEL/model_" +
            this.models[index].id +
            "_" +
            this.models[index].version
        );
    } catch (error) {
      console.error("error", error);
    }
  }
}
