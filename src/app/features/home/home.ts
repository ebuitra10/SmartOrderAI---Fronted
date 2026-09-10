import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../core/services/keycloak.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  constructor(private keycloak: KeycloakService) {}

  login(): void {
    this.keycloak.login();
  }
}