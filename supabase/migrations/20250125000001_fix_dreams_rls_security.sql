/*
  # Fix Dreams Table RLS Security Issue

  This migration fixes the critical security vulnerability where dream interpretation 
  results were visible to all authenticated users instead of only the owner.

  Problem:
  - Current policies use `USING (true)` and `WITH CHECK (true)` 
  - This allows all authenticated users to see, modify, and delete any user's dreams
  - This is a major privacy and security issue

  Solution:
  - Replace permissive policies with proper user-specific policies
  - Ensure users can only access their own dreams
  - Maintain proper authentication checks
*/

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can view their own dreams" ON public.dreams;
DROP POLICY IF EXISTS "Users can insert their own dreams" ON public.dreams;
DROP POLICY IF EXISTS "Users can update their own dreams" ON public.dreams;
DROP POLICY IF EXISTS "Users can delete their own dreams" ON public.dreams;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.dreams;
DROP POLICY IF EXISTS "Allow authenticated users to manage dreams" ON public.dreams;

-- Create secure RLS policies that restrict access to owner only
CREATE POLICY "Users can view only their own dreams"
  ON public.dreams
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert only their own dreams"
  ON public.dreams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update only their own dreams"
  ON public.dreams
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete only their own dreams"
  ON public.dreams
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled (it should already be, but let's be explicit)
ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON public.dreams(user_id);
CREATE INDEX IF NOT EXISTS idx_dreams_created_at ON public.dreams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dreams_is_analyzed ON public.dreams(is_analyzed) WHERE is_analyzed = true;

-- Verify the policies are correctly applied
-- This query will show all policies on the dreams table
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'dreams' 
  AND schemaname = 'public'
ORDER BY policyname;

-- Add comment for documentation
COMMENT ON TABLE public.dreams IS 'User dreams and interpretations - RLS enabled to ensure users can only access their own dreams';
