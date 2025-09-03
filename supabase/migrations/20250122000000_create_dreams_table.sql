-- Create dreams table for Firebase authentication
-- This table works with the UUID conversion from Firebase user IDs

-- Create dreams table
CREATE TABLE IF NOT EXISTS public.dreams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- No foreign key constraint since we're using Firebase
  title text NOT NULL,
  description text NOT NULL,
  mood text,
  date timestamptz DEFAULT now(),
  interpretation text,
  biblical_insights jsonb,
  spiritual_meaning text,
  symbols jsonb,
  prayer text,
  significance text CHECK (significance IN ('low', 'medium', 'high')),
  is_analyzed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure no foreign key constraint exists (in case it was created elsewhere)
ALTER TABLE public.dreams DROP CONSTRAINT IF EXISTS dreams_user_id_fkey;

-- Enable Row Level Security
ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for Firebase authentication
-- Since we're using Firebase, we need more permissive policies
CREATE POLICY "Users can view their own dreams"
  ON public.dreams
  FOR SELECT
  TO authenticated
  USING (true); -- Allow all authenticated users to view for now

CREATE POLICY "Users can insert their own dreams"
  ON public.dreams
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow all authenticated users to insert for now

CREATE POLICY "Users can update their own dreams"
  ON public.dreams
  FOR UPDATE
  TO authenticated
  USING (true); -- Allow all authenticated users to update for now

CREATE POLICY "Users can delete their own dreams"
  ON public.dreams
  FOR DELETE
  TO authenticated
  USING (true); -- Allow all authenticated users to delete for now

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at trigger
DROP TRIGGER IF EXISTS handle_dreams_updated_at ON public.dreams;
CREATE TRIGGER handle_dreams_updated_at
  BEFORE UPDATE ON public.dreams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON public.dreams(user_id);
CREATE INDEX IF NOT EXISTS idx_dreams_date ON public.dreams(date);
CREATE INDEX IF NOT EXISTS idx_dreams_is_analyzed ON public.dreams(is_analyzed);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.dreams TO authenticated;
