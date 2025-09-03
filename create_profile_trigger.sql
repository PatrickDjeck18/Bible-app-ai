-- Create trigger to automatically create profile when user signs up
-- This ensures every new user gets a profile record created automatically

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, journey_start_date)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also create a function to handle existing users who don't have profiles
-- This will create profiles for users who signed up before this trigger was added
CREATE OR REPLACE FUNCTION public.create_missing_profiles()
RETURNS void AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, journey_start_date)
  SELECT 
    au.id,
    au.raw_user_meta_data->>'full_name',
    au.email,
    CURRENT_DATE
  FROM auth.users au
  LEFT JOIN public.profiles p ON au.id = p.id
  WHERE p.id IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to create profiles for existing users
SELECT public.create_missing_profiles();
