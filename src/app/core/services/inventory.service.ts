import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Inventory {
  id: number;
  productCode: string;
  stockQuantity: number;
  unitPrice: number;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private url = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient,
  ) {}

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.url);
  }

  getByProductCode(productCode: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.url}/${productCode}`);
  }

  update(id: number, data: Partial<Inventory>): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.url}/${id}`, data);
  }

  addStock(productCode: string, quantity: number): Observable<any> {
  return this.http.post(`${this.url}`, {
    productCode: productCode,
    initialStock: quantity,
    unitPrice: 0
    });
  }
  
}