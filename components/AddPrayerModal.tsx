import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';
import { Plus, X } from 'lucide-react-native';

interface AddPrayerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onAddPrayer: (title: string, description: string, category: string, priority: string) => void;
}

const AddPrayerModal: React.FC<AddPrayerModalProps> = ({ isVisible, onClose, onAddPrayer }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
  const [formCategory, setFormCategory] = useState('personal');
  const [formPriority, setFormPriority] = useState('medium');

  const categories = [
    { id: 'personal', label: 'Personal', icon: '🙏', color: Colors.primary[500] },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', color: Colors.error[500] },
    { id: 'health', label: 'Health', icon: '🏥', color: Colors.success[500] },
    { id: 'work', label: 'Work', icon: '💼', color: Colors.warning[500] },
    { id: 'financial', label: 'Financial', icon: '💰', color: Colors.secondary[500] },
    { id: 'spiritual', label: 'Spiritual', icon: '✝️', color: Colors.primary[600] },
    { id: 'community', label: 'Community', icon: '🏘️', color: Colors.primary[500] },
    { id: 'gratitude', label: 'Gratitude', icon: '🙌', color: Colors.warning[500] },
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: Colors.neutral[400], icon: '🟢' },
    { id: 'medium', label: 'Medium', color: Colors.warning[500], icon: '🟡' },
    { id: 'high', label: 'High', color: Colors.error[500], icon: '🟠' },
    { id: 'urgent', label: 'Urgent', color: Colors.error[700], icon: '🔴' },
  ];

  const handleAddPrayer = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a prayer title');
      return;
    }

    onAddPrayer(title, description, formCategory, formPriority);
    setTitle('');
    setDescription('');
    setFormCategory("personal");
    setFormPriority("medium");
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Prayer</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={Colors.neutral[600]} />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Prayer Title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={Colors.neutral[400]}
              />
              
              <TextInput
                style={styles.textArea}
                placeholder="Description (optional)"
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                placeholderTextColor={Colors.neutral[400]}
              />
              
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      formCategory === category.id && styles.selectedCategory
                    ]}
                    onPress={() => setFormCategory(category.id)}
                  >
                    <Text style={styles.categoryText}>{category.icon} {category.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Priority</Text>
              <View style={styles.priorityGrid}>
                {priorities.map((priority) => (
                  <TouchableOpacity
                    key={priority.id}
                    style={[
                      styles.priorityButton,
                      formPriority === priority.id && styles.selectedPriority
                    ]}
                    onPress={() => setFormPriority(priority.id)}
                  >
                    <Text style={styles.priorityText}>{priority.icon} {priority.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddPrayer}
              >
                <Text style={styles.submitButtonText}>Add Prayer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral[900],
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  textArea: {
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    minHeight: 100,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryButton: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  selectedCategory: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[500],
  },
  categoryText: {
    fontSize: 14,
    color: Colors.neutral[700],
    textAlign: 'center',
    fontWeight: '500',
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  priorityButton: {
    backgroundColor: Colors.neutral[100],
    borderRadius: 12,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    width: '48%',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  selectedPriority: {
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[500],
  },
  priorityText: {
    fontSize: 14,
    color: Colors.neutral[700],
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: 12,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default AddPrayerModal;