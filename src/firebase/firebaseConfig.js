// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración real de Firebase para La Previa Chat (CORREGIDA)
const firebaseConfig = {
  apiKey: "AIzaSyCqBAOc6BESjL0PfUoEx3vPbAqI6tNCdWU", // ¡Esta es la clave corregida!
  authDomain: "la-previa-chat.firebaseapp.com",
  projectId: "la-previa-chat",
  storageBucket: "la-previa-chat.firebasestorage.app",
  messagingSenderId: "680714262585",
  appId: "1:680714262585:web:50a60221d84e300eeed5e8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

