import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar, CheckCircle, Circle, ArrowRight } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/DesignTokens';

interface ReadingDay {
  day: number;
  reference: string;
  completed: boolean;
  date: string;
}

interface BibleReadingPlanProps {
  title: string;
  description: string;
  totalDays: number;
  currentDay: number;
  days: ReadingDay[];
  onDayPress: (day: number) => void;
  onStartPlan: () => void;
}

export const BibleReadingPlan: React.FC<BibleReadingPlanProps> = ({
  title,
  description,
  totalDays,
  currentDay,
  days,
  onDayPress,
  onStartPlan,
}) => {
  const progress = (currentDay / totalDays) * 100;
  const isPlanStarted = currentDay > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>{currentDay}/{totalDays}</Text>
          <Text style={styles.progressLabel}>days</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[styles.progressFill, { width: `${progress}%` }]} 
        />
      </View>

      {!isPlanStarted ? (
        <TouchableOpacity style={styles.startButton} onPress={onStartPlan}>
          <Text style={styles.startButtonText}>Start Reading Plan</Text>
          <ArrowRight size={20} color={Colors.white} />
        </TouchableOpacity>
      ) : (
        <View style={styles.daysContainer}>
          <Text style={styles.daysTitle}>Reading Schedule</Text>
          <ScrollView style={styles.daysList} showsVerticalScrollIndicator={false}>
            {days.map((day) => (
              <TouchableOpacity
                key={day.day}
                style={[
                  styles.dayItem,
                  day.completed && styles.completedDay,
                  day.day === currentDay && !day.completed && styles.currentDay
                ]}
                onPress={() => onDayPress(day.day)}
              >
                <View style={styles.dayHeader}>
                  <Text style={styles.dayNumber}>Day {day.day}</Text>
                  {day.completed ? (
                    <CheckCircle size={20} color={Colors.success[500]} />
                  ) : (
                    <Circle size={20} color={Colors.neutral[400]} />
                  )}
                </View>
                <Text style={styles.dayReference}>{day.reference}</Text>
                <Text style={styles.dayDate}>{day.date}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.glass.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
  },
  progressSection: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[600],
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.neutral[500],
    textTransform: 'uppercase',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral[200],
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[600],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: Typography.weights.semibold,
  },
  daysContainer: {
    marginTop: Spacing.sm,
  },
  daysTitle: {
    fontSize: 16,
    fontWeight: Typography.weights.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing.md,
  },
  daysList: {
    maxHeight: 300,
  },
  dayItem: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral[50],
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  completedDay: {
    backgroundColor: Colors.success[50],
    borderColor: Colors.success[200],
  },
  currentDay: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
    borderWidth: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: Typography.weights.semibold,
    color: Colors.neutral[700],
  },
  dayReference: {
    fontSize: 14,
    color: Colors.primary[600],
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  dayDate: {
    fontSize: 12,
    color: Colors.neutral[500],
    fontStyle: 'italic',
  },
});


