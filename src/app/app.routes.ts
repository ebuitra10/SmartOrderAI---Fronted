import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },
  { path: 'products', canActivate: [authGuard], loadComponent: () => import('./features/products/products').then(m => m.ProductsComponent) },
  { path: 'inventory', canActivate: [authGuard], loadComponent: () => import('./features/inventory/inventory').then(m => m.InventoryComponent) },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./features/orders/orders').then(m => m.OrdersComponent) },
  { path: 'analytics', canActivate: [authGuard], loadComponent: () => import('./features/analytics/analytics').then(m => m.AnalyticsComponent) }
];