// src/lib/firebaseConfig.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Use optional chaining to safely access the config and extra properties.
const firebaseConfig = {
  apiKey: 'AIzaSyDbcPSejp8kJKEJBomRtAvPsWCAz9HSCCg',
  authDomain: "daily-bread-88f42.firebaseapp.com",
  projectId:"daily-bread-88f42",
  storageBucket:  "daily-bread-88f42.firebasestorage.app",
  messagingSenderId: "354959331079",
  appId: "1:354959331079:android:7484ecb8076d9ee686ffa2",
  databaseURL:"https://daily-bread-88f42.firebaseio.com"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = Platform.OS === 'web'
  ? getAuth(app)
  : initializeAuth(app);

const db = getFirestore(app);

// Add auth state change listener for debugging
auth.onAuthStateChanged((user) => {
  console.log('🔴 Firebase auth state changed:', user ? 'User signed in' : 'User signed out');
});

// Export services for use throughout your app
export { app, auth, db, firebaseConfig };