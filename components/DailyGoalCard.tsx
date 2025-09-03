import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Plus, Minus } from 'lucide-react-native';

interface DailyGoal {
  id: string;
  title: string;
  target: string;
  current: number;
  completed: boolean;
  icon: string;
  color: string;
}

interface DailyGoalCardProps {
  goal: DailyGoal;
  onUpdate: (goalId: string, value: number) => void;
}

export function DailyGoalCard({ goal, onUpdate }: DailyGoalCardProps) {
  const handleIncrement = () => {
    if (goal.id === 'devotional' || goal.id === 'mood') {
      onUpdate(goal.id, goal.completed ? 0 : 1);
    } else {
      onUpdate(goal.id, goal.current + 5); // Add 5 minutes
    }
  };

  const handleDecrement = () => {
    if (goal.id === 'devotional' || goal.id === 'mood') {
      onUpdate(goal.id, 0);
    } else {
      onUpdate(goal.id, Math.max(0, goal.current - 5)); // Subtract 5 minutes, min 0
    }
  };

  const getProgressText = () => {
    if (goal.id === 'devotional') {
      return goal.completed ? 'Completed' : 'Not completed';
    }
    if (goal.id === 'mood') {
      return goal.completed ? 'Recorded' : 'Not recorded';
    }
    return `${goal.current} minutes`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={goal.completed ? [goal.color, `${goal.color}CC`] : ['#F9FAFB', '#F3F4F6']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{goal.icon}</Text>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, goal.completed && styles.completedTitle]}>
              {goal.title}
            </Text>
            <Text style={[styles.target, goal.completed && styles.completedTarget]}>
              {goal.target}
            </Text>
          </View>
          {goal.completed && (
            <View style={styles.checkContainer}>
              <Check size={20} color="white" />
            </View>
          )}
        </View>

        <View style={styles.progressSection}>
          <Text style={[styles.progressText, goal.completed && styles.completedProgressText]}>
            {getProgressText()}
          </Text>
          
          {!goal.completed && (goal.id === 'bible_reading' || goal.id === 'prayer') && (
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton} onPress={handleDecrement}>
                <Minus size={16} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleIncrement}>
                <Plus size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
          
          {!goal.completed && (goal.id === 'devotional' || goal.id === 'mood') && (
            <TouchableOpacity style={styles.markCompleteButton} onPress={handleIncrement}>
              <Text style={styles.markCompleteText}>Mark Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  gradient: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  icon: {
    fontSize: 24,
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
  completedTitle: {
    color: 'white',
  },
  target: {
    fontSize: 12,
    color: '#6B7280',
  },
  completedTarget: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  completedProgressText: {
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markCompleteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  markCompleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});