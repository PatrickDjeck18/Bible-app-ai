import React, { useEffect, useRef, useState } from 'react';
import { ExtendedUser } from '@/hooks/useAuth';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  Animated,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import { router } from 'expo-router';
import { Colors, Shadows, BorderRadius, Spacing, Typography } from '@/constants/DesignTokens';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  Bell,
  User,
  Heart,
  Clock,
  MessageCircle,
  Smile,
  Cloud,
  Bot,
  Eye,
  ThumbsUp,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  Target,
  Zap,
  BookOpen,
  BarChart3,
  ArrowRight,
  Book,
  Plus,
  MoreHorizontal,
  FileText,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useDailyActivity } from '@/hooks/useDailyActivity';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { usePrayers } from '@/hooks/usePrayers';
import { useBibleAPI } from '../../hooks/useBibleAPI';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import MoodTrackerCard from '@/components/MoodTrackerCard';
import { useRecentActivity } from '@/hooks/useRecentActivity';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase, createFirebaseSupabaseClient } from '@/lib/supabase';
import BackgroundGradient from '@/components/BackgroundGradient';




const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Mood data from mood tracker
const moodCategories = {
  positive: {
    title: 'Positive',
    icon: '✨',
    moods: [
      { id: 'positive_001_blessed', label: '🙏 Blessed', color: '#FFD700', gradient: ['#FFD700', '#FFA500', '#FF8C00'] as const },
      { id: 'positive_002_happy', label: '😊 Happy', color: '#10B981', gradient: ['#10B981', '#059669', '#047857'] as const },
      { id: 'positive_003_joyful', label: '😄 Joyful', color: '#22C55E', gradient: ['#22C55E', '#16A34A', '#15803D'] as const },
      { id: 'positive_004_grateful', label: '🙏 Grateful', color: '#84CC16', gradient: ['#84CC16', '#65A30D', '#4D7C0F'] as const },
      { id: 'positive_005_excited', label: '🤩 Excited', color: '#F59E0B', gradient: ['#F59E0B', '#D97706', '#B45309'] as const },
      { id: 'positive_006_loved', label: '💕 Loved', color: '#EC4899', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
      { id: 'positive_007_proud', label: '🏆 Proud', color: '#10B981', gradient: ['#10B981', '#059669', '#047857'] as const },
    ]
  },
  calm: {
    title: 'Calm',
    icon: '🧘',
    moods: [
      { id: 'calm_001_peaceful', label: '😇 Peaceful', color: '#06B6D4', gradient: ['#06B6D4', '#0891B2', '#0E7490'] as const },
      { id: 'calm_002_calm', label: '😌 Calm', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB', '#1D4ED8'] as const },
      { id: 'calm_003_content', label: '😊 Content', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
      { id: 'calm_004_prayerful', label: '🙏 Prayerful', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
    ]
  },
  energetic: {
    title: 'Energetic',
    icon: '⚡',
    moods: [
      { id: 'energetic_001_motivated', label: '💪 Motivated', color: '#10B981', gradient: ['#10B981', '#059669', '#047857'] as const },
      { id: 'energetic_002_focused', label: '🎯 Focused', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB', '#1D4ED8'] as const },
      { id: 'energetic_003_creative', label: '🎨 Creative', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
      { id: 'energetic_004_inspired', label: '✨ Inspired', color: '#EC4899', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
      { id: 'energetic_005_accomplished', label: '🎉 Accomplished', color: '#22C55E', gradient: ['#22C55E', '#16A34A', '#15803D'] as const },
    ]
  },
  challenging: {
    title: 'Challenging',
    icon: '💭',
    moods: [
      { id: 'challenging_001_sad', label: '😔 Sad', color: '#6B7280', gradient: ['#6B7280', '#4B5563', '#374151'] as const },
      { id: 'challenging_002_anxious', label: '😰 Anxious', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
      { id: 'challenging_003_stressed', label: '😓 Stressed', color: '#EC4899', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
      { id: 'challenging_004_angry', label: '😠 Angry', color: '#EF4444', gradient: ['#EF4444', '#DC2626', '#B91C1C'] as const },
      { id: 'challenging_005_frustrated', label: '😤 Frustrated', color: '#F97316', gradient: ['#F97316', '#EA580C', '#C2410C'] as const },
      { id: 'challenging_006_tired', label: '😴 Tired', color: '#A855F7', gradient: ['#A855F7', '#9333EA', '#7C3AED'] as const },
      { id: 'challenging_007_lonely', label: '🥺 Lonely', color: '#6B7280', gradient: ['#6B7280', '#4B5563', '#374151'] as const },
      { id: 'challenging_008_confused', label: '😕 Confused', color: '#F59E0B', gradient: ['#F59E0B', '#D97706', '#B45309'] as const },
    ]
  },
  curious: {
    title: 'Curious',
    icon: '🤔',
    moods: [
      { id: 'curious_001_curious', label: '🤔 Curious', color: '#14B8A6', gradient: ['#14B8A6', '#0D9488', '#0F766E'] as const },
      { id: 'curious_002_surprised', label: '😲 Surprised', color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B', '#D97706'] as const },
      { id: 'curious_003_hopeful', label: '🌟 Hopeful', color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B', '#D97706'] as const },
    ]
  },
  spiritual: {
    title: 'Spiritual',
    icon: '🕊️',
    moods: [
      { id: 'spiritual_001_inspired', label: '✨ Inspired', color: '#A78BFA', gradient: ['#A78BFA', '#8B5CF6', '#7C3AED'] as const },
      { id: 'spiritual_002_connected', label: '🔗 Connected', color: '#6EE7B7', gradient: ['#6EE7B7', '#34D399', '#10B981'] as const },
      { id: 'spiritual_003_faithful', label: '✝️ Faithful', color: '#F472B6', gradient: ['#F472B6', '#EC4899', '#DB2777'] as const },
    ]
  },
  health: {
    title: 'Health',
    icon: '💪',
    moods: [
      { id: 'health_001_healthy', label: '🍎 Healthy', color: '#6EE7B7', gradient: ['#6EE7B7', '#34D399', '#10B981'] as const },
      { id: 'health_002_rested', label: '😴 Rested', color: '#A78BFA', gradient: ['#A78BFA', '#8B5CF6', '#7C3AED'] as const },
      { id: 'health_003_balanced', label: '🧘 Balanced', color: '#F472B6', gradient: ['#F472B6', '#EC4899', '#DB2777'] as const },
    ]
  }
};

// Flatten all moods for easy access
const buildAllMoods = () => {
  const result: any[] = [];
  const categories = Object.values(moodCategories || {});
  for (const category of categories) {
    const moods = (category as any)?.moods || [];
    for (const mood of moods) {
      result.push({
        ...mood,
        gradient: (mood.gradient as readonly [string, string, string])
      });
    }
  }
  return result;
};
const allMoods = buildAllMoods();

// Helper function to get mood data by ID
const getMoodData = (moodId: string) => {
  return allMoods.find(mood => mood.id === moodId) || {
    id: 'unknown',
    label: '❓ Unknown',
    color: '#6B7280',
    gradient: ['#6B7280', '#4B5563', '#374151'] as readonly [string, string, string]
  };
};

// Mood helper functions
const getMoodGradient = (moodId: string | null | undefined) => {
  if (!moodId) return ['#F3F4F6', '#E5E7EB'];
  const moodData = getMoodData(moodId);
  return moodData.gradient;
};

const getMoodEmoji = (moodId: string | null | undefined) => {
  if (!moodId) return '😊';
  const moodData = getMoodData(moodId);
  if (!moodData || !moodData.label) return '😊';
  return moodData.label.split(' ')[0]; // Get the emoji part
};

const getMoodLabel = (moodId: string | null | undefined) => {
  if (!moodId) return 'Not set';
  const moodData = getMoodData(moodId);
  if (!moodData || !moodData.label) return 'Not set';
  return moodData.label.split(' ').slice(1).join(' '); // Get the text part
};

const getMoodMessage = (rating: number | null | undefined) => {
  if (!rating) return 'How are you feeling today?';
  
  if (rating >= 8) return 'You\'re radiating positivity! ✨';
  if (rating >= 6) return 'You\'re doing great! Keep it up! 🌟';
  if (rating >= 4) return 'You\'re making progress! 💪';
  return 'Remember, every day is a new beginning 🌅';
};

const getMoodAccentColor = (rating: number | null | undefined) => {
  if (!rating) return Colors.neutral[300];
  
  if (rating >= 8) return Colors.success[500]; // Green for excited/joyful
  if (rating >= 6) return Colors.primary[500]; // Purple for happy/peaceful
  if (rating >= 4) return Colors.warning[500]; // Orange for neutral/worried
  return Colors.error[500]; // Red for sad/anxious
};

// Helper function to get gradient colors for action cards based on their base color
const getActionGradient = (baseColor: string) => {
  return Colors.gradients.spiritualLight;
};

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  // Responsive breakpoints
  const isTablet = screenWidth >= 768;
  const isDesktop = screenWidth >= 1024;
  
  const getResponsiveValue = (mobile: number, tablet: number, desktop?: number) => {
    if (desktop && isDesktop) return desktop;
    if (isTablet) return tablet;
    return mobile;
  };
  
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { todayActivity, calculateGoalPercentage, getCurrentStreak, getTodayGoals, refetch, loading } = useDailyActivity();
  const { prayers, getActivePrayers } = usePrayers();
  const { fetchVerseOfTheDay } = useBibleAPI();
  const { activities: recentActivities, loading: activitiesLoading, formatTimeAgo } = useRecentActivity();
  const { moodStats, loading: moodLoading, refetch: refetchMoods } = useMoodTracker();

  const [dailyVerse, setDailyVerse] = useState<{reference: string, text: string} | null>(null);
  const [verseLoading, setVerseLoading] = useState(true);
  const todaysMood = moodStats.todaysMood;
  const weeklyMoods = moodStats.weeklyData.map((d: { date: string | number | Date; }) => ({
    ...d,
    day: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })
  }));

  // Refetch mood data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetchMoods();
    }, [refetchMoods])
  );

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    loadVerseOfTheDay();
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Refetch daily activity when screen gains focus
  useFocusEffect(
    useCallback(() => {
      refetch();
      return () => {};
    }, [refetch])
  );

  const loadVerseOfTheDay = async () => {
    try {
      setVerseLoading(true);
      const verse = await fetchVerseOfTheDay();
      setDailyVerse(verse);
    } catch (error) {
      console.error('Error loading verse of the day:', error);
      const fallbackVerse = {
        reference: 'Jeremiah 29:11',
        text: 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.'
      };
      setDailyVerse(fallbackVerse);
    } finally {
      setVerseLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const calculateJourneyDays = () => {
    if (!profile?.journey_start_date) return 1;
    const startDate = new Date(profile.journey_start_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  // Calculate data
  const goalPercentage = user ? calculateGoalPercentage() : 0;
  const activePrayers = user ? getActivePrayers() : [];
  const journeyDays = user ? calculateJourneyDays() : 1;
  const currentStreak = user ? getCurrentStreak() : 0;

  const quickActions = [
    {
      icon: BookOpen,
      title: "Bible Reading",
      subtitle: "Daily Scripture",
      color: '#3B82F6',
      route: '/(tabs)/bible'
    },
    {
      icon: Sparkles,
      title: "Bible Study AI",
      subtitle: "Ask questions",
      color: '#10B981',
      route: '/bible-study-ai'
    },
    {
      icon: FileText,
      title: "Notes",
      subtitle: "Capture thoughts",
      color: '#8B5CF6',
      route: '/note-taker'
    },
    {
      icon: Heart,
      title: "Prayer Tracker",
      subtitle: `${activePrayers.length} active`,
      color: '#EF4444',
      route: '/(tabs)/prayer-tracker'
    },
    {
      icon: MessageCircle,
      title: "Bible Quiz",
      subtitle: "Test knowledge",
      color: '#8B5CF6',
      route: '/bible-quiz'
    },
    {
      icon: Cloud,
      title: "Dream Journal",
      subtitle: "Interpret dreams",
      color: '#F59E0B',
      route: '/dream-interpretation'
    },
  ];

  // Today goals breakdown removed per request

  return (
    <View style={styles.container}>
      <BackgroundGradient>
        <Animated.ScrollView 
          style={[styles.scrollView, { opacity: fadeAnim }]} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + Spacing['4xl'] }]}
        >
        {/* Header */}
        <Animated.View style={[
          styles.header, 
          { transform: [{ translateY: slideAnim }] }
        ]}>
          <View>
            <Text style={styles.headerTitle}>{getGreeting()}</Text>
            <Text style={styles.headerSubtitle}>
              {user ? (profile?.full_name || (user as ExtendedUser).email?.split('@')[0] || 'User') : 'Welcome, Guest'} • Day {journeyDays}
            </Text>
          </View>
        </Animated.View>

        {/* Daily Verse Card */}
        <Animated.View style={[
          { transform: [{ translateY: slideAnim }] }
        ]}>
          <LinearGradient
            colors={Colors.gradients.spiritualLight}
            style={styles.verseCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.verseHeader}>
              <View style={styles.verseBadge}>
                <BookOpen size={18} color={Colors.primary[600]} />
                <Text style={[styles.verseBadgeText, { color: Colors.primary[600] }]}>Daily Bread</Text>
              </View>
              <Text style={[styles.verseDate, { color: Colors.neutral[600] }]}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
            
            {verseLoading ? (
              <View style={styles.verseLoading}>
                <ActivityIndicator size="small" color={Colors.primary[500]} />
                <Text style={[styles.verseLoadingText, { color: Colors.neutral[700] }]}>Loading today's verse...</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.verseReference, { color: Colors.neutral[900] }]}>
                  {dailyVerse?.reference || 'Jeremiah 29:11'}
                </Text>
                <Text style={[styles.verseText, { color: Colors.neutral[800] }]}>
                  "{dailyVerse?.text || 'For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future.'}"
                </Text>
              </>
            )}
            
            <TouchableOpacity
              style={[styles.verseButton, { backgroundColor: Colors.primary[50] }]}
              onPress={() => router.push('/(tabs)/bible')}
            >
              <Text style={[styles.verseButtonText, { color: Colors.primary[600] }]}>Read Full Chapter</Text>
              <ArrowRight size={18} color={Colors.primary[600]} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Modern Mood Card */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <MoodTrackerCard />
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={action.title}
              onPress={() => router.push(action.route)}
              activeOpacity={0.8}
            >
              <Animated.View
                style={[
                  styles.actionCard,
                  {
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + (index * 10)],
                      })
                    }]
                  }
                ]}
              >
                <LinearGradient
                  colors={getActionGradient(action.color)}
                  style={styles.actionButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={[styles.actionIcon, { backgroundColor: Colors.primary[50] }]}>
                    {React.createElement(action.icon, { size: 24, color: Colors.primary[600] })}
                  </View>
                  <Text style={[styles.actionTitle, { color: Colors.neutral[900] }]}>{action.title}</Text>
                  <Text style={[styles.actionSubtitle, { color: Colors.neutral[600] }]}>{action.subtitle}</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.activityList}>
          {activitiesLoading ? (
            <View style={styles.activityLoading}>
              <ActivityIndicator size="small" color={Colors.primary[500]} />
              <Text style={styles.activityLoadingText}>Loading recent activities...</Text>
            </View>
          ) : recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <Animated.View
                key={activity.id}
                style={[
                  { 
                    transform: [{ 
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 20 + (index * 8)],
                      })
                    }],
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => router.push(activity.route as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={Colors.gradients.spiritualLight}
                    style={styles.activityItem}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={[styles.activityIcon, { backgroundColor: Colors.primary[50] }]}>
                      <Text style={[styles.activityIconText, { color: Colors.primary[600] }]}>{activity.icon}</Text>
                    </View>
                    <View style={styles.activityContent}>
                      <Text style={[styles.activityTitle, { color: Colors.neutral[900] }]}>{activity.title}</Text>
                      {activity.description && (
                        <Text style={[styles.activityDescription, { color: Colors.neutral[600] }]}>{activity.description}</Text>
                      )}
                      <Text style={[styles.activityTime, { color: Colors.neutral[500] }]}>{formatTimeAgo(activity.timestamp)}</Text>
                    </View>
                    <View style={styles.activityArrow}>
                      <ArrowRight size={16} color={Colors.primary[600]} />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyActivity}>
              <View style={styles.emptyActivityIcon}>
                <Sparkles size={32} color={Colors.neutral[400]} />
              </View>
              <Text style={styles.emptyActivityText}>No recent activities</Text>
              <Text style={styles.emptyActivitySubtext}>Start your spiritual journey today!</Text>
            </View>
          )}
        </View>





        </Animated.ScrollView>
      </BackgroundGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Account for status bar
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0) + Spacing.lg,
    paddingBottom: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  headerTitle: {
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
  },
  headerSubtitle: {
    fontSize: Typography.sizes.lg,
    color: Colors.neutral[600],
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  journeyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  journeyText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[600],
    marginLeft: Spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error[500],
    borderRadius: BorderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: Typography.weights.bold,
    color: 'white',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  
  // Verse Card
  verseCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius['3xl'],
    padding: Spacing['3xl'],
    marginBottom: Spacing['2xl'],
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    position: 'relative',
    overflow: 'hidden',
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  verseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary[100],
  },
  verseBadgeText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.primary[700],
    marginLeft: Spacing.sm,
    letterSpacing: 0.5,
  },
  verseDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    fontWeight: Typography.weights.medium,
  },
  verseLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  verseLoadingText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    marginLeft: Spacing.sm,
    fontWeight: Typography.weights.medium,
  },
  verseReference: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[700],
    marginBottom: Spacing.md,
    letterSpacing: 0.3,
  },
  verseText: {
    fontSize: Typography.sizes.lg,
    lineHeight: Typography.sizes.lg * 1.6,
    color: Colors.neutral[800],
    marginBottom: Spacing['2xl'],
    fontStyle: 'italic',
    fontWeight: Typography.weights.medium,
    textAlign: 'left',
  },
  verseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
  },
  verseButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: 'white',
    marginRight: Spacing.sm,
    letterSpacing: 0.3,
  },
  
  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  sectionMore: {
    padding: Spacing.sm,
  },
  sectionMoreText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.primary[600],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  viewAllText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.primary[600],
    marginRight: Spacing.xs,
  },
  
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  actionCard: {
    width: (screenWidth - (Spacing.lg * 2) - Spacing.md) / 2,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[900],
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  
  // Activity List
  activityList: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    ...Shadows.sm,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    ...Shadows.xs,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  activityTime: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
    fontWeight: Typography.weights.medium,
  },
  activityIconText: {
    fontSize: 18,
  },
  activityDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    marginBottom: 4,
    fontWeight: Typography.weights.medium,
  },
  activityArrow: {
    marginLeft: Spacing.sm,
  },
  activityLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['2xl'],
  },
  activityLoadingText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    marginLeft: Spacing.sm,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  emptyActivityIcon: {
    marginBottom: Spacing.md,
  },
  emptyActivityText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[700],
    marginBottom: Spacing.xs,
  },
  emptyActivitySubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
  },
  
  bottomSpacing: {
    height: Spacing['4xl'],
  },

  // Goals breakdown removed
});
