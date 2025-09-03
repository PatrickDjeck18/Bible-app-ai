import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { MoodEntry, MoodInfluence, MoodAnalytics } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export interface MoodOption {
  emoji: string;
  label: string;
  color: string;
  value: number;
}

export interface WeeklyMoodData {
  date: string;
  mood: string | null;
  rating: number | null;
  emoji: string | null;
}

export interface MoodStats {
  totalEntries: number;
  currentStreak: number;
  averageWeekly: number;
  todaysMood: MoodEntry | null;
  weeklyData: WeeklyMoodData[];
  monthlyTrend: MoodEntry[];
}

export function useMoodTracker() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const moodOptions: MoodOption[] = [
    { emoji: '😢', label: 'Sad', color: '#6B7280', value: 2 },
    { emoji: '😟', label: 'Worried', color: '#F59E0B', value: 4 },
    { emoji: '😐', label: 'Neutral', color: '#9CA3AF', value: 5 },
    { emoji: '😊', label: 'Happy', color: '#8B5CF6', value: 7 },
    { emoji: '😄', label: 'Joyful', color: '#F97316', value: 9 },
    { emoji: '😰', label: 'Anxious', color: '#EF4444', value: 3 },
    { emoji: '😌', label: 'Peaceful', color: '#10B981', value: 6 },
    { emoji: '🤩', label: 'Excited', color: '#EC4899', value: 8 },
    { emoji: '😴', label: 'Calm', color: '#06B6D4', value: 5 },
    { emoji: '😤', label: 'Stressed', color: '#DC2626', value: 4 },
  ];

  useEffect(() => {
    if (user && profile) {
      fetchMoodEntries();
    } else {
      setMoodEntries([]);
      setLoading(false);
    }
  }, [user, profile]);

  const fetchMoodEntries = async () => {
    if (!user || !profile) {
      console.log('🔴 MOOD: No user or profile found, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      console.log('🔴 MOOD: Starting fetchMoodEntries for user:', user.id, 'profile:', profile.id);
      console.log('🔴 MOOD: User object:', { id: user.id, uid: user.uid, email: user.email });
      
      // Fetch last 90 days of mood data
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const dateFilter = ninetyDaysAgo.toISOString().split('T')[0];
      
      console.log('🔴 MOOD: Fetching data from', dateFilter, 'for user_id:', profile.id);

      // First, try to fetch from mood_entries table (primary source)
      console.log('🔴 MOOD: Trying mood_entries table first');
      const { data: moodEntriesData, error: moodEntriesError } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', profile.id)
        .gte('entry_date', dateFilter)
        .order('entry_date', { ascending: false });

      console.log('🔴 MOOD: mood_entries query result:', {
        data: moodEntriesData,
        error: moodEntriesError,
        count: moodEntriesData?.length,
        profileId: profile.id
      });

      if (!moodEntriesError && moodEntriesData && moodEntriesData.length > 0) {
        setMoodEntries(moodEntriesData);
        console.log('🔴 MOOD: Final mood_entries count:', moodEntriesData.length);
      } else {
        // Fallback to daily_activities table for legacy data
        console.log('🔴 MOOD: No data in mood_entries, trying daily_activities table');
        const dailyActivitiesResult = await supabase
          .from('daily_activities')
          .select('*')
          .eq('user_id', profile.id)
          .gte('activity_date', dateFilter)
          .order('activity_date', { ascending: false });
        
        console.log('🔴 MOOD: daily_activities query result:', {
          data: dailyActivitiesResult.data,
          error: dailyActivitiesResult.error,
          count: dailyActivitiesResult.data?.length
        });
        
        if (!dailyActivitiesResult.error && dailyActivitiesResult.data && dailyActivitiesResult.data.length > 0) {
          // Convert daily_activities to mood entries
          const convertedEntries: MoodEntry[] = dailyActivitiesResult.data
            .filter(activity => {
              console.log('🔴 MOOD: Processing activity:', activity);
              return activity.mood_rating && activity.mood_rating > 0;
            })
            .map(activity => {
              const moodData = moodOptions.find(m =>
                Math.abs(m.value - activity.mood_rating) <= 1
              ) || moodOptions[2]; // Default to neutral

              const converted = {
                id: activity.id,
                user_id: activity.user_id,
                entry_date: activity.activity_date,
                mood_id: moodData.label,
                mood_type: moodData.label,
                intensity_rating: activity.mood_rating,
                emoji: moodData.emoji,
                note: null,
                created_at: activity.created_at,
                updated_at: activity.updated_at,
              };
              
              console.log('🔴 MOOD: Converted activity to mood entry:', converted);
              return converted;
            });
          
          setMoodEntries(convertedEntries);
          console.log('🔴 MOOD: Final converted entries count:', convertedEntries.length);
        } else {
          // Set empty entries if both queries fail
          setMoodEntries([]);
          console.log('🔴 MOOD: No mood data found in either table');
        }
      }
    } catch (error) {
      console.error('🔴 MOOD: Error fetching mood entries:', error);
      setMoodEntries([]);
    } finally {
      setLoading(false);
      console.log('🔴 MOOD: fetchMoodEntries completed');
    }
  };

  const saveMoodEntry = async (
    mood: string,
    rating: number,
    influences: string[],
    note: string
  ): Promise<{ data: MoodEntry | null; error: any }> => {
    console.log('saveMoodEntry called with:', { mood, rating, influences, note });
    console.log('User:', user);
    console.log('Profile:', profile);
    
    if (!user || !profile) {
      console.log('No user or profile, returning error');
      return { data: null, error: 'User not authenticated or profile not found' };
    }

    try {
      setSaving(true);
      console.log('Setting saving to true');
      
      const moodData = moodOptions.find(m => m.label === mood);
      if (!moodData) {
        console.log('Invalid mood selected:', mood);
        return { data: null, error: 'Invalid mood selected' };
      }
      console.log('Mood data found:', moodData);

      const today = new Date().toISOString().split('T')[0];
      console.log('Today:', today);

      // Check if entry already exists for today
      const existingEntry = moodEntries.find(entry => entry.entry_date === today);
      console.log('Existing entry:', existingEntry);
      
      let moodEntry: MoodEntry;
      
      if (existingEntry) {
        console.log('Updating existing entry');
        // Update existing entry
        const { data, error } = await supabase
          .from('mood_entries')
          .update({
            mood_type: mood,
            intensity_rating: rating,
            emoji: moodData.emoji,
            note: note || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingEntry.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating entry:', error);
          // Fallback to daily_activities table if mood_entries doesn't exist
          console.log('Falling back to daily_activities table for update');
          const fallbackResult = await supabase
            .from('daily_activities')
            .upsert({
              user_id: profile.id,
              activity_date: today,
              mood_rating: rating,
            }, {
              onConflict: 'user_id,activity_date'
            })
            .select()
            .single();
          
          if (fallbackResult.error) {
            console.error('Fallback update also failed:', fallbackResult.error);
            throw fallbackResult.error;
          }
          
          // Create a mock mood entry from the fallback data
          moodEntry = {
            id: fallbackResult.data.id,
            user_id: profile.id,
            entry_date: today,
            mood_id: mood,
            mood_type: mood,
            intensity_rating: rating,
            emoji: moodData.emoji,
            note: note || null,
            created_at: fallbackResult.data.created_at,
            updated_at: fallbackResult.data.updated_at,
          };
          console.log('Fallback entry updated:', moodEntry);
        } else {
          moodEntry = data;
          console.log('Entry updated:', moodEntry);
        }
      } else {
        console.log('Creating new entry');
        // Create new entry
        const { data, error } = await supabase
          .from('mood_entries')
          .insert({
            user_id: profile.id,
            entry_date: today,
            mood_type: mood,
            intensity_rating: rating,
            emoji: moodData.emoji,
            note: note || null,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating entry:', error);
          // Fallback to daily_activities table if mood_entries doesn't exist
          console.log('Falling back to daily_activities table');
          const fallbackResult = await supabase
            .from('daily_activities')
            .upsert({
              user_id: profile.id,
              activity_date: today,
              mood_rating: rating,
            }, {
              onConflict: 'user_id,activity_date'
            })
            .select()
            .single();
          
          if (fallbackResult.error) {
            console.error('Fallback also failed:', fallbackResult.error);
            throw fallbackResult.error;
          }
          
          // Create a mock mood entry from the fallback data
          moodEntry = {
            id: fallbackResult.data.id,
            user_id: profile.id,
            entry_date: today,
            mood_id: mood,
            mood_type: mood,
            intensity_rating: rating,
            emoji: moodData.emoji,
            note: note || null,
            created_at: fallbackResult.data.created_at,
            updated_at: fallbackResult.data.updated_at,
          };
          console.log('Fallback entry created:', moodEntry);
        } else {
          moodEntry = data;
          console.log('Entry created:', moodEntry);
        }
      }

      // Handle influences
      if (moodEntry) {
        console.log('Handling influences for entry:', moodEntry.id);
        
        // Delete existing influences for this entry
        const deleteResult = await supabase
          .from('mood_influences')
          .delete()
          .eq('mood_entry_id', moodEntry.id);
        
        console.log('Delete influences result:', deleteResult);

        // Insert new influences
        if (influences.length > 0) {
          console.log('Inserting influences:', influences);
          const influenceData = influences.map(influence => ({
            mood_entry_id: moodEntry.id,
            influence_name: influence,
            influence_category: getInfluenceCategory(influence),
          }));

          const { error: influenceError } = await supabase
            .from('mood_influences')
            .insert(influenceData);

          if (influenceError) {
            console.error('Error saving influences:', influenceError);
          } else {
            console.log('Influences saved successfully');
          }
        }

        // Update local state
        console.log('Updating local state');
        setMoodEntries(prev => {
          const filtered = prev.filter(e => e.entry_date !== today);
          return [moodEntry, ...filtered];
        });
      }

      console.log('Returning success:', moodEntry);
      return { data: moodEntry, error: null };
    } catch (error) {
      console.error('Error saving mood entry:', error);
      return { data: null, error };
    } finally {
      console.log('Setting saving to false');
      setSaving(false);
    }
  };

  const getInfluenceCategory = (influence: string): string => {
    const spiritual = ['Prayer Time', 'Bible Reading', 'Worship', 'Church', 'Meditation', 'Fellowship'];
    const social = ['Family', 'Friends', 'Relationships', 'Community'];
    const physical = ['Health', 'Exercise', 'Sleep', 'Nutrition'];
    const emotional = ['Gratitude', 'Achievement', 'Challenges', 'Stress', 'Anxiety'];
    const environmental = ['Weather', 'Nature', 'Travel'];
    const work = ['Work', 'School', 'Finances', 'Career'];
    
    if (spiritual.includes(influence)) return 'spiritual';
    if (social.includes(influence)) return 'social';
    if (physical.includes(influence)) return 'physical';
    if (emotional.includes(influence)) return 'emotional';
    if (environmental.includes(influence)) return 'environmental';
    if (work.includes(influence)) return 'work';
    
    return 'other';
  };

  const getTodaysMood = useCallback((): MoodEntry | null => {
    const today = new Date().toISOString().split('T')[0];
    return moodEntries.find(entry => entry.entry_date === today) || null;
  }, [moodEntries]);

  const getWeeklyMoodData = useCallback((): WeeklyMoodData[] => {
    const weekData: WeeklyMoodData[] = [];
    const today = new Date();
    
    // Get the start of the current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    
    // Get data for each day of the week (Sunday to Saturday)
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const entry = moodEntries.find(e => e.entry_date === dateString);
      weekData.push({
        date: dateString,
        mood: entry?.mood_type || null,
        rating: entry?.intensity_rating || null,
        emoji: entry?.emoji || null,
      });
    }
    
    return weekData;
  }, [moodEntries]);

  const getAverageWeeklyMood = useCallback((): number => {
    const weekData = getWeeklyMoodData();
    const validRatings = weekData.filter(d => d.rating !== null).map(d => d.rating!);
    
    console.log('🔴 MOOD CALC: Week data for average calculation:', weekData);
    console.log('🔴 MOOD CALC: Valid ratings:', validRatings);
    
    if (validRatings.length === 0) {
      console.log('🔴 MOOD CALC: No valid ratings, returning 0');
      return 0;
    }
    
    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    const average = Math.round((sum / validRatings.length) * 10) / 10;
    
    console.log('🔴 MOOD CALC: Sum:', sum, 'Count:', validRatings.length, 'Average:', average);
    return average;
  }, [getWeeklyMoodData]);

  const getCurrentStreak = useCallback((): number => {
    let streak = 0;
    const sortedEntries = [...moodEntries].sort((a, b) => 
      new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
    );

    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);

    for (const entry of sortedEntries) {
      const entryDate = currentDate.toISOString().split('T')[0];
      
      if (entry.entry_date === entryDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [moodEntries]);

  const getMonthlyTrend = useCallback((): MoodEntry[] => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return moodEntries.filter(entry => 
      new Date(entry.entry_date) >= thirtyDaysAgo
    );
  }, [moodEntries]);

  const moodStats: MoodStats = useMemo(() => {
    const stats = {
      totalEntries: moodEntries.length,
      currentStreak: getCurrentStreak(),
      averageWeekly: getAverageWeeklyMood(),
      todaysMood: getTodaysMood(),
      weeklyData: getWeeklyMoodData(),
      monthlyTrend: getMonthlyTrend(),
    };
    
    console.log('🔴 MOOD STATS: Final calculated stats:', {
      totalEntries: stats.totalEntries,
      currentStreak: stats.currentStreak,
      averageWeekly: stats.averageWeekly,
      todaysMood: stats.todaysMood?.mood_type,
      weeklyDataCount: stats.weeklyData.length,
      monthlyTrendCount: stats.monthlyTrend.length,
    });
    
    return stats;
  }, [moodEntries, getCurrentStreak, getAverageWeeklyMood, getTodaysMood, getWeeklyMoodData, getMonthlyTrend]);

  const deleteMoodEntry = async (entryId: string): Promise<{ error: any }> => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setMoodEntries(prev => prev.filter(entry => entry.id !== entryId));
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting mood entry:', error);
      return { error };
    }
  };

  const getMoodInsights = () => {
    const monthlyData = getMonthlyTrend();
    
    // Most common mood
    const moodCounts = monthlyData.reduce((acc, entry) => {
      acc[entry.mood_type] = (acc[entry.mood_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostCommonMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Neutral';
    
    // Average intensity
    const avgIntensity = monthlyData.length > 0 
      ? Math.round(monthlyData.reduce((sum, entry) => sum + entry.intensity_rating, 0) / monthlyData.length * 10) / 10
      : 0;
    
    // Mood improvement trend
    const recentEntries = monthlyData.slice(0, 7);
    const olderEntries = monthlyData.slice(-7);
    
    const recentAvg = recentEntries.length > 0 
      ? recentEntries.reduce((sum, entry) => sum + entry.intensity_rating, 0) / recentEntries.length
      : 0;
    
    const olderAvg = olderEntries.length > 0 
      ? olderEntries.reduce((sum, entry) => sum + entry.intensity_rating, 0) / olderEntries.length
      : 0;
    
    const isImproving = recentAvg > olderAvg;
    
    return {
      mostCommonMood,
      averageIntensity: avgIntensity,
      isImproving,
      improvementPercentage: olderAvg > 0 ? Math.round(((recentAvg - olderAvg) / olderAvg) * 100) : 0,
    };
  };

  return {
    moodEntries,
    moodOptions,
    loading,
    saving,
    saveMoodEntry,
    deleteMoodEntry,
    moodStats,
    getMoodInsights,
    refetch: fetchMoodEntries,
  };
}
