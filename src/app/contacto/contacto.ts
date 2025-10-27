// contacto.ts - VERSIÓN COMPLETA CON TODAS LAS PROPIEDADES
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class Contacto {
  
  contactForm: FormGroup;
  enviando = false; // ← AÑADE esta propiedad
  enviadoExitosamente = false; // ← AÑADE esta propiedad

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.invalid) return;

    this.enviando = true;
    
    // Simular envío
    setTimeout(() => {
      console.log('Formulario enviado:', this.contactForm.value);
      this.enviadoExitosamente = true;
      this.enviando = false;
      this.contactForm.reset();
    }, 1500);
  }
}