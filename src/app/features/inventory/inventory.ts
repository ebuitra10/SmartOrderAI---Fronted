import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, Inventory } from '../../core/services/inventory.service';
import { Product, ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss'
})
export class InventoryComponent implements OnInit {
  inventory: Inventory[] = [];
  loading = false;
  error = '';

  constructor(
    
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.inventoryService.getAll().subscribe({
      next: (data) => { 
        this.inventory = data; this.loading = false; 
        this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al cargar inventario'; this.loading = false; }
    });
  }

  getStockStatus(stock: number): string {
    if (stock === 0) return 'out';
    if (stock < 10) return 'low';
    return 'ok';
  }

  getStockLabel(stock: number): string {
    if (stock === 0) return 'Sin stock';
    if (stock < 10) return 'Stock bajo';
    return 'Disponible';
  }

  


}