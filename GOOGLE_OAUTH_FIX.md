# 🔧 **Google OAuth Fix Guide**

## **Issue: "Requested URL was not found on this server"**

This error occurs when the Google OAuth redirect URI doesn't match what's configured in Google Cloud Console.

## **🔧 Step 1: Update Google Cloud Console Configuration**

### **1.1 Go to Google Cloud Console**
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (`daily-bread-88f42`)
3. Navigate to **APIs & Services** → **Credentials**

### **1.2 Update OAuth 2.0 Client ID**
1. Find your existing OAuth 2.0 Client ID
2. Click on it to edit
3. Update the **Authorized redirect URIs** to include:

```
For Development:
http://localhost:8081/auth
http://localhost:8081/__/auth/handler

For Production (when you deploy):
https://your-domain.com/auth
https://your-domain.com/__/auth/handler
```

### **1.3 Update Authorized JavaScript Origins**
Add these origins:
```
http://localhost:8081
https://your-domain.com (for production)
```

## **🔧 Step 2: Environment Variables**

### **2.1 Create/Update .env file**
Create a `.env` file in your project root:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=1094208780432-thgtvadb92vnmobe0gdu4be32ied125u.apps.googleusercontent.com
```

### **2.2 Verify the Client ID**
Make sure the client ID in your `.env` file matches the one in Google Cloud Console.

## **🔧 Step 3: App Configuration**

### **3.1 App Scheme (Already Updated)**
The app.json has been updated to use:
```json
{
  "expo": {
    "scheme": "daily-bread"
  }
}
```

### **3.2 Google Auth Service (Already Updated)**
The `lib/googleAuth.ts` has been updated with:
- Correct redirect URI generation
- Better error logging
- Platform-specific handling

## **🔧 Step 4: Testing**

### **4.1 Development Testing**
1. Start your development server: `npm start`
2. Open the app in your browser
3. Try Google login
4. Check the console for the redirect URI being generated

### **4.2 Mobile Testing**
1. Test on a physical device (not simulator)
2. Use Expo Go app
3. Scan the QR code
4. Try Google login

## **🔧 Step 5: Troubleshooting**

### **Common Issues & Solutions:**

#### **Issue 1: "Invalid client"**
- **Solution**: Verify your client ID in `.env` matches Google Cloud Console

#### **Issue 2: "Redirect URI mismatch"**
- **Solution**: Add the exact redirect URI from console logs to Google Cloud Console

#### **Issue 3: "Popup blocked"**
- **Solution**: This is expected. The app will redirect to Google and back.

#### **Issue 4: "Network error"**
- **Solution**: Check internet connection and Firebase configuration

### **Debug Steps:**
1. Check browser console for the exact redirect URI
2. Verify it's added to Google Cloud Console
3. Clear browser cache and try again
4. Test in incognito/private mode

## **🔧 Step 6: Verification**

### **6.1 Check Console Logs**
Look for these logs in your browser console:
```
🔴 Starting Google Sign-In...
🔴 Redirect URI: [your-redirect-uri]
🔴 Auth request created, starting prompt...
```

### **6.2 Verify Redirect URI**
The redirect URI should look like:
- Development: `http://localhost:8081/auth`
- Production: `https://your-domain.com/auth`

## **🔧 Step 7: Production Deployment**

When you deploy to production:

1. **Update Google Cloud Console** with your production domain
2. **Update environment variables** for production
3. **Test the OAuth flow** on the live site

## **🔧 Alternative Solution: Use Firebase Auth Directly**

If OAuth continues to have issues, you can use Firebase's built-in Google auth:

```typescript
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();
const result = await signInWithPopup(auth, provider);
```

## **🔧 Need Help?**

If you're still experiencing issues:

1. **Check the browser console** for detailed error messages
2. **Verify all redirect URIs** in Google Cloud Console
3. **Test with a fresh browser session**
4. **Contact support** with the specific error message

---

**Remember**: The redirect URI must match exactly between your app configuration and Google Cloud Console settings.
