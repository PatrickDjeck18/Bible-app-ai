import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Heart, BookOpen, Plus, Check, Clock, Trash2, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { usePrayers } from '@/hooks/usePrayers';
import type { Prayer } from '@/lib/supabase';

export default function PrayerJournalScreen() {
  const { prayers, loading, addPrayer, markPrayerAsAnswered, deletePrayer, refetch } = usePrayers();
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Simple form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a prayer title.');
      return;
    }

    const prayerData = {
      title: title.trim(),
      description: description.trim() || null,
      status: 'active' as const,
      category: 'personal' as const,
      priority: 'medium' as const,
      frequency: 'daily' as const,
      is_shared: false,
      is_community: false,
      answered_at: null,
      answered_notes: null,
      prayer_notes: null,
      gratitude_notes: null,
      reminder_time: null,
      reminder_frequency: null,
      last_prayed_at: null,
      prayer_count: 0,
      answered_prayer_count: 0,
    };

    const result = await addPrayer(prayerData);
    
    if (result.error) {
      Alert.alert('Error', 'Failed to add prayer. Please try again.');
      return;
    }

    Alert.alert('Success', 'Prayer added! 🙏');
    setShowAddForm(false);
    setTitle('');
    setDescription('');
  };

  const handleMarkAnswered = async (prayerId: string) => {
    const result = await markPrayerAsAnswered(prayerId);
    if (result.error) {
      Alert.alert('Error', 'Failed to mark prayer as answered.');
    } else {
      Alert.alert('Success', 'Prayer answered! 🎉');
    }
  };

  const handleDelete = (prayer: Prayer) => {
    Alert.alert(
      'Delete Prayer',
      `Delete "${prayer.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePrayer(prayer.id);
            if (result.error) {
              Alert.alert('Error', 'Failed to delete prayer.');
            } else {
              Alert.alert('Success', 'Prayer deleted.');
            }
          },
        },
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <Check size={18} color="#10B981" />;
      case 'active':
        return <Clock size={18} color="#3B82F6" />;
      default:
        return <Heart size={18} color="#8B5CF6" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'answered':
        return 'Answered';
      case 'active':
        return 'Active';
      default:
        return 'Active';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return '#D1FAE5';
      case 'active':
        return '#DBEAFE';
      default:
        return '#F3E8FF';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const answeredCount = prayers.filter(p => p.status === 'answered').length;
  const activeCount = prayers.filter(p => p.status === 'active').length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient 
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']} 
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Modern Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.backButtonGradient}>
                <ArrowLeft size={20} color="#475569" />
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Prayer Journal</Text>
              </View>
              <Text style={styles.headerSubtitle}>Track your spiritual journey</Text>
            </View>
            
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(!showAddForm)}>
              <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.addButtonGradient}>
                <Plus size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Modern Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.statCardGradient}>
                <View style={styles.statIconContainer}>
                  <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.statIconGradient}>
                    <BookOpen size={20} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.statNumber}>{prayers.length}</Text>
                <Text style={styles.statLabel}>Total Prayers</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.statCardGradient}>
                <View style={styles.statIconContainer}>
                  <LinearGradient colors={['#10B981', '#059669']} style={styles.statIconGradient}>
                    <Check size={20} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.statNumber}>{answeredCount}</Text>
                <Text style={styles.statLabel}>Answered</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statCard}>
              <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.statCardGradient}>
                <View style={styles.statIconContainer}>
                  <LinearGradient colors={['#3B82F6', '#2563EB']} style={styles.statIconGradient}>
                    <Clock size={20} color="white" />
                  </LinearGradient>
                </View>
                <Text style={styles.statNumber}>{activeCount}</Text>
                <Text style={styles.statLabel}>Active</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Modern Add Form */}
          {showAddForm && (
            <View style={styles.addFormContainer}>
              <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.addForm}>
                <View style={styles.formHeader}>
                  <View style={styles.formIconContainer}>
                    <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.formIconGradient}>
                      <Plus size={20} color="white" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.formTitle}>New Prayer</Text>
                </View>
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Prayer Title *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="What are you praying for?"
                      value={title}
                      onChangeText={setTitle}
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description (optional)</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Additional details..."
                      value={description}
                      onChangeText={setDescription}
                      placeholderTextColor="#94A3B8"
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => {
                      setShowAddForm(false);
                      setTitle('');
                      setDescription('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.submitGradient}>
                      <Text style={styles.submitButtonText}>Add Prayer</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Modern Prayer List */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.loadingCard}>
                <Text style={styles.loadingText}>Loading your prayers...</Text>
              </LinearGradient>
            </View>
          ) : prayers.length > 0 ? (
            <View style={styles.prayerList}>
              {prayers.map((prayer) => (
                <View key={prayer.id} style={styles.prayerCardContainer}>
                  <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.prayerCard}>
                    <View style={styles.prayerHeader}>
                      <View style={styles.prayerInfo}>
                        <Text style={styles.prayerTitle}>{prayer.title}</Text>
                        <View style={styles.prayerMeta}>
                          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(prayer.status) }]}>
                            {getStatusIcon(prayer.status)}
                            <Text style={styles.prayerStatus}>{getStatusText(prayer.status)}</Text>
                          </View>
                          <Text style={styles.prayerDate}>{formatDate(prayer.created_at)}</Text>
                        </View>
                      </View>
                      
                      <View style={styles.prayerActions}>
                        {prayer.status === 'active' && (
                          <TouchableOpacity
                            style={styles.answerButton}
                            onPress={() => handleMarkAnswered(prayer.id)}
                          >
                            <LinearGradient colors={['#10B981', '#059669']} style={styles.answerButtonGradient}>
                              <Check size={16} color="white" />
                            </LinearGradient>
                          </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDelete(prayer)}
                        >
                          <LinearGradient colors={['#FEF2F2', '#FEE2E2']} style={styles.deleteButtonGradient}>
                            <Trash2 size={16} color="#EF4444" />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {prayer.description && (
                      <Text style={styles.prayerDescription}>{prayer.description}</Text>
                    )}
                  </LinearGradient>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <LinearGradient colors={['#FFFFFF', '#F8FAFC']} style={styles.emptyStateCard}>
                <View style={styles.emptyIconContainer}>
                  <LinearGradient colors={['#E2E8F0', '#CBD5E1']} style={styles.emptyIconGradient}>
                    <BookOpen size={48} color="#64748B" />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyTitle}>Start Your Prayer Journal</Text>
                <Text style={styles.emptySubtitle}>
                  Begin documenting your spiritual journey with your first prayer.
                </Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => setShowAddForm(true)}
                >
                  <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.startButtonGradient}>
                    <Text style={styles.startButtonText}>Add Your First Prayer</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: 20, paddingBottom: 120 },
  
  // Modern Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    gap: 16,
  },
  backButton: { 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleIcon: { marginRight: 8 },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerSubtitle: { 
    fontSize: 16, 
    color: '#64748B',
    fontWeight: '500',
  },
  addButton: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  addButtonGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  // Modern Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  statCardGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  statIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },

  // Modern Add Form
  addFormContainer: {
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  addForm: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  formIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  formIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  inputGroup: { marginBottom: 20 },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#374151', 
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  textArea: { 
    minHeight: 120, 
    textAlignVertical: 'top',
    lineHeight: 24,
  },

  // Form Buttons
  formButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  submitButton: { 
    flex: 2, 
    borderRadius: 18, 
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  submitGradient: { 
    paddingVertical: 18, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  submitButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  // Modern Prayer List
  prayerList: {
    gap: 16,
  },
  prayerCardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  prayerCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  prayerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  prayerStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  prayerDate: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  prayerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  answerButton: {
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  answerButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  deleteButton: {
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  deleteButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  prayerDescription: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    fontWeight: '400',
  },

  // Loading & Empty States
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontWeight: '400',
  },
  startButton: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonGradient: {
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 24,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
