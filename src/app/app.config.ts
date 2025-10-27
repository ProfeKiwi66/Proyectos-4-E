import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';

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
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage())
  ]
};
