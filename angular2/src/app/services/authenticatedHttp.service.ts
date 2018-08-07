import {Injectable} from '@angular/core';
import {Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers} from '@angular/http';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthenticatedHttpService extends Http {

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router) {
    super(backend, defaultOptions);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).catch((error: Response) => {
      if (
        error.status === 401 ||
        error.status === 403 ||
        error.status === 497 ||
        error.status === 496
      ) {
        console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
        this.router.navigate(['/front-page']);

      }
      return Observable.throw(error);
    });
  }
}