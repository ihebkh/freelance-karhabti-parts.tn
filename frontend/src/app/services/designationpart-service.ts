import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DesignationPart } from '../models/DesignationPart';

@Injectable({
  providedIn: 'root',
})
export class DesignationPartService {
  private apiUrl = 'http://localhost:8088/api/v1/designations-part';

  constructor(private http: HttpClient) { }

  findAll(): Observable<DesignationPart[]> {
    return this.http.get<DesignationPart[]>(this.apiUrl);
  }

  create(namePart: string, logo?: File): Observable<DesignationPart> {
    const formData = new FormData();
    formData.append('namePart', namePart);
    if (logo) formData.append('logo', logo);

    return this.http.post<DesignationPart>(this.apiUrl, formData);
  }

  update(id: number, namePart: string, logo?: File): Observable<DesignationPart> {
    const formData = new FormData();
    formData.append('namePart', namePart);
    if (logo) formData.append('logo', logo);

    return this.http.put<DesignationPart>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}