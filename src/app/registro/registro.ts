import { Component, ViewEncapsulation } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-registro',
  imports: [Header, Footer],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
  encapsulation: ViewEncapsulation.None // ← ¡Esta línea es clave!
})
export class Registro {}
