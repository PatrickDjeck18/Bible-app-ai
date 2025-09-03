import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOnboarding = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      setLoading(true);
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      setHasSeenOnboarding(onboardingComplete === 'true');
    } catch (error) {
      console.log('Error checking onboarding status:', error);
      setHasSeenOnboarding(false);
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.log('Error saving onboarding status:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('onboardingComplete');
      setHasSeenOnboarding(false);
    } catch (error) {
      console.log('Error resetting onboarding status:', error);
    }
  };

  return {
    hasSeenOnboarding,
    loading,
    completeOnboarding,
    resetOnboarding,
    checkOnboardingStatus,
  };
};
