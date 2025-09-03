/*
  # Fix profiles table RLS policy for user signup

  1. Security Updates
    - Drop existing restrictive INSERT policy
    - Add new policy allowing authenticated users to insert their own profile
    - Ensure users can create profiles during signup process

  2. Changes
    - Remove old "Users can insert own profile" policy if it exists
    - Add new "Allow authenticated users to insert their own profile" policy
    - Policy allows INSERT when auth.uid() matches the id being inserted
*/

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new INSERT policy that allows authenticated users to insert their own profile
CREATE POLICY "Allow authenticated users to insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);