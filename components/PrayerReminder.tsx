import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Clock, CheckCircle, X } from 'lucide-react-native';
import { Colors } from '@/constants/DesignTokens';

interface PrayerReminderProps {
  onSetReminder?: (time: string) => void;
  onCancelReminder?: () => void;
}

export default function PrayerReminder({ onSetReminder, onCancelReminder }: PrayerReminderProps) {
  const [reminderTime, setReminderTime] = useState('09:00');
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [nextPrayerTime, setNextPrayerTime] = useState<string>('');

  const prayerTimes = [
    { name: 'Morning Prayer', time: '06:00', icon: '🌅' },
    { name: 'Midday Prayer', time: '12:00', icon: '☀️' },
    { name: 'Evening Prayer', time: '18:00', icon: '🌆' },
    { name: 'Night Prayer', time: '21:00', icon: '🌙' },
  ];

  useEffect(() => {
    // Calculate next prayer time
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    let nextTime = prayerTimes[0];
    for (const prayer of prayerTimes) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      if (prayerMinutes > currentTime) {
        nextTime = prayer;
        break;
      }
    }
    
    setNextPrayerTime(nextTime.time);
  }, []);

  const handleSetReminder = () => {
    if (onSetReminder) {
      onSetReminder(reminderTime);
    }
    setIsReminderSet(true);
    Alert.alert('Reminder Set', `Daily prayer reminder set for ${reminderTime} 🕐`);
  };

  const handleCancelReminder = () => {
    if (onCancelReminder) {
      onCancelReminder();
    }
    setIsReminderSet(false);
    Alert.alert('Reminder Cancelled', 'Prayer reminder has been cancelled');
  };

  const formatTimeUntil = (targetTime: string) => {
    const now = new Date();
    const [hours, minutes] = targetTime.split(':').map(Number);
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    const diff = target.getTime() - now.getTime();
    const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
    const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hoursUntil > 0) {
      return `${hoursUntil}h ${minutesUntil}m`;
    }
    return `${minutesUntil}m`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Bell size={20} color="#667eea" />
            <Text style={styles.headerTitle}>Prayer Reminders</Text>
          </View>
          {isReminderSet && (
            <View style={styles.reminderStatus}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.reminderStatusText}>Active</Text>
            </View>
          )}
        </View>

        {/* Next Prayer Time */}
        <View style={styles.nextPrayerSection}>
          <Text style={styles.nextPrayerLabel}>Next Prayer Time</Text>
          <View style={styles.nextPrayerCard}>
            <Text style={styles.nextPrayerIcon}>🕐</Text>
            <View style={styles.nextPrayerInfo}>
              <Text style={styles.nextPrayerTime}>{nextPrayerTime}</Text>
              <Text style={styles.nextPrayerCountdown}>
                in {formatTimeUntil(nextPrayerTime)}
              </Text>
            </View>
          </View>
        </View>

        {/* Prayer Times Grid */}
        <View style={styles.prayerTimesGrid}>
          {prayerTimes.map((prayer, index) => (
            <View key={index} style={styles.prayerTimeCard}>
              <Text style={styles.prayerIcon}>{prayer.icon}</Text>
              <Text style={styles.prayerName}>{prayer.name}</Text>
              <Text style={styles.prayerTime}>{prayer.time}</Text>
            </View>
          ))}
        </View>

        {/* Reminder Controls */}
        <View style={styles.reminderControls}>
          {!isReminderSet ? (
            <TouchableOpacity style={styles.setReminderButton} onPress={handleSetReminder}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.buttonGradient}
              >
                <Bell size={16} color="white" />
                <Text style={styles.buttonText}>Set Daily Reminder</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cancelReminderButton} onPress={handleCancelReminder}>
              <X size={16} color="#EF4444" />
              <Text style={styles.cancelButtonText}>Cancel Reminder</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Reminder Info */}
        <View style={styles.reminderInfo}>
          <Text style={styles.reminderInfoText}>
            {isReminderSet 
              ? `Daily reminder set for ${reminderTime}. You'll receive a notification to pray.`
              : 'Set a daily reminder to help you maintain a consistent prayer routine.'
            }
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  gradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  reminderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  nextPrayerSection: {
    marginBottom: 20,
  },
  nextPrayerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  nextPrayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  nextPrayerIcon: {
    fontSize: 24,
  },
  nextPrayerInfo: {
    flex: 1,
  },
  nextPrayerTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  nextPrayerCountdown: {
    fontSize: 14,
    color: '#6B7280',
  },
  prayerTimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  prayerTimeCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  prayerIcon: {
    fontSize: 20,
  },
  prayerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  prayerTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
  reminderControls: {
    marginBottom: 16,
  },
  setReminderButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelReminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  reminderInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 12,
  },
  reminderInfoText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
