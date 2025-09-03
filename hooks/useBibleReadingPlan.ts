import { useState, useEffect } from 'react';

export interface ReadingDay {
  day: number;
  reference: string;
  completed: boolean;
  date: string;
  notes?: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  currentDay: number;
  startDate: string;
  days: ReadingDay[];
  isActive: boolean;
  createdAt: number;
  lastModified: number;
}

const STORAGE_KEY = 'bible_reading_plans';

// Local storage helper functions
const getFromStorage = (key: string) => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

const setToStorage = (key: string, value: any) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error writing to storage:', error);
  }
};

// Predefined reading plans
const PREDEFINED_PLANS = [
  {
    id: 'bible-in-a-year',
    title: 'Bible in a Year',
    description: 'Read through the entire Bible in 365 days',
    totalDays: 365,
    currentDay: 0,
    startDate: '',
    days: [],
    isActive: false,
    createdAt: Date.now(),
    lastModified: Date.now(),
  },
  {
    id: 'new-testament',
    title: 'New Testament',
    description: 'Read through the New Testament in 90 days',
    totalDays: 90,
    currentDay: 0,
    startDate: '',
    days: [],
    isActive: false,
    createdAt: Date.now(),
    lastModified: Date.now(),
  },
  {
    id: 'psalms-proverbs',
    title: 'Psalms & Proverbs',
    description: 'Read through Psalms and Proverbs in 60 days',
    totalDays: 60,
    currentDay: 0,
    startDate: '',
    days: [],
    isActive: false,
    createdAt: Date.now(),
    lastModified: Date.now(),
  },
  {
    id: 'gospels',
    title: 'The Gospels',
    description: 'Read through Matthew, Mark, Luke, and John in 45 days',
    totalDays: 45,
    currentDay: 0,
    startDate: '',
    days: [],
    isActive: false,
    createdAt: Date.now(),
    lastModified: Date.now(),
  },
];

export function useBibleReadingPlan() {
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Load plans from storage on mount
  useEffect(() => {
    const loadPlans = () => {
      try {
        const storedPlans = getFromStorage(STORAGE_KEY);
        if (storedPlans && Array.isArray(storedPlans)) {
          setPlans(storedPlans);
        } else {
          // Initialize with predefined plans if no stored plans exist
          setPlans(PREDEFINED_PLANS);
        }
      } catch (error) {
        console.error('Error loading plans:', error);
        setPlans(PREDEFINED_PLANS);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  // Save plans to storage whenever they change
  useEffect(() => {
    setToStorage(STORAGE_KEY, plans);
  }, [plans]);

  const createCustomPlan = (planData: Omit<ReadingPlan, 'id' | 'createdAt' | 'lastModified'>) => {
    const newPlan: ReadingPlan = {
      ...planData,
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    setPlans(prevPlans => [...prevPlans, newPlan]);
    return newPlan;
  };

  const startPlan = (planId: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId) {
          // Deactivate all other plans
          const updatedPlan = {
            ...plan,
            isActive: true,
            startDate: today,
            currentDay: 1,
            lastModified: Date.now(),
          };
          
          // Generate reading days
          updatedPlan.days = generateReadingDays(updatedPlan);
          
          return updatedPlan;
        } else {
          return { ...plan, isActive: false };
        }
      })
    );
  };

  const generateReadingDays = (plan: ReadingPlan): ReadingDay[] => {
    const days: ReadingDay[] = [];
    const startDate = new Date(plan.startDate);
    
    for (let i = 0; i < plan.totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      days.push({
        day: i + 1,
        reference: `Day ${i + 1}`, // This would be customized based on the plan
        completed: false,
        date: currentDate.toISOString().split('T')[0],
      });
    }
    
    return days;
  };

  const completeDay = (planId: string, dayNumber: number) => {
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId) {
          const updatedDays = plan.days.map(day => {
            if (day.day === dayNumber) {
              return { ...day, completed: true };
            }
            return day;
          });
          
          const completedDays = updatedDays.filter(day => day.completed).length;
          
          return {
            ...plan,
            days: updatedDays,
            currentDay: Math.max(plan.currentDay, dayNumber + 1),
            lastModified: Date.now(),
          };
        }
        return plan;
      })
    );
  };

  const updatePlan = (planId: string, updates: Partial<ReadingPlan>) => {
    setPlans(prevPlans =>
      prevPlans.map(plan =>
        plan.id === planId
          ? { ...plan, ...updates, lastModified: Date.now() }
          : plan
      )
    );
  };

  const deletePlan = (planId: string) => {
    setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
  };

  const getActivePlan = () => {
    return plans.find(plan => plan.isActive);
  };

  const getPlanProgress = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return null;
    
    const completedDays = plan.days.filter(day => day.completed).length;
    const progress = (completedDays / plan.totalDays) * 100;
    
    return {
      completed: completedDays,
      total: plan.totalDays,
      progress,
      isOnTrack: plan.currentDay <= plan.totalDays,
    };
  };

  const resetPlan = (planId: string) => {
    setPlans(prevPlans =>
      prevPlans.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            currentDay: 0,
            startDate: '',
            isActive: false,
            days: plan.days.map(day => ({ ...day, completed: false })),
            lastModified: Date.now(),
          };
        }
        return plan;
      })
    );
  };

  const getTodayReading = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan || !plan.isActive) return null;
    
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(plan.startDate);
    const daysSinceStart = Math.floor((new Date(today).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceStart < 0 || daysSinceStart >= plan.totalDays) return null;
    
    return plan.days[daysSinceStart];
  };

  const getStreak = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan || !plan.isActive) return 0;
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(plan.startDate);
    
    for (let i = 0; i < plan.totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      if (dateStr > today) break;
      
      const day = plan.days[i];
      if (day && day.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return {
    plans,
    loading,
    createCustomPlan,
    startPlan,
    completeDay,
    updatePlan,
    deletePlan,
    getActivePlan,
    getPlanProgress,
    resetPlan,
    getTodayReading,
    getStreak,
  };
}


