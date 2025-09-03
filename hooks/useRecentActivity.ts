import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface RecentActivity {
  id: string;
  type: 'bible_reading' | 'prayer' | 'mood' | 'quiz' | 'dream_journal' | 'note' | 'dream';
  title: string;
  description?: string;
  timestamp: string;
  icon: string;
  color: string;
  route: string;
}

export function useRecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentActivities();
    } else {
      setActivities([]);
      setLoading(false);
    }
  }, [user]);

  const fetchRecentActivities = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const allActivities: RecentActivity[] = [];

      // Fetch recent daily activities (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Bible reading activities
      const { data: bibleActivities } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', user.id)
        .gt('bible_reading_minutes', 0)
        .gte('activity_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('updated_at', { ascending: false })
        .limit(5);

      if (bibleActivities) {
        bibleActivities.forEach(activity => {
          allActivities.push({
            id: activity.id,
            type: 'bible_reading',
            title: 'Completed Bible reading',
            description: `${activity.bible_reading_minutes} minutes`,
            timestamp: activity.updated_at,
            icon: '📖',
            color: '#3B82F6',
            route: '/(tabs)/bible'
          });
        });
      }

      // Prayer activities
      const { data: prayerActivities } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', user.id)
        .gt('prayer_minutes', 0)
        .gte('activity_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('updated_at', { ascending: false })
        .limit(5);

      if (prayerActivities) {
        prayerActivities.forEach(activity => {
          allActivities.push({
            id: activity.id,
            type: 'prayer',
            title: 'Completed prayer session',
            description: `${activity.prayer_minutes} minutes`,
            timestamp: activity.updated_at,
            icon: '🙏',
            color: '#EF4444',
            route: '/(tabs)/prayer-tracker'
          });
        });
      }

      // Mood activities
      const { data: moodActivities } = await supabase
        .from('daily_activities')
        .select('*')
        .eq('user_id', user.id)
        .not('mood_rating', 'is', null)
        .gte('activity_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('updated_at', { ascending: false })
        .limit(5);

      if (moodActivities) {
        moodActivities.forEach(activity => {
          allActivities.push({
            id: activity.id,
            type: 'mood',
            title: 'Updated mood tracker',
            description: `Rating: ${activity.mood_rating}/10`,
            timestamp: activity.updated_at,
            icon: '😊',
            color: '#10B981',
            route: '/(tabs)/mood-tracker'
          });
        });
      }

      // Recent prayers (new prayer requests)
      const { data: recentPrayers } = await supabase
        .from('prayers')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentPrayers) {
        recentPrayers.forEach(prayer => {
          allActivities.push({
            id: prayer.id,
            type: 'prayer',
            title: 'Added new prayer request',
            description: prayer.title,
            timestamp: prayer.created_at,
            icon: '🙏',
            color: '#EF4444',
            route: '/(tabs)/prayer-tracker'
          });
        });
      }

      // Recent notes
      const { data: recentNotes } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentNotes) {
        recentNotes.forEach(note => {
          allActivities.push({
            id: note.id,
            type: 'note',
            title: 'Added new note',
            description: note.title || 'Untitled note',
            timestamp: note.created_at,
            icon: '📝',
            color: '#8B5CF6',
            route: '/note-taker'
          });
        });
      }

      // Recent dreams
      const { data: recentDreams } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentDreams) {
        recentDreams.forEach(dream => {
          allActivities.push({
            id: dream.id,
            type: 'dream',
            title: 'Added dream journal entry',
            description: dream.title || 'Dream entry',
            timestamp: dream.created_at,
            icon: '☁️',
            color: '#F59E0B',
            route: '/dream-interpretation'
          });
        });
      }

      // Sort all activities by timestamp (most recent first)
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Take the most recent 3 activities
      setActivities(allActivities.slice(0, 3));

    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Fallback to sample data if there's an error
      setActivities(getSampleActivities());
    } finally {
      setLoading(false);
    }
  };

  const getSampleActivities = (): RecentActivity[] => {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'bible_reading',
        title: 'Completed Bible reading',
        description: '15 minutes',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        icon: '📖',
        color: '#3B82F6',
        route: '/(tabs)/bible'
      },
      {
        id: '2',
        type: 'note',
        title: 'Added new note',
        description: 'Daily reflection',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        icon: '📝',
        color: '#8B5CF6',
        route: '/note-taker'
      },
      {
        id: '3',
        type: 'dream',
        title: 'Added dream journal entry',
        description: 'Spiritual dream',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        icon: '☁️',
        color: '#F59E0B',
        route: '/dream-interpretation'
      },
      {
        id: '4',
        type: 'prayer',
        title: 'Added new prayer request',
        description: 'Family health',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        icon: '🙏',
        color: '#EF4444',
        route: '/(tabs)/prayer-tracker'
      },
      {
        id: '5',
        type: 'mood',
        title: 'Updated mood tracker',
        description: 'Rating: 8/10',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        icon: '😊',
        color: '#10B981',
        route: '/(tabs)/mood-tracker'
      }
    ];
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMs = now.getTime() - activityTime.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return activityTime.toLocaleDateString();
    }
  };

  return {
    activities,
    loading,
    formatTimeAgo,
    refresh: fetchRecentActivities
  };
}

