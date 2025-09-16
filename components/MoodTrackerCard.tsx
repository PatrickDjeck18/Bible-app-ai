import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Smile, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Zap, 
  Sparkles,
  Brain,
  Plus,
  ArrowRight,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { useMoodTracker } from '@/hooks/useMoodTracker';
import { router } from 'expo-router';
import { onMoodEntrySaved, offMoodEntrySaved } from '@/lib/eventEmitter';

const { width: screenWidth } = Dimensions.get('window');

interface MoodTrackerCardProps {
  onPress?: () => void;
  compact?: boolean;
}

export default function MoodTrackerCard({ onPress, compact = false }: MoodTrackerCardProps) {
  const { moodStats, loading, refetch } = useMoodTracker();
  const [showInsights, setShowInsights] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const todaysMood = moodStats.todaysMood;
  const todayDate = new Date().toISOString().split('T')[0];
  
  const weeklyMoods = moodStats.weeklyData.map((d: { date: string; mood: string | null; mood_id: string | null; rating: number | null; emoji: string | null }) => ({
    ...d,
    day: new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
    isToday: d.date === todayDate
  }));
  

  // Listen for mood entry saved events and refresh data
  useEffect(() => {
    const handleMoodSaved = async (data?: any) => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    };

    // Use cross-platform event emitter
    onMoodEntrySaved(handleMoodSaved);
    
    // Also listen to web events for web platform compatibility
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('moodEntrySaved', handleMoodSaved);
    }
    
    return () => {
      offMoodEntrySaved(handleMoodSaved);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener('moodEntrySaved', handleMoodSaved);
      }
    };
  }, [refetch]);

  // Additional effect to refresh data when component becomes visible
  // This helps with mobile platforms where events might not work
  useEffect(() => {
    const refreshData = async () => {
      if (!loading) {
        await refetch();
      }
    };

    // Refresh data when component mounts
    refreshData();
  }, []);

  // Refresh data when the component comes into focus (for mobile navigation)
  useEffect(() => {
    const handleFocus = () => {
      if (!loading) {
        refetch();
      }
    };

    // This will be called when the component comes into focus
    // You can add navigation focus listeners here if needed
    return () => {
      // Cleanup if needed
    };
  }, [refetch, loading]);

  // Helper functions
  const getMoodGradient = (moodId: string | null | undefined) => {
    return Colors.gradients.spiritualLight;
  };

  const getMoodDisplayName = (moodId: string | null, moodType: string | null) => {
    if (!moodId && !moodType) return '';
    
    // If we have mood_id, derive the name from it
    if (moodId) {
      const moodData = getMoodData(moodId);
      if (moodData && moodData.label) {
        // Extract the text part after the emoji
        const parts = moodData.label.split(' ');
        return parts.slice(1).join(' ');
      }
    }
    
    // Fallback to mood_type mapping
    if (moodType) {
      const moodNameMap: { [key: string]: string } = {
        'Happy': 'Happy',
        'Joyful': 'Joyful',
        'Blessed': 'Blessed',
        'Grateful': 'Grateful',
        'Excited': 'Excited',
        'Loved': 'Loved',
        'Proud': 'Proud',
        'Peaceful': 'Peaceful',
        'Calm': 'Calm',
        'Content': 'Content',
        'Prayerful': 'Prayerful',
        'Motivated': 'Motivated',
        'Focused': 'Focused',
        'Creative': 'Creative',
        'Inspired': 'Inspired',
        'Accomplished': 'Accomplished',
        'Sad': 'Sad',
        'Anxious': 'Anxious',
        'Stressed': 'Stressed',
        'Angry': 'Angry',
        'Frustrated': 'Frustrated',
        'Tired': 'Tired',
        'Lonely': 'Lonely',
        'Confused': 'Confused',
        'Fearful': 'Fearful',
        'Curious': 'Curious',
        'Surprised': 'Surprised',
        'Hopeful': 'Hopeful',
        'Connected': 'Connected',
        'Faithful': 'Faithful',
        'Healthy': 'Healthy',
        'Rested': 'Rested',
        'Balanced': 'Balanced',
        'Neutral': 'Neutral',
        'Worried': 'Worried'
      };
      return moodNameMap[moodType] || moodType;
    }
    
    return '';
  };

  const getMoodData = (moodId: string) => {
    const moodCategories = {
      positive: {
        moods: [
          { id: 'positive_001_blessed', label: '🙏 Blessed', gradient: ['#FFD700', '#FFA500', '#FF8C00'] as const },
          { id: 'positive_002_happy', label: '😊 Happy', gradient: ['#10B981', '#059669', '#047857'] as const },
          { id: 'positive_003_joyful', label: '😄 Joyful', gradient: ['#22C55E', '#16A34A', '#15803D'] as const },
          { id: 'positive_004_grateful', label: '🙏 Grateful', gradient: ['#84CC16', '#65A30D', '#4D7C0F'] as const },
          { id: 'positive_005_excited', label: '🤩 Excited', gradient: ['#F59E0B', '#D97706', '#B45309'] as const },
          { id: 'positive_006_loved', label: '💕 Loved', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
          { id: 'positive_007_proud', label: '🏆 Proud', gradient: ['#10B981', '#059669', '#047857'] as const },
        ]
      },
      calm: {
        moods: [
          { id: 'calm_001_peaceful', label: '😇 Peaceful', gradient: ['#06B6D4', '#0891B2', '#0E7490'] as const },
          { id: 'calm_002_calm', label: '😌 Calm', gradient: ['#3B82F6', '#2563EB', '#1D4ED8'] as const },
          { id: 'calm_003_content', label: '😊 Content', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
          { id: 'calm_004_prayerful', label: '🙏 Prayerful', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
        ]
      },
      energetic: {
        moods: [
          { id: 'energetic_001_motivated', label: '💪 Motivated', gradient: ['#10B981', '#059669', '#047857'] as const },
          { id: 'energetic_002_focused', label: '🎯 Focused', gradient: ['#3B82F6', '#2563EB', '#1D4ED8'] as const },
          { id: 'energetic_003_creative', label: '🎨 Creative', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
          { id: 'energetic_004_inspired', label: '✨ Inspired', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
          { id: 'energetic_005_accomplished', label: '🎉 Accomplished', gradient: ['#22C55E', '#16A34A', '#15803D'] as const },
        ]
      },
      challenging: {
        moods: [
          { id: 'challenging_001_sad', label: '😔 Sad', gradient: ['#6B7280', '#4B5563', '#374151'] as const },
          { id: 'challenging_002_anxious', label: '😰 Anxious', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
          { id: 'challenging_003_stressed', label: '😓 Stressed', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
          { id: 'challenging_004_angry', label: '😠 Angry', gradient: ['#EF4444', '#DC2626', '#B91C1C'] as const },
          { id: 'challenging_005_frustrated', label: '😤 Frustrated', gradient: ['#F97316', '#EA580C', '#C2410C'] as const },
          { id: 'challenging_006_tired', label: '😴 Tired', gradient: ['#A855F7', '#9333EA', '#7C3AED'] as const },
          { id: 'challenging_007_lonely', label: '🥺 Lonely', gradient: ['#6B7280', '#4B5563', '#374151'] as const },
          { id: 'challenging_008_confused', label: '😕 Confused', gradient: ['#F59E0B', '#D97706', '#B45309'] as const },
        ]
      },
      curious: {
        moods: [
          { id: 'curious_001_curious', label: '🤔 Curious', gradient: ['#14B8A6', '#0D9488', '#0F766E'] as const },
          { id: 'curious_002_surprised', label: '😲 Surprised', gradient: ['#FBBF24', '#F59E0B', '#D97706'] as const },
          { id: 'curious_003_hopeful', label: '🌟 Hopeful', gradient: ['#FBBF24', '#F59E0B', '#D97706'] as const },
        ]
      },
      spiritual: {
        moods: [
          { id: 'spiritual_001_inspired', label: '✨ Inspired', gradient: ['#A78BFA', '#8B5CF6', '#7C3AED'] as const },
          { id: 'spiritual_002_connected', label: '🔗 Connected', gradient: ['#6EE7B7', '#34D399', '#10B981'] as const },
          { id: 'spiritual_003_faithful', label: '✝️ Faithful', gradient: ['#F472B6', '#EC4899', '#DB2777'] as const },
        ]
      },
      health: {
        moods: [
          { id: 'health_001_healthy', label: '🍎 Healthy', gradient: ['#6EE7B7', '#34D399', '#10B981'] as const },
          { id: 'health_002_rested', label: '😴 Rested', gradient: ['#A78BFA', '#8B5CF6', '#7C3AED'] as const },
          { id: 'health_003_balanced', label: '🧘 Balanced', gradient: ['#F472B6', '#EC4899', '#DB2777'] as const },
        ]
      }
    };

    const allMoods: any[] = [];
    Object.values(moodCategories).forEach(category => {
      category.moods.forEach(mood => allMoods.push(mood));
    });

    return allMoods.find(mood => mood.id === moodId) || {
      id: 'unknown',
      label: '❓ Unknown',
      gradient: ['#6B7280', '#4B5563', '#374151'] as const
    };
  };

  const getMoodMessage = (rating: number | null | undefined) => {
    if (!rating) return 'How are you feeling today?';
    
    if (rating >= 8) return 'You\'re radiating positivity! ✨';
    if (rating >= 6) return 'You\'re doing great! Keep it up! 🌟';
    if (rating >= 4) return 'You\'re making progress! 💪';
    return 'Remember, every day is a new beginning 🌅';
  };

  const getMoodInsight = () => {
    if (moodStats.totalEntries === 0) return 'Start tracking your mood to gain insights!';
    
    const positiveDays = moodStats.weeklyData.filter(d => d.rating && d.rating >= 6).length;
    const positivePercentage = Math.round((positiveDays / 7) * 100);
    
    if (positivePercentage >= 70) return '🌟 Amazing week! You\'ve been positive most days.';
    if (positivePercentage >= 50) return '✨ Good balance! Keep nurturing your spiritual well-being.';
    return '💭 Every emotion is part of your journey. You\'re growing through it all.';
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/(tabs)/mood-tracker');
    }
  };

  const toggleInsights = () => {
    setShowInsights(!showInsights);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="small" color={Colors.primary[600]} />
        <Text style={styles.loadingText}>Loading mood data...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compactContainer]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      {refreshing && (
        <View style={styles.refreshOverlay}>
          <ActivityIndicator size="small" color="white" />
        </View>
      )}
      <LinearGradient
        colors={getMoodGradient(todaysMood?.mood_id)}
        style={[styles.gradient, compact && styles.compactGradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header Section */}
        <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                {todaysMood?.emoji ? (
                  <Text style={styles.moodEmoji}>{todaysMood.emoji}</Text>
                ) : (
                  <Smile size={compact ? 20 : 24} color={Colors.primary[600]} />
                )}
              </View>
              <View>
                <Text style={styles.title}>Today's Mood</Text>
                <Text style={styles.subtitle}>
                 {todaysMood ? 
    `${getMoodDisplayName(todaysMood.mood_id ?? null, todaysMood.mood_type)} • ${getMoodMessage(todaysMood.intensity_rating)}` :
    'Track your mood today'
}
                </Text>
                {todaysMood?.created_at && (
                  <Text style={styles.moodTime}>
                    Recorded at {new Date(todaysMood.created_at).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </Text>
                )}
              </View>
            </View>
            
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => router.push('/(tabs)/mood-tracker')}
              >
                <Plus size={16} color={Colors.primary[600]} />
              </TouchableOpacity>
            </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Zap size={16} color={Colors.primary[600]} />
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statNumber}>{moodStats.currentStreak}</Text>
          </View>
          
          <View style={styles.statItem}>
            <BarChart3 size={16} color={Colors.primary[600]} />
            <Text style={styles.statLabel}>Avg</Text>
            <Text style={styles.statNumber}>{moodStats.averageWeekly.toFixed(1)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Calendar size={16} color={Colors.primary[600]} />
            <Text style={styles.statLabel}>Entries</Text>
            <Text style={styles.statNumber}>{moodStats.totalEntries}</Text>
          </View>
        </View>

        {/* Weekly Trend */}
        {!compact && (
          <View style={styles.weeklyContainer}>
            <View style={styles.weeklyHeader}>
              <Text style={styles.weeklyTitle}>This Week</Text>
              <TouchableOpacity onPress={toggleInsights}>
                <Brain size={16} color={Colors.primary[600]} opacity={0.8} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weeklyBars}>
              {weeklyMoods.map((mood: any, index: number) => (
                <View key={index} style={styles.weeklyBarContainer}>
                  <Text style={[
                    styles.weeklyDay,
                    mood.isToday && styles.todayDay
                  ]}>{mood.day}</Text>
                  {mood.emoji && (
                    <View style={styles.moodContainer}>
                      <Text style={[
                        styles.weeklyEmoji,
                        mood.isToday && styles.todayEmoji
                      ]}>{mood.emoji}</Text>
                      <Text style={[
                        styles.moodName,
                        mood.isToday && styles.todayMoodName
                      ]}>{getMoodDisplayName(mood.mood_id, mood.mood)}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* AI Insights */}
            {showInsights && (
              <View style={styles.insightsContainer}>
                <View style={styles.insightsHeader}>
                  <Sparkles size={14} color={Colors.primary[600]} />
                  <Text style={styles.insightsTitle}>AI Insight</Text>
                </View>
                <Text style={styles.insightsText}>{getMoodInsight()}</Text>
              </View>
            )}
          </View>
        )}

        {/* Quick Actions */}
        {!compact && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/mood-tracker')}
            >
              <Text style={styles.actionText}>Track Mood</Text>
              <ArrowRight size={16} color={Colors.primary[600]} />
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius['3xl'],
    marginBottom: Spacing['2xl'],
    ...Shadows.xl,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  compactContainer: {
    marginBottom: Spacing.lg,
  },
  gradient: {
    padding: Spacing['2xl'],
  },
  compactGradient: {
    padding: Spacing.lg,
  },
  loadingContainer: {
    padding: Spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral[100],
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[800],
    opacity: 0.9,
    marginTop: Spacing.xs,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  moodTime: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[700],
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.lg,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[700],
    opacity: 0.8,
  },
  statNumber: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  
  // Weekly Trends
  weeklyContainer: {
    marginBottom: Spacing.xl,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  weeklyTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[900],
  },
  weeklyBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  weeklyBarContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  weeklyDay: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[700],
    opacity: 0.8,
  },
  weeklyEmoji: {
    fontSize: Typography.sizes.sm,
    marginTop: 2,
  },
  moodContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  moodName: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 50,
  },
  todayMoodName: {
    fontWeight: Typography.weights.semiBold,
    color: Colors.primary[700],
  },
  todayDay: {
    fontWeight: Typography.weights.bold,
    color: Colors.primary[600],
  },
  todayEmoji: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  
  // Insights
  insightsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  insightsTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[900],
  },
  insightsText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[800],
    opacity: 0.9,
    lineHeight: Typography.sizes.sm * 1.4,
  },
  
  // Actions
  actionsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.lg,
  },
  actionText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[900],
  },
  
  // Refresh overlay
  refreshOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius['3xl'],
  },
});
            
