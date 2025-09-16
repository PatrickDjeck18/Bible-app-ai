// // 1. Polyfill the crypto module at the very top of the file
// import 'react-native-get-random-values';
// import { SubscriptionProvider } from '@/hooks/subsHook';

// import { useEffect, useState, useRef } from 'react';
// import { Platform } from 'react-native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import * as SplashScreen from 'expo-splash-screen';
// import { useFrameworkReady } from '@/hooks/useFrameworkReady';
// import { useAuth } from '@/hooks/useAuth';
// import { useOnboarding } from '@/hooks/useOnboarding';
// import { router } from 'expo-router';
// import { firebaseMessaging } from '@/lib/firebaseMessaging';
// import { GoogleAuthService } from '@/lib/googleAuth';
// import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// // Disable analytics before any Firebase initialization
// import '@/lib/disableAnalytics';

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [servicesReady, setServicesReady] = useState({
//     revenueCat: false,
//     firebase: false,
//     googleAuth: false,
//   });

//   const allServicesReady = servicesReady.revenueCat && servicesReady.firebase && servicesReady.googleAuth;
//   const initializedRef = useRef(false);

//   // 🔑 SEPARATE EFFECT FOR INITIALIZING ALL SERVICES
//   // This hook runs once to initialize all services sequentially.
//   // useEffect(() => {
//   //   if (initializedRef.current) {
//   //     console.log('🟡 [RootLayout] Initialization already called. Skipping.');
//   //     return;
//   //   }
//   //   initializedRef.current = true;

//   //   console.log('🔵 [RootLayout] Starting all service initializations...');

//   //   const initializeServices = async () => {
//   //     try {
//   //       // Step 1: Initialize Firebase and GoogleAuth
//   //       if (Platform.OS === 'web') {
//   //         await firebaseMessaging.initialize();
//   //       }
//   //       await GoogleAuthService.initialize();
//   //       console.log('✅ [Firebase/GoogleAuth] Services initialized.');
//   //       setServicesReady((prev:any) => ({ ...prev, firebase: true, googleAuth: true }));

//   //       // Step 2: Initialize RevenueCat
//   //       Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
//   //       if (Platform.OS === 'ios') {
//   //         await Purchases.configure({ apiKey: 'appl_NvuOMWMLGsVqViZVToKuRbnOxyt' });
//   //       } else if (Platform.OS === 'android') {
//   //         await Purchases.configure({ apiKey: 'goog_GutPCLEGNhXqdpJBpZQFUMMcrgn' });
//   //       } else {
//   //         console.log('🟡 [RevenueCat] Not configured for platform:', Platform.OS);
//   //       }
//   //       console.log('✅ [RevenueCat] SDK configured.');
//   //       setServicesReady((prev : any) => ({ ...prev, revenueCat: true }));

//   //       // Step 3: Fetch RevenueCat data after it's configured
//   //       console.log('🔵 [RevenueCat] Configuration complete, fetching subscription data...');
//   //       const customerInfo = await Purchases.getCustomerInfo();
//   //       console.log('🟢 [RevenueCat] Customer Info:', JSON.stringify(customerInfo, null, 2));

//   //       const offerings = await Purchases.getOfferings();
//   //       if (offerings.current && offerings.current.availablePackages.length > 0) {
//   //         console.log('🟢 [RevenueCat] Offerings Info:', JSON.stringify(offerings, null, 2));
//   //       } else {
//   //         console.log('🟡 [RevenueCat] No offerings found.');
//   //       }

//   //     } catch (e) {
//   //       console.error('❌ [RevenueCat] Error during setup or data fetch:', e);
//   //     }
//   //   };
//   //   initializeServices();
//   // }, []);

//   // All hook calls must be at the top level of the component.
//   const frameworkReady = useFrameworkReady();
//   const { user, loading: authLoading } = useAuth();
//   const { hasSeenOnboarding, loading: onboardingLoading } = useOnboarding();

//   // 🔑 SEPARATE EFFECT FOR NAVIGATION
//   // This hook will now properly react to state changes from all hooks.
//   useEffect(() => {
//     console.log('🔵 [Navigation] Navigation effect started.');
//     const navigate = async () => {
//       const allAppReady = allServicesReady && frameworkReady && !authLoading && !onboardingLoading;

//       console.log('🔴 [Navigation Check] App state:', {
//         allServicesReady,
//         frameworkReady,
//         authLoading,
//         onboardingLoading,
//         user: !!user,
//         hasSeenOnboarding,
//       });

//       if (allAppReady) {
//         console.log('✅ [Navigation] All conditions met. Navigating...');
//         if (!user) {
//           if (hasSeenOnboarding === false) {
//             console.log('➡️ [Navigation] Redirecting to onboarding.');
//             router.replace('/onboarding');
//           } else {
//             console.log('➡️ [Navigation] Redirecting to login.');
//             router.replace('/login');
//           }
//         } else {
//           console.log('➡️ [Navigation] User is logged in. Redirecting to main app.');
//           router.replace('/(tabs)');
//         }
//         await SplashScreen.hideAsync();
//         console.log('🎉 [Splash Screen] Hidden.');
//       } else {
//         console.log('🟡 [Navigation] Conditions not met. Waiting...');
//       }
//     };
//     navigate();
//   }, [allServicesReady, frameworkReady, authLoading, onboardingLoading, user, hasSeenOnboarding]);

//   // Handle user sign out - navigate to login when user becomes null
//   useEffect(() => {
//     if (frameworkReady && !authLoading && !onboardingLoading && !user && hasSeenOnboarding !== false) {
//       console.log('🔴 [User Sign Out] Detected. Navigating to login...');
//       const timer = setTimeout(() => {
//         router.replace('/login');
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [user, frameworkReady, authLoading, onboardingLoading, hasSeenOnboarding]);

//   return (
//     <>
//   {/* //  <SubscriptionProvider> */}
//   <Stack screenOptions={{ headerShown: false }}>
//     <Stack.Screen name="onboarding" />
//     <Stack.Screen name="login" />
//     <Stack.Screen name="signup" />
//     <Stack.Screen name="(tabs)" />
//     <Stack.Screen name="add-prayer" />
//     <Stack.Screen name="edit-prayer" />
//     <Stack.Screen name="prayer-journal" />
//     <Stack.Screen name="ai-bible-chat" />
//     <Stack.Screen name="bible-study-ai" />
//     <Stack.Screen name="note-taker" />
//     <Stack.Screen name="dream-interpretation" />
//     <Stack.Screen name="+not-found" />
//   </Stack>
//   <StatusBar style="auto" />
// {/* // </SubscriptionProvider> */}
// </>
//   );
// }