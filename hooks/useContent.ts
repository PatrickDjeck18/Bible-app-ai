import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  limit,
} from 'firebase/firestore';

// Define the data types for Firestore documents
export interface BibleVerse {
  id: string;
  verse: string;
  reference: string;
  is_daily_verse: boolean;
  date_featured: string;
}

export interface Devotional {
  id: string;
  title: string;
  content: string;
  views: number;
  likes: number;
  is_featured: boolean;
  featured_date: string;
}

export function useContent() {
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [featuredDevotional, setFeaturedDevotional] = useState<Devotional | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch daily verse
      const verseQuery = query(
        collection(db, 'bible_verses'),
        where('is_daily_verse', '==', true),
        where('date_featured', '==', today),
        limit(1)
      );

      const verseSnapshot = await getDocs(verseQuery);
      if (!verseSnapshot.empty) {
        const verseDoc = verseSnapshot.docs[0];
        setDailyVerse({ ...verseDoc.data(), id: verseDoc.id } as BibleVerse);
      } else {
        setDailyVerse(null);
      }

      // Fetch featured devotional
      const devotionalQuery = query(
        collection(db, 'devotionals'),
        where('is_featured', '==', true),
        where('featured_date', '==', today),
        limit(1)
      );

      const devotionalSnapshot = await getDocs(devotionalQuery);
      if (!devotionalSnapshot.empty) {
        const devotionalDoc = devotionalSnapshot.docs[0];
        setFeaturedDevotional({ ...devotionalDoc.data(), id: devotionalDoc.id } as Devotional);
      } else {
        setFeaturedDevotional(null);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const incrementDevotionalViews = useCallback(async (devotionalId: string) => {
    try {
      const devotionalRef = doc(db, 'devotionals', devotionalId);
      await updateDoc(devotionalRef, {
        views: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }, []);

  const incrementDevotionalLikes = useCallback(async (devotionalId: string) => {
    try {
      const devotionalRef = doc(db, 'devotionals', devotionalId);
      await updateDoc(devotionalRef, {
        likes: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing likes:', error);
    }
  }, []);

  return {
    dailyVerse,
    featuredDevotional,
    loading,
    incrementDevotionalViews,
    incrementDevotionalLikes,
    refetch: fetchContent,
  };
}