import { Injectable } from '@angular/core';
import {SubCategory} from '../models/SubCategory';
import {Observable} from 'rxjs';
import {Category} from '../models/Category';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PublicCategoryService {

  private baseUrl = 'http://84.247.131.212:8088/api/v1/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  getSubCategoriesByCategory(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(
      `${this.baseUrl}/${categoryId}/subcategories`
    );
  }
}
