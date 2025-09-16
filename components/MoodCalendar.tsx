import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Colors, Typography, Spacing } from '../constants/DesignTokens';
import { moodCategories } from '../constants/moods';

interface MoodCalendarProps {
  moodHistory: any[];
}

const getMoodEmoji = (moodId: string) => {
  for (const category of Object.values(moodCategories)) {
    const mood = category.moods.find(m => m.id === moodId);
    if (mood) {
      return mood.label.split(' ')[0];
    }
  }
  return '😐';
};

const MoodCalendar: React.FC<MoodCalendarProps> = ({ moodHistory }) => {
  const markedDates = moodHistory.reduce((acc, entry) => {
    const date = new Date(entry.created_at).toISOString().split('T')[0];
    const moodEmoji = getMoodEmoji(entry.mood_id);

    acc[date] = {
      customStyles: {
        container: {
          backgroundColor: Colors.primary[100],
          borderRadius: 20,
        },
        text: {
          color: Colors.primary[800],
          fontWeight: 'bold',
        },
      },
      moodEmoji,
    };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        dayComponent={({ date, state, marking }: { date?: any; state?: string; marking?: any }) => {
          return (
            <View style={styles.dayContainer}>
              <Text style={[styles.dayText, state === 'disabled' ? styles.disabledText : {}]}>
                {date?.day}
              </Text>
              {marking && marking.moodEmoji && (
                <Text style={styles.emoji}>{marking.moodEmoji}</Text>
              )}
            </View>
          );
        }}
        theme={{
          backgroundColor: Colors.white,
          calendarBackground: Colors.white,
          textSectionTitleColor: Colors.neutral[500],
          selectedDayBackgroundColor: Colors.primary[500],
          selectedDayTextColor: Colors.white,
          todayTextColor: Colors.primary[500],
          dayTextColor: Colors.neutral[800],
          textDisabledColor: Colors.neutral[300],
          arrowColor: Colors.primary[500],
          disabledArrowColor: Colors.neutral[300],
          monthTextColor: Colors.neutral[900],
          indicatorColor: Colors.primary[500],
          textDayFontWeight: Typography.weights.regular,
          textMonthFontWeight: Typography.weights.bold,
          textDayHeaderFontWeight: Typography.weights.medium,
          textDayFontSize: Typography.sizes.base,
          textMonthFontSize: Typography.sizes.lg,
          textDayHeaderFontSize: Typography.sizes.sm,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Spacing.lg,
    padding: Spacing.md,
  },
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  dayText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[800],
  },
  disabledText: {
    color: Colors.neutral[300],
  },
  emoji: {
    fontSize: 24,
    position: 'absolute',
  },
});

export default MoodCalendar;
