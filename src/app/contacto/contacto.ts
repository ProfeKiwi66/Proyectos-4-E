import { Component, ViewEncapsulation } from '@angular/core';

import { CommonModule } from '@angular/common'; 
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; 
import { AngularFirestore } from '@angular/fire/compat/firestore'; // <-- Solo importa el servicio

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ // <-- REVISA ESTA LISTA
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css'],
  encapsulation: ViewEncapsulation.None
})
export class Contacto {
  
  contactForm: any; 
  enviando = false;
  enviadoExitosamente = false;

  constructor(
    private fb: FormBuilder,
    private firestore: AngularFirestore // <-- Esto ahora funcionará
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.contactForm.invalid) {
      return;
    }

    this.enviando = true;
    this.enviadoExitosamente = false;

    const { nombre, email, mensaje } = this.contactForm.value;

    try {
      await this.firestore.collection('mensajes').add({
        nombre: nombre,
        email: email,
        mensaje: mensaje,
        fecha: new Date(),
        to: 'tomas.allendesd@gmail.com', // Tu email
        message: {
          subject: `Nuevo mensaje de ${nombre} desde la web`,
          text: `De: ${nombre} (${email})\n\nMensaje:\n${mensaje}`,
        }
      });

      this.enviadoExitosamente = true;
      this.contactForm.reset();
    
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    } finally {
      this.enviando = false;
    }
  }
}