import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { Svg, Path } from 'react-native-svg';

// Google Icon Component
const GoogleIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18">
    <Path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      fill="#4285F4"
    />
    <Path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      fill="#34A853"
    />
    <Path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <Path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </Svg>
);

interface SocialLoginButtonProps {
  provider: 'google' | 'apple' | 'facebook';
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

export default function SocialLoginButton({
  provider,
  onPress,
  disabled = false,
  style,
}: SocialLoginButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (!disabled) {
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
    if (!disabled) {
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

  const getProviderConfig = () => {
    switch (provider) {
      case 'google':
        return {
          colors: ['#ffffff', '#ffffff'] as const,
          textColor: '#3c4043',
          borderColor: '#dadce0',
          text: 'Continue with Google',
          shadowColor: '#4285f4',
          useCustomIcon: true,
        };
      case 'apple':
        return {
          colors: ['#000000', '#1a1a1a'] as const,
          textColor: '#ffffff',
          borderColor: '#333333',
          text: 'Continue with Apple',
          shadowColor: '#000000',
          useCustomIcon: false,
        };
      case 'facebook':
        return {
          colors: ['#1877f2', '#166fe5'] as const,
          textColor: '#ffffff',
          borderColor: '#1877f2',
          text: 'Continue with Facebook',
          shadowColor: '#1877f2',
          useCustomIcon: false,
        };
      default:
        return {
          colors: ['#ffffff', '#f8f9fa'] as const,
          textColor: '#1f2937',
          borderColor: '#e5e7eb',
          text: 'Continue',
          shadowColor: '#6b7280',
          useCustomIcon: false,
        };
    }
  };

  const config = getProviderConfig();
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={config.text}
      accessibilityState={{
        disabled: disabled,
      }}
    >
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow Effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: glowOpacity,
              shadowColor: disabled ? Colors.neutral[400] : config.shadowColor,
            },
          ]}
        />

        {/* Button Background */}
        <LinearGradient
          colors={disabled ? ['#f3f4f6', '#e5e7eb'] as const : config.colors}
          style={[
            styles.gradient,
            {
              borderColor: disabled ? Colors.neutral[300] : config.borderColor,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {/* Button Content */}
          <View style={styles.content}>
            {/* Provider Icon */}
            <View style={styles.iconContainer}>
              {config.useCustomIcon && provider === 'google' ? (
                <GoogleIcon />
              ) : (
                <Text style={styles.icon}>
                  {provider === 'apple' ? '🍎' : provider === 'facebook' ? '📘' : '🔗'}
                </Text>
              )}
            </View>

            {/* Button Text */}
            <Text
              style={[
                styles.text,
                {
                  color: disabled ? Colors.neutral[400] : config.textColor,
                },
              ]}
            >
              {config.text}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  buttonContainer: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: BorderRadius.xl + 2,
    ...Shadows.md,
  },
  gradient: {
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...Shadows.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  iconContainer: {
    marginRight: Spacing.md,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  text: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
});