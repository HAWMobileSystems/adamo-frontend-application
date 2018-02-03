import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, Subject} from "rxjs/Rx";
import {ApiService} from "../services/api.service";

@Injectable()
export class AuthGuard implements CanActivate {


    constructor(private router: Router,
                private apiService: ApiService) {
    }



    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        // var t: boolean = true;
        // if (t) return true;   //Uncomment to turn off AuthGuard
        var subject = new Subject<boolean>();
        this.apiService.login_status()
            .subscribe(
                response => {
                    if (response.loggedIn) {
                        subject.next(true);
                    }
                    else {
                        console.log(response);
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