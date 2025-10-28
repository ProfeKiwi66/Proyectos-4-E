import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
@Component({
  selector: 'app-iniciosesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './iniciosesion.html',
})
export class InicioSesion {
  loginForm: FormGroup;
  cargando = false;
  mensajeError = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

 constructor() {
    // AQUÍ VA EL CÓDIGO - REEMPLAZA LO QUE TENÍAS:
    this.loginForm = this.fb.group({
      email: ['prueba@chronoplan.com', [Validators.required, Validators.email]], // ← Datos de prueba
      password: ['123456', [Validators.required, Validators.minLength(6)]] // ← Datos de prueba
    });
  }

  async onSubmit() {
  this.loginForm.markAllAsTouched();

  if (this.loginForm.invalid) {
    this.mensajeError = 'Por favor completa todos los campos correctamente';
    return;
  }

  this.cargando = true;
  this.mensajeError = '';

  const { email, password } = this.loginForm.value;

  try {
    const resultado = await this.authService.login(email, password);
    
    if (resultado.success) {
      console.log('✅ Login exitoso - Redirigiendo...');
      // Redirigir a la página principal después del login
      this.router.navigate(['/inicio']);
    } else {
      this.mensajeError = resultado.error || 'Error al iniciar sesión';
    }
  } catch (error) {
    this.mensajeError = 'Error inesperado al iniciar sesión';
    console.error('Error:', error);
  } finally {
    this.cargando = false;
  }
}

  recuperarPassword() {
    this.router.navigate(['/recuperar-password']);
  }

  // Métodos auxiliares para validación en template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  private markAllAsTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }
}