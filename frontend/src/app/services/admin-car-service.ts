import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CarBrand} from '../models/CarBrand';
import {CarModel} from '../models/CarModel';
import {CarGeneration} from '../models/CarGeneration';

@Injectable({ providedIn: 'root' })
export class AdminCarService {

  private baseUrl = 'http://84.247.131.212:8088/api/v1/admin/cars';

  constructor(private http: HttpClient) {}

  // ===== BRANDS =====
  createBrand(name: string, logo?: File): Observable<CarBrand> {
    const fd = new FormData();
    fd.append('name', name);
    if (logo) fd.append('logo', logo);
    return this.http.post<CarBrand>(`${this.baseUrl}/brands`, fd);
  }

  updateBrand(id: number, name: string, logo?: File): Observable<CarBrand> {
    const fd = new FormData();
    fd.append('name', name);
    if (logo) fd.append('logo', logo);
    return this.http.put<CarBrand>(`${this.baseUrl}/brands/${id}`, fd);
  }

  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/brands/${id}`);
  }

  // ===== MODELS =====
  createModel(brandId: number, name: string, image?: File): Observable<CarModel> {
    const fd = new FormData();
    fd.append('name', name);
    if (image) fd.append('image', image);
    return this.http.post<CarModel>(`${this.baseUrl}/brands/${brandId}/models`, fd);
  }

  updateModel(id: number, name: string, image?: File): Observable<CarModel> {
    const fd = new FormData();
    fd.append('name', name);
    if (image) fd.append('image', image);
    return this.http.put<CarModel>(`${this.baseUrl}/models/${id}`, fd);
  }

  deleteModel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/models/${id}`);
  }

  // ===== GENERATIONS =====
  createGeneration(modelId: number, name: string, image?: File): Observable<CarGeneration> {
    const fd = new FormData();
    fd.append('name', name);
    if (image) fd.append('image', image);
    return this.http.post<CarGeneration>(`${this.baseUrl}/models/${modelId}/generations`, fd);
  }

  updateGeneration(id: number, name: string, image?: File): Observable<CarGeneration> {
    const fd = new FormData();
    fd.append('name', name);
    if (image) fd.append('image', image);
    return this.http.put<CarGeneration>(`${this.baseUrl}/generations/${id}`, fd);
  }

  deleteGeneration(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/generations/${id}`);
  }
}
