# Firestore Security Rules Setup

## Step 1: Access Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`daily-bread-88f42`)
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab

## Step 2: Replace Default Rules

Replace the default rules with these permissive rules for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for testing
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Step 3: Publish Rules

1. Click "Publish" to save the rules
2. Wait for the rules to be deployed (usually takes a few seconds)

## Step 4: Test Connection

After setting up the rules, run the test script again:

```bash
node test-firestore.js
```

## Step 5: Production Rules (After Migration)

Once migration is complete, update to secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /profiles/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    match /daily_activities/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    match /mood_entries/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    match /prayers/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    match /dreams/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    match /quiz_sessions/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    match /user_quiz_stats/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.user_id;
    }
    
    // Public data (read-only for authenticated users)
    match /bible_verses/{document} {
      allow read: if request.auth != null;
    }
    
    match /devotionals/{document} {
      allow read: if request.auth != null;
    }
    
    match /quiz_questions/{document} {
      allow read: if request.auth != null;
    }
  }
}
```

## Important Notes

- **Test Mode**: The initial rules allow all operations for testing
- **Security**: Update to production rules after migration is complete
- **Authentication**: Production rules require user authentication
- **User ID Matching**: Rules ensure users can only access their own data
