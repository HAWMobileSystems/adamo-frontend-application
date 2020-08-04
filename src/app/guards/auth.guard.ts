import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    try {
      const user = this.authService.getCurrentUser();
    } catch (error) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
