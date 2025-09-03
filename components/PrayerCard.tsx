import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MoveVertical as MoreVertical, Heart, Calendar, Users, Bell, Share, Check, MessageCircle, Church, Target, BookOpen, Clock, Star, Globe } from 'lucide-react-native';
import type { Prayer } from '@/lib/supabase';

interface PrayerCardProps {
  prayer: Prayer;
  onEdit: (prayerId: string) => void;
  onMarkAnswered: (prayerId: string) => void;
  onMarkPrayed?: (prayerId: string) => void;
}

export function PrayerCard({ prayer, onEdit, onMarkAnswered, onMarkPrayed }: PrayerCardProps) {
  const getIcon = () => {
    if (prayer.status === 'answered') {
      return <Check size={20} color="white" />;
    }
    
    // Choose icon based on prayer content or frequency
    if (prayer.is_community) {
      return <Church size={20} color="white" />;
    }
    
    return <MessageCircle size={20} color="white" />;
  };

  const getIconColor = () => {
    if (prayer.status === 'answered') {
      return '#10B981';
    }
    
    if (prayer.is_community) {
      return '#8B5CF6';
    }
    
    return '#3B82F6';
  };

  const getCategoryIcon = () => {
    switch (prayer.category) {
      case 'personal': return <Heart size={16} color="white" />;
      case 'family': return <Users size={16} color="white" />;
      case 'health': return <Heart size={16} color="white" />;
      case 'work': return <Target size={16} color="white" />;
      case 'spiritual': return <BookOpen size={16} color="white" />;
      case 'community': return <Users size={16} color="white" />;
      case 'world': return <Globe size={16} color="white" />;
      default: return <MessageCircle size={16} color="white" />;
    }
  };

  const getCategoryColor = () => {
    switch (prayer.category) {
      case 'personal': return '#3B82F6';
      case 'family': return '#8B5CF6';
      case 'health': return '#EF4444';
      case 'work': return '#F59E0B';
      case 'spiritual': return '#10B981';
      case 'community': return '#8B5CF6';
      case 'world': return '#6366F1';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = () => {
    switch (prayer.priority) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'urgent': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusColor = () => {
    switch (prayer.status) {
      case 'active': return '#3B82F6';
      case 'answered': return '#10B981';
      case 'paused': return '#F59E0B';
      case 'archived': return '#6B7280';
      default: return '#3B82F6';
    }
  };

  const getFrequencyColor = () => {
    switch (prayer.frequency) {
      case 'daily': return '#10B981';
      case 'weekly': return '#F59E0B';
      case 'monthly': return '#8B5CF6';
      case 'custom': return '#6366F1';
      default: return '#6B7280';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  };

  const formatDuration = () => {
    if (prayer.status === 'answered' && prayer.answered_at) {
      const startDate = new Date(prayer.created_at);
      const endDate = new Date(prayer.answered_at);
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      return `${diffInDays} days`;
    }
    return null;
  };

  const handleMenuPress = () => {
    const options = ['Edit Prayer'];
    
    if (prayer.status === 'active') {
      options.push('Mark as Prayed');
      options.push('Mark as Answered');
    }
    
    if (prayer.status === 'paused') {
      options.push('Resume Prayer');
    }
    
    options.push('Cancel');

    Alert.alert(
      'Prayer Options',
      'What would you like to do?',
      [
        {
          text: 'Edit Prayer',
          onPress: () => onEdit(prayer.id),
        },
        ...(prayer.status === 'active' ? [
          {
            text: 'Mark as Prayed',
            onPress: () => onMarkPrayed?.(prayer.id),
          },
          {
            text: 'Mark as Answered',
            onPress: () => onMarkAnswered(prayer.id),
          }
        ] : []),
        ...(prayer.status === 'paused' ? [{
          text: 'Resume Prayer',
          onPress: () => onEdit(prayer.id),
        }] : []),
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
            {getIcon()}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{prayer.title}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
                <Text style={styles.statusText}>
                  {prayer.status.charAt(0).toUpperCase() + prayer.status.slice(1)}
                </Text>
              </View>
              <Text style={styles.timeAgo}>{formatTimeAgo(prayer.created_at)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          {prayer.status === 'answered' && (
            <TouchableOpacity style={styles.heartButton}>
              <Heart size={20} color="#EC4899" fill="#EC4899" />
            </TouchableOpacity>
          )}
          {prayer.status === 'active' && onMarkPrayed && (
            <TouchableOpacity 
              style={styles.prayNowButton}
              onPress={() => onMarkPrayed(prayer.id)}
            >
              <Heart size={16} color="white" />
              <Text style={styles.prayNowText}>Pray</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <MoreVertical size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      {prayer.description && (
        <Text style={styles.description}>{prayer.description}</Text>
      )}

      {/* Prayer Notes */}
      {prayer.prayer_notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Prayer Points:</Text>
          <Text style={styles.notesText}>{prayer.prayer_notes}</Text>
        </View>
      )}

      {/* Gratitude Notes */}
      {prayer.gratitude_notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Gratitude:</Text>
          <Text style={styles.notesText}>{prayer.gratitude_notes}</Text>
        </View>
      )}

      {/* Answered Notes */}
      {prayer.answered_notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Answer Notes:</Text>
          <Text style={styles.notesText}>{prayer.answered_notes}</Text>
        </View>
      )}

      {/* Category and Priority */}
      <View style={styles.metaRow}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
          {getCategoryIcon()}
          <Text style={styles.categoryText}>{prayer.category}</Text>
        </View>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
          <Star size={14} color="white" />
          <Text style={styles.priorityText}>{prayer.priority}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.metaItem}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.metaText}>
              Started: {new Date(prayer.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Bell size={14} color="#6B7280" />
            <Text style={styles.metaText}>{prayer.frequency}</Text>
          </View>
          {prayer.last_prayed_at && (
            <View style={styles.metaItem}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.metaText}>
                Last prayed: {formatTimeAgo(prayer.last_prayed_at)}
              </Text>
            </View>
          )}
          {prayer.prayer_count > 0 && (
            <View style={styles.metaItem}>
              <Heart size={14} color="#6B7280" />
              <Text style={styles.metaText}>
                Prayed {prayer.prayer_count} time{prayer.prayer_count > 1 ? 's' : ''}
              </Text>
            </View>
          )}
          {prayer.is_shared && (
            <View style={styles.metaItem}>
              <Share size={14} color="#6B7280" />
              <Text style={styles.metaText}>Shared prayer</Text>
            </View>
          )}
          {prayer.is_community && (
            <View style={styles.metaItem}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.metaText}>Community prayer</Text>
            </View>
          )}
        </View>
        
        <View style={styles.footerRight}>
          {formatDuration() && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{formatDuration()}</Text>
            </View>
          )}
          <View style={[styles.frequencyBadge, { backgroundColor: getFrequencyColor() }]}>
            <Text style={styles.frequencyText}>{prayer.frequency}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  answeredStatus: {
    color: '#10B981',
  },
  activeStatus: {
    color: '#3B82F6',
  },
  timeAgo: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heartButton: {
    padding: 4,
  },
  menuButton: {
    padding: 4,
  },
  prayNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
  },
  prayNowText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    marginBottom: 16,
  },
  notesSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    flex: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationBadge: {
    backgroundColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
  },
  frequencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  frequencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
});