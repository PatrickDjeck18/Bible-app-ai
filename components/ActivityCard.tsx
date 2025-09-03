import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ActivityCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  subtitle: string;
  goalText: string;
  progress: number;
  progressText: string;
  weeklyStats: string;
}

export function ActivityCard({
  icon,
  iconColor,
  title,
  subtitle,
  goalText,
  progress,
  progressText,
  weeklyStats,
}: ActivityCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
          {icon}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.statsContainer}>
          <Text style={styles.weeklyNumber}>{weeklyStats.split(' ')[0]}</Text>
          <Text style={styles.weeklyLabel}>
            {weeklyStats.includes('min') ? 'min this\nweek' : 'days this\nweek'}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.goalText}>{goalText}</Text>
        <Text style={[styles.progressText, { color: iconColor }]}>{progressText}</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${progress}%`, backgroundColor: iconColor }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    alignItems: 'center',
  },
  weeklyNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  weeklyLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});