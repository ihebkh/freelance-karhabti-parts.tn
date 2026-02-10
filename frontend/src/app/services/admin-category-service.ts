import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { SubCategory } from '../models/SubCategory';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryService {

  private baseUrl = 'http://localhost:8088/api/v1/admin/categories';

  constructor(private http: HttpClient) {}

  /* ===================== CATEGORY ===================== */

  createCategory(
    name: string,
    image?: File
  ): Observable<Category> {

    const formData = new FormData();
    formData.append('name', name);

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<Category>(this.baseUrl, formData);
  }

  updateCategory(
    id: number,
    name: string,
    image?: File
  ): Observable<Category> {

    const formData = new FormData();
    formData.append('name', name);

    if (image) {
      formData.append('image', image);
    }

    return this.http.put<Category>(
      `${this.baseUrl}/${id}`,
      formData
    );
  }

  /* ===================== SUB CATEGORY ===================== */

  createSubCategory(
    categoryId: number,
    name: string,
    image?: File
  ): Observable<SubCategory> {

    const formData = new FormData();
    formData.append('name', name);

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<SubCategory>(
      `${this.baseUrl}/${categoryId}/subcategories`,
      formData
    );
  }

  updateSubCategory(
    id: number,
    name: string,
    image?: File
  ): Observable<SubCategory> {

    const formData = new FormData();
    formData.append('name', name);

    if (image) {
      formData.append('image', image);
    }

    return this.http.put<SubCategory>(
      `${this.baseUrl}/subcategories/${id}`,
      formData
    );
  }




  deleteC(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }


  deleteSubC(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subcategories/${id}`);
  }
}
