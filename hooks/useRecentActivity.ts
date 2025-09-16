import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
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

  const fetchRecentActivities = useCallback(async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const allActivities: RecentActivity[] = [];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();

      // Helper function to fetch and transform data from a collection
      const fetchAndTransform = async (
        collectionName: string,
        transformFn: (item: any) => RecentActivity,
        orderByField = 'updated_at' 
      ) => {
        const q = query(
          collection(db, collectionName),
          where('user_id', '==', user.uid),
          where('created_at', '>=', sevenDaysAgoISO),
          orderBy(orderByField, 'desc'),
          limit(5)
        );

        try {
          const snapshot = await getDocs(q);
          snapshot.forEach(doc => {
            allActivities.push(transformFn({ id: doc.id, ...doc.data() }));
          });
        } catch (err) {
          console.error(`Error fetching from ${collectionName}:`, err);
        }
      };

      // Bible reading activities
      const bibleQuery = query(
        collection(db, 'daily_activities'),
        where('user_id', '==', user.uid),
        where('bible_reading_minutes', '>', 0),
        where('activity_date', '>=', sevenDaysAgo.toISOString().split('T')[0]),
        orderBy('bible_reading_minutes', 'desc'),
        limit(5)
      );
      const bibleSnapshot = await getDocs(bibleQuery);
      bibleSnapshot.forEach(doc => {
        const activity = doc.data();
        allActivities.push({
          id: doc.id,
          type: 'bible_reading',
          title: 'Completed Bible reading',
          description: `${activity.bible_reading_minutes} minutes`,
          timestamp: activity.updated_at,
          icon: '📖',
          color: '#3B82F6',
          route: '/(tabs)/bible',
        });
      });

      // Prayer activities
      const prayerQuery = query(
        collection(db, 'daily_activities'),
        where('user_id', '==', user.uid),
        where('prayer_minutes', '>', 0),
        where('activity_date', '>=', sevenDaysAgo.toISOString().split('T')[0]),
        orderBy('prayer_minutes', 'desc'),
        limit(5)
      );
      const prayerSnapshot = await getDocs(prayerQuery);
      prayerSnapshot.forEach(doc => {
        const activity = doc.data();
        allActivities.push({
          id: doc.id,
          type: 'prayer',
          title: 'Completed prayer session',
          description: `${activity.prayer_minutes} minutes`,
          timestamp: activity.updated_at,
          icon: '🙏',
          color: '#EF4444',
          route: '/(tabs)/prayer-tracker',
        });
      });

      // Mood activities
      // We can't query for 'not null' directly, so we'll fetch recent activities and filter
      const moodQuery = query(
        collection(db, 'daily_activities'),
        where('user_id', '==', user.uid),
        where('activity_date', '>=', sevenDaysAgo.toISOString().split('T')[0]),
        orderBy('updated_at', 'desc'),
        limit(5)
      );
      const moodSnapshot = await getDocs(moodQuery);
      moodSnapshot.forEach(doc => {
        const activity = doc.data();
        if (activity.mood_rating !== null) { // Filter on the client-side
          allActivities.push({
            id: doc.id,
            type: 'mood',
            title: 'Updated mood tracker',
            description: `Rating: ${activity.mood_rating}/10`,
            timestamp: activity.updated_at,
            icon: '😊',
            color: '#10B981',
            route: '/(tabs)/mood-tracker',
          });
        }
      });

      // Recent prayers
      await fetchAndTransform(
        'prayers',
        (prayer) => ({
          id: prayer.id,
          type: 'prayer',
          title: 'Added new prayer request',
          description: prayer.title,
          timestamp: prayer.created_at,
          icon: '🙏',
          color: '#EF4444',
          route: '/(tabs)/prayer-tracker',
        }),
        'created_at'
      );

      // Recent notes
      await fetchAndTransform(
        'notes',
        (note) => ({
          id: note.id,
          type: 'note',
          title: 'Added new note',
          description: note.title || 'Untitled note',
          timestamp: note.created_at,
          icon: '📝',
          color: '#8B5CF6',
          route: '/note-taker',
        }),
        'created_at'
      );

      // Recent dreams
      await fetchAndTransform(
        'dreams',
        (dream) => ({
          id: dream.id,
          type: 'dream',
          title: 'Added dream journal entry',
          description: dream.title || 'Dream entry',
          timestamp: dream.created_at,
          icon: '☁️',
          color: '#F59E0B',
          route: '/dream-interpretation',
        }),
        'created_at'
      );

      // Sort all activities by timestamp
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Take the most recent 3
      setActivities(allActivities.slice(0, 3));

    } catch (error) {
      console.error('Error fetching recent activities:', error);
      setActivities(getSampleActivities());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecentActivities();
  }, [user, fetchRecentActivities]);

  const getSampleActivities = (): RecentActivity[] => {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'bible_reading',
        title: 'Completed Bible reading',
        description: '15 minutes',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        icon: '📖',
        color: '#3B82F6',
        route: '/(tabs)/bible',
      },
      {
        id: '2',
        type: 'note',
        title: 'Added new note',
        description: 'Daily reflection',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        icon: '📝',
        color: '#8B5CF6',
        route: '/note-taker',
      },
      {
        id: '3',
        type: 'dream',
        title: 'Added dream journal entry',
        description: 'Spiritual dream',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        icon: '☁️',
        color: '#F59E0B',
        route: '/dream-interpretation',
      },
      {
        id: '4',
        type: 'prayer',
        title: 'Added new prayer request',
        description: 'Family health',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '🙏',
        color: '#EF4444',
        route: '/(tabs)/prayer-tracker',
      },
      {
        id: '5',
        type: 'mood',
        title: 'Updated mood tracker',
        description: 'Rating: 8/10',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        icon: '😊',
        color: '#10B981',
        route: '/(tabs)/mood-tracker',
      },
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
    refresh: fetchRecentActivities,
  };
}