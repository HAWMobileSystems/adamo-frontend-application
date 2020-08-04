import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { UserWithTokenDto } from '../models/dto/UserWithTokenDTO';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private currentUserToken: any = null;
  constructor(public auth: AuthService) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      this.currentUserToken = this.auth.getCurrentUserWithTokenDto().token;
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.currentUserToken}`,
        },
      });
    } catch (error) {
      console.log('No User at the Moment');
    }


    return next.handle(request);
  }
}
