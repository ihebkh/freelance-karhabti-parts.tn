import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {User} from '../models/UserModel';
import {Observable, tap} from 'rxjs';
import {AuthResponse} from '../models/AuthResponse';
import {PageResponse} from '../models/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8088/api/v1/users';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  verify(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify`, {
      params: { token },

    });
  }
  resendVerification(email: string) {
    return this.http.post<void>(
      `${this.baseUrl}/resend-verification`,
      null,
      { params: { email } }
    );
  }



  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      null,
      { params: { email, password } }
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken')!;
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/refresh-token`,
      null,
      { params: { refreshToken } }
    ).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
      })
    );
  }

  logout() {
    localStorage.clear();
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }


  updateProfileInfo(userId: number, profileData: any): Observable<User> {
    return this.http.put<User>(
      `${this.baseUrl}/${userId}/profile`,
      profileData
    );
  }
  // Update profile picture
  updateProfilePicture(userId: number, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<User>(
      `${this.baseUrl}/${userId}/profile-picture`,
      formData
    );
  }

  // Get profile picture URL
  getProfilePicture(userId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/profile-picture/${userId}`, {
      responseType: 'blob'
    });
  }



  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password/request?email=${email}`, {});
  }

  completePasswordReset(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password/reset`, {
      token: token,
      newPassword: newPassword
    });
  }


  getAllUsers(page: number = 0, role?: string): Observable<PageResponse<User>> {
    let params = new HttpParams().set('page', page.toString());

    if (role && role !== 'ALL') {
      params = params.set('role', role);
    }
    return this.http.get<PageResponse<User>>(`${this.baseUrl}`, { params });
  }

  updateUserRole(userId: number, role: string): Observable<User> {
    const params = new HttpParams().set('role', role);
    return this.http.patch<User>(`${this.baseUrl}/${userId}/role`, null, { params });
  }

}
