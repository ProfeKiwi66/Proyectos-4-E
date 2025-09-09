import { Component, ViewEncapsulation } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-contacto',
  imports: [Header, Footer],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css'],
  encapsulation: ViewEncapsulation.None // ← ¡Esta línea es clave!
})
export class Contacto {}