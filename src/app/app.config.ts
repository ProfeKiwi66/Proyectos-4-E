import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// IMPORTACIONES CORRECTAS para Angular 20
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAu-0ACGJIKb6GQ97NNxSnk2yAFJ6lGtxM",
  authDomain: "chronoplan-a908d.firebaseapp.com",
  projectId: "chronoplan-a908d",
  storageBucket: "chronoplan-a908d.firebasestorage.app",
  messagingSenderId: "111970172625",
  appId: "1:111970172625:web:d1577c50fc2d7b78ab4ff0",
  measurementId: "G-C06L4VLB50"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    
    // CONFIGURACIÓN FIREBASE - ESTE ORDEN ES IMPORTANTE
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),  // ← ESTA LÍNEA FALTA
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};