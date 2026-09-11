import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AnalyticsService,
  SalesReport,
  Alert,
} from '../../core/services/analytics.service';
import { InventoryService, Inventory } from '../../core/services/inventory.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class AnalyticsComponent implements OnInit {
  salesReport: SalesReport | null = null;
  alerts: Alert[] = [];
  loading: boolean = true;
  error: string = '';

  syncing: boolean = false;
  syncSuccess: string = '';

  totalProducts: number = 0;
  totalStockValue: number = 0;
  productsLowStock: number = 0;
  productsOutOfStock: number = 0;

  // Variables para rango de fechas
  startDate: string = '';
  endDate: string = '';

  constructor(
    private analyticsService: AnalyticsService,
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initDefaultDates();
    this.loadAll();
  }

  initDefaultDates(): void {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    this.endDate = end.toISOString().split('T')[0];
    this.startDate = start.toISOString().split('T')[0];
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';

    // 1. Datos en tiempo real desde msvc-inventory
    this.loadInventoryRealTime();

    // 2. Reporte de ventas filtrado desde Python
    this.loadSalesReport();

    // 3. Alertas
    this.analyticsService.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data.filter((a) => !a.resolved).slice(0, 5);
        this.cdr.detectChanges();
      },
      error: () => {},
    });
  }

  loadInventoryRealTime(): void {
    this.inventoryService.getAll().subscribe({
      next: (data: Inventory[]) => {
        this.totalProducts = data.length;
        this.productsLowStock = data.filter(
          (i) => i.stockQuantity > 0 && i.stockQuantity < 10,
        ).length;
        this.productsOutOfStock = data.filter((i) => i.stockQuantity === 0).length;
        this.totalStockValue = data.reduce(
          (sum, i) => sum + i.stockQuantity * i.unitPrice,
          0,
        );
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar inventario en tiempo real';
      },
    });
  }

  loadSalesReport(): void {
    this.analyticsService.getSalesReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.salesReport = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Error al cargar reporte de ventas';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onFilterChange(): void {
    if (this.startDate && this.endDate) {
      this.loadSalesReport();
    }
  }

  formatCurrency(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(num || 0);
  }

  getAlertClass(type: string): string {
    switch (type) {
      case 'OUT_OF_STOCK':
        return 'alert-danger';
      case 'LOW_STOCK':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  }

  getAlertLabel(type: string): string {
    switch (type) {
      case 'OUT_OF_STOCK':
        return 'Sin stock';
      case 'LOW_STOCK':
        return 'Stock bajo';
      default:
        return type;
    }
  }

  syncData(): void {
    this.syncing = true;
    this.syncSuccess = '';

    const today = new Date().toISOString().split('T')[0];

    this.analyticsService.runSnapshot().subscribe({
      next: () => {
        this.analyticsService.runEtl(today).subscribe({
          next: () => {
            this.syncing = false;
            this.syncSuccess = 'Datos sincronizados correctamente';
            this.loadAll();
            this.cdr.detectChanges();
            setTimeout(() => {
              this.syncSuccess = '';
              this.cdr.detectChanges();
            }, 3000);
          },
          error: () => {
            this.syncing = false;
            this.error = 'Error al procesar ETL de ventas';
            this.cdr.detectChanges();
          },
        });
      },
      error: () => {
        this.syncing = false;
        this.error = 'Error al sincronizar inventario';
        this.cdr.detectChanges();
      },
    });
  }
}