import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadows, BorderRadius, Spacing, Typography } from '@/constants/DesignTokens';

interface ProgressCardProps {
  number: string;
  label: string;
  color: string;
}

export function ProgressCard({ number, label, color }: ProgressCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const numberAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(numberAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const numberScale = numberAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 1],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={[Colors.glass.cardDark, Colors.glass.card]}
        style={styles.cardGradient}
      >
        <View style={styles.backgroundPattern}>
          <LinearGradient
            colors={[`${color}15`, `${color}08`]}
            style={styles.patternGradient}
          />
        </View>
        
        <Animated.View style={[{ transform: [{ scale: numberScale }] }]}>
          <LinearGradient
            colors={[color, `${color}E6`, `${color}CC`]}
            style={styles.numberContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.number}>{number}</Text>
            <View style={[styles.numberHighlight, { backgroundColor: `${color}40` }]} />
          </LinearGradient>
        </Animated.View>
        
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.md,
  },
  cardGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.glass.light,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xl,
  },
  patternGradient: {
    flex: 1,
    borderRadius: BorderRadius.xl,
  },
  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
    ...Shadows.sm,
  },
  numberHighlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    height: '40%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  number: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.extraBold,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[700],
    textAlign: 'center',
    lineHeight: Typography.lineHeights.tight * Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    letterSpacing: Typography.letterSpacing.wide,
    flexShrink: 1,
  },
});