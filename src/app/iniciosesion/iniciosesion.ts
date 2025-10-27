import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-iniciosesion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './iniciosesion.html',
  styleUrl: './iniciosesion.css',
  encapsulation: ViewEncapsulation.None, // ← ¡Esta línea es clave!
})
export class Iniciosesion {

}



