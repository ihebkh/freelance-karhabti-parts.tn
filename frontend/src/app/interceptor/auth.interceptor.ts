import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Skip adding token for login or refresh endpoints
    if (req.url.endsWith('/login') || req.url.endsWith('/refresh-token')) {
      return next.handle(req);
    }

    // Attach access token if available
    const accessToken = localStorage.getItem('accessToken');
    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // Only attempt refresh if 401 & refresh token exists
        if (error.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            return this.userService.refreshToken().pipe(
              switchMap(res => {
                // save new access token
                localStorage.setItem('accessToken', res.accessToken);

                // retry original request with new token
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` }
                });
                return next.handle(retryReq);
              }),
              catchError(() => {
                // refresh token expired → logout
                this.userService.logout();
                this.router.navigate(['/auth/signin']);
                return throwError(() => error);
              })
            );
          } else {
            // no refresh token → logout
            this.userService.logout();
            this.router.navigate(['/auth/signin']);
            return throwError(() => error);
          }
        }

        // other errors → propagate
        return throwError(() => error);
      })
    );
  }
}
