import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { KeycloakService } from './core/services/keycloak.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
  <ng-container *ngIf="isAuthenticated; else publicView">
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand-name">SmartOrderAI</span>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/products" routerLinkActive="active" class="nav-item">Productos</a>
          <a routerLink="/inventory" routerLinkActive="active" class="nav-item">Inventario</a>
          <a routerLink="/orders" routerLinkActive="active" class="nav-item">Ordenes</a>
          <a routerLink="/analytics" routerLinkActive="active" class="nav-item">Analytics</a>
        </nav>
      </aside>
      <div class="main">
        <header class="topbar">
          <h1 class="page-title">SmartOrderAI Dashboard</h1>
          <div class="topbar-right">
            <span class="user-role" [class.admin]="isAdmin">{{ isAdmin ? 'Admin' : 'Usuario' }}</span>
            <span class="username">{{ username }}</span>
            <button class="btn-logout" (click)="logout()">Cerrar sesion</button>
          </div>
        </header>
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  </ng-container>
  <ng-template #publicView>
    <router-outlet />
  </ng-template>
`,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .layout { display: flex; height: 100vh; font-family: 'Segoe UI', sans-serif; background: #f5f7fa; }
    .sidebar { width: 240px; background: #1e293b; color: white; display: flex; flex-direction: column; flex-shrink: 0; }
    .sidebar-brand { padding: 24px 20px; border-bottom: 1px solid #334155; font-size: 18px; font-weight: 700; }
    .sidebar-nav { display: flex; flex-direction: column; padding: 16px 0; }
    .nav-item { padding: 12px 20px; color: #94a3b8; text-decoration: none; font-size: 14px; }
    .nav-item:hover { background: #334155; color: white; }
    .nav-item.active { background: #3b82f6; color: white; }
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar { background: white; border-bottom: 1px solid #e2e8f0; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 18px; font-weight: 600; color: #1e293b; }
    .topbar-right { display: flex; align-items: center; gap: 16px; }
    .user-role { background: #e2e8f0; color: #475569; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .user-role.admin { background: #fef3c7; color: #92400e; }
    .username { font-size: 14px; color: #475569; }
    .btn-logout { background: none; border: 1px solid #e2e8f0; color: #64748b; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .btn-logout:hover { background: #fee2e2; color: #dc2626; }
    .content { flex: 1; overflow-y: auto; padding: 24px; }
  `]
})



export class App implements OnInit {
  username = '';
  isAdmin = false;

  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf]

  isAuthenticated: boolean = false;


  constructor(private keycloak: KeycloakService) {}

  ngOnInit() {
    this.isAuthenticated = this.keycloak.isAuthenticated();
    this.username = this.keycloak.getUsername();
    this.isAdmin = this.keycloak.isAdmin();
  }

  logout() {
    this.keycloak.logout();
  }
}