import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {CarBrand} from '../models/CarBrand';
import {CarModel} from '../models/CarModel';
import {CarGeneration} from '../models/CarGeneration';

@Injectable({ providedIn: 'root' })
export class PublicCarService {

  private baseUrl = 'http://localhost:8088/api/v1/cars';
  private uploadsUrl = `${this.baseUrl}/uploads`;
  constructor(private http: HttpClient) {}

  getBrands(): Observable<CarBrand[]> {
    return this.http.get<CarBrand[]>(`${this.baseUrl}/brands`);
  }

  getModelsByBrand(brandId: number): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.baseUrl}/brands/${brandId}/models`);
  }

  getGenerationsByModel(modelId: number): Observable<CarGeneration[]> {
    return this.http.get<CarGeneration[]>(`${this.baseUrl}/models/${modelId}/generations`);
  }


  getImageUrl(filePath?: string): string {
    return `${this.uploadsUrl}/${filePath}`;
  }

  getAllGenerations(): Observable<CarGeneration[]> {
    return this.http.get<CarGeneration[]>(`${this.baseUrl}/generations`);
  }

  lookupVin(query:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/vin-lookup/${query}`);
  }
}
