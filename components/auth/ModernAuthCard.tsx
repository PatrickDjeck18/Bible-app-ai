import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '@/constants/DesignTokens';

interface ModernAuthCardProps {
  children: React.ReactNode;
  style?: any;
}

export default function ModernAuthCard({ children, style }: ModernAuthCardProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.cardContainer}>
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius['2xl'],
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  content: {
    padding: Spacing['2xl'],
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['3xl'],
  },
});