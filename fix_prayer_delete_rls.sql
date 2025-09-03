-- Fix Prayer Delete Functionality
-- Run this SQL in your Supabase SQL Editor to enable proper delete functionality

-- First, ensure the prayers table exists with proper structure
CREATE TABLE IF NOT EXISTS public.prayers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'personal',
    priority TEXT NOT NULL DEFAULT 'medium',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'answered', 'paused')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    answered_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.prayers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Users can insert own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Users can update own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Users can delete own prayers" ON public.prayers;
DROP POLICY IF EXISTS "Allow authenticated users to manage prayers" ON public.prayers;

-- Create proper RLS policies for Firebase Auth
CREATE POLICY "Users can view own prayers" ON public.prayers
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own prayers" ON public.prayers
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own prayers" ON public.prayers
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own prayers" ON public.prayers
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS handle_prayers_updated_at ON public.prayers;

-- Create the trigger
CREATE TRIGGER handle_prayers_updated_at
    BEFORE UPDATE ON public.prayers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.prayers TO authenticated;

-- Verify the policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'prayers';

-- Test query to verify RLS is working
-- This should return true if the user is authenticated
SELECT 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'prayers';

