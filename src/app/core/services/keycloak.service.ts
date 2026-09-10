import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId
    });
  }

  async init(): Promise<boolean> {
    return await this.keycloak.init({
      onLoad: 'check-sso',
      checkLoginIframe: false
    });
  }

  login(): void {
    this.keycloak.login({ redirectUri: 'http://localhost:4200/products' });
  }

  getToken(): string {
    return this.keycloak.token ?? '';
  }

  getUsername(): string {
    return this.keycloak.tokenParsed?.['preferred_username'] ?? '';
  }

  getRoles(): string[] {
    return this.keycloak.tokenParsed?.['realm_access']?.['roles'] ?? [];
  }

  isAdmin(): boolean {
    return this.getRoles().includes('admin');
  }

  isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }

  clearToken(): void {
    this.keycloak.clearToken();
  }

  logout(): void {
    this.keycloak.clearToken();
    this.keycloak.logout({ redirectUri: 'http://localhost:4200/home' });
  }
}