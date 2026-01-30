import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable({ providedIn: 'root' })
export class RootRedirectGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.getToken()) {
      this.router.navigate(['/home']);
      return false;
    }

    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin/cars/brands']);
    } else {
      this.router.navigate(['/home']);
    }

    return false;
  }
}
