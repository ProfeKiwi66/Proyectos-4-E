import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
  encapsulation: ViewEncapsulation.None // ← ¡Esta línea es clave!
})
export class Registro {}
