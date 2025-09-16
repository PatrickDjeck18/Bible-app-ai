// src/hooks/usePrayers.js

import { useEffect, useState } from 'react';
import { db, auth } from '../lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import { useAuth } from './useAuth';

// ➡️ Step 1: Define the Prayer interface based on your data structure
// @/lib/types.ts

export interface Prayer {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: 'active' | 'answered' | 'paused' | 'archived';
  category: 'personal' | 'family' | 'health' | 'work' | 'spiritual' | 'community' | 'world' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
  is_shared: boolean;
  is_community: boolean;
  answered_at: string | null;
  answered_notes: string | null;
  prayer_notes: string | null;
  gratitude_notes: string | null;
  reminder_time: string | null;
  reminder_frequency: 'daily' | 'weekly' | 'monthly' | 'custom' | null;
  last_prayed_at: string | null;
  prayer_count: number;
  answered_prayer_count: number;
  created_at: string;
  updated_at: string;
}

export function usePrayers() {
  const { user } = useAuth();
  // ➡️ Step 2: Explicitly define the state type
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayers = async () => {
    if (!user) {
      setPrayers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, 'prayers'),
        where('user_id', '==', user.uid),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedPrayers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Prayer[]; // ➡️ Add a type assertion
      setPrayers(fetchedPrayers);
    } catch (e: any) {
      console.error('🔴 Error fetching prayers:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [user]);

  const addPrayer = async (prayerData: Omit<Prayer, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      return { error: 'No user logged in' };
    }

    try {
      const prayerWithUser = {
        ...prayerData,
        user_id: user.uid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        prayer_count: 0,
        answered_prayer_count: 0,
      };

      const docRef = await addDoc(collection(db, 'prayers'), prayerWithUser);
      console.log('Document written with ID: ', docRef.id);

      const newPrayer: Prayer = { id: docRef.id, ...prayerWithUser } as Prayer;
      setPrayers(prev => [newPrayer, ...prev]);
      return { data: newPrayer, error: null };
    } catch (e: any) {
      console.error('Error adding document: ', e);
      return { error: e.message };
    }
  };

  const updatePrayer = async (id: string, updates: Partial<Prayer>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const prayerRef = doc(db, 'prayers', id);
      await updateDoc(prayerRef, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      const updatedPrayer = {
        id,
        ...prayers.find(p => p.id === id),
        ...updates,
        updated_at: new Date().toISOString(),
      } as Prayer; // ➡️ Add a type assertion
      setPrayers(prev => prev.map(p => p.id === id ? updatedPrayer : p));
      return { data: updatedPrayer, error: null };
    } catch (e: any) {
      console.error('Error updating prayer:', e);
      return { error: e.message };
    }
  };

  const deletePrayer = async (id: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      await deleteDoc(doc(db, 'prayers', id));
      setPrayers(prev => prev.filter(p => p.id !== id));
      return { error: null };
    } catch (e: any) {
      console.error('Error deleting prayer:', e);
      return { error: e.message };
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
        updated_at: new Date().toISOString(),
      };

      const prayerRef = doc(db, 'prayers', id);
      await updateDoc(prayerRef, updates);

      const updatedPrayer: Prayer = { ...prayer, ...updates };
      setPrayers(prev => prev.map(p => p.id === id ? updatedPrayer : p));
      return { data: updatedPrayer, error: null };
    } catch (e: any) {
      console.error('Error marking prayer as prayed:', e);
      return { error: e.message };
    }
  };

  const markPrayerAsAnswered = async (id: string, answeredNotes: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const prayer = prayers.find(p => p.id === id);
      if (!prayer) return { error: 'Prayer not found' };

      const updates = {
        status: 'answered' as const,
        answered_at: new Date().toISOString(),
        answered_notes: answeredNotes || null,
        answered_prayer_count: (prayer.answered_prayer_count || 0) + 1,
        updated_at: new Date().toISOString(),
      };

      const prayerRef = doc(db, 'prayers', id);
      await updateDoc(prayerRef, updates);

      const updatedPrayer: Prayer = { ...prayer, ...updates };
      setPrayers(prev => prev.map(p => p.id === id ? updatedPrayer : p));
      return { data: updatedPrayer, error: null };
    } catch (e: any) {
      console.error('Error marking prayer as answered:', e);
      return { error: e.message };
    }
  };

  const getActivePrayers = () => prayers.filter(p => p.status === 'active');
  const getAnsweredPrayers = () => prayers.filter(p => p.status === 'answered');
  const getPausedPrayers = () => prayers.filter(p => p.status === 'paused');
  const getArchivedPrayers = () => prayers.filter(p => p.status === 'archived');
  const getPrayersByCategory = (category: Prayer['category']) => prayers.filter(p => p.category === category);
  const getPrayersByPriority = (priority: Prayer['priority']) => prayers.filter(p => p.priority === priority);
  const getPrayersByFrequency = (frequency: Prayer['frequency']) => prayers.filter(p => p.frequency === frequency);

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

  const calculateCurrentStreak = () => {
    if (prayers.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const hasActivity = prayers.some(prayer => {
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
    error,
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