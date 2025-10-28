import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  registroForm: FormGroup;
  cargando = false;
  mensajeError = '';
  registroExitoso = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordsIguales 
    });
  }

  // Validador personalizado para contraseñas iguales
  private passwordsIguales(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmarPassword = formGroup.get('confirmarPassword')?.value;
    
    if (password && confirmarPassword && password !== confirmarPassword) {
      formGroup.get('confirmarPassword')?.setErrors({ passwordsNoCoinciden: true });
      return { passwordsNoCoinciden: true };
    } else {
      formGroup.get('confirmarPassword')?.setErrors(null);
      return null;
    }
  }

  async onSubmit() {
    // Marcar todos los campos como tocados
    this.registroForm.markAllAsTouched();

    if (this.registroForm.invalid) {
      this.mensajeError = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.registroExitoso = false;

    const { nombre, email, password } = this.registroForm.value;

    try {
      const resultado = await this.authService.register(email, password, nombre);
      
      if (resultado.success) {
        this.registroExitoso = true;
        console.log('✅ Registro exitoso');
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/inicio']);
        }, 2000);
      } else {
        this.mensajeError = resultado.error || 'Error al registrar usuario';
      }
    } catch (error) {
      this.mensajeError = 'Error inesperado al registrar usuario';
      console.error('Error:', error);
    } finally {
      this.cargando = false;
    }
  }

  // Métodos auxiliares para validación en template
  get nombre() { return this.registroForm.get('nombre'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
  get confirmarPassword() { return this.registroForm.get('confirmarPassword'); }
}