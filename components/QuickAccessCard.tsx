import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface QuickAccessCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  meta: string;
  backgroundColor: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // Account for padding and gap

export function QuickAccessCard({ icon, title, subtitle, meta, backgroundColor }: QuickAccessCardProps) {
  return (
    <TouchableOpacity style={[styles.container, { width: cardWidth, backgroundColor }]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.metaContainer}>
        <View style={styles.dot} />
        <Text style={styles.meta}>{meta}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#9CA3AF',
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
  },
});