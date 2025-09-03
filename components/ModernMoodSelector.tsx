import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
  Vibration,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { Smile, Sparkles, Brain, Heart, Zap, Target } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface ModernMoodSelectorProps {
  onMoodSelect: (moodId: string) => void;
  selectedMood?: string | null;
  compact?: boolean;
}

// Enhanced mood categories with spiritual themes
const modernMoodCategories = [
  {
    id: 'spiritual',
    title: 'Spiritual',
    icon: '🙏',
    color: Colors.primary[500],
    moods: [
      { id: 'spiritual_peace', label: '🙏 Peaceful', gradient: Colors.gradients.spiritual },
      { id: 'spiritual_grateful', label: '😇 Grateful', gradient: Colors.gradients.nature },
      { id: 'spiritual_connected', label: '🌟 Connected', gradient: Colors.gradients.cosmic },
    ]
  },
  {
    id: 'positive',
    title: 'Positive',
    icon: '✨',
    color: Colors.success[500],
    moods: [
      { id: 'positive_joy', label: '😄 Joyful', gradient: Colors.gradients.goldenHour },
      { id: 'positive_excited', label: '🤩 Excited', gradient: Colors.gradients.fire },
      { id: 'positive_loved', label: '💕 Loved', gradient: Colors.gradients.aurora },
    ]
  },
  {
    id: 'calm',
    title: 'Calm',
    icon: '🧘',
    color: Colors.secondary[500],
    moods: [
      { id: 'calm_relaxed', label: '😌 Relaxed', gradient: Colors.gradients.oceanBreeze },
      { id: 'calm_content', label: '😊 Content', gradient: Colors.gradients.softGlow },
      { id: 'calm_balanced', label: '⚖️ Balanced', gradient: Colors.gradients.minimal },
    ]
  },
  {
    id: 'challenging',
    title: 'Challenging',
    icon: '💭',
    color: Colors.warning[500],
    moods: [
      { id: 'challenging_anxious', label: '😰 Anxious', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] },
      { id: 'challenging_sad', label: '😔 Sad', gradient: ['#6B7280', '#4B5563', '#374151'] },
      { id: 'challenging_tired', label: '😴 Tired', gradient: ['#A855F7', '#9333EA', '#7C3AED'] },
    ]
  }
];

export default function ModernMoodSelector({ onMoodSelect, selectedMood, compact = false }: ModernMoodSelectorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleMoodSelect = (moodId: string) => {
    // Haptic feedback
    if (Platform.OS === 'ios') {
      const impactHeavy = require('expo-haptics').ImpactFeedbackStyle.Heavy;
      require('expo-haptics').impactAsync(impactHeavy);
    } else {
      Vibration.vibrate(50);
    }

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onMoodSelect(moodId);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const MoodBubble = ({ mood, isSelected }: { mood: any; isSelected: boolean }) => (
    <Animated.View
      style={{
        transform: [{ scale: isSelected ? scaleAnim : 1 }],
      }}
    >
      <TouchableOpacity
        onPress={() => handleMoodSelect(mood.id)}
        activeOpacity={0.8}
        style={[
          styles.moodBubble,
          isSelected && styles.moodBubbleSelected,
        ]}
      >
        <LinearGradient
          colors={mood.gradient}
          style={styles.moodGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.moodEmoji}>{mood.label.split(' ')[0]}</Text>
          {isSelected && (
            <Text style={styles.moodLabel}>
              {mood.label.split(' ').slice(1).join(' ')}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <ScrollView
        horizontal={compact}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {modernMoodCategories.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <TouchableOpacity
              onPress={() => toggleCategory(category.id)}
              style={styles.categoryHeader}
              activeOpacity={0.7}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </TouchableOpacity>

            {(expandedCategory === category.id || compact) && (
              <View style={styles.moodsGrid}>
                {category.moods.map((mood) => (
                  <MoodBubble
                    key={mood.id}
                    mood={mood}
                    isSelected={selectedMood === mood.id}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* AI Suggestion Button */}
      {!compact && (
        <TouchableOpacity
          style={styles.aiSuggestionButton}
          activeOpacity={0.8}
          onPress={() => {
            // TODO: Implement AI mood suggestion
            console.log('AI mood suggestion requested');
          }}
        >
          <LinearGradient
            colors={Colors.gradients.spiritual}
            style={styles.aiButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Brain size={20} color="white" />
            <Text style={styles.aiButtonText}>AI Mood Insight</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius['2xl'],
    ...Shadows.md,
  },
  compactContainer: {
    padding: Spacing.md,
  },
  scrollContent: {
    gap: Spacing.xl,
  },
  categorySection: {
    gap: Spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 18,
  },
  categoryTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'flex-start',
  },
  moodBubble: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  moodBubbleSelected: {
    ...Shadows.lg,
    transform: [{ scale: 1.1 }],
  },
  moodGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  moodLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semiBold,
    color: 'white',
    textAlign: 'center',
  },
  aiSuggestionButton: {
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  aiButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  aiButtonText: {
    color: 'white',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
  },
});