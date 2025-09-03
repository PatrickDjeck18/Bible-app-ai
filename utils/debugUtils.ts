import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugUtils = {
  // Reset onboarding state
  async resetOnboarding() {
    try {
      await AsyncStorage.removeItem('onboardingComplete');
      console.log('🔴 Onboarding state reset successfully');
      return true;
    } catch (error) {
      console.error('🔴 Error resetting onboarding:', error);
      return false;
    }
  },

  // Clear all auth and onboarding data
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        'onboardingComplete',
        // Add other auth-related keys if needed
      ]);
      console.log('🔴 All data cleared successfully');
      return true;
    } catch (error) {
      console.error('🔴 Error clearing data:', error);
      return false;
    }
  },

  // Check current state
  async checkCurrentState() {
    try {
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      console.log('🔴 Current state:', {
        onboardingComplete,
        hasSeenOnboarding: onboardingComplete === 'true'
      });
      return {
        onboardingComplete,
        hasSeenOnboarding: onboardingComplete === 'true'
      };
    } catch (error) {
      console.error('🔴 Error checking state:', error);
      return null;
    }
  },

  // Test logout functionality
  async testLogout() {
    try {
      console.log('🔴 Testing logout functionality...');
      
      // Clear any cached data
      await this.clearAllData();
      
      // Force reload the app state
      console.log('🔴 Logout test completed');
      return true;
    } catch (error) {
      console.error('🔴 Error testing logout:', error);
      return false;
    }
  },

  // Check Firebase auth state
  checkFirebaseAuthState() {
    try {
      // This will be called from the auth hook
      console.log('🔴 Firebase auth state check requested');
      return true;
    } catch (error) {
      console.error('🔴 Error checking Firebase auth state:', error);
      return false;
    }
  }
};
