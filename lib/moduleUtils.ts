/**
 * Utility functions for checking native module availability
 * Helps prevent crashes when native modules aren't properly linked
 */

import { Platform } from 'react-native';

export class ModuleUtils {
  /**
   * Check if a native module is available without importing it
   */
  static isNativeModuleAvailable(moduleName: string): boolean {
    if (Platform.OS === 'web') {
      return false; // Native modules don't exist on web
    }

    try {
      const NativeModules = require('react-native').NativeModules;
      const isAvailable = NativeModules && NativeModules[moduleName] !== undefined;
      console.log(`Native module ${moduleName} available:`, isAvailable);
      return isAvailable;
    } catch (error) {
      console.warn(`Error checking native module ${moduleName}:`, error);
      return false;
    }
  }

  /**
   * Check if a specific module is available (for static imports)
   */
  static isModuleAvailable(moduleName: string): boolean {
    switch (moduleName) {
      case 'google-signin':
        return this.isGoogleSignInAvailable();
      case 'firebase':
        return this.isFirebaseAvailable();
      default:
        return false;
    }
  }

  /**
   * Check if Google Sign-in native module is available
   */
  static isGoogleSignInAvailable(): boolean {
    return this.isNativeModuleAvailable('RNGoogleSignin');
  }

  /**
   * Check if Firebase native modules are available
   */
  static isFirebaseAvailable(): boolean {
    return this.isNativeModuleAvailable('RNFirebaseApp');
  }
}
