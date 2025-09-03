/*
  # Create automatic profile creation trigger

  1. Function
    - `handle_new_user()` - Creates profile automatically when user signs up
    
  2. Trigger
    - Triggers on INSERT to auth.users table
    - Automatically creates profile record with user data
    
  3. Security
    - Uses SECURITY DEFINER to bypass RLS during profile creation
    - Ensures profile is created with correct user ID
*/

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();