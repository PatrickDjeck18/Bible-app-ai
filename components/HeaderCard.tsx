import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bookmark } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

// Responsive spacing function
const getResponsiveSpacing = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

interface HeaderCardProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightActions?: React.ReactNode;
  gradientColors?: readonly [string, string, ...string[]];
  badgeCount?: number;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightActions,
  gradientColors = Colors.gradients.spiritualLight || ['#fdfcfb', '#e2d1c3', '#c9d6ff'],
  badgeCount,
}) => {
  return (
    <View style={styles.hero}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <View style={styles.heroContent}>
          {/* Back button */}
          {showBackButton && (
            <TouchableOpacity
              style={styles.heroActionButton}
              onPress={onBackPress}
            >
              <ArrowLeft size={20} color={Colors.primary[600]} />
            </TouchableOpacity>
          )}
          
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroSubtitle}>{subtitle}</Text>
          </View>
          
          <View style={styles.heroActions}>
            {rightActions}
            {badgeCount !== undefined && badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{badgeCount}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingTop: (Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0) + getResponsiveSpacing(Spacing['3xl'], Spacing['4xl'], Spacing['5xl']),
    paddingBottom: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
  },
  heroGradient: {
    paddingHorizontal: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
    paddingVertical: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    borderRadius: BorderRadius.lg,
    marginHorizontal: getResponsiveSpacing(2, 4, 6),
    ...Shadows.md,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextBlock: {
    flex: 1,
  },
  heroTitle: {
    fontSize: getResponsiveSpacing(Typography.sizes['2xl'], Typography.sizes['3xl'], Typography.sizes['4xl']),
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: getResponsiveSpacing(Typography.sizes.sm, Typography.sizes.base, Typography.sizes.lg),
    color: Colors.neutral[600],
    lineHeight: Typography.lineHeights.base,
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  heroActionButton: {
    padding: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.md),
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.md,
    minWidth: getResponsiveSpacing(36, 40, 44),
    minHeight: getResponsiveSpacing(36, 40, 44),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error[500],
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: 'white',
  },
});
