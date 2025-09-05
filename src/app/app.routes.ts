import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Contacto } from './contacto/contacto';
import { Descarga } from './descarga/descarga';

export const routes: Routes = [
    {path:'',component:Inicio},
    {path:'inicio',component:Inicio},
    {path:'contacto',component:Contacto},
    //el resto de rutas añadir acá
    {path:'descarga',component:Descarga},


    
    {path: '**', redirectTo: ''}
];
