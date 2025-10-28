import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface User {
  email: string;
  password: string;
  name: string;
  role: 'jefe_utp' | 'profesor' | 'alumno'; // ← NUEVO: roles definidos
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
    this.initializeDemoUsers(); // ← Cambiamos a usuarios múltiples
  }

  private initializeDemoUsers() {
    if (!this.isBrowser) return;

    const demoUsers: User[] = [
      {
        email: 'utp@chronoplan.com',
        password: '123456',
        name: 'Jefe UTP Demo',
        role: 'jefe_utp'
      },
      {
        email: 'profesor@chronoplan.com',
        password: '123456',
        name: 'Profesor Demo',
        role: 'profesor'
      },
      {
        email: 'alumno@chronoplan.com',
        password: '123456',
        name: 'Alumno Demo',
        role: 'alumno'
      }
    ];

    // Guardar usuarios demo
    if (!this.getLocalStorage('chronoplan_users')) {
      this.setLocalStorage('chronoplan_users', JSON.stringify(demoUsers));
    }

    // Cargar usuario logueado si existe
    const savedUser = this.getLocalStorage('chronoplan_current_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  // LOGIN - Ahora maneja roles
  async login(email: string, password: string): Promise<{success: boolean; error?: string}> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const usersJson = this.getLocalStorage('chronoplan_users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        this.currentUser = user;
        this.setLocalStorage('chronoplan_current_user', JSON.stringify(user));
        
        console.log('✅ Login exitoso:', user.email, 'Rol:', user.role);
        return { success: true };
      } else {
        return { success: false, error: 'Email o contraseña incorrectos' };
      }
    } catch (error) {
      return { success: false, error: 'Error al iniciar sesión' };
    }
  }

  // REGISTRO - Ahora incluye rol
  async register(email: string, password: string, name: string, role: User['role']): Promise<{success: boolean; error?: string}> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const usersJson = this.getLocalStorage('chronoplan_users');
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      if (users.find(u => u.email === email)) {
        return { success: false, error: 'Este email ya está registrado' };
      }

      const newUser: User = { email, password, name, role };
      users.push(newUser);
      this.setLocalStorage('chronoplan_users', JSON.stringify(users));

      this.currentUser = newUser;
      this.setLocalStorage('chronoplan_current_user', JSON.stringify(newUser));

      console.log('✅ Usuario registrado:', email, 'Rol:', role);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al registrar usuario' };
    }
  }

  // MÉTODOS DE ROLES
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUserRole(): User['role'] | null {
    return this.currentUser?.role || null;
  }

  isJefeUTP(): boolean {
    return this.currentUser?.role === 'jefe_utp';
  }

  isProfesor(): boolean {
    return this.currentUser?.role === 'profesor';
  }

  isAlumno(): boolean {
    return this.currentUser?.role === 'alumno';
  }

  // Resto de métodos permanecen igual...
  logout(): void {
    this.currentUser = null;
    this.removeLocalStorage('chronoplan_current_user');
    this.router.navigate(['/iniciosesion']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Métodos de localStorage...
  private getLocalStorage(key: string): string | null {
    if (this.isBrowser) return localStorage.getItem(key);
    return null;
  }

  private setLocalStorage(key: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(key, value);
  }

  private removeLocalStorage(key: string): void {
    if (this.isBrowser) localStorage.removeItem(key);
  }
}