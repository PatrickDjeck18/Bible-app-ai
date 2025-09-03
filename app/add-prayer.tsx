import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, Users, Share, Calendar, Target, BookOpen, Bell, Globe, MoreHorizontal } from 'lucide-react-native';
import { router } from 'expo-router';
import { usePrayers } from '@/hooks/usePrayers';
import { Colors } from '@/constants/DesignTokens';

export default function AddPrayerScreen() {
  const { addPrayer } = usePrayers();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [category, setCategory] = useState<'personal' | 'family' | 'health' | 'work' | 'spiritual' | 'community' | 'world' | 'other'>('personal');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [prayerNotes, setPrayerNotes] = useState('');
  const [gratitudeNotes, setGratitudeNotes] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isCommunity, setIsCommunity] = useState(false);
  const [enableReminders, setEnableReminders] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [loading, setLoading] = useState(false);

  const frequencies = [
    { value: 'daily' as const, label: 'Daily', description: 'Pray every day', icon: Calendar },
    { value: 'weekly' as const, label: 'Weekly', description: 'Pray once a week', icon: Calendar },
    { value: 'monthly' as const, label: 'Monthly', description: 'Pray once a month', icon: Calendar },
    { value: 'custom' as const, label: 'Custom', description: 'Set your own frequency', icon: Calendar },
  ];

  const categories = [
    { value: 'personal' as const, label: 'Personal', color: '#3B82F6', icon: Heart },
    { value: 'family' as const, label: 'Family', color: '#8B5CF6', icon: Users },
    { value: 'health' as const, label: 'Health', color: '#EF4444', icon: Heart },
    { value: 'work' as const, label: 'Work', color: '#F59E0B', icon: Target },
    { value: 'spiritual' as const, label: 'Spiritual', color: '#10B981', icon: BookOpen },
    { value: 'community' as const, label: 'Community', color: '#8B5CF6', icon: Users },
    { value: 'world' as const, label: 'World', color: '#6366F1', icon: Globe },
    { value: 'other' as const, label: 'Other', color: '#6B7280', icon: MoreHorizontal },
  ];

  const priorities = [
    { value: 'low' as const, label: 'Low', color: '#10B981', description: 'Can wait' },
    { value: 'medium' as const, label: 'Medium', color: '#F59E0B', description: 'Normal priority' },
    { value: 'high' as const, label: 'High', color: '#EF4444', description: 'Important' },
    { value: 'urgent' as const, label: 'Urgent', color: '#DC2626', description: 'Needs immediate attention' },
  ];

  const prayerTemplates = [
    { id: 1, title: 'Morning Prayer', description: 'Start your day with a focused prayer.', icon: Heart, color: '#EF4444' },
    { id: 2, title: 'Thanksgiving', description: 'Express gratitude for all the good in your life.', icon: Users, color: '#10B981' },
    { id: 3, title: 'Intercession', description: 'Pray for others and ask God for their needs.', icon: Bell, color: '#F59E0B' },
    { id: 4, title: 'General Prayer', description: 'A general prayer for guidance and strength.', icon: BookOpen, color: '#3B82F6' },
  ];

  const applyTemplate = (template: typeof prayerTemplates[0]) => {
    setTitle(template.title);
    setDescription(template.description);
    setCategory('personal'); // Default to personal for templates
    setPriority('medium'); // Default to medium for templates
    setFrequency('daily'); // Default to daily for templates
    setIsShared(false);
    setIsCommunity(false);
    setEnableReminders(false);
    setReminderTime('09:00');
    setPrayerNotes('');
    setGratitudeNotes('');
    Alert.alert('Template Applied', `Template "${template.title}" applied.`, [
      { text: 'OK', onPress: () => {} }
    ]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a prayer title');
      return;
    }

    setLoading(true);
    
    const { error } = await addPrayer({
      title: title.trim(),
      description: description.trim() || null,
      status: 'active',
      frequency,
      category,
      priority,
      is_shared: isShared,
      is_community: isCommunity,
      answered_at: null,
      answered_notes: null,
      prayer_notes: prayerNotes.trim() || null,
      gratitude_notes: gratitudeNotes.trim() || null,
      reminder_time: enableReminders ? reminderTime : null,
      reminder_frequency: enableReminders ? frequency : null,
      last_prayed_at: null,
      prayer_count: 0,
      answered_prayer_count: 0,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to add prayer. Please try again.');
    } else {
      Alert.alert('Success', 'Prayer added successfully! 🙏', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  const renderFrequencyOption = (freq: typeof frequencies[0]) => {
    const Icon = freq.icon;
    const isSelected = frequency === freq.value;
    
    return (
      <TouchableOpacity
        key={freq.value}
        style={[styles.optionCard, isSelected && styles.selectedOption]}
        onPress={() => setFrequency(freq.value)}
      >
        <LinearGradient
          colors={isSelected ? ['#667eea', '#764ba2'] : ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
          style={styles.optionGradient}
        >
          <Icon size={24} color={isSelected ? 'white' : '#374151'} />
          <Text style={[styles.optionLabel, isSelected && styles.selectedOptionText]}>
            {freq.label}
          </Text>
          <Text style={[styles.optionDescription, isSelected && styles.selectedOptionText]}>
            {freq.description}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderCategoryOption = (cat: typeof categories[0]) => {
    const Icon = cat.icon;
    const isSelected = category === cat.value;
    
    return (
      <TouchableOpacity
        key={cat.value}
        style={[styles.categoryOption, isSelected && styles.selectedCategory]}
        onPress={() => {
          console.log('Category selected:', cat.value); // Debug log
          setCategory(cat.value);
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
          <Icon size={20} color="white" />
        </View>
        <Text style={[styles.categoryLabel, isSelected && styles.selectedCategoryText]}>
          {cat.label}
        </Text>
        {isSelected && (
          <View style={styles.categoryCheckmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderPriorityOption = (pri: typeof priorities[0]) => {
    const isSelected = priority === pri.value;
    
    return (
      <TouchableOpacity
        key={pri.value}
        style={[styles.priorityOption, isSelected && styles.selectedPriority]}
        onPress={() => setPriority(pri.value)}
      >
        <View style={[styles.priorityIndicator, { backgroundColor: pri.color }]} />
        <View style={styles.priorityContent}>
          <Text style={[styles.priorityLabel, isSelected && styles.selectedPriorityText]}>
            {pri.label}
          </Text>
          <Text style={[styles.priorityDescription, isSelected && styles.selectedPriorityText]}>
            {pri.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#E8F5E8', '#F0F8F0', '#F8FDF8']}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          bounces={true}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Add Prayer</Text>
              <Text style={styles.headerSubtitle}>Share your heart with God</Text>
            </View>
            <View style={styles.headerRight} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Prayer Templates */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prayer Templates</Text>
              <Text style={styles.sublabel}>Choose a template to get started</Text>
              <View style={styles.templatesContainer}>
                {prayerTemplates.map((template) => (
                  <TouchableOpacity
                    key={template.id}
                    style={styles.templateCard}
                    onPress={() => applyTemplate(template)}
                  >
                    <View style={[styles.templateIcon, { backgroundColor: template.color }]}>
                      <template.icon size={24} color="white" />
                    </View>
                    <View style={styles.templateContent}>
                      <Text style={styles.templateTitle}>{template.title}</Text>
                      <Text style={styles.templateDescription}>{template.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

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
              />
              <Text style={styles.charCount}>{title.length}/100</Text>
            </View>

            {/* Prayer Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add more details about your prayer request..."
                value={description}
                onChangeText={setDescription}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
              <Text style={styles.charCount}>{description.length}/500</Text>
            </View>

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoriesGrid}>
                {categories.map(renderCategoryOption)}
              </View>
            </View>

            {/* Priority Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority Level</Text>
              <View style={styles.prioritiesContainer}>
                {priorities.map(renderPriorityOption)}
              </View>
            </View>

            {/* Frequency Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prayer Frequency</Text>
              <View style={styles.frequencyGrid}>
                {frequencies.map(renderFrequencyOption)}
              </View>
            </View>

            {/* Prayer Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prayer Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add specific points to pray about..."
                value={prayerNotes}
                onChangeText={setPrayerNotes}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                maxLength={300}
              />
              <Text style={styles.charCount}>{prayerNotes.length}/300</Text>
            </View>

            {/* Gratitude Notes */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gratitude Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What are you thankful for today?"
                value={gratitudeNotes}
                onChangeText={setGratitudeNotes}
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
                maxLength={300}
              />
              <Text style={styles.charCount}>{gratitudeNotes.length}/300</Text>
            </View>

            {/* Reminder Settings */}
            <View style={styles.inputGroup}>
              <View style={styles.reminderHeader}>
                <Text style={styles.label}>Prayer Reminders</Text>
                <Switch
                  value={enableReminders}
                  onValueChange={setEnableReminders}
                  trackColor={{ false: '#E5E7EB', true: '#667eea' }}
                  thumbColor={enableReminders ? '#4F46E5' : '#9CA3AF'}
                />
              </View>
              {enableReminders && (
                <View style={styles.reminderSettings}>
                  <Text style={styles.reminderLabel}>Reminder Time</Text>
                  <TextInput
                    style={styles.timeInput}
                    value={reminderTime}
                    onChangeText={setReminderTime}
                    placeholder="09:00"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              )}
            </View>

            {/* Privacy Settings */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Privacy Settings</Text>
              <View style={styles.privacyOptions}>
                <TouchableOpacity
                  style={[styles.privacyOption, isShared && styles.selectedPrivacy]}
                  onPress={() => setIsShared(!isShared)}
                >
                  <Share size={20} color={isShared ? 'white' : '#6B7280'} />
                  <Text style={[styles.privacyLabel, isShared && styles.selectedPrivacyText]}>
                    Share Prayer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.privacyOption, isCommunity && styles.selectedPrivacy]}
                  onPress={() => setIsCommunity(!isCommunity)}
                >
                  <Users size={20} color={isCommunity ? 'white' : '#6B7280'} />
                  <Text style={[styles.privacyLabel, isCommunity && styles.selectedPrivacyText]}>
                    Community Prayer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>
                  {loading ? 'Adding Prayer...' : 'Add Prayer'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            {/* Bottom spacing for better scrolling */}
            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
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
    marginBottom: 0,
  },
  scrollContent: {
    paddingBottom: 160, // Increased space for floating tab bar
    flexGrow: 1,
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
    width: 40,
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
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  selectedFrequencyLabel: {
    color: 'white',
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
    height: 140, // Increased height to ensure content scrolls above bottom menu
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
  optionCard: {
    width: '48%', // Adjust as needed for grid layout
    aspectRatio: 1.2,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#667eea',
  },
  selectedOptionText: {
    color: 'white',
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    minHeight: 56,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedCategory: {
    backgroundColor: '#E0E7FF',
    borderColor: '#667eea',
    borderWidth: 3,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedCategoryText: {
    color: '#667eea',
  },
  prioritiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  priorityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priorityContent: {
    flex: 1,
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedPriority: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  selectedPriorityText: {
    color: '#F59E0B',
  },
  priorityDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  timeInput: {
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
  reminderSettings: {
    marginTop: 8,
  },
  privacyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    gap: 10,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  selectedPrivacy: {
    backgroundColor: '#E0E7FF',
    borderColor: '#667eea',
    borderWidth: 2,
  },
  selectedPrivacyText: {
    color: '#667eea',
  },
  submitGradient: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templatesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  templateCard: {
    width: '48%', // Adjust as needed for grid layout
    aspectRatio: 1.2,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  templateIcon: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateContent: {
    padding: 12,
    gap: 4,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  templateDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  categoryCheckmark: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});