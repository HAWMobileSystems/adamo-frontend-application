import {Injectable} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs';

@Injectable()
export class AlertService {
  private subject : Subject<any> = new Subject<any>();
  private keepAfterNavigationChange : boolean = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next();
        }
      }
    });
  }

  public success(message: string, keepAfterNavigationChange : boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'success', text: message});
    window.scrollTo(0, 0);
  }

  public error(message: string, keepAfterNavigationChange : boolean = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'error', text: message});
    window.scrollTo(0, 0);
  }

  public getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}