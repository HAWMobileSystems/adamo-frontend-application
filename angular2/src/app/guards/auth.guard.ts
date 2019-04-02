import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject, from} from 'rxjs';
import {ApiService} from '../services/api.service';
import { first } from 'rxjs/operators';

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
        (response: any) => {
          if (response.loggedIn) {
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
    return from(subject).pipe(first()); // subject.asObservable().first();

  }
}