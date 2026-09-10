import { Component, OnInit } from '@angular/core';
import { KeycloakService } from './core/services/keycloak.service';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  username = '';
  isAdmin = false;

  constructor(private keycloak: KeycloakService) {}

  ngOnInit() {
    this.username = this.keycloak.getUsername();
    this.isAdmin = this.keycloak.isAdmin();
  }

  logout() {
    this.keycloak.logout();
  }
}