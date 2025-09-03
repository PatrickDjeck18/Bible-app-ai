import { useEffect, useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import { Alert } from 'react-native';
import { GoogleAuthService } from '@/lib/googleAuth';

// Extend the User type to include the properties we need
export type ExtendedUser = User & {
  id?: string;
  user_metadata?: {
    full_name?: string;
  };
  email?: string | null;
  uid?: string;
};

// Utility function to convert Firebase user ID to UUID format
function firebaseIdToUUID(firebaseId: string): string {
  // Create a deterministic UUID v5 from the Firebase ID
  // This ensures the same Firebase ID always generates the same UUID
  
  // Simple hash function to create a deterministic UUID
  let hash = 0;
  for (let i = 0; i < firebaseId.length; i++) {
    const char = firebaseId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert hash to a UUID-like string
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  const part1 = hashStr.substring(0, 8);
  const part2 = hashStr.substring(8, 12) || '0000';
  const part3 = '4' + (hashStr.substring(12, 15) || '000');
  const part4 = '8' + (hashStr.substring(15, 18) || '000');
  const part5 = hashStr.substring(18, 30) || '000000000000';
  const paddedPart5 = part5.padEnd(12, '0');
  
  const uuid = `${part1}-${part2}-${part3}-${part4}-${paddedPart5}`;
  
  return uuid;
}

// Function to sync Firebase user with Supabase
async function syncUserWithSupabase(firebaseUser: User) {
  try {
    const userId = firebaseIdToUUID(firebaseUser.uid);
    console.log('🔴 Syncing Firebase user with Supabase:', userId);
    
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('🔴 Error checking profile:', fetchError);
      return;
    }

    if (!existingProfile) {
      // Create profile if it doesn't exist
      console.log('🔴 Creating new profile for user:', userId);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          full_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          journey_start_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (createError) {
        console.error('🔴 Error creating profile:', createError);
        return;
      }

      console.log('🔴 Profile created successfully:', newProfile);
    } else {
      console.log('🔴 Profile already exists:', existingProfile);
    }
  } catch (error) {
    console.error('🔴 Error syncing user with Supabase:', error);
  }
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔴 Auth state changed:', currentUser ? 'User signed in' : 'User signed out');

      if (currentUser) {
        // Sync Firebase user with Supabase
        await syncUserWithSupabase(currentUser);

        // Add the id property to the user object, converting Firebase ID to UUID
        const extendedUser = {
          ...currentUser,
          id: firebaseIdToUUID(currentUser.uid),
          user_metadata: {
            full_name: currentUser.displayName || undefined
          },
          email: currentUser.email || null,
          uid: currentUser.uid,
        } as ExtendedUser;

        setUser(extendedUser);
      } else {
        setUser(null);
      }

      setLoading(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Sync with Supabase after successful sign in
      await syncUserWithSupabase(userCredential.user);

      // Convert the user to include the UUID id
      const extendedUser = {
        ...userCredential.user,
        id: firebaseIdToUUID(userCredential.user.uid),
        user_metadata: {
          full_name: userCredential.user.displayName || undefined
        },
        email: userCredential.user.email || null,
        uid: userCredential.user.uid,
      } as ExtendedUser;
      return { data: { user: extendedUser }, error: null };
    } catch (error: any) {
      console.error('Error during sign in:', error);
      return {
        data: null,
        error: {
          message: error.message || 'An unknown error occurred.',
          code: error.code,
        },
      };
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName,
        });
      }

      // Sync with Supabase after successful sign up
      await syncUserWithSupabase(userCredential.user);

      // Convert the user to include the UUID id
      const extendedUser = {
        ...userCredential.user,
        id: firebaseIdToUUID(userCredential.user.uid),
        user_metadata: {
          full_name: fullName
        },
        email: userCredential.user.email || null,
        uid: userCredential.user.uid,
      } as ExtendedUser;

      return { data: { user: extendedUser }, error: null };
    } catch (error: any) {
      console.error('Error during sign up:', error);
      return {
        data: null,
        error: {
          message: error.message || 'An unknown error occurred.',
          code: error.code,
        },
      };
    }
  };

  const signOut = async () => {
    try {
      console.log('🔴 Starting sign out process...');
      
      // Clear any local storage or cached data
      try {
        // Clear any auth-related data from AsyncStorage if needed
        // This can help with persistent login issues
      } catch (storageError) {
        console.warn('🔴 Warning: Could not clear local storage:', storageError);
      }
      
      // Sign out from Firebase
      await firebaseSignOut(auth);
      console.log('🔴 Firebase sign out successful');

      // Force clear the user state immediately
      setUser(null);
      
      return { error: null };
    } catch (error: any) {
      console.error('🔴 Error during sign out:', error);
      
      // Even if Firebase sign out fails, clear the local user state
      setUser(null);
      
      return {
        error: {
          message: error.message || 'Failed to sign out.',
          code: error.code,
        },
      };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🔴 Starting Google Sign-In...');
      
      // Use the Google Auth Service
      const result = await GoogleAuthService.signInWithGoogleFirebase();
      
      if (result.error) {
        console.error('🔴 Google Sign-In error:', result.error);
        return {
          data: null,
          error: result.error,
        };
      }

      if (result.user) {
        // Sync with Supabase after successful sign in
        await syncUserWithSupabase(result.user);
        
        // Convert the user to include the UUID id
        const extendedUser = {
          ...result.user,
          id: firebaseIdToUUID(result.user.uid),
          user_metadata: {
            full_name: result.user.displayName || undefined
          },
          email: result.user.email || null,
          uid: result.user.uid,
        } as ExtendedUser;

        console.log('🔴 Google Sign-In successful:', extendedUser.uid);
        return { data: { user: extendedUser }, error: null };
      }

      return {
        data: null,
        error: {
          message: 'No user returned from Google Sign-In',
          code: 'no-user',
        },
      };
    } catch (error: any) {
      console.error('🔴 Error during Google sign in:', error);
      return {
        data: null,
        error: {
          message: error.message || 'An unknown error occurred.',
          code: error.code,
        },
      };
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithGoogle,
  };
}
