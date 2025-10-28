import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface User {
  email: string;
  password: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initializeDemoUser();
  }

  private initializeDemoUser() {
    if (!this.isBrowser) return; // No ejecutar en servidor

    const demoUser: User = {
      email: 'prueba@chronoplan.com',
      password: '123456',
      name: 'Usuario Demo'
    };

    // Guardar usuario demo en localStorage solo en el navegador
    if (!this.getLocalStorage('chronoplan_users')) {
      this.setLocalStorage('chronoplan_users', JSON.stringify([demoUser]));
    }

    // Cargar usuario logueado si existe
    const savedUser = this.getLocalStorage('chronoplan_current_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  // Métodos seguros para localStorage
  private getLocalStorage(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setLocalStorage(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private removeLocalStorage(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }

  // LOGIN REAL
  async login(email: string, password: string): Promise<{success: boolean; error?: string}> {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Obtener usuarios del localStorage
      const usersJson = this.getLocalStorage('chronoplan_users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Buscar usuario
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Login exitoso
        this.currentUser = user;
        this.setLocalStorage('chronoplan_current_user', JSON.stringify(user));
        
        console.log('✅ Login exitoso:', user.email);
        return { success: true };
      } else {
        return { success: false, error: 'Email o contraseña incorrectos' };
      }

    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  }

  // REGISTRO REAL
  async register(email: string, password: string, name: string): Promise<{success: boolean; error?: string}> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const usersJson = this.getLocalStorage('chronoplan_users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Verificar si el usuario ya existe
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'Este email ya está registrado' };
      }

      // Crear nuevo usuario
      const newUser: User = { email, password, name };
      users.push(newUser);
      this.setLocalStorage('chronoplan_users', JSON.stringify(users));

      // Auto-login después del registro
      this.currentUser = newUser;
      this.setLocalStorage('chronoplan_current_user', JSON.stringify(newUser));

      console.log('✅ Usuario registrado:', email);
      return { success: true };

    } catch (error) {
      return { success: false, error: 'Error al registrar usuario' };
    }
  }

  // CERRAR SESIÓN
  logout(): void {
    this.currentUser = null;
    this.removeLocalStorage('chronoplan_current_user');
    this.router.navigate(['/iniciosesion']);
    console.log('✅ Sesión cerrada');
  }

  // OBTENER USUARIO ACTUAL
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // VERIFICAR SI ESTÁ LOGUEADO
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // RECUPERAR CONTRASEÑA (simulado)
  async resetPassword(email: string): Promise<{success: boolean; error?: string}> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const usersJson = this.getLocalStorage('chronoplan_users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    if (users.find(u => u.email === email)) {
      return { success: true };
    } else {
      return { success: false, error: 'Email no encontrado' };
    }
  }
}