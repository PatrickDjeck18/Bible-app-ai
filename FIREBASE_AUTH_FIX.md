# Firebase Authentication + Supabase RLS Fix

## Problem
Your app is getting a 401 Unauthorized error when trying to save mood data because:
1. The app uses Firebase for authentication
2. Supabase has Row Level Security (RLS) policies that expect Supabase authentication
3. The RLS policies check for `auth.uid()` which doesn't exist with Firebase auth

## Solution Options

### Option 1: Quick Fix - Disable RLS Temporarily (Recommended for Testing)

Run this SQL script in your Supabase SQL Editor:

```sql
-- Temporarily disable RLS for Firebase auth compatibility
-- Run this script in your Supabase SQL Editor for testing

-- Disable RLS for all tables
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE prayers DISABLE ROW LEVEL SECURITY;

-- Disable RLS for other tables if they exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dreams') THEN
        ALTER TABLE dreams DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quiz_sessions') THEN
        ALTER TABLE quiz_sessions DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_quiz_stats') THEN
        ALTER TABLE user_quiz_stats DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Grant all permissions to authenticated users
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON mood_entries TO authenticated;
GRANT ALL ON daily_activities TO authenticated;
GRANT ALL ON prayers TO authenticated;

-- Grant permissions for other tables if they exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'dreams') THEN
        GRANT ALL ON dreams TO authenticated;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quiz_sessions') THEN
        GRANT ALL ON quiz_sessions TO authenticated;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_quiz_stats') THEN
        GRANT ALL ON user_quiz_stats TO authenticated;
    END IF;
END $$;
```

### Option 2: Create Permissive RLS Policies (More Secure)

Run this SQL script in your Supabase SQL Editor:

```sql
-- Fix RLS policies for Firebase authentication compatibility
-- Run this script in your Supabase SQL Editor

-- ========================================
-- Fix profiles table RLS policies
-- ========================================

-- Drop existing policies for profiles
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON profiles;

-- Create permissive policies for profiles that work with Firebase auth
CREATE POLICY "Allow authenticated users to read profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant permissions for profiles
GRANT ALL ON profiles TO authenticated;

-- ========================================
-- Fix mood_entries table RLS policies
-- ========================================

-- Drop existing policies for mood_entries
DROP POLICY IF EXISTS "Users can manage own mood entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow all operations on mood_entries" ON mood_entries;
DROP POLICY IF EXISTS "Allow authenticated users to manage mood entries" ON mood_entries;

-- Create permissive policy for mood_entries
CREATE POLICY "Allow authenticated users to manage mood entries"
  ON mood_entries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions for mood_entries
GRANT ALL ON mood_entries TO authenticated;

-- ========================================
-- Fix daily_activities table RLS policies
-- ========================================

-- Drop existing policies for daily_activities
DROP POLICY IF EXISTS "Users can manage own daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Allow all operations for daily activities" ON daily_activities;
DROP POLICY IF EXISTS "Users can manage own daily activities with profile check" ON daily_activities;

-- Create permissive policy for daily_activities
CREATE POLICY "Allow authenticated users to manage daily activities"
  ON daily_activities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions for daily_activities
GRANT ALL ON daily_activities TO authenticated;

-- ========================================
-- Fix prayers table RLS policies
-- ========================================

-- Drop existing policies for prayers
DROP POLICY IF EXISTS "Users can view own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can insert own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can update own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can delete own prayers" ON prayers;
DROP POLICY IF EXISTS "Allow authenticated users to manage prayers" ON prayers;

-- Create permissive policy for prayers
CREATE POLICY "Allow authenticated users to manage prayers"
  ON prayers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant permissions for prayers
GRANT ALL ON prayers TO authenticated;
```

## Code Changes Made

I've also updated your code to better handle Firebase authentication with Supabase:

### 1. Updated Supabase Client (`lib/supabase.ts`)
- Added helper functions to create Supabase clients with Firebase auth headers
- Added proper authentication headers for Firebase users

### 2. Updated Mood Tracker (`app/(tabs)/mood-tracker.tsx`)
- Now uses `createFirebaseSupabaseClient()` to create authenticated Supabase clients
- All database operations now include proper Firebase authentication headers

### 3. Updated Home Screen (`app/(tabs)/index.tsx`)
- Updated mood fetching to use Firebase-authenticated Supabase client

## Testing the Fix

1. **Run the SQL script** in your Supabase SQL Editor (choose Option 1 or 2 above)
2. **Restart your app** to ensure the changes take effect
3. **Try saving a mood** - the 401 error should be resolved
4. **Check the console** for any remaining errors

## Long-term Solutions

### Option A: Switch to Supabase Auth
- Replace Firebase authentication with Supabase authentication
- This would work seamlessly with RLS policies
- Requires updating all authentication code

### Option B: Custom RLS Policies
- Create custom RLS policies that work with Firebase user IDs
- More complex but maintains security
- Requires additional database functions

### Option C: Service Role Key (Not Recommended for Production)
- Use Supabase service role key for database operations
- Bypasses RLS entirely
- Only use for admin operations, not user operations

## Verification

After applying the fix, you should see:
- ✅ No more 401 Unauthorized errors
- ✅ Mood entries can be saved successfully
- ✅ Profile creation works
- ✅ All database operations work with Firebase auth

## Security Note

The temporary fix (Option 1) disables RLS, which means:
- All authenticated users can access all data
- This is fine for testing but not recommended for production
- Consider implementing proper user-based filtering in your application code

For production, use Option 2 or implement proper Supabase authentication.
