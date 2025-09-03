import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: any;
}

export default function ModernButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'large',
  icon,
  rightIcon,
  style,
}: ModernButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const loadingRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loading) {
      const rotationAnimation = Animated.loop(
        Animated.timing(loadingRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotationAnimation.start();
      return () => rotationAnimation.stop();
    }
  }, [loading]);

  useEffect(() => {
    // Continuous shimmer effect for primary buttons
    if (variant === 'primary' && !disabled) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.delay(1000),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.delay(2000),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    }
  }, [variant, disabled]);

  const handlePressIn = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.96,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return disabled || loading
          ? ['#9CA3AF', '#6B7280'] as const
          : ['#667eea', '#764ba2', '#f093fb'] as const;
      case 'secondary':
        return disabled || loading
          ? ['#E5E7EB', '#D1D5DB'] as const
          : ['#14B8A6', '#06B6D4', '#0EA5E9'] as const;
      case 'outline':
        return ['transparent', 'transparent'] as const;
      case 'ghost':
        return ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'] as const;
      default:
        return ['#667eea', '#764ba2'] as const;
    }
  };

  const getTextColor = () => {
    if (disabled || loading) return Colors.neutral[400];
    switch (variant) {
      case 'outline':
        return Colors.primary[500];
      case 'ghost':
        return Colors.neutral[700];
      default:
        return 'white';
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'small':
        return { height: 44, paddingHorizontal: Spacing.lg };
      case 'medium':
        return { height: 52, paddingHorizontal: Spacing.xl };
      case 'large':
        return { height: 60, paddingHorizontal: Spacing['2xl'] };
      default:
        return { height: 60, paddingHorizontal: Spacing['2xl'] };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return Typography.sizes.base;
      case 'medium':
        return Typography.sizes.lg;
      case 'large':
        return Typography.sizes.xl;
      default:
        return Typography.sizes.xl;
    }
  };

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const loadingRotate = loadingRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={loading ? `Loading ${title}` : title}
      accessibilityState={{
        disabled: disabled || loading,
      }}
    >
      <Animated.View
        style={[
          styles.buttonContainer,
          getButtonSize(),
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow Effect */}
        {variant === 'primary' && (
          <Animated.View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
                shadowColor: disabled ? Colors.neutral[400] : Colors.primary[400],
              },
            ]}
          />
        )}

        {/* Button Background */}
        <LinearGradient
          colors={getButtonColors()}
          style={[
            styles.gradient,
            variant === 'outline' && styles.outlineButton,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Shimmer Effect */}
          {variant === 'primary' && !disabled && !loading && (
            <View style={styles.shimmerContainer}>
              <Animated.View
                style={[
                  styles.shimmer,
                  {
                    transform: [{ translateX: shimmerTranslateX }],
                  },
                ]}
              >
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(255, 255, 255, 0.4)',
                    'rgba(255, 255, 255, 0.2)',
                    'transparent',
                  ]}
                  style={styles.shimmerGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
          )}

          {/* Button Content */}
          <View style={styles.content}>
            {/* Left Icon */}
            {icon && !loading && (
              <View style={styles.leftIcon}>
                {icon}
              </View>
            )}

            {/* Loading Spinner */}
            {loading && (
              <Animated.View
                style={[
                  styles.loadingContainer,
                  {
                    transform: [{ rotate: loadingRotate }],
                  },
                ]}
              >
                <ActivityIndicator
                  size="small"
                  color={getTextColor()}
                />
              </Animated.View>
            )}

            {/* Button Text */}
            <Text
              style={[
                styles.text,
                {
                  color: getTextColor(),
                  fontSize: getFontSize(),
                  opacity: loading ? 0.7 : 1,
                },
              ]}
            >
              {loading ? 'Loading...' : title}
            </Text>

            {/* Right Icon */}
            {rightIcon && !loading && (
              <View style={styles.rightIcon}>
                {rightIcon}
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  buttonContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: BorderRadius.xl + 4,
    ...Shadows.lg,
  },
  gradient: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: Colors.primary[400],
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
  shimmerGradient: {
    flex: 1,
    transform: [{ skewX: '-20deg' }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  loadingContainer: {
    marginRight: Spacing.sm,
  },
  text: {
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});