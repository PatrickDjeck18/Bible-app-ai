import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './firebase';

export class GoogleAuthWebService {
  static async signInWithGoogle() {
    try {
      console.log('🔴 Starting Google Sign-In for Web...');
      
      // Use Firebase's built-in Google auth for web to avoid COOP issues
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      // Use signInWithPopup which handles COOP better than custom OAuth flow
      const result = await import('firebase/auth').then(({ signInWithPopup }) => 
        signInWithPopup(auth, provider)
      );
      
      console.log('🔴 User signed in successfully:', result.user.uid);
      return {
        user: result.user,
        error: null,
      };
    } catch (error: any) {
      console.error('🔴 Google Sign-In error:', error);
      
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        return {
          user: null,
          error: {
            message: 'Google Sign-In was cancelled',
            code: 'cancelled',
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

  static async signInWithGoogleFirebase() {
    return await this.signInWithGoogle();
  }
}
