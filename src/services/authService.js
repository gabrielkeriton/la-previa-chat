import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from '../firebase/firebase.js';
import { userService } from './userService.js';

class AuthService {
  constructor() {
    this.googleProvider = new GoogleAuthProvider();
  }

  // Sign in with email and password
  async signInWithEmail(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Create account with email and password
  async createAccount(email, password, profileData) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await userService.createUserProfile(result.user.uid, {
        email: result.user.email,
        ...profileData,
        createdAt: new Date(),
        isVIP: false,
        lastSeen: new Date()
      });

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      
      // Check if user profile exists, if not create one
      const existingProfile = await userService.getUserProfile(result.user.uid);
      
      if (!existingProfile) {
        await userService.createUserProfile(result.user.uid, {
          email: result.user.email,
          nickname: result.user.displayName || 'Usuario',
          profilePicUrl: result.user.photoURL || '',
          createdAt: new Date(),
          isVIP: false,
          lastSeen: new Date()
        });
      } else {
        // Update last seen
        await userService.updateLastSeen(result.user.uid);
      }

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Sign out
  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Get error message in Spanish
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'No existe una cuenta con este email',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Ya existe una cuenta con este email',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intentá más tarde',
      'auth/network-request-failed': 'Error de conexión. Verificá tu internet',
      'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
      'auth/cancelled-popup-request': 'Solicitud cancelada',
      'auth/popup-blocked': 'Popup bloqueado por el navegador'
    };

    return errorMessages[errorCode] || 'Error desconocido. Intentá nuevamente';
  }
}

export const authService = new AuthService();


