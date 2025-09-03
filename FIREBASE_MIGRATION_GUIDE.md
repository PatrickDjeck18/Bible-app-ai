# Firebase Database Migration Guide

This guide will help you migrate your Bible app from Supabase to Firebase Firestore.

## 🎯 **Overview**

Your app currently uses:
- **Firebase Authentication** for user management
- **Supabase** (PostgreSQL) for the database
- **Hybrid setup** with authentication and database separation

After migration, you'll have:
- **Firebase Authentication** for user management
- **Firebase Firestore** for the database
- **Unified Firebase ecosystem** for better integration

## 📋 **Prerequisites**

1. **Firebase Project Setup**
   - Ensure your Firebase project is properly configured
   - Enable Firestore Database in Firebase Console
   - Set up Firestore security rules

2. **Dependencies**
   - Firebase SDK is already installed
   - Firebase Admin SDK is installed for migration

3. **Data Backup**
   - Export your Supabase data as backup
   - Verify all data is accessible

## 🔧 **Step 1: Enable Firestore Database**

### 1.1 Enable Firestore in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`daily-bread-88f42`)
3. Navigate to **Firestore Database** in the left sidebar
4. Click **Create Database**
5. Choose **Start in test mode** (we'll update security rules later)
6. Select a location (choose the closest to your users)

### 1.2 Set Up Firestore Security Rules
Replace the default rules with:

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

## 🔧 **Step 2: Run the Migration**

### 2.1 Access the Migration UI
1. **Add the migration component to your app** (temporarily)
2. **Navigate to the migration screen**
3. **Test Firebase connection** first
4. **Start the migration process**

### 2.2 Migration Process
The migration will:
1. **Connect to both Supabase and Firebase**
2. **Read all data from Supabase tables**
3. **Transform data to Firestore format**
4. **Write data to Firestore collections**
5. **Verify migration success**

### 2.3 Migration Tables
The following data will be migrated:
- ✅ **Profiles** - User profile information
- ✅ **Daily Activities** - Spiritual activity tracking
- ✅ **Mood Entries** - Mood tracking data
- ✅ **Prayers** - Prayer requests and tracking
- ✅ **Dreams** - Dream journal entries
- ✅ **Quiz Sessions** - Bible quiz results
- ✅ **User Quiz Stats** - Quiz performance statistics

## 🔧 **Step 3: Update Your App Code**

### 3.1 Replace Supabase Imports
Replace Supabase imports with Firebase imports:

```typescript
// OLD: Supabase imports
import { supabase } from '../lib/supabase';
import { createFirebaseSupabaseClient } from '../lib/supabase';

// NEW: Firebase imports
import { DatabaseService } from '../lib/services/databaseService';
import { FirestoreService } from '../lib/firestore';
```

### 3.2 Update Database Calls
Replace Supabase calls with Firebase calls:

```typescript
// OLD: Supabase calls
const { data, error } = await supabase
  .from('mood_entries')
  .select('*')
  .eq('user_id', userId);

// NEW: Firebase calls
const moodEntries = await DatabaseService.getMoodEntries();
```

### 3.3 Update Error Handling
Firebase error handling is different:

```typescript
// OLD: Supabase error handling
if (error) {
  console.error('Supabase error:', error);
  return;
}

// NEW: Firebase error handling
try {
  const data = await DatabaseService.getMoodEntries();
  // Handle success
} catch (error) {
  console.error('Firebase error:', error);
  // Handle error
}
```

## 🔧 **Step 4: Test the Migration**

### 4.1 Verify Data Migration
1. **Check migration results** in the UI
2. **Compare record counts** between Supabase and Firestore
3. **Test data integrity** by accessing migrated data
4. **Verify relationships** between collections

### 4.2 Test App Functionality
1. **Test user authentication** (should work unchanged)
2. **Test data creation** (mood entries, prayers, etc.)
3. **Test data reading** (profile, activities, etc.)
4. **Test data updates** (editing entries)
5. **Test data deletion** (removing entries)

### 4.3 Performance Testing
1. **Test query performance** for large datasets
2. **Test real-time updates** (if using)
3. **Test offline functionality** (Firestore supports offline)
4. **Test concurrent access** (multiple users)

## 🔧 **Step 5: Clean Up**

### 5.1 Remove Supabase Dependencies
After successful migration and testing:

```bash
# Remove Supabase dependencies
npm uninstall @supabase/supabase-js
```

### 5.2 Update Environment Variables
Remove Supabase environment variables:

```env
# Remove these from your .env file
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

### 5.3 Remove Supabase Files
Delete or archive Supabase-related files:
- `lib/supabase.ts`
- `databaseMigration.ts` (after migration)
- `DatabaseMigration.tsx` (after migration)
- SQL migration files

## 🔧 **Step 6: Production Deployment**

### 6.1 Update Firestore Security Rules
For production, use stricter security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data - only owner can access
    match /{collection}/{document} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
    
    // Public data - read-only for authenticated users
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

### 6.2 Set Up Monitoring
1. **Enable Firebase Analytics** for app usage tracking
2. **Set up Firestore monitoring** for database performance
3. **Configure error reporting** for debugging
4. **Set up alerts** for unusual activity

### 6.3 Backup Strategy
1. **Regular Firestore exports** to Cloud Storage
2. **Automated backup scheduling**
3. **Cross-region replication** (if needed)
4. **Point-in-time recovery** setup

## 🚨 **Important Considerations**

### Data Consistency
- **Firestore is eventually consistent** (not strongly consistent like PostgreSQL)
- **Queries may return slightly stale data** in some cases
- **Use transactions** for critical operations requiring consistency

### Cost Optimization
- **Firestore pricing** is based on reads, writes, and storage
- **Optimize queries** to minimize read operations
- **Use pagination** for large datasets
- **Consider caching** frequently accessed data

### Performance
- **Firestore queries** are optimized for specific patterns
- **Composite indexes** may be needed for complex queries
- **Real-time listeners** consume more resources
- **Batch operations** are more efficient than individual operations

## 🔍 **Troubleshooting**

### Common Issues

1. **"Permission denied" errors**
   - Check Firestore security rules
   - Verify user authentication
   - Ensure user ID matches document user_id

2. **"Missing or insufficient permissions"**
   - Update security rules
   - Check Firebase project configuration
   - Verify API key permissions

3. **"Quota exceeded" errors**
   - Check Firestore usage limits
   - Optimize query patterns
   - Consider upgrading Firebase plan

4. **"Network error"**
   - Check internet connection
   - Verify Firebase project status
   - Check firewall settings

### Migration Issues

1. **Partial migration**
   - Check for data type mismatches
   - Verify all required fields are present
   - Re-run migration for failed records

2. **Duplicate data**
   - Check for existing records before creating
   - Use unique identifiers
   - Implement deduplication logic

3. **Data corruption**
   - Verify source data integrity
   - Check data transformation logic
   - Re-run migration from backup

## 📞 **Support**

If you encounter issues during migration:

1. **Check Firebase documentation** for specific error messages
2. **Review Firestore security rules** for permission issues
3. **Test with smaller datasets** first
4. **Contact Firebase support** for technical issues
5. **Check migration logs** for detailed error information

## ✅ **Migration Checklist**

- [ ] Firebase project configured
- [ ] Firestore database enabled
- [ ] Security rules configured
- [ ] Migration service created
- [ ] Data migration completed
- [ ] Migration verification passed
- [ ] App code updated
- [ ] Functionality tested
- [ ] Performance verified
- [ ] Supabase dependencies removed
- [ ] Production security rules applied
- [ ] Monitoring configured
- [ ] Backup strategy implemented

---

**Congratulations!** 🎉 You've successfully migrated your Bible app from Supabase to Firebase Firestore. Your app now uses a unified Firebase ecosystem for both authentication and database operations.
