import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.html',
  styleUrls: ['./registro.css'],
  encapsulation: ViewEncapsulation.None // ← ¡Esta línea es clave!
})
export class Registro {}
