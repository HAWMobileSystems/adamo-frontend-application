import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.template.html'
})

export class AppFooterComponent {
  private route: ActivatedRoute;
  private currentStatus: string;

  constructor(route: ActivatedRoute) {
    this.route = route;
    this.currentStatus = '';
  }

  public ngOnInit() {
    this.route.params
    .pipe(map((params: { status: any; }) => params.status))
      .subscribe((status: string) => {
        this.currentStatus = status || '';
      });
  }

}
