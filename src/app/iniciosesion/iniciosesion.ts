import { Component, ViewEncapsulation } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-iniciosesion',
  imports: [Header, Footer],
  templateUrl: './iniciosesion.html',
  styleUrl: './iniciosesion.css',
  encapsulation: ViewEncapsulation.None, // ← ¡Esta línea es clave!
})
export class Iniciosesion {

}



