# Mood Tracker Home Page Fix Guide

## Problem Description
The mood card on the home page was showing "Avg 0.0" and "Entries 0" despite users having mood entries. This was happening because the app couldn't access the user's mood data due to Row Level Security (RLS) policy issues.

## Root Cause Analysis
1. **Authentication Mismatch**: The app uses Firebase authentication but stores data in Supabase
2. **RLS Policy Issues**: The `daily_activities` table used `auth.uid()` in RLS policies, which doesn't work with Firebase-converted UUIDs
3. **Data Access Blocked**: Users couldn't access their own mood data because the RLS policies were rejecting queries

## Files Modified

### 1. Enhanced Debugging - [`hooks/useMoodTracker.ts`](hooks/useMoodTracker.ts)
- Added comprehensive debug logging to track data fetching process
- Changed query order to prioritize `daily_activities` table (where user data likely exists)
- Improved error handling and fallback mechanisms

### 2. RLS Policy Fix - [`fix_daily_activities_rls_firebase.sql`](fix_daily_activities_rls_firebase.sql)
- Created new SQL script to fix RLS policies for Firebase authentication
- Replaced `auth.uid()` based policies with permissive policies for authenticated users

## How to Apply the Fix

### Step 1: Run the RLS Fix Script
1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of [`fix_daily_activities_rls_firebase.sql`](fix_daily_activities_rls_firebase.sql)
4. Execute the script

### Step 2: Verify the Changes
The script will:
- Drop existing restrictive RLS policies
- Create new permissive policies that work with Firebase authentication
- Grant necessary permissions to authenticated users
- Show verification results

### Step 3: Test the Application
1. Restart your React Native/Expo development server
2. Log in to the app
3. Navigate to the home page
4. The mood card should now correctly display your mood statistics

## Expected Results
After applying the fix:
- ✅ Mood entries count should show actual number of entries
- ✅ Average mood rating should be calculated correctly
- ✅ Weekly trend data should display properly
- ✅ Current streak should be accurate

## Debugging
If issues persist, check the console logs for debug messages starting with "🔴 MOOD:" to identify where the data fetching is failing.

## Technical Details
- **User ID Conversion**: Firebase UIDs are converted to UUID format using `firebaseIdToUUID()`
- **Data Tables**: The app uses both `mood_entries` and `daily_activities` tables with fallback logic
- **RLS Policies**: Must be permissive for Firebase-authenticated users to access their data

## Related Files
- [`fix_mood_entries_rls_firebase.sql`](fix_mood_entries_rls_firebase.sql) - Similar fix for mood_entries table
- [`create_daily_activities_table.sql`](create_daily_activities_table.sql) - Original table creation script
- [`lib/supabase.ts`](lib/supabase.ts) - Supabase client configuration
- [`hooks/useAuth.ts`](hooks/useAuth.ts) - Firebase authentication and user sync

## Support
If you continue to experience issues after applying this fix, check:
1. Supabase table structure matches expected schema
2. User data exists in the `daily_activities` table with `mood_rating` values
3. Firebase user ID conversion is working correctly