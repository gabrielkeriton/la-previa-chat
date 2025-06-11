// Firebase services exports
export { auth, db, storage } from './firebaseConfig.js';

// Firebase functions exports
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export {
  collection,
  doc,
  setDoc,  
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

export {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';


