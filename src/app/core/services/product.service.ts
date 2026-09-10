import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: number;
  productName: string;
  productCode: string;
  price: number;
  description: string;
  imageUrl: string;
  createdDate: string;
}

export interface ProductRequest {
  productName: string;
  productCode: string;
  price: number;
  description: string;
  imageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private url = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.url}/${id}`);
  }

  create(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  update(id: number, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.url}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}