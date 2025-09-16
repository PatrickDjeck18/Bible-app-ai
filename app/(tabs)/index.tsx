import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { collection, doc, getDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

import { router, useFocusEffect } from 'expo-router';
import { Colors, Shadows, BorderRadius, Spacing, Typography } from '@/constants/DesignTokens';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  FileText,
  Heart,
  MessageCircle,
  Cloud,
} from 'lucide-react-native';
import { useBibleAPI } from '../../hooks/useBibleAPI';
import MoodTrackerCard from '@/components/MoodTrackerCard';
import { LinearGradient } from 'expo-linear-gradient';
import BackgroundGradient from '@/components/BackgroundGradient';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth'; // Import the useAuth hook

const { width: screenWidth } = Dimensions.get('window');

// Mood data and utility functions (keep these as they are)
const moodCategories = {
  // ... your mood categories
};

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

const getMoodData = (moodId: string) => {
  return allMoods.find(mood => mood.id === moodId) || {
    id: 'unknown',
    label: '❓ Unknown',
    color: '#6B7280',
    gradient: ['#6B7280', '#4B5563', '#374151'] as readonly [string, string, string]
  };
};

const getActionGradient = (baseColor: string) => {
  return Colors.gradients.spiritualLight;
};

// Interface definitions (ensure these are correct)
interface UserProfile {
  full_name: string;
  journey_start_date: string;
}

interface MoodEntry {
  mood_id: string;
  mood_type: string;
  intensity_rating: number;
  created_at: { toDate: () => Date };
}

interface RecentActivity {
  id: string;
  icon: string;
  title: string;
  description?: string;
  timestamp: { toDate: () => Date };
  route: string;
}

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { fetchVerseOfTheDay } = useBibleAPI();
  const { user, loading: authLoading } = useAuth(); // Use the new useAuth hook

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [moodStats, setMoodStats] = useState({
    todaysMood: null as MoodEntry | null,
    weeklyData: [],
  });
  const [activePrayers, setActivePrayers] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true); // State for all data fetching on this screen
  const [verseLoading, setVerseLoading] = useState(true);
  const [dailyVerse, setDailyVerse] = useState<{ reference: string, text: string } | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Combine all data fetching into a single function
  const fetchAllData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch user profile
      const usersCollectionRef = collection(db, 'users');
      const userDocRef = doc(usersCollectionRef, user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }

      // Fetch today's mood
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const moodEntriesCollectionRef = collection(db, 'moodEntries');
      const moodQuery = query(
        moodEntriesCollectionRef,
        where('user_id', '==', user.uid),
        where('created_at', '>=', today),
        where('created_at', '<', tomorrow),
        limit(1)
      );
      const moodSnapshot = await getDocs(moodQuery);
      
      if (!moodSnapshot.empty) {
        setMoodStats(prev => ({
          ...prev,
          todaysMood: moodSnapshot.docs[0].data() as MoodEntry,
        }));
      } else {
        setMoodStats(prev => ({ ...prev, todaysMood: null }));
      }
      
      // Fetch recent activities
      const recentActivitiesCollectionRef = collection(db, 'recentActivities');
      const activitiesQuery = query(
        recentActivitiesCollectionRef,
        where('user_id', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const activitiesSnapshot = await getDocs(activitiesQuery);
      
      const activities = activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecentActivity[];
      setRecentActivities(activities);

    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Use useFocusEffect to fetch data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!authLoading && user) {
        fetchAllData();
      } else if (!user) {
        // If no user is logged in, stop the loading indicator
        setLoading(false);
      }
      return () => {};
    }, [user, authLoading, fetchAllData])
  );
  
  // Animate the entrance of the screen
  useEffect(() => {
    loadVerseOfTheDay();

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
            try {
              await auth.signOut();
              router.replace('/signup');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const formatTimeAgo = (timestamp: { toDate: () => Date }) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.toDate().getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} years ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} months ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} days ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} hours ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
  };
  
  const journeyDays = user ? calculateJourneyDays() : 1;

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

  return (
    <View style={styles.container}>
      <BackgroundGradient>
        <Animated.ScrollView 
          style={[styles.scrollView, { opacity: fadeAnim }]} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + Spacing['4xl'] }]}
        >
          <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
            <View>
              <Text style={styles.headerTitle}>{getGreeting()}</Text>
              <Text style={styles.headerSubtitle}>
                {user ? (profile?.full_name || user.email?.split('@')[0] || 'User') : 'Welcome, Guest'} • Day {journeyDays}
              </Text>
            </View>
          </Animated.View>

          <Animated.View style={[{ transform: [{ translateY: slideAnim }] }]}>
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
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <MoodTrackerCard />
          </Animated.View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.title}
                onPress={() => router.push(action.route as any)}
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

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>

          <View style={styles.activityList}>
            {loading ? (
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
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
    color: Colors.neutral[900],
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
});