import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { Sparkles, RefreshCw, Lightbulb } from 'lucide-react-native';
import { useMoodAnalysis } from '@/hooks/useMoodAnalysis';

interface RealTimeMoodSuggestionProps {
  onSuggestionClick?: (suggestion: string) => void;
  compact?: boolean;
}

export default function RealTimeMoodSuggestion({ onSuggestionClick, compact = false }: RealTimeMoodSuggestionProps) {
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { getRealTimeSuggestion } = useMoodAnalysis();
  const fadeAnim = useState(new Animated.Value(0))[0];

  const generateSuggestion = async () => {
    setLoading(true);
    try {
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                        new Date().getHours() < 17 ? 'afternoon' : 'evening';

      const newSuggestion = await getRealTimeSuggestion({
        timeOfDay,
        recentActivities: ['App usage', 'Mood tracking'],
        currentLocation: 'Mobile',
        weather: 'Indoor',
      });

      setSuggestion(newSuggestion);

      // Animate in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

    } catch (error) {
      setSuggestion('Take a moment to breathe and connect with God. 🙏');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSuggestion();
  }, []);

  const handleRefresh = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      generateSuggestion();
    });
  };

  const handlePress = () => {
    if (onSuggestionClick && suggestion) {
      onSuggestionClick(suggestion);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <LinearGradient
          colors={Colors.gradients.softGlow}
          style={styles.compactContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.compactContent}>
            <Lightbulb size={16} color={Colors.primary[600]} />
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary[600]} />
            ) : (
              <Text style={styles.compactText} numberOfLines={2}>
                {suggestion || 'Get mood tip'}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <LinearGradient
        colors={Colors.gradients.spiritualLight}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Sparkles size={20} color={Colors.primary[600]} />
            <Text style={styles.title}>Real-time Suggestion</Text>
          </View>
          <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
            <RefreshCw size={16} color={Colors.primary[600]} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary[600]} />
              <Text style={styles.loadingText}>Generating suggestion...</Text>
            </View>
          ) : (
            <Text style={styles.suggestionText}>
              {suggestion || 'Take a moment to breathe and connect with God.'}
            </Text>
          )}
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by AI • {new Date().toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
    marginVertical: Spacing.md,
  },
  compactContainer: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
    minWidth: 120,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactText: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[700],
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
  },
  refreshButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
  },
  content: {
    minHeight: 60,
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
  },
  suggestionText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[700],
    lineHeight: Typography.sizes.base * 1.4,
    textAlign: 'center',
  },
  footer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});