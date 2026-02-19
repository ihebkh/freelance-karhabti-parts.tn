import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/Category';
import { SubCategory } from '../models/SubCategory';
import { CategoryAcc } from '../models/CategoryAcc';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryService {

  private baseUrl = 'http://localhost:8088/api/v1/admin/categories';
  private baseAccUrl = 'http://localhost:8088/api/v1/admin/categoriesAcc';

  constructor(private http: HttpClient) { }

  /* ===================== CATEGORY ===================== */

  createCategory(name: string, image?: File): Observable<Category> {
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    return this.http.post<Category>(this.baseUrl, formData);
  }

  updateCategory(id: number, name: string, image?: File): Observable<Category> {
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    return this.http.put<Category>(`${this.baseUrl}/${id}`, formData);
  }

  deleteC(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /* ===================== SUB CATEGORY ===================== */

  createSubCategory(categoryId: number, name: string, image?: File): Observable<SubCategory> {
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    return this.http.post<SubCategory>(`${this.baseUrl}/${categoryId}/subcategories`, formData);
  }

  updateSubCategory(id: number, name: string, image?: File): Observable<SubCategory> {
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    return this.http.put<SubCategory>(`${this.baseUrl}/subcategories/${id}`, formData);
  }

  deleteSubC(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subcategories/${id}`);
  }

  /* ===================== CATEGORY ACC ===================== */

  getAllCategoryAcc(): Observable<CategoryAcc[]> {
    return this.http.get<CategoryAcc[]>(`${this.baseAccUrl}/categoryacc`);
  }

  createCategoryAcc(name: string, image?: File): Observable<CategoryAcc> {
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    return this.http.post<CategoryAcc>(`${this.baseAccUrl}/categoryacc`, formData);
  }

  updateCategoryAcc(id: number, name: string, image?: File): Observable<CategoryAcc> {
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('image', image);
    return this.http.put<CategoryAcc>(`${this.baseAccUrl}/categoryacc/${id}`, formData);
  }

  deleteCategoryAcc(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseAccUrl}/categoryacc/${id}`);
  }
}