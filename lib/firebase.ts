import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration.
const firebaseConfig = {
  apiKey: "AIzaSyAVNWytRAmf_qz-bUI2s7IJo85-NtVaC7s",
  authDomain: "daily-bread-88f42.firebaseapp.com",
  projectId: "daily-bread-88f42",
  storageBucket: "daily-bread-88f42.firebasestorage.app",
  messagingSenderId: "354959331079",
  appId: "1:354959331079:web:0cdd37c2387fc1b386ffa2",
  measurementId: "G-53DHZ8FNP0",
  databaseURL: "https://daily-bread-88f42.firebaseio.com",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const app = firebase.app();
const auth = getAuth(app);
const db = firebase.firestore();

// Initialize Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Add auth state change listener for debugging
auth.onAuthStateChanged((user) => {
  console.log('🔴 Firebase auth state changed:', user ? 'User signed in' : 'User signed out');
});

export { app, auth, db, googleProvider, firebaseConfig };
