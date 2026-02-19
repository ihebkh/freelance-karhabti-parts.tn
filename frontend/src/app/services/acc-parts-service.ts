import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccPart } from '../models/AccPart';
import { PageResponse } from '../models/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class AccPartsService {
  private baseUrl = 'http://localhost:8088/api/v1/acc-parts';

  constructor(private http: HttpClient) { }

  getPartsByCategoryAcc(
    categoryAccId: number,
    page: number = 0,
    designationId?: number
  ): Observable<PageResponse<AccPart>> {
    let url = `${this.baseUrl}/category/${categoryAccId}?page=${page}`;
    if (designationId) url += `&designationId=${designationId}`;
    return this.http.get<PageResponse<AccPart>>(url);
  }

  getAllParts(
    page: number = 0,
    designationId?: number,
    categoryAccId?: number
  ): Observable<PageResponse<AccPart>> {
    let url = `${this.baseUrl}?page=${page}`;
    if (designationId) url += `&designationId=${designationId}`;
    if (categoryAccId) url += `&categoryAccId=${categoryAccId}`;
    return this.http.get<PageResponse<AccPart>>(url);
  }

  getAllPartsOnSale(page: number = 0): Observable<PageResponse<AccPart>> {
    const url = `${this.baseUrl}/on-sale?page=${page}`;
    return this.http.get<PageResponse<AccPart>>(url);
  }

  getPart(id: number): Observable<AccPart> {
    return this.http.get<AccPart>(`${this.baseUrl}/${id}`);
  }

  createPart(part: AccPart, file?: File): Observable<AccPart> {
    const formData = new FormData();
    this.fillFormData(formData, part, file);
    return this.http.post<AccPart>(this.baseUrl, formData);
  }

  updatePart(part: AccPart, file?: File): Observable<AccPart> {
    const formData = new FormData();
    this.fillFormData(formData, part, file);
    return this.http.put<AccPart>(`${this.baseUrl}/${part.id}`, formData);
  }

  private fillFormData(formData: FormData, part: AccPart, file?: File): void {
    formData.append('name', part.name);
    formData.append('price', part.price.toString());
    formData.append('costPrice', part.costPrice.toString());
    formData.append('inStock', part.inStock.toString());

    if (!part.categoryAccId) {
      throw new Error('CategoryAcc ID is required');
    }
    formData.append('categoryAccId', part.categoryAccId.toString());

    formData.append('desId', part.designationId.toString());
    formData.append('ref', part.reference || '');
    formData.append('desc', part.description || '');
    formData.append('onSale', part.onSale.toString());
    formData.append('salePercentage', (part.salePercentage || 0).toString());

    if (file) {
      formData.append('imageFile', file);
    }
  }

  deletePart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchParts(query: string, page: number = 0): Observable<PageResponse<AccPart>> {
    return this.http.get<PageResponse<AccPart>>(
      `${this.baseUrl}/search?q=${query}&page=${page}`
    );
  }
}

