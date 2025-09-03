import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, BorderRadius, Spacing, Typography } from '@/constants/DesignTokens';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface ActionButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  backgroundColor: string;
  gradientColors?: string[];
  onPress?: () => void;
}

export function ActionButton({ icon, title, subtitle, backgroundColor, gradientColors, onPress }: ActionButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={styles.container} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={[`${backgroundColor}20`, `${backgroundColor}10`]}
          style={styles.quickActionGradient}
        >
          <LinearGradient
            colors={[backgroundColor, `${backgroundColor}CC`]}
            style={styles.quickActionIcon}
          >
            {icon}
          </LinearGradient>
          <Text style={styles.quickActionTitle}>{title}</Text>
          <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: (width - 60) / 2,
    aspectRatio: 1, // Make all cards square
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});