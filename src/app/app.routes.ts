// app.routes.ts - VERSIÓN CORREGIDA
import { Routes } from '@angular/router';

// IMPORTAR COMPONENTES COMO STANDALONE
import { Inicio } from './inicio/inicio';
import { Contacto } from './contacto/contacto';
import { Registro } from './registro/registro';
import { Horarios } from './horarios/horarios';
import { InicioSesion } from './iniciosesion/iniciosesion';
import { Recuperacion } from './recuperacion/recuperacion';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio },
  { path: 'contacto', component: Contacto },
  { path: 'registro', component: Registro },
  { path: 'horarios', component: Horarios },
  { path: 'iniciosesion', component: InicioSesion },
  { path: 'recuperacion', component: Recuperacion },
  { path: '**', redirectTo: '' }
];