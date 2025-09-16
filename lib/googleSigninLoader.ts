/**
 * Safe loader for Google Sign-in module
 * Handles cases where the native module isn't available
 */

import { ModuleUtils } from './moduleUtils';

// Cache for loaded modules
let GoogleSignin: any = null;
let statusCodes: any = null;
let isLoaded = false;
let loadFailed = false;

/**
 * Safely load the Google Sign-in module
 */
export const loadGoogleSigninModule = () => {
  if (isLoaded) {
    return GoogleSignin;
  }

  if (loadFailed) {
    return false;
  }

  // In development mode, skip native module check and try direct import
  const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) {
    // Check if native module is available first (only in production)
    if (!ModuleUtils.isGoogleSignInAvailable()) {
      console.warn('Google Sign-in native module not available');
      loadFailed = true;
      return false;
    }
    console.log('Native module check passed, attempting to load JavaScript module...');
  } else {
    console.log('Development mode: skipping native module check, attempting direct import...');
  }

  try {
    // Import the module with additional safety
    let googleSigninModule;
    try {
      googleSigninModule = require('@react-native-google-signin/google-signin');
    } catch (requireError) {
      console.warn('Failed to require Google Sign-in module:', requireError);
      loadFailed = true;
      return false;
    }
    
    console.log('Google Sign-in module imported:', !!googleSigninModule);
    console.log('Module keys:', googleSigninModule ? Object.keys(googleSigninModule) : 'undefined');
    
    // Check if the module has the expected properties
    if (!googleSigninModule) {
      console.warn('Google Sign-in module is null/undefined');
      loadFailed = true;
      return false;
    }
    
    if (!googleSigninModule.GoogleSignin) {
      console.warn('Google Sign-in module loaded but GoogleSignin property is undefined');
      console.warn('Available properties:', Object.keys(googleSigninModule));
      loadFailed = true;
      return false;
    }
    
    GoogleSignin = googleSigninModule.GoogleSignin;
    statusCodes = googleSigninModule.statusCodes;
    isLoaded = true;
    console.log('Google Sign-in module loaded successfully');
    return GoogleSignin;
  } catch (error) {
    console.warn('Failed to load Google Sign-in module:', error);
    loadFailed = true;
    return false;
  }
};

/**
 * Get the status codes for Google Sign-in
 */
export const getGoogleSigninStatusCodes = () => {
  if (!isLoaded && !loadFailed) {
    loadGoogleSigninModule();
  }
  return statusCodes;
};

/**
 * Check if Google Sign-in is available
 */
export const isGoogleSigninAvailable = () => {
  return ModuleUtils.isGoogleSignInAvailable();
};

/**
 * Reset the loader state (for testing)
 */
export const resetGoogleSigninLoader = () => {
  GoogleSignin = null;
  statusCodes = null;
  isLoaded = false;
  loadFailed = false;
};
