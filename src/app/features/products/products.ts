import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, ProductRequest } from '../../core/services/product.service';
import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';
  success: string = '';

  showModal = false;
  isEditing = false;
  selectedId: number | null = null;

  
  showDeleteModal: boolean = false;
  showStockModal: boolean = false;
  productToDelete: Product | null = null;
  selectedProductCode: string = '';
  selectedProductName: string = '';
  stockQuantity: number = 1;

  form: ProductRequest = {
    productName: '',
    productCode: '',
    price: 0,
    description: '',
    imageUrl: ''
  };

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (data) => { 
        this.products = data; this.loading = false; 
        this.cdr.detectChanges(); },
      error: () => { this.error = 'Error al cargar productos'; this.loading = false; }
    });
  }

  openCreate() {
    this.isEditing = false;
    this.selectedId = null;
    this.form = { productName: '', productCode: '', price: 0, description: '', imageUrl: '' };
    this.showModal = true;
  }

  openEdit(product: Product) {
    this.isEditing = true;
    this.selectedId = product.id;
    this.form = {
      productName: product.productName,
      productCode: product.productCode,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl
    };
    this.showModal = true;
  }

  save() {
    if (this.isEditing && this.selectedId) {
      this.productService.update(this.selectedId, this.form).subscribe({
        next: () => { this.showModal = false; this.loadProducts(); },
        error: () => { this.error = 'Error al actualizar producto'; }
      });
    } else {
      this.productService.create(this.form).subscribe({
        next: () => { this.showModal = false; this.loadProducts(); },
        error: () => { this.error = 'Error al crear producto'; }
      });
    }
  }

  delete(product: Product): void {
  this.productToDelete = product;
  this.showDeleteModal = true;
}

confirmDelete(): void {
  if (!this.productToDelete) return;

  this.productService.delete(this.productToDelete.id).subscribe({
    next: () => {
      this.showDeleteModal = false;
      this.productToDelete = null;
      this.success = 'Producto eliminado correctamente';
      this.loadProducts();
      this.cdr.detectChanges();
      setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
    },
    error: () => {
      this.showDeleteModal = false;
      this.error = 'Error al eliminar el producto';
      this.cdr.detectChanges();
    }
  });
}

cancelDelete(): void {
  this.showDeleteModal = false;
  this.productToDelete = null;
}

  closeModal() {
    this.showModal = false;
  }

  openAddStock(product: Product): void {
  this.selectedProductCode = product.productCode;
  this.selectedProductName = product.productName;
  this.stockQuantity = 1;
  this.showStockModal = true;
  }

  saveStock(): void {
  this.inventoryService.addStock(this.selectedProductCode, this.stockQuantity).subscribe({
    next: () => {
      this.showStockModal = false;
      this.success = `Stock actualizado para ${this.selectedProductName}`;
      this.cdr.detectChanges();
      setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
    },
    error: () => {
      this.error = 'Error al actualizar el stock';
      this.cdr.detectChanges();
    }
  });
  }

  closeStockModal(): void {
  this.showStockModal = false;
  }


}
