import { Component, ViewChild, ElementRef } from "@angular/core";
import { UserService } from "../../services/user.service";
import { TabbarService } from "../../services/tabbar.service";
import { AuthService } from "../../services";
import { Router } from "@angular/router";

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "frontpage-header",
  templateUrl: "./frontpage-header.template.html"
})
export class FrontpageHeaderComponent {

  @ViewChild("navBurger") public navBurger: ElementRef;
  @ViewChild("navMenu") public navMenu: ElementRef;

  constructor(
    private router: Router,
    public translate: TranslateService
  ) {}

  public onBurgerClicked() {
    this.navBurger.nativeElement.classList.toggle("is-active");
    this.navMenu.nativeElement.classList.toggle("is-active");
  }
}
