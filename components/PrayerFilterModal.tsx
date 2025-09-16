import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';

interface PrayerFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedStatus: string;
  selectedCategory: string;
  selectedPriority: string;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onPriorityChange: (priority: string) => void;
}

const PrayerFilterModal: React.FC<PrayerFilterModalProps> = ({
  isVisible,
  onClose,
  selectedStatus,
  selectedCategory,
  selectedPriority,
  onStatusChange,
  onCategoryChange,
  onPriorityChange,
}) => {
  const statusData = [
    { key: 'all', value: 'All' },
    { key: 'active', value: 'Active' },
    { key: 'answered', value: 'Answered' },
    { key: 'paused', value: 'Paused' },
  ];

  const categoryData = [
    { key: 'all', value: 'All' },
    { key: 'personal', value: 'Personal' },
    { key: 'family', value: 'Family' },
    { key: 'health', value: 'Health' },
    { key: 'work', value: 'Work' },
    { key: 'financial', value: 'Financial' },
    { key: 'spiritual', value: 'Spiritual' },
    { key: 'community', value: 'Community' },
    { key: 'gratitude', value: 'Gratitude' },
  ];

  const priorityData = [
    { key: 'all', value: 'All' },
    { key: 'low', value: 'Low' },
    { key: 'medium', value: 'Medium' },
    { key: 'high', value: 'High' },
    { key: 'urgent', value: 'Urgent' },
  ];

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Filter Prayers</Text>
          <ScrollView>
            <Text style={styles.filterTitle}>Status</Text>
            <View style={styles.filterGrid}>
              {statusData.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.filterButton,
                    selectedStatus === item.key && styles.selectedFilter,
                  ]}
                  onPress={() => onStatusChange(item.key)}
                >
                  <Text style={styles.filterText}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterTitle}>Category</Text>
            <View style={styles.filterGrid}>
              {categoryData.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.filterButton,
                    selectedCategory === item.key && styles.selectedFilter,
                  ]}
                  onPress={() => onCategoryChange(item.key)}
                >
                  <Text style={styles.filterText}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterTitle}>Priority</Text>
            <View style={styles.filterGrid}>
              {priorityData.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.filterButton,
                    selectedPriority === item.key && styles.selectedFilter,
                  ]}
                  onPress={() => onPriorityChange(item.key)}
                >
                  <Text style={styles.filterText}>{item.value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
    padding: Spacing.md,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: 'bold',
    color: Colors.neutral[700],
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  filterTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    color: Colors.neutral[700],
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterButton: {
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    width: '48%',
    alignItems: 'center',
  },
  selectedFilter: {
    backgroundColor: Colors.primary[100],
  },
  filterText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[700],
  },
  closeButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  closeButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: 'bold',
    color: Colors.neutral[50],
  },
});

export default PrayerFilterModal;