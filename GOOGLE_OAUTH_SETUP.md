# Google OAuth Setup Guide

This guide will help you set up Google Sign-In for your Bible app.

## 🔧 **Step 1: Firebase Console Setup**

### 1.1 Enable Google Sign-In in Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`daily-bread-88f42`)
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Enable it and configure:
   - **Project support email**: Your email
   - **Web SDK configuration**: Use the default Firebase configuration

### 1.2 Get OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **Credentials**
4. Create a new **OAuth 2.0 Client ID**:
   - Application type: **Web application**
   - Name: `Daily Bread Web App`
   - Authorized JavaScript origins: 
     - `http://localhost:8081` (for development)
     - `http://localhost:19006` (for Expo web development)
     - `https://your-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:8081/__/auth/handler` (for development)
     - `http://localhost:19006/__/auth/handler` (for Expo web development)
     - `https://your-domain.com/__/auth/handler` (for production)
     - `http://localhost:8081/auth` (for mobile development)
     - `http://localhost:19006/auth` (for Expo web development)
     - `https://your-domain.com/auth` (for production)

## 🔧 **Step 2: Update App Configuration**

### 2.1 Update Google Auth Service
The Google Auth service has been updated to handle COOP (Cross-Origin-Opener-Policy) issues:

- **Web Platform**: Uses Firebase's built-in `signInWithPopup` to avoid COOP issues
- **Mobile Platform**: Uses Expo AuthSession for native OAuth flow

### 2.2 Update App Scheme
In `app.json`, ensure your scheme matches:

```json
{
  "expo": {
    "scheme": "daily-bread",
    // ... other config
  }
}
```

## 🔧 **Step 3: Environment Variables**

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=1094208780432-thgtvadb92vnmobe0gdu4be32ied125u.apps.googleusercontent.com
```

## 🔧 **Step 4: Implementation Details**

### 4.1 Web Platform (Fixed COOP Issues)
The web implementation now uses Firebase's built-in Google auth:

```typescript
// lib/googleAuthWeb.ts
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export class GoogleAuthWebService {
  static async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  }
}
```

### 4.2 Mobile Platform
The mobile implementation uses Expo AuthSession:

```typescript
// lib/googleAuth.ts
import * as AuthSession from 'expo-auth-session';

export class GoogleAuthService {
  static async signInWithGoogle() {
    // Platform detection and appropriate flow
    if (typeof window !== 'undefined') {
      return await GoogleAuthWebService.signInWithGoogle();
    }
    // Mobile flow with AuthSession
  }
}
```

## 🔧 **Step 5: Testing**

### 5.1 Development Testing
1. **Web Development**: 
   - Start with `npm start` or `expo start --web`
   - Test on `http://localhost:19006`
   - Should work without COOP issues

2. **Mobile Development**:
   - Test on physical devices (not just simulators)
   - Use Expo Go app
   - Scan the QR code

### 5.2 Production Testing
1. Deploy to your domain
2. Update Google Cloud Console with production URLs
3. Test the OAuth flow on live site

## 🔧 **Step 6: Troubleshooting**

### Common Issues & Solutions:

#### **Issue 1: "Cross-Origin-Opener-Policy policy would block the window.closed call"**
- **Solution**: ✅ **FIXED** - The web implementation now uses Firebase's `signInWithPopup` which handles COOP properly

#### **Issue 2: "Invalid client" error**
- **Solution**: Check that your client ID is correct in `.env` file

#### **Issue 3: "Redirect URI mismatch"**
- **Solution**: Verify redirect URIs in Google Cloud Console match your app's URLs

#### **Issue 4: "Popup blocked"**
- **Solution**: This is expected behavior. The app will fall back to redirect method

#### **Issue 5: "Network error"**
- **Solution**: Check your internet connection and Firebase configuration

### Debug Steps:
1. Check browser console for the exact redirect URI
2. Verify it's added to Google Cloud Console
3. Clear browser cache and try again
4. Test in incognito/private mode

## 🔧 **Step 7: Verification**

### 7.1 Check Console Logs
Look for these logs in your browser console:
```
🔴 Using web-specific Google auth service...
🔴 Starting Google Sign-In for Web...
🔴 User signed in successfully: [user-id]
```

### 7.2 Verify Platform Detection
- **Web**: Should use `GoogleAuthWebService`
- **Mobile**: Should use `AuthSession` flow

## 🔧 **Step 8: Production Deployment**

When you deploy to production:

1. **Update Google Cloud Console** with your production domain
2. **Update environment variables** for production
3. **Test the OAuth flow** on the live site
4. **Monitor for any errors** in production

## 🔧 **Security Notes**

- Never commit your client secret to version control
- Use environment variables for sensitive data
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in Google Cloud Console

## 🔧 **Next Steps**

Once Google OAuth is working:

1. Test the sign-in flow on both web and mobile
2. Verify user data is synced with Supabase
3. Test error handling and edge cases
4. Monitor for any errors in production

---

**Need Help?** Contact the development team or check the Firebase documentation for more details.

