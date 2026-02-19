import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryAcc } from '../models/CategoryAcc';

@Injectable({
  providedIn: 'root',
})
export class CategorieAccService {

  // Public endpoint for listing accessory categories
  private baseUrl = 'http://localhost:8088/api/v1/parts/categoryacc';

  constructor(private http: HttpClient) { }

  getAll(): Observable<CategoryAcc[]> {
    return this.http.get<CategoryAcc[]>(this.baseUrl);
  }

  getById(id: number): Observable<CategoryAcc> {
    return this.http.get<CategoryAcc>(`${this.baseUrl}/${id}`);
  }
}