import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-tutorial",
  templateUrl: "./tutorial.component.html",
  styleUrls: ["./tutorial.component.css"],
})
export class TutorialComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService
  ) {}
}
