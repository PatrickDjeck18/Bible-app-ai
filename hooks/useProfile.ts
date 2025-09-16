import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './useAuth';

// Use a simplified Profile type for Firebase
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  journey_start_date: string | null;
  created_at: number;
  updated_at: number;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the user's profile and create it if it doesn't exist
  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profileDocRef = doc(db, 'profiles', user.uid);
      const docSnap = await getDoc(profileDocRef);

      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() } as Profile);
      } else {
        // Profile does not exist, so create one.
        console.log('Profile not found, creating new profile for user:', user.uid);
        const newProfileData: Omit<Profile, 'id'> = {
          full_name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email,
          avatar_url: user.photoURL,
          journey_start_date: new Date().toISOString().split('T')[0],
          created_at: Date.now(),
          updated_at: Date.now(),
        };
        await setDoc(profileDocRef, newProfileData);
        setProfile({ id: user.uid, ...newProfileData } as Profile);
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Function to update the user's profile
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: 'No user logged in' };
    }

    try {
      const profileDocRef = doc(db, 'profiles', user.uid);
      const now = Date.now();

      // Ensure that 'id' is not included in the updates to the document
      const { id, ...updatesWithoutId } = updates;

      await updateDoc(profileDocRef, {
        ...updatesWithoutId,
        updated_at: now,
      });

      // Update the local state to reflect the changes
      setProfile(prevProfile => {
        if (!prevProfile) return null;
        return {
          ...prevProfile,
          ...updatesWithoutId,
          updated_at: now,
        };
      });

      return { data: { ...updates, id: user.uid }, error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { error: error.message || 'Failed to update profile' };
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [user, fetchProfile]);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
}