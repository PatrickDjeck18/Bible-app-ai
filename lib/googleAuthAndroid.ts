import { Platform } from 'react-native';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import { 
  configureGoogleSignin, 
  signInWithGoogle, 
  signOutGoogle, 
  isSignedInGoogle, 
  getCurrentUserGoogle,
  getGoogleSigninStatusCodes,
  isGoogleSigninAvailable
} from './googleSigninWrapper';

export class GoogleAuthAndroidService {
  static async initialize() {
    try {
      if (!isGoogleSigninAvailable()) {
        console.warn('Google Sign-in module not available, skipping initialization');
        return;
      }

      try {
        await configureGoogleSignin({
          webClientId: '354959331079-faisqnjq2nd81nrhnikm2t0clfc49kle.apps.googleusercontent.com', // From google-services.json
          offlineAccess: true,
          hostedDomain: '',
          forceCodeForRefreshToken: true,
          accountName: '',
          iosClientId: '', // Not needed for Android
        });
        
        console.log('🔴 Google Sign-In configured successfully');
      } catch (configError) {
        console.warn('🔴 Google Sign-In configuration failed:', configError);
        // Don't throw, just log the error and continue
      }
    } catch (error) {
      console.error('🔴 Google Sign-In configuration error:', error);
      // Don't throw error during initialization
    }
  }

  static async signInWithGoogle() {
    try {
      if (!isGoogleSigninAvailable()) {
        throw new Error('Google Sign-in module not available. Please ensure the native module is properly linked.');
      }

      console.log('🔴 Starting Google Sign-In for Android...');
      
      // Check if Google Play Services are available
      const GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
      await GoogleSignin.hasPlayServices();
      
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      console.log('🔴 Google Sign-In successful:', userInfo.user.email);
      
      // Get the ID token
      const idToken = userInfo.idToken;
      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In');
      }
      
      // Create Firebase credential
      const credential = GoogleAuthProvider.credential(idToken);
      
      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, credential);
      
      console.log('🔴 Firebase sign-in successful:', userCredential.user.uid);
      
      return {
        user: userCredential.user,
        error: null,
      };
    } catch (error: any) {
      console.error('🔴 Google Sign-In error:', error);
      
      // Handle specific error cases
      const statusCodes = getGoogleSigninStatusCodes();
      if (statusCodes && error.code === statusCodes.SIGN_IN_CANCELLED) {
        return {
          user: null,
          error: {
            message: 'Google Sign-In was cancelled',
            code: 'cancelled',
          },
        };
      } else if (statusCodes && error.code === statusCodes.IN_PROGRESS) {
        return {
          user: null,
          error: {
            message: 'Google Sign-In is already in progress',
            code: 'in-progress',
          },
        };
      } else if (statusCodes && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        return {
          user: null,
          error: {
            message: 'Google Play Services not available',
            code: 'play-services-not-available',
          },
        };
      } else {
        return {
          user: null,
          error: {
            message: error.message || 'Failed to sign in with Google',
            code: error.code || 'unknown',
          },
        };
      }
    }
  }

  static async signOut() {
    try {
      const module = loadGoogleSigninModule();
      if (!module) {
        console.warn('Google Sign-in module not available, skipping sign out');
        return;
      }

      const GoogleSignin = loadGoogleSigninModule();
      await GoogleSignin.signOut();
      console.log('🔴 Google Sign-In sign out successful');
    } catch (error) {
      console.error('🔴 Google Sign-In sign out error:', error);
    }
  }

  static async isSignedIn() {
    try {
      const module = loadGoogleSigninModule();
      if (!module) {
        return false;
      }
      const GoogleSignin = loadGoogleSigninModule();
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('🔴 Error checking Google Sign-In status:', error);
      return false;
    }
  }

  static async getCurrentUser() {
    try {
      const module = loadGoogleSigninModule();
      if (!module) {
        return null;
      }
      const GoogleSignin = loadGoogleSigninModule();
      return await GoogleSignin.getCurrentUser();
    } catch (error) {
      console.error('🔴 Error getting current Google user:', error);
      return null;
    }
  }
}
