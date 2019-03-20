import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject} from 'rxjs/Rx';
import {ApiService} from '../services/api.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private apiService: ApiService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    // var t: boolean = true;
    // if (t) return true;   //Uncomment to turn off AuthGuard
    const subject = new Subject<boolean>();
    this.apiService.login_status()
      .subscribe(
        (response) => {
          if (response.json().loggedIn) {
            subject.next(true);
          } else {
            this.router.navigate(['/front-page']);
            subject.next(false);
          }
        },
        error => {
          console.log(error);
          this.router.navigate(['/front-page']);
          subject.next(false);
        });
    return subject.asObservable().first();

  }
}