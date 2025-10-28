import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrls: []  // ← VACÍO o elimínalo
})
export class Contacto {
  
  contactForm: FormGroup;
  enviando = false;
  enviadoExitosamente = false;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });

    // CONFIGURACIÓN EMAILJS CON TUS CREDENCIALES
    emailjs.init("b03wE7RZXQQvasNaP");
  }

  async onSubmit() {
    // Marcar todos los campos como tocados para mostrar errores
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      console.log('❌ Formulario inválido');
      return;
    }

    this.enviando = true;
    this.enviadoExitosamente = false;

    try {
      console.log('📤 Enviando email con datos:', this.contactForm.value);
      
      // ENVÍO REAL CON EMAILJS - SOLO PARÁMETROS NECESARIOS
  const result = await emailjs.send(
  "service_wjlgua6",  // ← Service ID correcto
  "template_lzzm27p", 
  {
    from_name: this.contactForm.value.nombre.trim(),
    from_email: this.contactForm.value.email.trim(),
    message: this.contactForm.value.mensaje.trim()
  }
);

      console.log('✅ Email enviado exitosamente:', result);
      
      this.enviadoExitosamente = true;
      this.contactForm.reset();
      
      // Resetear errores del formulario
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.setErrors(null);
      });

      alert('✅ ¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.log('🔍 Status:', error?.status);
      console.log('🔍 Text:', error?.text);
      
      // Manejo específico de errores
      if (error?.status === 400) {
        alert('❌ Error: Verifica que todos los campos estén correctamente llenados.');
      } else if (error?.status === 0) {
        alert('❌ Error de conexión. Verifica tu internet.');
      } else {
        alert('❌ Error al enviar el mensaje. Intenta nuevamente.');
      }
    } finally {
      this.enviando = false;
    }
  }

  // Métodos auxiliares para validación en el template
  get nombre() { return this.contactForm.get('nombre'); }
  get email() { return this.contactForm.get('email'); }
  get mensaje() { return this.contactForm.get('mensaje'); }
}