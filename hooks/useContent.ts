import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { BibleVerse, Devotional } from '@/lib/supabase';

export function useContent() {
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [featuredDevotional, setFeaturedDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch daily verse
      const { data: verseData, error: verseError } = await supabase
        .from('bible_verses')
        .select('*')
        .eq('is_daily_verse', true)
        .eq('date_featured', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (verseError && verseError.code !== 'PGRST116') {
        console.error('Error fetching daily verse:', verseError);
      } else if (verseData) {
        setDailyVerse(verseData);
      }

      // Fetch featured devotional
      const { data: devotionalData, error: devotionalError } = await supabase
        .from('devotionals')
        .select('*')
        .eq('is_featured', true)
        .eq('featured_date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (devotionalError && devotionalError.code !== 'PGRST116') {
        console.error('Error fetching devotional:', devotionalError);
      } else if (devotionalData) {
        setFeaturedDevotional(devotionalData);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementDevotionalViews = async (devotionalId: string) => {
    try {
      const { error } = await supabase.rpc('increment_devotional_views', {
        devotional_id: devotionalId
      });

      if (error) {
        console.error('Error incrementing views:', error);
      }
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  };

  const incrementDevotionalLikes = async (devotionalId: string) => {
    try {
      const { error } = await supabase.rpc('increment_devotional_likes', {
        devotional_id: devotionalId
      });

      if (error) {
        console.error('Error incrementing likes:', error);
      }
    } catch (error) {
      console.error('Error incrementing likes:', error);
    }
  };

  return {
    dailyVerse,
    featuredDevotional,
    loading,
    incrementDevotionalViews,
    incrementDevotionalLikes,
    refetch: fetchContent,
  };
}