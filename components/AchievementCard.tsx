import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface AchievementCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3; // Account for padding and gaps

export function AchievementCard({ 
  icon, 
  iconColor, 
  title, 
  subtitle, 
  backgroundColor 
}: AchievementCardProps) {
  return (
    <TouchableOpacity style={[styles.container, { width: cardWidth, backgroundColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
        {icon}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});