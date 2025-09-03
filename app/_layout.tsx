import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { router } from 'expo-router';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const frameworkReady = useFrameworkReady();
  const { user, loading: authLoading } = useAuth();
  const { hasSeenOnboarding, loading: onboardingLoading } = useOnboarding();

  useEffect(() => {
    const initialize = async () => {
      if (frameworkReady && !authLoading && !onboardingLoading) {
        console.log('🔴 App initialization:', {
          user: !!user,
          hasSeenOnboarding,
          authLoading,
          onboardingLoading
        });



        if (!user) {
          // User is not logged in - check onboarding status
          if (hasSeenOnboarding === false) {
            console.log('🔴 Redirecting to onboarding...');
            router.replace('/onboarding');
          } else {
            console.log('🔴 Redirecting to login...');
            router.replace('/login');
          }
        } else {
          // User is logged in - go directly to main app
          console.log('🔴 User logged in, redirecting to main app...');
          router.replace('/(tabs)');
        }
        await SplashScreen.hideAsync();
      }
    };

    initialize();
  }, [frameworkReady, authLoading, onboardingLoading, user, hasSeenOnboarding]);

  // Handle user sign out - navigate to login when user becomes null
  useEffect(() => {
    if (frameworkReady && !authLoading && !onboardingLoading && !user && hasSeenOnboarding !== false) {
      console.log('🔴 User signed out, navigating to login...');
      // Add a small delay to ensure all state updates are complete
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, frameworkReady, authLoading, onboardingLoading, hasSeenOnboarding]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-prayer" />
        <Stack.Screen name="edit-prayer" />
        <Stack.Screen name="prayer-journal" />
        <Stack.Screen name="ai-bible-chat" />
        <Stack.Screen name="bible-study-ai" />
        <Stack.Screen name="note-taker" />
        <Stack.Screen name="dream-interpretation" />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
