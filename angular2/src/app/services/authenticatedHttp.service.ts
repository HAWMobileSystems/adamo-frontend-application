import {Injectable} from '@angular/core';
import {Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from '@angular/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthenticatedHttpService extends Http {

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router) {
    super(backend, defaultOptions);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).pipe(catchError((error: Response) => {
      if (
        error.status === 401 ||
        error.status === 403 ||
        error.status === 497 ||
        error.status === 496
      ) {
        console.log('The authentication session expires or the user is not authorised. Force to Login Page.');
        this.router.navigate(['/front-page']);

      }
      return Observable.throw(error);
    }));
  }
}