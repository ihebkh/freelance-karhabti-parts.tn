import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Designation} from '../models/Designation';

@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  private apiUrl = 'http://84.247.131.212:8088/api/v1/designations';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Designation[]> {
    return this.http.get<Designation[]>(this.apiUrl);
  }

  create(name: string, logo?: File): Observable<Designation> {
    const formData = new FormData();
    formData.append('name', name);
    if (logo) formData.append('logo', logo);

    return this.http.post<Designation>(this.apiUrl, formData);
  }

  update(id: number, name: string, logo?: File): Observable<Designation> {
    const formData = new FormData();
    formData.append('name', name);
    if (logo) formData.append('logo', logo);

    return this.http.put<Designation>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
