import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Contacto } from './contacto/contacto';
import { Registro } from './registro/registro';
import { Horarios } from './horarios/horarios';
import { Iniciosesion } from './iniciosesion/iniciosesion';
import { Recuperacion } from './recuperacion/recuperacion';

export const routes: Routes = [
    {path:'',component:Inicio},
    {path:'inicio',component:Inicio},
    {path:'contacto',component:Contacto},
    {path:'registro',component:Registro},
    {path:'horarios',component:Horarios},
    {path:'iniciosesion',component:Iniciosesion},
    {path:'recuperacion',component:Recuperacion},
    //el resto de rutas añadir acá



    
    {path: '**', redirectTo: ''}
];
