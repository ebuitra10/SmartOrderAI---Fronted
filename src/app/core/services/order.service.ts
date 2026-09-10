import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Order {
  id: number;
  userId: string;
  date: string;
  store: string;
  paymentMethod: string;
  totalPrice: number;
}

export interface OrderItem {
  productCode: string;
  quantity: number;
}

export interface CreateOrderRequest {
  date: string;
  store: string;
  paymentMethod: string;
}

export interface CreateOrderItemsRequest {
  orderId: number;
  items: OrderItem[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private ordersUrl = `${environment.apiUrl}/orders`;
  private itemsUrl = `${environment.apiUrl}/products-orders`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  createOrder(data: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.ordersUrl, data);
  }

  addItems(data: CreateOrderItemsRequest): Observable<any> {
    return this.http.post(this.itemsUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.ordersUrl}/${id}`);
  }
}