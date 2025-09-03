# 🔧 Google OAuth Production Setup

## ✅ **Current Status: Production Ready**

Your app is now configured to use the production Google OAuth with the URL: **https://daily-bread-88f42.web.app**

## 🔧 **Configuration Updated**

### 1. Environment Variables ✅
The `.env` file has been updated with:
```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=1094208780432-thgtvadb92vnmobe0gdu4be32ied125u.apps.googleusercontent.com
```

### 2. Firebase Configuration ✅
The `lib/firebase.ts` is already configured for production:
- **Project ID**: `daily-bread-88f42`
- **Auth Domain**: `daily-bread-88f42.firebaseapp.com`
- **Storage Bucket**: `daily-bread-88f42.firebasestorage.app`
- **Database URL**: `https://daily-bread-88f42.firebaseio.com`

## 🔧 **Google Cloud Console Configuration Required**

### **Step 1: Update OAuth 2.0 Client ID**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (`daily-bread-88f42`)
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID and click to edit
5. Update the **Authorized redirect URIs** to include:

```
For Production:
https://daily-bread-88f42.web.app/__/auth/handler
https://daily-bread-88f42.web.app/auth
```

### **Step 2: Update Authorized JavaScript Origins**
Add these origins:
```
https://daily-bread-88f42.web.app
```

## 🔧 **Testing Production OAuth**

### **1. Web Testing**
1. Deploy your app to Firebase Hosting
2. Visit: https://daily-bread-88f42.web.app
3. Try Google login
4. Check browser console for any errors

### **2. Mobile Testing**
1. Build and deploy your mobile app
2. Test Google login on physical devices
3. Verify the OAuth flow works correctly

## 🔧 **Expected Behavior**

### **Web Platform**
- Uses Firebase's built-in `signInWithPopup`
- Redirects to: `https://daily-bread-88f42.web.app/__/auth/handler`
- No COOP (Cross-Origin-Opener-Policy) issues

### **Mobile Platform**
- Uses Expo AuthSession
- Redirects to: `daily-bread://auth`
- Native OAuth flow

## 🔧 **Troubleshooting**

### **Common Issues & Solutions:**

#### **Issue 1: "Redirect URI mismatch"**
- **Solution**: Ensure the exact redirect URI is added to Google Cloud Console
- **Check**: Browser console for the exact redirect URI being generated

#### **Issue 2: "Invalid client"**
- **Solution**: Verify the client ID in `.env` matches Google Cloud Console
- **Current ID**: `1094208780432-thgtvadb92vnmobe0gdu4gdu4be32ied125u.apps.googleusercontent.com`

#### **Issue 3: "Network error"**
- **Solution**: Check internet connection and Firebase configuration
- **Verify**: Firebase project is active and billing is set up

#### **Issue 4: "Popup blocked"**
- **Solution**: This is expected. The app will redirect to Google and back.

## 🔧 **Verification Steps**

### **1. Check Console Logs**
Look for these logs in your browser console:
```
🔴 Using web-specific Google auth service...
🔴 Starting Google Sign-In for Web...
🔴 User signed in successfully: [user-id]
```

### **2. Verify Platform Detection**
- **Web**: Should use `GoogleAuthWebService`
- **Mobile**: Should use `AuthSession` flow

### **3. Test Error Handling**
- Cancel OAuth flow
- Network errors
- Invalid credentials

## 🔧 **Production URLs**

### **Firebase Hosting**
- **URL**: https://daily-bread-88f42.web.app
- **Config**: https://daily-bread-88f42.web.app/ad-config.json

### **Firebase Console**
- **Project**: https://console.firebase.google.com/project/daily-bread-88f42

### **Google Cloud Console**
- **Credentials**: https://console.cloud.google.com/apis/credentials?project=daily-bread-88f42

## 🔧 **Next Steps**

1. **Update Google Cloud Console** with production redirect URIs
2. **Deploy your app** to Firebase Hosting
3. **Test the OAuth flow** on the live site
4. **Monitor for any errors** in production logs

## 🔧 **Security Notes**

- ✅ Client ID is configured for production
- ✅ Firebase project is set to production
- ✅ Environment variables are properly set
- ⚠️ Remember to update Google Cloud Console redirect URIs

---

**Status**: ✅ **Production Ready** - Just update Google Cloud Console redirect URIs!
