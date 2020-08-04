import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css']
})
export class LeavesComponent{
    public activeTab = '';
    constructor(
        private router: Router,
      ) {
        this.activeTab = router.url.split('/').slice(-1)[0]
        this.router.events
          .pipe(filter(event => event instanceof NavigationEnd))
          .subscribe((event: NavigationEnd) => {
            this.activeTab = event.url.split('/').slice(-1)[0]
          }); 
      }
}