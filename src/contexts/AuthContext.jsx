import { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from '../firebase/firebase.js';
import { userService } from '../services/userService.js';
import { serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const profile = await userService.getUserProfile(currentUser.uid);

          if (profile) {
            setUserProfile(profile);
          } else {
            // Crear perfil si no existe
            const newProfileData = {
              nickname: currentUser.displayName || currentUser.email?.split('@')[0] || 'Invitado',
              email: currentUser.email || '',
              profilePicUrl: currentUser.photoURL || null,
              isVIP: false,
              createdAt: serverTimestamp(),
              lastSeen: serverTimestamp(),
              // Puedes agregar más campos por defecto aquí
            };

            await userService.createUserProfile(currentUser.uid, newProfileData);
            setUserProfile(newProfileData);
          }
        } catch (error) {
          console.error('Error fetching or creating user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfile = (newProfile) => {
    setUserProfile(newProfile);
  };

  const value = {
    user,
    userProfile,
    loading,
    updateUserProfile,
    isAuthenticated: !!user,
    isVIP: userProfile?.isVIP || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

