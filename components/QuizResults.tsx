import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
  Pressable,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { 
  Trophy, 
  Target, 
  Zap, 
  Clock, 
  RotateCcw, 
  Home, 
  Share2,
  Award,
  TrendingUp,
  BookOpen,
  Star,
  CheckCircle,
  XCircle,
  Sparkles,
  Medal,
  Crown,
  Flame,
  Heart,
  ChevronRight
} from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isTablet = SCREEN_WIDTH >= 768;

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  accuracy: number;
  grade: {
    grade: string;
    color: string;
    message: string;
  };
  timeSpent?: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onShare?: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  unlocked: boolean;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  streak,
  accuracy,
  grade,
  timeSpent,
  onPlayAgain,
  onGoHome,
  onShare
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  
  const [statAnimations] = React.useState(() =>
    Array(6).fill(0).map(() => new Animated.Value(0))
  );

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Stagger stat animations
    const animations = statAnimations.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        delay: index * 100,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();

    // Trophy rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for CTA button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparkle animation for high scores
    if (accuracy >= 80) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  const getPerformanceEmoji = () => {
    if (accuracy >= 95) return '🏆';
    if (accuracy >= 90) return '🌟';
    if (accuracy >= 80) return '🎯';
    if (accuracy >= 70) return '👍';
    if (accuracy >= 60) return '💪';
    return '📚';
  };

  const getPerformanceMessage = () => {
    if (accuracy >= 95) return "Absolutely Outstanding! You're a Bible Master!";
    if (accuracy >= 90) return "Excellent Performance! You know your Scripture!";
    if (accuracy >= 80) return "Great Job! Your knowledge is impressive!";
    if (accuracy >= 70) return "Good Work! Keep studying and growing!";
    if (accuracy >= 60) return "Nice Effort! You're on the right path!";
    return "Keep Learning! Every question teaches us something new!";
  };

  const achievements: Achievement[] = [
    {
      id: 'perfect',
      title: 'Perfect Score',
      description: 'Answer all questions correctly',
      icon: Crown,
      color: Colors.warning[500],
      unlocked: accuracy === 100,
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: `${streak}+ correct in a row`,
      icon: Flame,
      color: Colors.error[500],
      unlocked: streak >= 5,
    },
    {
      id: 'quick_thinker',
      title: 'Quick Thinker',
      description: 'Complete quiz under 5 minutes',
      icon: Zap,
      color: Colors.primary[500],
      unlocked: timeSpent ? timeSpent < 300 : false,
    },
    {
      id: 'scholar',
      title: 'Bible Scholar',
      description: '90%+ accuracy',
      icon: BookOpen,
      color: Colors.success[500],
      unlocked: accuracy >= 90,
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);

  const handleShareResults = async () => {
    const message = `🎉 Bible Quiz Results!\n\n` +
      `${getPerformanceEmoji()} Score: ${Math.round(accuracy)}%\n` +
      `✅ Correct: ${correctAnswers}/${totalQuestions}\n` +
      `🔥 Best Streak: ${streak}\n` +
      `📊 Grade: ${grade.grade}\n\n` +
      `${getPerformanceMessage()}\n\n` +
      `Challenge yourself with the Bible Quiz app!`;

    try {
      await Share.share({
        message,
        title: 'My Bible Quiz Results',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderStatCard = (
    icon: any,
    value: string | number,
    label: string,
    color: string,
    index: number
  ) => (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: statAnimations[index],
          transform: [
            {
              translateY: statAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
            {
              scale: statAnimations[index].interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.8, 1.1, 1],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={[`${color}15`, 'white']}
        style={styles.statGradient}
      >
        <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
          {React.createElement(icon, { size: 24, color })}
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Sparkle Effects for High Scores */}
        {accuracy >= 80 && (
          <Animated.View
            style={[
              styles.sparkleContainer,
              {
                opacity: sparkleAnim,
                transform: [
                  {
                    scale: sparkleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1.2],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents="none"
          >
            <Sparkles size={32} color={Colors.warning[500]} />
          </Animated.View>
        )}

        {/* Header Section */}
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.gradeContainer,
              {
                transform: [
                  {
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[grade.color, `${grade.color}CC`]}
              style={styles.gradeBadge}
            >
              <Text style={styles.gradeText}>{grade.grade}</Text>
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.title}>Quiz Complete!</Text>
          <Text style={styles.performanceEmoji}>{getPerformanceEmoji()}</Text>
          <Text style={styles.message}>{grade.message}</Text>
          <Text style={styles.performanceMessage}>{getPerformanceMessage()}</Text>
        </View>

        {/* Score Circle */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreCircleContainer}>
            <LinearGradient
              colors={[`${grade.color}20`, `${grade.color}05`]}
              style={styles.scoreCircleBackground}
            />
            <View style={[styles.scoreCircle, { borderColor: grade.color }]}>
              <Text style={[styles.scoreText, { color: grade.color }]}>
                {Math.round(accuracy)}%
              </Text>
              <Text style={styles.scoreLabel}>Accuracy</Text>
              <View style={styles.scoreDetails}>
                <Text style={styles.scoreDetailText}>
                  {correctAnswers}/{totalQuestions}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {renderStatCard(Trophy, score, 'Total Score', Colors.primary[500], 0)}
          {renderStatCard(CheckCircle, correctAnswers, 'Correct', Colors.success[500], 1)}
          {renderStatCard(XCircle, wrongAnswers, 'Missed', Colors.error[500], 2)}
          {renderStatCard(Zap, streak, 'Best Streak', Colors.warning[500], 3)}
          {timeSpent && renderStatCard(
            Clock,
            `${Math.floor(timeSpent / 60)}:${(timeSpent % 60).toString().padStart(2, '0')}`,
            'Time',
            Colors.secondary[500],
            4
          )}
          {renderStatCard(Target, `${Math.round(accuracy)}%`, 'Accuracy', Colors.primary[600], 5)}
        </View>

        {/* Achievements Section */}
        {unlockedAchievements.length > 0 && (
          <View style={styles.achievementsSection}>
            <View style={styles.sectionHeader}>
              <Award size={20} color={Colors.warning[600]} />
              <Text style={styles.sectionTitle}>Achievements Unlocked</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementsScroll}
            >
              {unlockedAchievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <LinearGradient
                    colors={[`${achievement.color}20`, 'white']}
                    style={styles.achievementGradient}
                  >
                    <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}15` }]}>
                      {React.createElement(achievement.icon, { 
                        size: 24, 
                        color: achievement.color 
                      })}
                    </View>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                  </LinearGradient>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onPlayAgain}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.buttonGradient}
              >
                <RotateCcw size={20} color="white" />
                <Text style={styles.primaryButtonText}>Play Again</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.secondaryButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onGoHome}
            >
              <Home size={20} color={Colors.neutral[600]} />
              <Text style={styles.secondaryButtonText}>Home</Text>
            </Pressable>

            {onShare && (
              <Pressable
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleShareResults}
              >
                <Share2 size={20} color={Colors.neutral[600]} />
                <Text style={styles.secondaryButtonText}>Share</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteContainer}>
          <LinearGradient
            colors={[Colors.primary[50], Colors.primary[100]]}
            style={styles.quoteGradient}
          >
            <Sparkles size={16} color={Colors.primary[600]} />
            <Text style={styles.quote}>
              "Study to show yourself approved unto God, a workman that needs not to be ashamed, rightly dividing the word of truth."
            </Text>
            <Text style={styles.quoteReference}>2 Timothy 2:15</Text>
          </LinearGradient>
        </View>

        {/* Improvement Tips */}
        {accuracy < 80 && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>Tips for Improvement</Text>
            <View style={styles.tipCard}>
              <BookOpen size={16} color={Colors.primary[600]} />
              <Text style={styles.tipText}>Read a chapter of the Bible daily</Text>
            </View>
            <View style={styles.tipCard}>
              <Heart size={16} color={Colors.primary[600]} />
              <Text style={styles.tipText}>Join a Bible study group</Text>
            </View>
            <View style={styles.tipCard}>
              <TrendingUp size={16} color={Colors.primary[600]} />
              <Text style={styles.tipText}>Practice with easier questions first</Text>
            </View>
          </View>
        )}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  content: {
    paddingHorizontal: isTablet ? Spacing['2xl'] : Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  gradeContainer: {
    marginBottom: Spacing.lg,
  },
  gradeBadge: {
    width: isTablet ? 100 : 80,
    height: isTablet ? 100 : 80,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradeText: {
    fontSize: isTablet ? Typography.sizes['5xl'] : Typography.sizes['4xl'],
    fontWeight: Typography.weights.black,
    color: 'white',
  },
  title: {
    fontSize: isTablet ? Typography.sizes['4xl'] : Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  performanceEmoji: {
    fontSize: isTablet ? 48 : 40,
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: isTablet ? Typography.sizes.xl : Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.primary[600],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  performanceMessage: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    paddingHorizontal: Spacing.lg,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  scoreCircleContainer: {
    position: 'relative',
    width: isTablet ? 160 : 140,
    height: isTablet ? 160 : 140,
  },
  scoreCircleBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  scoreCircle: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.full,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scoreText: {
    fontSize: isTablet ? Typography.sizes['5xl'] : Typography.sizes['4xl'],
    fontWeight: Typography.weights.black,
  },
  scoreLabel: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
    fontWeight: Typography.weights.medium,
  },
  scoreDetails: {
    marginTop: Spacing.xs,
  },
  scoreDetailText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    fontWeight: Typography.weights.semiBold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  statCard: {
    width: (SCREEN_WIDTH - (isTablet ? Spacing['2xl'] * 2 : Spacing.lg * 2) - Spacing.md * 2) / 3,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statGradient: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  statIcon: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: isTablet ? Typography.sizes['2xl'] : Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
    fontWeight: Typography.weights.medium,
  },
  achievementsSection: {
    marginBottom: Spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
  },
  achievementsScroll: {
    paddingRight: Spacing.lg,
    gap: Spacing.md,
  },
  achievementCard: {
    width: isTablet ? 140 : 120,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  achievementGradient: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  achievementIcon: {
    width: isTablet ? 48 : 40,
    height: isTablet ? 48 : 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  achievementTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
    textAlign: 'center',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: Spacing['2xl'],
  },
  primaryButton: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary[600],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: 'white',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: Colors.neutral[200],
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
  },
  secondaryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[700],
  },
  quoteContainer: {
    marginBottom: Spacing['2xl'],
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  quoteGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quote: {
    fontSize: Typography.sizes.base,
    fontStyle: 'italic',
    color: Colors.primary[700],
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    textAlign: 'center',
  },
  quoteReference: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.primary[600],
  },
  tipsSection: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  tipsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semiBold,
    color: Colors.neutral[800],
    marginBottom: Spacing.sm,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[700],
  },
  sparkleContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
});