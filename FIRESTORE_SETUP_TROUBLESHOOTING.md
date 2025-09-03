# Firestore Setup Troubleshooting Guide

## 🚨 Current Issue: PERMISSION_DENIED Error

The error "7 PERMISSION_DENIED: Missing or insufficient permissions" indicates that either:
1. Firestore Database hasn't been created
2. Security rules are too restrictive
3. The project configuration is incorrect

## 🔧 Step-by-Step Resolution

### Step 1: Verify Project Configuration

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Select your project** (`daily-bread-88f42`)
3. **Click the gear icon (⚙️) next to "Project Overview"**
4. **Select "Project settings"**
5. **Scroll down to "Your apps" section**
6. **Verify your web app is listed and configured**

### Step 2: Check if Firestore Database Exists

1. **In Firebase Console, look for "Firestore Database" in the left sidebar**
2. **If you see it, click on it**
3. **If you see "Create Database", the database doesn't exist yet**
4. **If you see collections or data, the database exists**

### Step 3: Create Firestore Database (If Needed)

If you don't see Firestore Database or see "Create Database":

1. **Click "Create Database"**
2. **Choose security mode: "Start in test mode"**
3. **Select a location** (choose closest to your users)
4. **Click "Done"**
5. **Wait for the database to be created (may take a few minutes)**

### Step 4: Enable Firestore API (Alternative)

If you can't find Firestore Database:

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select your project** (`daily-bread-88f42`)
3. **Search for "Firestore" in the search bar**
4. **Click on "Firestore"**
5. **If prompted, click "Enable API"**
6. **Wait for the API to be enabled**

### Step 5: Set Permissive Security Rules

Once you can access Firestore Database:

1. **Click on the "Rules" tab**
2. **Replace the existing rules with:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. **Click "Publish"**
4. **Wait for rules to be deployed (usually takes 30-60 seconds)**

### Step 6: Verify Database URL

Check if your Firebase config has the correct database URL:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAVNWytRAmf_qz-bUI2s7IJo85-NtVaC7s",
  authDomain: "daily-bread-88f42.firebaseapp.com",
  projectId: "daily-bread-88f42",
  storageBucket: "daily-bread-88f42.firebasestorage.app",
  messagingSenderId: "354959331079",
  appId: "1:354959331079:web:0cdd37c2387fc1b386ffa2",
  measurementId: "G-53DHZ8FNP0",
  // Make sure this URL is correct for Firestore
  databaseURL: "https://daily-bread-88f42.firebaseio.com", // This is for Realtime Database
};
```

**Note**: The `databaseURL` field is for Realtime Database, not Firestore. Firestore doesn't need this field.

### Step 7: Alternative Configuration

Try updating your Firebase config to remove the databaseURL:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAVNWytRAmf_qz-bUI2s7IJo85-NtVaC7s",
  authDomain: "daily-bread-88f42.firebaseapp.com",
  projectId: "daily-bread-88f42",
  storageBucket: "daily-bread-88f42.firebasestorage.app",
  messagingSenderId: "354959331079",
  appId: "1:354959331079:web:0cdd37c2387fc1b386ffa2",
  measurementId: "G-53DHZ8FNP0"
  // Remove databaseURL for Firestore
};
```

## 🔍 Common Issues and Solutions

### Issue 1: "Firestore Database not found"
**Solution**: Create the database in Firebase Console

### Issue 2: "API not enabled"
**Solution**: Enable Firestore API in Google Cloud Console

### Issue 3: "Rules not published"
**Solution**: Wait 30-60 seconds after publishing rules

### Issue 4: "Wrong project selected"
**Solution**: Verify you're in the correct Firebase project

### Issue 5: "Network issues"
**Solution**: Check your internet connection and firewall settings

## 🧪 Testing Steps

After completing the setup:

1. **Run the test script:**
   ```bash
   node migrate-to-firestore.js test
   ```

2. **Expected output:**
   ```
   [timestamp] 🧪 Testing connections...
   [timestamp] ✅ Firestore: OK
   [timestamp] ✅ Supabase: OK
   [timestamp] 🎉 All connections working!
   ```

3. **If successful, proceed with migration:**
   ```bash
   node migrate-to-firestore.js migrate
   ```

## 📞 Getting Help

If you're still having issues:

1. **Check Firebase Console** for any error messages
2. **Verify your project ID** matches exactly
3. **Ensure you have the correct permissions** in the project
4. **Try creating a new Firebase project** for testing
5. **Contact Firebase support** if the issue persists

## 🔗 Useful Links

- [Firebase Console](https://console.firebase.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
