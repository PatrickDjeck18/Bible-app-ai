import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
}

export function CircularProgress({ percentage, size, strokeWidth, color }: CircularProgressProps) {
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;
  
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Progress circle behind */}
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          opacity={1}
        />
      </Svg>
      {/* Percentage text on top */}
      <View style={styles.textContainer}>
        <Text style={[styles.percentage, { color: 'white' }]}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
    zIndex: 1,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});