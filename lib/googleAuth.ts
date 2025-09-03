import { Platform } from 'react-native';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthWebService } from './googleAuthWeb';

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession();

export class GoogleAuthService {
  static async signInWithGoogle() {
    // Use web-specific service for web platform to avoid COOP issues
    if (typeof window !== 'undefined') {
      console.log('🔴 Using web-specific Google auth service...');
      return await GoogleAuthWebService.signInWithGoogle();
    }

    try {
      console.log('🔴 Starting Google Sign-In for mobile...');
      
      // Get the correct redirect URI based on platform
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'daily-bread',
        path: 'auth',
      });

      console.log('🔴 Redirect URI:', redirectUri);
      
      const request = new AuthSession.AuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '1094208780432-thgtvadb92vnmobe0gdu4be32ied125u.apps.googleusercontent.com',
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
        
        // For web, we need to handle the code exchange differently
        if (Platform.OS === 'web' && result.params.code) {
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
      const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '1094208780432-thgtvadb92vnmobe0gdu4be32ied125u.apps.googleusercontent.com';
      
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
