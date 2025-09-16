/**
 * Google Sign-in Wrapper
 * Completely prevents module import when native module is not available
 */

import { Platform } from 'react-native';

// Check if we're in a development environment where native modules might not be available
const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

// Check if the native module is available
const isNativeModuleAvailable = () => {
  if (Platform.OS === 'web') {
    return false;
  }
  
  try {
    const NativeModules = require('react-native').NativeModules;
    return NativeModules && NativeModules.RNGoogleSignin !== undefined;
  } catch {
    return false;
  }
};

// Only import the module if it's available
let GoogleSigninModule: any = null;
let isModuleLoaded = false;

const loadModuleIfAvailable = () => {
  if (isModuleLoaded) {
    return GoogleSigninModule;
  }

  // In development mode, be extra cautious
  if (isDevelopment) {
    console.log('Development mode: checking native module availability...');
    if (!isNativeModuleAvailable()) {
      console.log('Native module not available in development, skipping import');
      isModuleLoaded = true;
      return null;
    }
  }

  try {
    console.log('Attempting to load Google Sign-in module...');
    GoogleSigninModule = require('@react-native-google-signin/google-signin');
    isModuleLoaded = true;
    console.log('Google Sign-in module loaded successfully');
    return GoogleSigninModule;
  } catch (error) {
    console.warn('Failed to load Google Sign-in module:', error);
    isModuleLoaded = true;
    return null;
  }
};

export const getGoogleSignin = () => {
  const module = loadModuleIfAvailable();
  return module?.GoogleSignin || null;
};

export const getGoogleSigninStatusCodes = () => {
  const module = loadModuleIfAvailable();
  return module?.statusCodes || null;
};

export const isGoogleSigninAvailable = () => {
  return getGoogleSignin() !== null;
};

export const configureGoogleSignin = async (config: any) => {
  const GoogleSignin = getGoogleSignin();
  if (!GoogleSignin) {
    throw new Error('Google Sign-in module not available');
  }
  return await GoogleSignin.configure(config);
};

export const signInWithGoogle = async () => {
  const GoogleSignin = getGoogleSignin();
  if (!GoogleSignin) {
    throw new Error('Google Sign-in module not available');
  }
  return await GoogleSignin.signIn();
};

export const signOutGoogle = async () => {
  const GoogleSignin = getGoogleSignin();
  if (!GoogleSignin) {
    throw new Error('Google Sign-in module not available');
  }
  return await GoogleSignin.signOut();
};

export const isSignedInGoogle = async () => {
  const GoogleSignin = getGoogleSignin();
  if (!GoogleSignin) {
    return false;
  }
  return await GoogleSignin.isSignedIn();
};

export const getCurrentUserGoogle = async () => {
  const GoogleSignin = getGoogleSignin();
  if (!GoogleSignin) {
    return null;
  }
  return await GoogleSignin.getCurrentUser();
};
