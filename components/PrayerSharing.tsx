import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Share2, Heart, Users, MessageCircle, Eye, Lock, Globe } from 'lucide-react-native';

interface PrayerSharingProps {
  onSharePrayer?: (prayer: SharedPrayer) => void;
}

interface SharedPrayer {
  id: string;
  title: string;
  description: string;
  category: string;
  privacy: 'public' | 'private' | 'friends';
  supportCount: number;
  prayerCount: number;
  createdAt: string;
}

export default function PrayerSharing({ onSharePrayer }: PrayerSharingProps) {
  const [showShareForm, setShowShareForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [privacy, setPrivacy] = useState<'public' | 'private' | 'friends'>('public');

  const categories = [
    { value: 'general', label: 'General', icon: '🙏' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { value: 'work', label: 'Work', icon: '💼' },
    { value: 'spiritual', label: 'Spiritual', icon: '✝️' },
    { value: 'community', label: 'Community', icon: '🏘️' },
  ];

  const privacyOptions = [
    { value: 'public' as const, label: 'Public', icon: Globe, description: 'Visible to everyone' },
    { value: 'friends' as const, label: 'Friends Only', icon: Users, description: 'Visible to your friends' },
    { value: 'private' as const, label: 'Private', icon: Lock, description: 'Only visible to you' },
  ];

  const handleSharePrayer = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Required Fields', 'Please fill in both title and description.');
      return;
    }

    const sharedPrayer: SharedPrayer = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      category,
      privacy,
      supportCount: 0,
      prayerCount: 0,
      createdAt: new Date().toISOString(),
    };

    if (onSharePrayer) {
      onSharePrayer(sharedPrayer);
    }

    Alert.alert('Prayer Shared', 'Your prayer request has been shared successfully! 🙏');
    setShowShareForm(false);
    setTitle('');
    setDescription('');
    setCategory('general');
    setPrivacy('public');
  };

  const renderPrivacyOption = (option: typeof privacyOptions[0]) => (
    <TouchableOpacity
      key={option.value}
      style={[
        styles.privacyOption,
        privacy === option.value && styles.selectedPrivacy
      ]}
      onPress={() => setPrivacy(option.value)}
    >
      <option.icon size={16} color={privacy === option.value ? 'white' : '#6B7280'} />
      <View style={styles.privacyInfo}>
        <Text style={[styles.privacyLabel, privacy === option.value && styles.selectedPrivacyText]}>
          {option.label}
        </Text>
        <Text style={[styles.privacyDescription, privacy === option.value && styles.selectedPrivacyText]}>
          {option.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(236, 72, 153, 0.1)', 'rgba(239, 68, 68, 0.1)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Share2 size={20} color="#EC4899" />
            <Text style={styles.headerTitle}>Share Prayer Requests</Text>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => setShowShareForm(!showShareForm)}
          >
            <Text style={styles.shareButtonText}>
              {showShareForm ? 'Cancel' : 'Share Prayer'}
            </Text>
          </TouchableOpacity>
        </View>

        {showShareForm && (
          <View style={styles.shareForm}>
            <Text style={styles.formTitle}>Share Your Prayer Request</Text>
            
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prayer Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="What do you need prayer for?"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#9CA3AF"
                maxLength={100}
              />
              <Text style={styles.charCount}>{title.length}/100</Text>
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share more details about your prayer request..."
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryOption,
                      category === cat.value && styles.selectedCategory
                    ]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={[styles.categoryLabel, category === cat.value && styles.selectedCategoryText]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Privacy Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Privacy Setting</Text>
              <View style={styles.privacyOptions}>
                {privacyOptions.map(renderPrivacyOption)}
              </View>
            </View>

            {/* Share Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSharePrayer}>
              <LinearGradient
                colors={['#EC4899', '#EF4444']}
                style={styles.submitGradient}
              >
                <Share2 size={16} color="white" />
                <Text style={styles.submitButtonText}>Share Prayer Request</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Sharing Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Share Your Prayers?</Text>
          <View style={styles.benefitsGrid}>
            <View style={styles.benefitCard}>
              <Users size={20} color="#EC4899" />
              <Text style={styles.benefitTitle}>Community Support</Text>
              <Text style={styles.benefitText}>Get prayer support from your faith community</Text>
            </View>
            <View style={styles.benefitCard}>
              <Heart size={20} color="#EC4899" />
              <Text style={styles.benefitTitle}>Encouragement</Text>
              <Text style={styles.benefitText}>Receive encouragement and hope from others</Text>
            </View>
            <View style={styles.benefitCard}>
              <MessageCircle size={20} color="#EC4899" />
              <Text style={styles.benefitTitle}>Connection</Text>
              <Text style={styles.benefitText}>Build deeper relationships through shared prayer</Text>
            </View>
            <View style={styles.benefitCard}>
              <Eye size={20} color="#EC4899" />
              <Text style={styles.benefitTitle}>Accountability</Text>
              <Text style={styles.benefitText}>Stay accountable to your prayer commitments</Text>
            </View>
          </View>
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
    marginBottom: 20,
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
  shareButton: {
    backgroundColor: '#EC4899',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  shareForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryOption: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCategory: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  selectedCategoryText: {
    color: 'white',
  },
  privacyOptions: {
    gap: 8,
  },
  privacyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedPrivacy: {
    backgroundColor: '#EC4899',
    borderColor: '#EC4899',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  privacyDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedPrivacyText: {
    color: 'white',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  benefitsSection: {
    marginTop: 20,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  benefitCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  benefitText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});
