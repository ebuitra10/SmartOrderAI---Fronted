import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InventorySummary {
  total_products: number;
  total_stock_value: string;
  products_low_stock: number;
  products_out_of_stock: number;
  last_updated: string;
}

export interface TopProduct {
  product_code: string;
  product_name: string;
  total_units_sold: number;
  total_revenue: string;
  rank: number;
}

export interface SalesReport {
  period_start: string;
  period_end: string;
  total_revenue: string;
  total_units_sold: number;
  total_orders: number;
  top_products: TopProduct[];
}

export interface Alert {
  id: number;
  product_code: string;
  alert_type: string;
  message: string;
  created_at: string;
  resolved: boolean;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private url = environment.analyticsUrl;

  constructor(private http: HttpClient) {}

  getInventorySummary(): Observable<InventorySummary> {
    return this.http.get<InventorySummary>(`${this.url}/inventory/summary`);
  }

  getSalesReport(startDate?: string, endDate?: string): Observable<SalesReport> {
    let params: any = {};
    if (startDate && endDate) {
      params = { start_date: startDate, end_date: endDate };
    }
    return this.http.get<SalesReport>(`${this.url}/sales/report`, { params });
  }

  getTopProducts(): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.url}/sales/top-products`);
  }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.url}/alerts`);
  }

  runSnapshot(): Observable<any> {
    return this.http.post(`${this.url}/dev/run-snapshot`, {});
  }

  runEtl(targetDate: string): Observable<any> {
    return this.http.post(`${this.url}/dev/run-etl?target_date=${targetDate}`, {});
  }
}
