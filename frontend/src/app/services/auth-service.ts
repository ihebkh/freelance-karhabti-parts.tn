import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getDecodedToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getRoles(): string[] {
    return this.getDecodedToken()?.role || [];
  }

  getEmail(): string | null {
    return this.getDecodedToken()?.sub || null;
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  isAdmin(): boolean {
    return (this.hasRole('ADMIN')||this.hasRole('SUPER_ADMIN'));
  }

  isSuperAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN');
  }


  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      const isExpired = Math.floor(Date.now() / 1000) >= payload.exp;

      if (isExpired) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }


}
