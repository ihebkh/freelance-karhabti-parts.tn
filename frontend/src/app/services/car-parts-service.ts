import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CarPart} from '../models/CarPart';
import {PageResponse} from '../models/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class CarPartsService {
  private baseUrl = 'http://84.247.131.212:8088/api/v1/parts';

  constructor(private http: HttpClient) {}

  getPartsByGeneration(
    generationId: number,
    page: number = 0,
    designationId?: number,
    catId?: number,
    subCatId?:number):
    Observable<PageResponse<CarPart>> {
    let url = `${this.baseUrl}/generation/${generationId}?page=${page}`;
    if (designationId) url += `&designationId=${designationId}`;
    if (catId) url += `&categoryId=${catId}`;
    if (subCatId) url += `&subCategoryId=${subCatId}`;

    return this.http.get<PageResponse<CarPart>>(url);
  }

  getPartsBySubCategory(subcategoryId: number, page: number = 0, designationId?: number): Observable<PageResponse<CarPart>> {
    let url = `${this.baseUrl}/subcategory/${subcategoryId}?page=${page}`;
    if (designationId) url += `&designationId=${designationId}`;
    return this.http.get<PageResponse<CarPart>>(url);
  }

  getAllParts(page: number = 0, designationId?: number,
              catId?: number,
              subCatId?:number
  ): Observable<PageResponse<CarPart>> {
    let url = `${this.baseUrl}?page=${page}`;
    if (designationId) url += `&designationId=${designationId}`;
    if (catId) url += `&categoryId=${catId}`;
    if (subCatId) url += `&subCategoryId=${subCatId}`;

    return this.http.get<PageResponse<CarPart>>(url);
  }



  getAllPartsOnSale(page: number = 0): Observable<PageResponse<CarPart>> {
    let url = `${this.baseUrl}/on-sale?page=${page}`;
    return this.http.get<PageResponse<CarPart>>(url);
  }


  getPart(id: number): Observable<CarPart> {
    return this.http.get<CarPart>(`${this.baseUrl}/${id}`);
  }

  createPart(part: CarPart, file?: File): Observable<CarPart> {
    const formData = new FormData();
    this.fillFormData(formData, part, file);
    return this.http.post<CarPart>(this.baseUrl, formData);
  }

  updatePart(part: CarPart, file?: File): Observable<CarPart> {
    const formData = new FormData();
    this.fillFormData(formData, part, file);
    return this.http.put<CarPart>(`${this.baseUrl}/${part.id}`, formData);
  }

  private fillFormData(formData: FormData, part: any, file?: File): void {
    formData.append('name', part.name);
    formData.append('price', part.price.toString());
    formData.append('inStock', part.inStock.toString());
    formData.append('subCategoryId', part.subCategoryId.toString());

    // The new fields matching your Java Controller @RequestParams
    formData.append('desId', part.designationId.toString());
    formData.append('ref', part.reference || '');
    formData.append('desc', part.description || '');


    formData.append('onSale', part.onSale.toString());
    formData.append('salePercentage', (part.salePercentage || 0).toString());

    // ManyToMany Compatibility IDs
    if (part.generationIds && part.generationIds.length > 0) {
        formData.append('generationIds', part.generationIds.join(','));
    }

    if (file) {
      formData.append('imageFile', file);
    }
  }

  deletePart(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  searchParts(query: string, page: number = 0): Observable<PageResponse<CarPart>> {
    return this.http.get<PageResponse<CarPart>>(
      `${this.baseUrl}/search?q=${query}&page=${page}`
    );
  }
}
