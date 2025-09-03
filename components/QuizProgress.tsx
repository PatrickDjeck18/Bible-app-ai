import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { 
  Trophy, 
  Target, 
  Zap, 
  Clock,
  TrendingUp,
  Award,
  Star,
  Flame
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;

interface QuizProgressProps {
  current: number;
  total: number;
  score: number;
  streak: number;
  accuracy: number;
  timeRemaining?: number;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  current,
  total,
  score,
  streak,
  accuracy,
  timeRemaining
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const streakAnim = useRef(new Animated.Value(1)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const progressPercentage = (current / total) * 100;

  useEffect(() => {
    // Progress bar animation
    Animated.spring(progressAnim, {
      toValue: progressPercentage,
      tension: 80,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  useEffect(() => {
    // Streak animation when it increases
    if (streak > 0) {
      Animated.sequence([
        Animated.spring(streakAnim, {
          toValue: 1.3,
          tension: 200,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(streakAnim, {
          toValue: 1,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();

      // Glow effect for high streaks
      if (streak >= 3) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    }
  }, [streak]);

  useEffect(() => {
    // Score animation
    Animated.spring(scoreAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [score]);

  useEffect(() => {
    // Pulse animation for timer when running low
    if (timeRemaining !== undefined && timeRemaining <= 10) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [timeRemaining]);

  const getStreakColor = () => {
    if (streak >= 10) return Colors.error[500];
    if (streak >= 5) return Colors.warning[500];
    if (streak >= 3) return Colors.success[500];
    return Colors.primary[500];
  };

  const getAccuracyColor = () => {
    if (accuracy >= 90) return Colors.success[500];
    if (accuracy >= 70) return Colors.warning[500];
    if (accuracy >= 50) return Colors.primary[500];
    return Colors.error[500];
  };

  return (
    <View style={styles.container}>
      {/* Glass effect background */}
      <LinearGradient
        colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.95)']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Progress Section */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressText}>
              {current} of {total}
            </Text>
          </View>
          <View style={styles.progressPercentage}>
            <Text style={styles.percentageText}>
              {Math.round(progressPercentage)}%
            </Text>
          </View>
        </View>
        
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              >
                {/* Animated shine effect */}
                <Animated.View
                  style={[
                    styles.progressShine,
                    {
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.6],
                      }),
                    },
                  ]}
                />
              </LinearGradient>
            </Animated.View>
          </View>
          
          {/* Progress milestones */}
          <View style={styles.milestones}>
            {[25, 50, 75].map((milestone) => (
              <View
                key={milestone}
                style={[
                  styles.milestone,
                  { left: `${milestone}%` },
                  progressPercentage >= milestone && styles.milestoneReached,
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Score */}
        <Animated.View 
          style={[
            styles.statCard,
            {
              transform: [{ scale: scoreAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.primary[50], 'white']}
            style={styles.statGradient}
          >
            <View style={[styles.statIcon, { backgroundColor: Colors.primary[100] }]}>
              <Trophy size={isTablet ? 20 : 18} color={Colors.primary[600]} />
            </View>
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </LinearGradient>
        </Animated.View>

        {/* Streak */}
        <Animated.View 
          style={[
            styles.statCard,
            {
              transform: [{ scale: streakAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[`${getStreakColor()}15`, 'white']}
            style={styles.statGradient}
          >
            <View style={[styles.statIcon, { backgroundColor: `${getStreakColor()}20` }]}>
              {streak >= 5 ? (
                <Flame size={isTablet ? 20 : 18} color={getStreakColor()} />
              ) : (
                <Zap size={isTablet ? 20 : 18} color={getStreakColor()} />
              )}
            </View>
            <View style={styles.streakValueContainer}>
              <Text style={[styles.statValue, { color: getStreakColor() }]}>
                {streak}
              </Text>
              {streak >= 3 && (
                <Animated.View
                  style={{
                    opacity: glowAnim,
                  }}
                >
                  <Text style={styles.streakEmoji}>🔥</Text>
                </Animated.View>
              )}
            </View>
            <Text style={styles.statLabel}>Streak</Text>
          </LinearGradient>
        </Animated.View>

        {/* Accuracy */}
        <View style={styles.statCard}>
          <LinearGradient
            colors={[`${getAccuracyColor()}15`, 'white']}
            style={styles.statGradient}
          >
            <View style={[styles.statIcon, { backgroundColor: `${getAccuracyColor()}20` }]}>
              <Target size={isTablet ? 20 : 18} color={getAccuracyColor()} />
            </View>
            <View style={styles.accuracyContainer}>
              <Text style={[styles.statValue, { color: getAccuracyColor() }]}>
                {Math.round(accuracy)}%
              </Text>
              <View style={styles.accuracyBar}>
                <View 
                  style={[
                    styles.accuracyFill,
                    { 
                      width: `${accuracy}%`,
                      backgroundColor: getAccuracyColor(),
                    }
                  ]} 
                />
              </View>
            </View>
            <Text style={styles.statLabel}>Accuracy</Text>
          </LinearGradient>
        </View>

        {/* Timer (if applicable) */}
        {timeRemaining !== undefined && (
          <Animated.View 
            style={[
              styles.statCard,
              {
                transform: [
                  { scale: timeRemaining <= 10 ? pulseAnim : 1 }
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[
                timeRemaining <= 10 ? Colors.error[50] : Colors.secondary[50],
                'white'
              ]}
              style={styles.statGradient}
            >
              <View style={[
                styles.statIcon, 
                { 
                  backgroundColor: timeRemaining <= 10 
                    ? Colors.error[100] 
                    : Colors.secondary[100] 
                }
              ]}>
                <Clock 
                  size={isTablet ? 20 : 18} 
                  color={timeRemaining <= 10 ? Colors.error[600] : Colors.secondary[600]} 
                />
              </View>
              <Text style={[
                styles.statValue,
                { 
                  color: timeRemaining <= 10 
                    ? Colors.error[600] 
                    : Colors.secondary[700] 
                }
              ]}>
                {timeRemaining}
              </Text>
              <Text style={styles.statLabel}>Seconds</Text>
            </LinearGradient>
          </Animated.View>
        )}
      </View>

      {/* Achievement Badges */}
      {(streak >= 5 || accuracy >= 90) && (
        <Animated.View 
          style={[
            styles.achievementBadge,
            {
              opacity: glowAnim,
              transform: [
                {
                  translateY: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.warning[400], Colors.warning[600]]}
            style={styles.achievementGradient}
          >
            <Award size={16} color="white" />
            <Text style={styles.achievementText}>
              {streak >= 5 ? 'On Fire!' : 'Perfect Accuracy!'}
            </Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: BorderRadius['2xl'],
    marginHorizontal: isTablet ? Spacing['2xl'] : Spacing.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  progressSection: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  progressText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
  },
  progressPercentage: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  percentageText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[600],
  },
  progressBarContainer: {
    position: 'relative',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  progressGradient: {
    flex: 1,
    borderRadius: BorderRadius.full,
    position: 'relative',
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  milestones: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  milestone: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: Colors.neutral[300],
  },
  milestoneReached: {
    backgroundColor: 'transparent',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  statGradient: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    width: isTablet ? 36 : 32,
    height: isTablet ? 36 : 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: isTablet ? Typography.sizes.xl : Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  streakValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  streakEmoji: {
    fontSize: 16,
  },
  accuracyContainer: {
    alignItems: 'center',
    width: '100%',
  },
  accuracyBar: {
    width: '100%',
    height: 3,
    backgroundColor: Colors.neutral[200],
    borderRadius: BorderRadius.full,
    marginTop: Spacing.xs,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  achievementBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  achievementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  achievementText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: 'white',
  },
});