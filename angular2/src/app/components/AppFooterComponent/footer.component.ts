import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.template.html'
})

export class AppFooterComponent {
  private _route: ActivatedRoute;
  private currentStatus: string;

  constructor( route: ActivatedRoute) {
    this._route = route;
    this.currentStatus = '';
  }

  public ngOnInit() {
    this._route.params
      .map(params => params.status)
      .subscribe((status) => {
        this.currentStatus = status || '';
      });
  }

}
