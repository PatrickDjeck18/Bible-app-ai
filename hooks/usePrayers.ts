import { useEffect, useState } from 'react';
import { supabase, createFirebaseSupabaseClient } from '@/lib/supabase';
import type { Prayer } from '@/lib/supabase';
import { useAuth } from './useAuth';

export function usePrayers() {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPrayers();
    } else {
      setPrayers([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPrayers = async () => {
    if (!user) return;

    try {
      console.log('🔴 Fetching prayers for user:', user.id);
      
      // Create a Supabase client with Firebase auth headers
      const firebaseSupabase = createFirebaseSupabaseClient(user);
      
      const { data, error } = await firebaseSupabase
        .from('prayers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🔴 Error fetching prayers:', error);
        return;
      }

      console.log('🔴 Prayers fetched successfully:', data?.length || 0, 'prayers');
      console.log('🔴 Sample prayer data:', data?.[0]);
      setPrayers(data || []);
    } catch (error) {
      console.error('🔴 Error fetching prayers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPrayer = async (prayer: Omit<Prayer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Create a Supabase client with Firebase auth headers
      const firebaseSupabase = createFirebaseSupabaseClient(user);
      
      const { data, error } = await firebaseSupabase
        .from('prayers')
        .insert({
          ...prayer,
          user_id: user.id,
          prayer_count: 0,
          answered_prayer_count: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding prayer:', error);
        return { error };
      }

      setPrayers(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      console.error('Error adding prayer:', error);
      return { error };
    }
  };

  const updatePrayer = async (id: string, updates: Partial<Prayer>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Create a Supabase client with Firebase auth headers
      const firebaseSupabase = createFirebaseSupabaseClient(user);
      
      const { data, error } = await firebaseSupabase
        .from('prayers')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating prayer:', error);
        return { error };
      }

      setPrayers(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (error) {
      console.error('Error updating prayer:', error);
      return { error };
    }
  };

  const deletePrayer = async (id: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      // Create a Supabase client with Firebase auth headers
      const firebaseSupabase = createFirebaseSupabaseClient(user);
      
      const { error } = await firebaseSupabase
        .from('prayers')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting prayer:', error);
        return { error };
      }

      setPrayers(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (error) {
      console.error('Error deleting prayer:', error);
      return { error };
    }
  };

  const markPrayerAsPrayed = async (id: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const prayer = prayers.find(p => p.id === id);
      if (!prayer) return { error: 'Prayer not found' };

      const updates = {
        last_prayed_at: new Date().toISOString(),
        prayer_count: (prayer.prayer_count || 0) + 1,
      };

      // Create a Supabase client with Firebase auth headers
      const firebaseSupabase = createFirebaseSupabaseClient(user);
      
      const { data, error } = await firebaseSupabase
        .from('prayers')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error marking prayer as prayed:', error);
        return { error };
      }

      setPrayers(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (error) {
      console.error('Error marking prayer as prayed:', error);
      return { error };
    }
  };

  const markPrayerAsAnswered = async (id: string, answeredNotes?: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const updates = {
        status: 'answered' as const,
        answered_at: new Date().toISOString(),
        answered_notes: answeredNotes || null,
        answered_prayer_count: 1,
      };

      // Create a Supabase client with Firebase auth headers
      const firebaseSupabase = createFirebaseSupabaseClient(user);
      
      const { data, error } = await firebaseSupabase
        .from('prayers')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error marking prayer as answered:', error);
        return { error };
      }

      setPrayers(prev => prev.map(p => p.id === id ? data : p));
      return { data, error: null };
    } catch (error) {
      console.error('Error marking prayer as answered:', error);
      return { error };
    }
  };

  // Enhanced filtering and analytics
  const getActivePrayers = () => {
    const active = prayers.filter(p => p.status === 'active');
    return active;
  };
  const getAnsweredPrayers = () => {
    const answered = prayers.filter(p => p.status === 'answered');
    return answered;
  };
  const getPausedPrayers = () => prayers.filter(p => p.status === 'paused');
  const getArchivedPrayers = () => prayers.filter(p => p.status === 'archived');
  
  const getPrayersByCategory = (category: Prayer['category']) => 
    prayers.filter(p => p.category === category);
  
  const getPrayersByPriority = (priority: Prayer['priority']) => 
    prayers.filter(p => p.priority === priority);
  
  const getPrayersByFrequency = (frequency: Prayer['frequency']) => 
    prayers.filter(p => p.frequency === frequency);

  const getThisWeekPrayers = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return prayers.filter(p => new Date(p.created_at) >= weekAgo);
  };

  const getTodayPrayers = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return prayers.filter(p => {
      const prayerDate = new Date(p.created_at);
      prayerDate.setHours(0, 0, 0, 0);
      return prayerDate.getTime() === today.getTime();
    });
  };

  const getOverduePrayers = () => {
    const now = new Date();
    return prayers.filter(p => {
      if (p.status !== 'active' || !p.reminder_time) return false;
      
      const lastPrayed = p.last_prayed_at ? new Date(p.last_prayed_at) : new Date(p.created_at);
      const daysSinceLastPrayed = Math.floor((now.getTime() - lastPrayed.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (p.frequency) {
        case 'daily': return daysSinceLastPrayed >= 1;
        case 'weekly': return daysSinceLastPrayed >= 7;
        case 'monthly': return daysSinceLastPrayed >= 30;
        default: return false;
      }
    });
  };

  // Analytics
  const getPrayerStats = () => {
    const total = prayers.length;
    const active = getActivePrayers().length;
    const answered = getAnsweredPrayers().length;
    const paused = getPausedPrayers().length;
    const archived = getArchivedPrayers().length;
    
    const totalPrayerCount = prayers.reduce((sum, p) => sum + (p.prayer_count || 0), 0);
    const totalAnsweredCount = prayers.reduce((sum, p) => sum + (p.answered_prayer_count || 0), 0);
    
    const categoryStats = prayers.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const priorityStats = prayers.reduce((acc, p) => {
      acc[p.priority] = (acc[p.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate current prayer streak
    const currentStreak = calculateCurrentStreak();

    return {
      total,
      active,
      answered,
      paused,
      archived,
      totalPrayerCount,
      totalAnsweredCount,
      categoryStats,
      priorityStats,
      answerRate: total > 0 ? (answered / total) * 100 : 0,
      currentStreak,
    };
  };

  // Calculate current prayer streak
  const calculateCurrentStreak = () => {
    if (prayers.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check if there's any prayer activity on this date
      const hasActivity = prayers.some(prayer => {
        // Check if prayer was created, prayed, or answered on this date
        const createdDate = prayer.created_at.split('T')[0];
        const prayedDate = prayer.last_prayed_at?.split('T')[0];
        const answeredDate = prayer.answered_at?.split('T')[0];
        
        return createdDate === dateStr || prayedDate === dateStr || answeredDate === dateStr;
      });
      
      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getPrayerTrends = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const dailyStats = last30Days.map(date => {
      const dayPrayers = prayers.filter(p => 
        p.created_at.startsWith(date) || 
        (p.last_prayed_at && p.last_prayed_at.startsWith(date))
      );
      
      return {
        date,
        newPrayers: prayers.filter(p => p.created_at.startsWith(date)).length,
        prayedCount: dayPrayers.reduce((sum, p) => sum + (p.prayer_count || 0), 0),
        answeredCount: prayers.filter(p => p.answered_at && p.answered_at.startsWith(date)).length,
      };
    });

    return dailyStats;
  };

  return {
    prayers,
    loading,
    addPrayer,
    updatePrayer,
    deletePrayer,
    markPrayerAsPrayed,
    markPrayerAsAnswered,
    getActivePrayers,
    getAnsweredPrayers,
    getPausedPrayers,
    getArchivedPrayers,
    getPrayersByCategory,
    getPrayersByPriority,
    getPrayersByFrequency,
    getThisWeekPrayers,
    getTodayPrayers,
    getOverduePrayers,
    getPrayerStats,
    getPrayerTrends,
    refetch: fetchPrayers,
  };
}