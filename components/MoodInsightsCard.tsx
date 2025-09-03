import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { Brain, Sparkles, Share2, RefreshCw, BookOpen } from 'lucide-react-native';
import { MoodAnalysis } from '@/lib/services/moodAnalysisService';

interface MoodInsightsCardProps {
  analysis: MoodAnalysis | null;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
  moodHistoryLength: number;
}

export default function MoodInsightsCard({
  analysis,
  loading,
  error,
  onRefresh,
  moodHistoryLength,
}: MoodInsightsCardProps) {
  const handleShare = async () => {
    if (!analysis) return;

    try {
      const shareContent = `
🌟 Mood Insights from Bible Daily App 🌟

Overall Pattern: ${analysis.overallPattern}

Spiritual Insights: ${analysis.spiritualInsights}

Biblical Wisdom: ${analysis.biblicalWisdom}

Suggested Scriptures:
${analysis.recommendedScriptures.map(s => `• ${s.reference}: ${s.relevance}`).join('\n')}

#MoodTracker #SpiritualGrowth #BibleDaily
      `.trim();

      await Share.share({
        message: shareContent,
        title: 'My Mood Insights',
      });
    } catch (error) {
      console.error('Error sharing insights:', error);
    }
  };

  if (moodHistoryLength < 3) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.softGlow}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <Brain size={24} color={Colors.primary[600]} />
            <Text style={styles.title}>Mood Insights</Text>
          </View>
          <Text style={styles.placeholderText}>
            Track at least 3 moods to unlock personalized insights and AI analysis! 📊
          </Text>
        </LinearGradient>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.softGlow}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[600]} />
            <Text style={styles.loadingText}>Analyzing your mood patterns with AI... ✨</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.softGlow}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ Couldn't load insights</Text>
            <Text style={styles.errorSubtext}>{error}</Text>
            {onRefresh && (
              <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                <RefreshCw size={16} color={Colors.primary[600]} />
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.spiritualLight}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Sparkles size={24} color={Colors.primary[600]} />
            <Text style={styles.title}>AI Mood Insights</Text>
          </View>
          <View style={styles.headerActions}>
            {onRefresh && (
              <TouchableOpacity onPress={onRefresh} style={styles.actionButton}>
                <RefreshCw size={18} color={Colors.primary[600]} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Share2 size={18} color={Colors.primary[600]} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Overall Pattern */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pattern Recognition</Text>
            <Text style={styles.sectionContent}>{analysis.overallPattern}</Text>
          </View>

          {/* Spiritual Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spiritual Insights</Text>
            <Text style={styles.sectionContent}>{analysis.spiritualInsights}</Text>
          </View>

          {/* Biblical Wisdom */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Biblical Wisdom</Text>
            <Text style={styles.sectionContent}>{analysis.biblicalWisdom}</Text>
          </View>

          {/* Recommended Scriptures */}
          {analysis.recommendedScriptures.length > 0 && (
            <View style={styles.section}>
              <View style={styles.scriptureHeader}>
                <BookOpen size={18} color={Colors.primary[600]} />
                <Text style={styles.sectionTitle}>Recommended Scriptures</Text>
              </View>
              {analysis.recommendedScriptures.map((scripture, index) => (
                <View key={index} style={styles.scriptureItem}>
                  <Text style={styles.scriptureReference}>{scripture.reference}</Text>
                  <Text style={styles.scriptureRelevance}>{scripture.relevance}</Text>
                  {scripture.text && (
                    <Text style={styles.scriptureText}>"{scripture.text}"</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Improvement Suggestions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Growth Suggestions</Text>
            <Text style={styles.sectionContent}>{analysis.improvementSuggestions}</Text>
          </View>

          {/* Trend Prediction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking Ahead</Text>
            <Text style={styles.sectionContent}>{analysis.trendPrediction}</Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by DeepSeek AI • {new Date().toLocaleDateString()}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadows.lg,
    marginVertical: Spacing.lg,
  },
  gradient: {
    padding: Spacing.xl,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[100],
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  sectionContent: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[700],
    lineHeight: Typography.sizes.base * 1.5,
  },
  scriptureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  scriptureItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  scriptureReference: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  scriptureRelevance: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    marginBottom: Spacing.xs,
    fontStyle: 'italic',
  },
  scriptureText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[700],
    fontStyle: 'italic',
  },
  footer: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.error[500],
    marginBottom: Spacing.xs,
  },
  errorSubtext: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.lg,
  },
  retryText: {
    fontSize: Typography.sizes.base,
    color: Colors.primary[600],
    fontWeight: Typography.weights.semiBold,
  },
  placeholderText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: Typography.sizes.base * 1.5,
  },
});