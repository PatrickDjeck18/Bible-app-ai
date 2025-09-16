import { Platform } from 'react-native';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthWebService } from './googleAuthWeb';
import { GoogleAuthAndroidService } from './googleAuthAndroidNew';
import { ModuleUtils } from './moduleUtils';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

export class GoogleAuthService {
  static async initialize() {
    try {
      if (Platform.OS === 'android') {
        console.log('🔴 Initializing Google Sign-In for Android...');
        
        // Only initialize if the native module is available
        if (this.isGoogleSignInAvailable()) {
          await GoogleAuthAndroidService.initialize();
        } else {
          console.log('🔴 Native Google Sign-in not available, skipping initialization');
        }
      }
      // Web and iOS don't need explicit initialization
    } catch (error) {
      console.error('🔴 Google Auth initialization error:', error);
      // Don't throw error during initialization, just log it
      console.warn('🔴 Google Auth Service will use fallback methods');
    }
  }

  static isGoogleSignInAvailable(): boolean {
    if (Platform.OS === 'web') {
      return true; // Web always has fallback methods
    } else if (Platform.OS === 'android') {
      return ModuleUtils.isGoogleSignInAvailable();
    }
    return true; // iOS and other platforms
  }

  static async signInWithGoogle() {
    // Use platform-specific services
    if (Platform.OS === 'web') {
      console.log('🔴 Using web-specific Google auth service...');
      return await GoogleAuthWebService.signInWithGoogle();
    } else if (Platform.OS === 'android') {
      console.log('🔴 Using Android-specific Google auth service...');
      
      // Check if native Google Sign-in is available
      if (!this.isGoogleSignInAvailable()) {
        console.log('🔴 Native Google Sign-in not available, using web fallback...');
        console.log('🔴 Attempting web-based Google authentication...');
        return await GoogleAuthWebService.signInWithGoogle();
      }
      
      try {
        return await GoogleAuthAndroidService.signInWithGoogle();
      } catch (error: any) {
        console.error('🔴 Android Google Sign-In failed, falling back to web method:', error);
        console.log('🔴 Attempting web-based Google authentication as fallback...');
        // Fall back to web method if Android native module isn't available
        const result = await GoogleAuthWebService.signInWithGoogle();
        console.log('🔴 Web fallback authentication completed');
        return result;
      }
    }

    try {
      console.log('🔴 Starting Google Sign-In for mobile...');
      
      // Get the correct redirect URI based on platform
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'daily-bread',
        path: 'auth',
      });

      console.log('🔴 Redirect URI:', redirectUri);
      console.log('🔴 Client ID:', process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID);
      
      // For development on physical devices, Expo uses a proxy
      // The redirect URI format is: exp://IP_ADDRESS:PORT/--/auth
      // This needs to be configured in Google Cloud Console
      
      const request = new AuthSession.AuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '354959331079-faisqnjq2nd81nrhnikm2t0clfc49kle.apps.googleusercontent.com',
        scopes: ['openid', 'profile', 'email'],
        redirectUri: redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {
          access_type: 'offline',
        },
      });

      console.log('🔴 Auth request created, starting prompt...');
      
      // Use a more robust prompt configuration for web
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
      });

      console.log('🔴 Auth result:', result.type);

      if (result.type === 'success') {
        console.log('🔴 Auth successful, creating credential...');
        
        // Handle authorization code exchange for mobile platforms
        if (result.params.code) {
          // Exchange the authorization code for tokens
          const tokenResponse = await this.exchangeCodeForTokens(result.params.code, redirectUri);
          
          if (tokenResponse.id_token) {
            const credential = GoogleAuthProvider.credential(tokenResponse.id_token);
            const userCredential = await signInWithCredential(auth, credential);
            
            console.log('🔴 User signed in successfully:', userCredential.user.uid);
            return {
              user: userCredential.user,
              error: null,
            };
          } else {
            throw new Error('Failed to exchange code for tokens');
          }
        } else if (result.params.id_token) {
          // Direct ID token (mobile flow)
          const credential = GoogleAuthProvider.credential(result.params.id_token);
          const userCredential = await signInWithCredential(auth, credential);
          
          console.log('🔴 User signed in successfully:', userCredential.user.uid);
          return {
            user: userCredential.user,
            error: null,
          };
        } else {
          throw new Error('No ID token or authorization code received');
        }
      } else {
        console.log('🔴 Auth cancelled or failed');
        return {
          user: null,
          error: {
            message: 'Google Sign-In was cancelled',
            code: 'cancelled',
          },
        };
      }
    } catch (error: any) {
      console.error('🔴 Google Sign-In error:', error);
      
      // Handle 404 errors specifically to prevent infinite loops
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        return {
          user: null,
          error: {
            message: 'Google OAuth configuration error. Please check your redirect URIs in Google Cloud Console.',
            code: 'oauth-config-error',
          },
        };
      }
      
      return {
        user: null,
        error: {
          message: error.message || 'Failed to sign in with Google',
          code: error.code,
        },
      };
    }
  }

  // Helper method to exchange authorization code for tokens
  private static async exchangeCodeForTokens(code: string, redirectUri: string) {
    try {
      const tokenEndpoint = 'https://oauth2.googleapis.com/token';
      const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '354959331079-faisqnjq2nd81nrhnikm2t0clfc49kle.apps.googleusercontent.com';
      
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: code,
          client_id: clientId,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokenDataResponse = await response.json();
      return tokenDataResponse;
    } catch (error) {
      console.error('🔴 Token exchange error:', error);
      throw error;
    }
  }

  // Simplified method that works for both platforms
  static async signInWithGoogleFirebase() {
    try {
      console.log('🔴 Using Firebase Google Sign-In...');
      return await this.signInWithGoogle();
    } catch (error: any) {
      console.error('Firebase Google Sign-In error:', error);
      return {
        user: null,
        error: {
          message: error.message || 'Failed to sign in with Google',
          code: error.code,
        },
      };
    }
  }
}
