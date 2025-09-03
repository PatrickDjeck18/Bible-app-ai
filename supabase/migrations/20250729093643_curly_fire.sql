/*
  # Add RPC functions for incrementing counters

  1. Functions
    - increment_devotional_views: Safely increment view count
    - increment_devotional_likes: Safely increment like count
*/

-- Function to increment devotional views
CREATE OR REPLACE FUNCTION increment_devotional_views(devotional_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE devotionals 
  SET views_count = views_count + 1 
  WHERE id = devotional_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment devotional likes
CREATE OR REPLACE FUNCTION increment_devotional_likes(devotional_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE devotionals 
  SET likes_count = likes_count + 1 
  WHERE id = devotional_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;