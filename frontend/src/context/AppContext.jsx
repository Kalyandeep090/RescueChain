import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  setDoc, 
  getDoc,
  addDoc,
  updateDoc
} from 'firebase/firestore';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

// Listen for authentication state changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setAuthLoading(true);
    if (!user) {
      setCurrentUser(null);
      setIsDemoMode(false);
      setAuthLoading(false);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (!userDoc.exists()) {
        console.warn('User profile not found. Using Volunteer as a temporary role.');
      
        setCurrentUser({
          id: user.uid,
          name: user.displayName || user.email,
          role: 'Volunteer',
          email: user.email
        });
        
        setAuthLoading(false);
        return;
      }
      const userData = userDoc.data();

      setCurrentUser({
        id: user.uid,
        name: user.displayName || user.email,
        role: userData.role === 'Admin' ? 'Admin' : 'Volunteer',
        email: user.email
      });
      setAuthLoading(false);

    } catch (err) {
      console.error('Error fetching user role:', err);
      setCurrentUser(null);
      await firebaseSignOut(auth);
      setAuthLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

// Listen for real-time alerts from Firestore
useEffect(() => {
  const q = collection(db, 'alerts');

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const alertsData = [];

    snapshot.forEach((document) => {
      alertsData.push({
        id: document.id,
        ...document.data()
      });
    });

    setAlerts(alertsData);
    console.log('Total alerts fetched:', alertsData.length);

  }, (error) => {
    console.error('Error fetching alerts:', error);
  });

  return () => unsubscribe();
}, []);

  const createAlert = async (alertData) => {
    try {
      const newAlert = {
        ...alertData,
        reporterId: currentUser?.id || 'anonymous',
        reporterRole: currentUser?.role || 'Volunteer',
        timestamp: new Date().toISOString()
      };
      await addDoc(collection(db, 'alerts'), newAlert);
    } catch (error) {
      console.error('Failed to create alert:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
  
      localStorage.removeItem('demo_user');
      setIsDemoMode(false);
  
      return userCredential;
  
    } catch (error) {
      console.error('Firebase login failed:', error);
      throw error;
    }
  };

  const signUp = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
  
      await updateProfile(userCredential.user, {
        displayName: name.trim()
      });
  
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name.trim(),
        email: email.trim(),
        role: 'Volunteer',
        createdAt: new Date().toISOString()
      });
  
      localStorage.removeItem('demo_user');
      setIsDemoMode(false);
  
      return userCredential;
  
    } catch (error) {
      console.error('Firebase signup failed:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await firebaseSignOut(auth);
      setIsDemoMode(false);
      setCurrentUser(null);
      localStorage.removeItem('demo_user');
    } catch (error) {
      console.error('Sign out error:', error);
      setIsDemoMode(false);
      setCurrentUser(null);
      localStorage.removeItem('demo_user');
    }
  };

  const updateAlertStatus = async (id, status) => {
    try {
      const alertRef = doc(db, 'alerts', id);
      await updateDoc(alertRef, { status });
    } catch (error) {
      console.error('Failed to update alert status:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      alerts,
      currentUser,
      authLoading,
      setCurrentUser,
      createAlert,
      signIn,
      signUp,
      signOutUser,
      updateAlertStatus,
      isDemoMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
