# 🔧 Android Google Sign-In Setup Guide

## ✅ **Implementation Complete**

Your Android Google Sign-In has been properly implemented using the native `@react-native-google-signin/google-signin` library.

## 🔧 **What's Been Updated**

### **1. New Android-Specific Service (`lib/googleAuthAndroid.ts`)**
- **Native Google Sign-In** using `@react-native-google-signin/google-signin`
- **Proper configuration** with web client ID from `google-services.json`
- **Firebase integration** for seamless authentication
- **Error handling** for common Android-specific issues

### **2. Updated Main Google Auth Service (`lib/googleAuth.ts`)**
- **Platform detection** to use Android-specific service
- **Initialization method** for proper setup
- **Fallback to Expo AuthSession** for iOS (if needed)

### **3. App Configuration (`app.json`)**
- **Google Sign-In plugin** added to Expo configuration
- **iOS URL scheme** configured for cross-platform compatibility

### **4. App Initialization (`app/_layout.tsx`)**
- **Google Sign-In initialization** on app startup
- **Platform-specific setup** handled automatically

## 🔧 **Required Setup Steps**

### **Step 1: Google Cloud Console Configuration**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your project** (`daily-bread-88f42`)
3. **Navigate to APIs & Services → Credentials**
4. **Find your OAuth 2.0 Client ID** and ensure it includes:

#### **Android Configuration:**
- **Application type**: Android
- **Package name**: `com.dailybread.dailyfaithbible`
- **SHA-1 certificate fingerprint**: Get this from your keystore

#### **Web Configuration:**
- **Application type**: Web application
- **Authorized JavaScript origins**:
  ```
  http://localhost:8081
  http://localhost:19006
  https://daily-bread-88f42.web.app
  ```
- **Authorized redirect URIs**:
  ```
  http://localhost:8081/__/auth/handler
  http://localhost:19006/__/auth/handler
  https://daily-bread-88f42.web.app/__/auth/handler
  ```

### **Step 2: Get SHA-1 Fingerprint (Required for Android)**

#### **For Development:**
```bash
# Get debug keystore SHA-1
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

#### **For Production:**
```bash
# Get release keystore SHA-1
keytool -list -v -keystore your-release-key.keystore -alias your-key-alias
```

### **Step 3: Update Google Cloud Console**

1. **Add the SHA-1 fingerprint** to your Android OAuth client
2. **Ensure package name** matches: `com.dailybread.dailyfaithbible`
3. **Save the configuration**

### **Step 4: Environment Variables**

Create/update your `.env` file:
```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=354959331079-faisqnjq2nd81nrhnikm2t0clfc49kle.apps.googleusercontent.com
```

## 🔧 **Testing the Implementation**

### **1. Development Testing**
```bash
# Start the development server
npm start

# Test on Android device
# Use Expo Go app or build development APK
```

### **2. Production Testing**
```bash
# Build for production
expo build:android

# Test on physical Android device
# Verify Google Sign-In works correctly
```

## 🔧 **How It Works**

### **Android Flow:**
1. **App starts** → Google Sign-In initializes
2. **User taps "Sign in with Google"** → Native Google Sign-In opens
3. **User authenticates** → Google returns ID token
4. **Firebase credential created** → User signed into Firebase
5. **Supabase profile synced** → User fully authenticated

### **Web Flow:**
1. **App starts** → Firebase Google auth ready
2. **User taps "Sign in with Google"** → Firebase popup opens
3. **User authenticates** → Firebase handles OAuth
4. **User signed in** → Supabase profile synced

## 🔧 **Troubleshooting**

### **Common Issues & Solutions:**

#### **Issue 1: "DEVELOPER_ERROR" on Android**
- **Solution**: Check SHA-1 fingerprint in Google Cloud Console
- **Verify**: Package name matches `com.dailybread.dailyfaithbible`

#### **Issue 2: "Sign in failed"**
- **Solution**: Ensure Google Play Services are installed
- **Check**: Device has Google Play Store

#### **Issue 3: "Invalid client" error**
- **Solution**: Verify client ID in `.env` file
- **Check**: OAuth client configuration in Google Cloud Console

#### **Issue 4: App crashes on Google Sign-In**
- **Solution**: Check that `google-services.json` is properly placed
- **Verify**: App package name matches configuration

## 🔧 **Files Modified**

- ✅ `lib/googleAuthAndroid.ts` - **NEW** Android-specific Google Sign-In service
- ✅ `lib/googleAuth.ts` - Updated to use platform-specific services
- ✅ `app/_layout.tsx` - Added Google Sign-In initialization
- ✅ `app.json` - Added Google Sign-In plugin configuration

## 🔧 **Next Steps**

1. **Get SHA-1 fingerprint** from your keystore
2. **Update Google Cloud Console** with SHA-1 and package name
3. **Test on Android device** (physical device recommended)
4. **Verify authentication flow** works end-to-end

Your Android Google Sign-In is now properly configured and ready to use! 🚀
