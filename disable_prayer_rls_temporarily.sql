-- Temporarily disable RLS on prayers table for testing
-- WARNING: This removes security restrictions - only use for testing!

-- Disable Row Level Security
ALTER TABLE public.prayers DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Users can insert own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Users can update own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Users can delete own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Allow authenticated users to manage prayers" ON public.prayers;
DROP POLICY IF EXISTS "Firebase users can view own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Firebase users can insert own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Firebase users can update own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Firebase users can delete own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Allow all operations for authenticated requests" ON public.prayers;

-- Grant all permissions to authenticated users
GRANT ALL ON public.prayers TO authenticated;

-- Verify RLS is disabled
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'prayers';

-- Show current policies (should be empty)
SELECT 
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE tablename = 'prayers';
