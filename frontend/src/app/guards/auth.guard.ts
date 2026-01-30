import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {catchError, map, Observable, of} from 'rxjs';
import {UserService} from '../services/user-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> | boolean {
    const jwtHelper = new JwtHelperService();
    const accessToken = this.userService.getAccessToken();
    const refreshToken = localStorage.getItem('refreshToken');


    if (!accessToken) {
      this.router.navigate(['/auth/signin']);
      return false;
    }


    if (!jwtHelper.isTokenExpired(accessToken)) {
      return true;
    }


    if (refreshToken && !jwtHelper.isTokenExpired(refreshToken)) {
      return this.userService.refreshToken().pipe(
        map(res => {

          localStorage.setItem('accessToken', res.accessToken);
          return true;
        }),
        catchError(() => {

          this.userService.logout();
          this.router.navigate(['/auth/signin']);
          return of(false);
        })
      );
    }


    this.userService.logout();
    this.router.navigate(['/auth/signin']);
    return false;
  }
}
