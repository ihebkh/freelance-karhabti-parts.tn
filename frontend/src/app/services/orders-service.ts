import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {CarPartOrder} from '../models/CarPartOrder';
import {HttpClient} from '@angular/common/http';
import {CarPartOrderRequest} from '../models/CarPartOrderRequest';
import {PageResponse} from '../models/PageResponse';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = 'http://84.247.131.212:8088/api/v1/orders';

  constructor(private http: HttpClient) {}

  createOrder(email: string, request: CarPartOrderRequest): Observable<CarPartOrder> {
    return this.http.post<CarPartOrder>(
      `${this.baseUrl}?email=${email}`,
      request
    );
  }

// orders.service.ts

  getOrdersByUser(email: string, page: number = 0, status?: string): Observable<PageResponse<CarPartOrder>> {
    let url = `${this.baseUrl}/user/${email}?page=${page}`;
    if (status && status !== 'ALL') {
      url += `&status=${status}`;
    }
    return this.http.get<PageResponse<CarPartOrder>>(url);
  }

  getAllOrders(page: number = 0, status?: string): Observable<PageResponse<CarPartOrder>> {
    let url = `${this.baseUrl}?page=${page}`;
    if (status && status !== 'ALL') {
      url += `&status=${status}`;
    }
    return this.http.get<PageResponse<CarPartOrder>>(url);
  }
  updateStatus(orderId: number, status: string): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${orderId}/status?status=${status}`,
      {}
    );
  }
}
