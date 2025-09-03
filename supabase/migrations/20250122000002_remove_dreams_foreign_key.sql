-- Remove foreign key constraint from dreams table
-- This is needed because we're using Firebase authentication, not Supabase auth

-- Drop the foreign key constraint
ALTER TABLE public.dreams DROP CONSTRAINT IF EXISTS dreams_user_id_fkey;

-- Verify the constraint is removed
-- The dreams table should now allow any UUID in the user_id column
