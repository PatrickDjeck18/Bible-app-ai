import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, Users, Share, Trash2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { usePrayers } from '@/hooks/usePrayers';
import type { Prayer } from '@/lib/supabase';

export default function EditPrayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { prayers, updatePrayer } = usePrayers();
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [isShared, setIsShared] = useState(false);
  const [isCommunity, setIsCommunity] = useState(false);
  const [loading, setLoading] = useState(false);

  const frequencies = [
    { value: 'daily' as const, label: 'Daily', description: 'Pray every day' },
    { value: 'weekly' as const, label: 'Weekly', description: 'Pray once a week' },
    { value: 'monthly' as const, label: 'Monthly', description: 'Pray once a month' },
  ];

  useEffect(() => {
    if (id && prayers.length > 0) {
      const foundPrayer = prayers.find(p => p.id === id);
      if (foundPrayer) {
        setPrayer(foundPrayer);
        setTitle(foundPrayer.title);
        setDescription(foundPrayer.description || '');
        setFrequency(foundPrayer.frequency);
        setIsShared(foundPrayer.is_shared);
        setIsCommunity(foundPrayer.is_community);
      } else {
        Alert.alert('Error', 'Prayer not found', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    }
  }, [id, prayers]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a prayer title');
      return;
    }

    if (!prayer) return;

    setLoading(true);
    
    const { error } = await updatePrayer(prayer.id, {
      title: title.trim(),
      description: description.trim() || null,
      frequency,
      is_shared: isShared,
      is_community: isCommunity,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to update prayer. Please try again.');
    } else {
      Alert.alert('Success', 'Prayer updated successfully! 🙏', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  const handleMarkAsAnswered = () => {
    if (!prayer) return;

    Alert.alert(
      'Mark as Answered',
      'Are you sure you want to mark this prayer as answered?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Answered',
          onPress: async () => {
            setLoading(true);
            const { error } = await updatePrayer(prayer.id, {
              status: 'answered',
              answered_at: new Date().toISOString(),
            });
            setLoading(false);

            if (error) {
              Alert.alert('Error', 'Failed to update prayer');
            } else {
              Alert.alert('Success', 'Prayer marked as answered! 🙏', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            }
          },
        },
      ]
    );
  };

  if (!prayer) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#E8F5E8', '#F0F8F0', '#F8FDF8']}
          style={styles.gradient}
        >
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading prayer...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F5E8', '#F0F8F0', '#F8FDF8']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Edit Prayer</Text>
              <Text style={styles.headerSubtitle}>
                {prayer.status === 'answered' ? 'Answered Prayer' : 'Update your prayer'}
              </Text>
            </View>
            <View style={styles.headerRight}>
              {prayer.status === 'active' && (
                <TouchableOpacity 
                  style={styles.answeredButton}
                  onPress={handleMarkAsAnswered}
                >
                  <Text style={styles.answeredButtonText}>Mark Answered</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Status Badge */}
          {prayer.status === 'answered' && (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>✅ This prayer has been answered</Text>
              <Text style={styles.statusDate}>
                Answered on {new Date(prayer.answered_at!).toLocaleDateString()}
              </Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {/* Prayer Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prayer Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="What would you like to pray about?"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#9CA3AF"
                maxLength={100}
                editable={prayer.status === 'active'}
              />
              <Text style={styles.charCount}>{title.length}/100</Text>
            </View>

            {/* Prayer Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prayer Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share more details about your prayer request..."
                value={description}
                onChangeText={setDescription}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
                editable={prayer.status === 'active'}
              />
              <Text style={styles.charCount}>{description.length}/500</Text>
            </View>

            {/* Frequency Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prayer Frequency</Text>
              <Text style={styles.sublabel}>How often would you like to be reminded?</Text>
              <View style={styles.frequencyContainer}>
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq.value}
                    style={[
                      styles.frequencyOption,
                      frequency === freq.value && styles.selectedFrequency,
                      prayer.status === 'answered' && styles.disabledOption
                    ]}
                    onPress={() => prayer.status === 'active' && setFrequency(freq.value)}
                    disabled={prayer.status === 'answered'}
                  >
                    <Text style={[
                      styles.frequencyLabel,
                      frequency === freq.value && styles.selectedFrequencyLabel,
                      prayer.status === 'answered' && styles.disabledText
                    ]}>
                      {freq.label}
                    </Text>
                    <Text style={[
                      styles.frequencyDescription,
                      frequency === freq.value && styles.selectedFrequencyDescription,
                      prayer.status === 'answered' && styles.disabledText
                    ]}>
                      {freq.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Prayer Options */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prayer Options</Text>
              
              <TouchableOpacity
                style={[styles.optionRow, prayer.status === 'answered' && styles.disabledOption]}
                onPress={() => prayer.status === 'active' && setIsShared(!isShared)}
                disabled={prayer.status === 'answered'}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: '#3B82F6' }]}>
                    <Share size={20} color="white" />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, prayer.status === 'answered' && styles.disabledText]}>
                      Shared Prayer
                    </Text>
                    <Text style={[styles.optionDescription, prayer.status === 'answered' && styles.disabledText]}>
                      Allow others to see and pray for this
                    </Text>
                  </View>
                </View>
                <View style={[styles.checkbox, isShared && styles.checkedBox]}>
                  {isShared && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionRow, prayer.status === 'answered' && styles.disabledOption]}
                onPress={() => prayer.status === 'active' && setIsCommunity(!isCommunity)}
                disabled={prayer.status === 'answered'}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: '#8B5CF6' }]}>
                    <Users size={20} color="white" />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, prayer.status === 'answered' && styles.disabledText]}>
                      Community Prayer
                    </Text>
                    <Text style={[styles.optionDescription, prayer.status === 'answered' && styles.disabledText]}>
                      Share with your church community
                    </Text>
                  </View>
                </View>
                <View style={[styles.checkbox, isCommunity && styles.checkedBox]}>
                  {isCommunity && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Submit Button */}
        {prayer.status === 'active' && (
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Heart size={20} color="white" />
              <Text style={styles.submitButtonText}>
                {loading ? 'Updating Prayer...' : 'Update Prayer'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for floating tab bar
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerRight: {
    minWidth: 100,
    alignItems: 'flex-end',
  },
  answeredButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  answeredButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginBottom: 4,
  },
  statusDate: {
    fontSize: 14,
    color: '#047857',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  sublabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  frequencyContainer: {
    gap: 12,
  },
  frequencyOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedFrequency: {
    backgroundColor: '#10B981',
  },
  disabledOption: {
    opacity: 0.6,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  selectedFrequencyLabel: {
    color: 'white',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  frequencyDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedFrequencyDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 100,
  },
  submitContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});