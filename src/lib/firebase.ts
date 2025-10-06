import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2bhlAdfiBHoB0OB9zUH-1kJGorN5LO0s",
  authDomain: "finance-tracker-2bd73.firebaseapp.com",
  projectId: "finance-tracker-2bd73",
  storageBucket: "finance-tracker-2bd73.appspot.com",
  messagingSenderId: "60433996859",
  appId: "1:60433996859:web:d06f058181f9efcab9501e",
  measurementId: "G-FEZGZGDLHN"
};

// Initialize Firebase
let app;
let auth;
let db;
let const_app_id;
let const_firebase_config;
let const_initial_auth_token;

try {
    const_app_id = typeof __app_id !== 'undefined' ? __app_id : null;
    const_firebase_config = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : firebaseConfig;
    const_initial_auth_token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
    
    app = initializeApp(const_firebase_config);
    auth = getAuth(app);
    
    // For development, we'll handle unauthorized domain errors gracefully
    if (process.env.NODE_ENV === 'development') {
        console.log('Firebase initialized in development mode');
        console.log('If you see auth/unauthorized-domain errors, please add localhost:3000 to Firebase authorized domains');
    }
    
    db = getFirestore(app);
} catch (error) {
    console.error("Error initializing Firebase:", error);
    console.log("Please ensure you've added localhost:3000 to Firebase authorized domains");
}

export { app, auth, db, const_app_id, const_initial_auth_token };