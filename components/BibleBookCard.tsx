import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface BibleBookCardProps {
  icon: string;
  title: string;
  subtitle: string;
  progress: number;
  progressColor: string;
  backgroundColor: string;
  isReading?: boolean;
  notStarted?: boolean;
}

export function BibleBookCard({ 
  icon, 
  title, 
  subtitle, 
  progress, 
  progressColor, 
  backgroundColor,
  isReading = false,
  notStarted = false
}: BibleBookCardProps) {
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            {isReading && (
              <View style={styles.readingBadge}>
                <Text style={styles.readingText}>Reading</Text>
              </View>
            )}
            {notStarted && (
              <View style={styles.notStartedBadge}>
                <Text style={styles.notStartedText}>Not started</Text>
              </View>
            )}
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progress}%`, 
                    backgroundColor: progressColor 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{progress}% read</Text>
          </View>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  readingBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  readingText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  notStartedBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  notStartedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});