import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, Order, OrderItem, CreateOrderRequest } from '../../core/services/order.service';
import { ProductService, Product } from '../../core/services/product.service';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];
  loading: boolean = false;
  error: string = '';
  success: string = '';
  saving: boolean = false;
  showModal: boolean = false;

  form: CreateOrderRequest = {
    date: new Date().toISOString().split('T')[0],
    store: '',
    paymentMethod: 'CASH'
  };

  items: OrderItem[] = [{ productCode: '', quantity: 1 }];

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
  }

  loadOrders(): void {
  this.loading = true;
  this.orderService.getAll().subscribe({
    next: (data) => {
      this.orders = data;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.error = 'Error al cargar ordenes';
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        const seen = new Set<string>();
        this.products = data.filter(p => {
          if (seen.has(p.productCode)) return false;
          seen.add(p.productCode);
          return true;
        });
      }
    });
  }

  openCreate(): void {
    this.form = {
      date: new Date().toISOString().split('T')[0],
      store: '',
      paymentMethod: 'CASH'
    };
    this.items = [{ productCode: '', quantity: 1 }];
    this.error = '';
    this.success = '';
    this.showModal = true;
  }

  addItem(): void {
    this.items.push({ productCode: '', quantity: 1 });
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    }
  }

  save(): void {
    const validItems = this.items.filter(i => i.productCode && i.quantity > 0);
    if (!this.form.store || validItems.length === 0) {
      this.error = 'Completa la tienda y agrega al menos un producto';
      return;
    }

    this.saving = true;
    this.error = '';

    this.orderService.createOrder(this.form).subscribe({
      next: (order) => {
        this.orderService.addItems({ orderId: order.id, items: validItems }).subscribe({
          next: (response) => {
            console.log('addItems response:', response);
            this.saving = false;
            this.showModal = false;
            this.error = '';
            this.success = 'Orden creada correctamente';
            this.cdr.detectChanges();
            setTimeout(() => this.loadOrders(), 300);
            setTimeout(() => { this.success = ''; }, 3000);
          },
          error: (err) => {
            console.log('addItems error:', err);
            this.saving = false;
            this.showModal = false;
            this.error = 'Orden creada pero error al agregar items';
          }
        });
      },
      error: (err) => {
        console.log('createOrder error:', err);
        this.saving = false;
        this.error = 'Error al crear la orden';
      }
    });
  }

  delete(order: Order): void {
    if (confirm(`¿Eliminar orden #${order.id}?`)) {
      this.orderService.delete(order.id).subscribe({
        next: () => this.loadOrders(),
        error: () => { this.error = 'Error al eliminar la orden'; }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.error = '';
    this.success = '';
  }

  getProductName(code: string): string {
    return this.products.find(p => p.productCode === code)?.productName ?? code;
  }
}