import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

interface User {
  email: string;
  password: string;
  name: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'] 
})
export class Header implements OnInit {
  usuarioLogueado: User | null = null;

  private authService = inject(AuthService);

  ngOnInit() {
    // Verificar estado de autenticación al cargar
    this.usuarioLogueado = this.authService.getCurrentUser();
  }

  cerrarSesion() {
    this.authService.logout();
    this.usuarioLogueado = null;
  }

  // Método para obtener el nombre cortado si es muy largo
  getNombreCorto(): string {
    if (!this.usuarioLogueado?.name) return '';
    
    const nombre = this.usuarioLogueado.name.split(' ')[0]; // Solo primer nombre
    return nombre.length > 10 ? nombre.substring(0, 10) + '...' : nombre;
  }

  // Método para verificar autenticación (se llama desde el template)
  estaLogueado(): boolean {
    this.usuarioLogueado = this.authService.getCurrentUser();
    return this.usuarioLogueado !== null;
  }
}