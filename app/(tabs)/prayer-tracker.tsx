import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Dimensions,
  TextInput,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  StatusBar,
  useWindowDimensions,
  useColorScheme,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import {
  Plus,
  Trash2,
  Heart,
  Clock,
  Search,
  X,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Calendar,
  Bell,
  Star,
  ArrowLeft,
  Award,
  Flame,
  BarChart3,
  Mic,
  Users,
  BookOpen,
  Lightbulb,
  Zap,
  Share2,
  Download,
  Settings,
  Moon,
  Sun,
  Camera,
  MapPin,
  Timer,
  Coffee,
  Music,
  MoreVertical,
  Edit3,
  CheckCircle2,
  Pause,
  Play,
} from 'lucide-react-native';
import { db } from '@/lib/firebase'; // Assuming you have a Firebase config file
import { collection, addDoc, getDocs, query, where, deleteDoc, updateDoc, doc, orderBy, serverTimestamp } from 'firebase/firestore';
import { Typography, Spacing, BorderRadius, Shadows, Colors } from '@/constants/DesignTokens';
import { useAuth } from '@/hooks/useAuth';
import { Prayer } from '@/lib/types';
import BackgroundGradient from '../../components/BackgroundGradient';
import { router } from 'expo-router';
import AddPrayerModal from '../../components/AddPrayerModal';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Enhanced responsive breakpoints
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

// Responsive spacing and sizing
const getResponsiveSpacing = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

const getResponsiveFontSize = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

// Helper function to ensure emoji visibility
const getEmojiStyle = (baseSize: number) => ({
  fontSize: getResponsiveFontSize(baseSize - 2, baseSize, baseSize + 2),
  fontFamily: Platform.OS === 'ios' ? 'System' : 'Noto Color Emoji',
  textAlign: 'center' as const,
  includeFontPadding: false,
  textAlignVertical: 'center' as const,
  minHeight: getResponsiveFontSize(baseSize - 2, baseSize, baseSize + 2) + 4,
  minWidth: getResponsiveFontSize(baseSize - 2, baseSize, baseSize + 2) + 4,
  lineHeight: getResponsiveFontSize(baseSize - 2, baseSize, baseSize + 2) + 4,
});

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

export default function PrayerTrackerScreen() {
  const { user } = useAuth();
  const tabBarHeight = useBottomTabBarHeight();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'answered' | 'paused'>('all');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const stats = useMemo(() => ({
    total: prayers.length,
    active: prayers.filter(p => p.status === 'active').length,
    answered: prayers.filter(p => p.status === 'answered').length,
    paused: prayers.filter(p => p.status === 'paused').length,
  }), [prayers]);

  useEffect(() => {
    if (user) {
      fetchPrayers();
    } else {
      setPrayers([]);
    }
  }, [user]);

  // Animation effects
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fetchPrayers = async () => {
    if (!user) {
      console.log('No authenticated user found');
      setPrayers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching prayers for user:', user.uid);
      
      const q = query(
        collection(db, 'prayers'),
        where('user_id', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedPrayers: Prayer[] = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        fetchedPrayers.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          category: data.category,
          priority: data.priority,
          status: data.status,
          created_at: data.createdAt?.toDate().toISOString(), // Convert Firebase Timestamp to ISO string
          answered_at: data.answeredAt ? data.answeredAt.toDate().toISOString() : null,
          user_id: data.user_id,
        });
      });
      
      console.log('Prayers fetched successfully:', fetchedPrayers.length, 'prayers');
      setPrayers(fetchedPrayers);
    } catch (error: any) {
      console.error('Error fetching prayers:', error);
      Alert.alert('Error', 'Failed to fetch prayers.');
    } finally {
      setLoading(false);
    }
  };


  const updatePrayerStatus = async (id: string, status: 'active' | 'answered' | 'paused') => {
    if (!user) return;
    try {
      const updateData: any = { status };
      if (status === 'answered') {
        updateData.answeredAt = serverTimestamp();
      } else if (status === 'active') {
        // Reset answeredAt if resuming
        updateData.answeredAt = null;
      }
      
      const prayerDocRef = doc(db, 'prayers', id);
      await updateDoc(prayerDocRef, updateData);

      fetchPrayers(); // Re-fetch to get updated data
    } catch (error: any) {
      console.error('Error updating prayer status:', error);
      Alert.alert('Error', 'Failed to update prayer status');
    }
  };

  const deletePrayer = async (id: string) => {
    if (!user) {
      Alert.alert('Error', 'You need to be logged in to delete prayers');
      return;
    }

    try {
      const prayerDocRef = doc(db, 'prayers', id);
      await deleteDoc(prayerDocRef);
      
      Alert.alert('Success', '🙏 Prayer deleted successfully');
      fetchPrayers();
    } catch (error: any) {
      console.error('Error deleting prayer:', error);
      Alert.alert('Error', 'Failed to delete prayer');
    }
  };


  const filteredPrayers = useMemo(() => {
    let filtered = prayers;
    
    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(prayer => prayer.status === selectedFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(prayer => 
        prayer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prayer.description && prayer.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [prayers, selectedFilter, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPrayers();
    setRefreshing(false);
  };


  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData?.icon || '🙏';
  };

  const getCategoryColor = (category: string) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData?.color || Colors.primary[500];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered': return Colors.success[500];
      case 'paused': return Colors.warning[500];
      default: return Colors.primary[500];
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered': return <CheckCircle2 size={16} color={Colors.success[500]} />;
      case 'paused': return <Pause size={16} color={Colors.warning[500]} />;
      default: return <Heart size={16} color={Colors.primary[500]} />;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  // Prayer Item Component
  const PrayerItem = React.memo(({ prayer, index }: { prayer: Prayer; index: number }) => {
    const itemAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(itemAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, [itemAnim, index]);

    return (
      <Animated.View 
        style={[
          styles.prayerCard,
          {
            opacity: itemAnim,
            transform: [{
              translateY: itemAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            }],
          },
        ]}
      >
        <View style={styles.prayerCardHeader}>
          <View style={styles.prayerCardLeft}>
            <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(prayer.category) + '20' }]}>
              <Text style={styles.categoryEmoji}>{getCategoryIcon(prayer.category)}</Text>
            </View>
            <View style={styles.prayerInfo}>
              <Text style={styles.prayerTitle}>{prayer.title}</Text>
              <View style={styles.prayerMeta}>
                <View style={styles.statusContainer}>
                  {getStatusIcon(prayer.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(prayer.status) }]}>
                    {prayer.status.charAt(0).toUpperCase() + prayer.status.slice(1)}
                  </Text>
                </View>
                <Text style={styles.prayerDate}>
                  {formatDate(prayer.created_at)}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={20} color={Colors.neutral[400]} />
          </TouchableOpacity>
        </View>
        
        {prayer.description && (
          <Text style={styles.prayerDescription} numberOfLines={2}>
            {prayer.description}
          </Text>
        )}

        <View style={styles.prayerActions}>
          {prayer.status === 'active' && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.answeredButton]}
                onPress={() => updatePrayerStatus(prayer.id, 'answered')}
              >
                <CheckCircle2 size={16} color={Colors.success[500]} />
                <Text style={[styles.actionButtonText, { color: Colors.success[500] }]}>
                  Mark Answered
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.pauseButton]}
                onPress={() => updatePrayerStatus(prayer.id, 'paused')}
              >
                <Pause size={16} color={Colors.warning[500]} />
                <Text style={[styles.actionButtonText, { color: Colors.warning[500] }]}>
                  Pause
                </Text>
              </TouchableOpacity>
            </>
          )}
          {prayer.status === 'paused' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.resumeButton]}
              onPress={() => updatePrayerStatus(prayer.id, 'active')}
            >
              <Play size={16} color={Colors.primary[500]} />
              <Text style={[styles.actionButtonText, { color: Colors.primary[500] }]}>
                Resume
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => deletePrayer(prayer.id)}
          >
            <Trash2 size={16} color={Colors.error[500]} />
            <Text style={[styles.actionButtonText, { color: Colors.error[500] }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  });

  // Render function for prayer items
  const renderPrayerItem: ListRenderItem<Prayer> = ({ item: prayer, index }) => {
    return <PrayerItem prayer={prayer} index={index} />;
  };

  // Key extractor for FlatList
  const keyExtractor = (item: Prayer) => item.id;

  // Empty component for FlatList
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🙏</Text>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No prayers found' : 'No prayers yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery 
          ? 'Try adjusting your search terms' 
          : 'Start your prayer journey by adding your first prayer'
        }
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Text style={styles.emptyButtonText}>Add Prayer</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Loading component for FlatList
  const renderLoadingComponent = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary[500]} />
      <Text style={styles.loadingText}>Loading prayers...</Text>
    </View>
  );

  // Scroll indicator component
  const renderScrollIndicator = () => {
    if (!showScrollIndicator || filteredPrayers.length <= 3) return null;
    
    return (
      <Animated.View style={styles.scrollIndicator}>
        <View style={styles.scrollIndicatorTrack}>
          <Animated.View 
            style={[
              styles.scrollIndicatorThumb,
              {
                transform: [{
                  translateY: scrollY.interpolate({
                    inputRange: [0, 1000],
                    outputRange: [0, 200],
                    extrapolate: 'clamp',
                  }),
                }],
              },
            ]}
          />
        </View>
      </Animated.View>
    );
  };

  // Handle scroll events
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowScrollIndicator(offsetY > 50);
        setShowScrollToTop(offsetY > 200);
      },
    }
  );

  // Scroll to top function
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Clean White Header */}
      <View style={styles.headerSimple}>
        <View style={styles.headerSimpleContent}>
          <View style={styles.headerSimpleLeft}>
            <View style={styles.headerSimpleIcon}>
              <Heart size={28} color={Colors.primary[600]} />
            </View>
            <View>
              <Text style={styles.headerSimpleTitle}>Prayer Tracker</Text>
              <Text style={styles.headerSimpleSubtitle}>
                Track your spiritual journey
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.headerSimpleAddButton}
            onPress={() => setIsAddModalVisible(true)}
          >
            <Plus size={20} color={Colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </View>

      <BackgroundGradient>
        {/* Header Card */}
        <View style={styles.headerCardContainer}>
          <View style={styles.headerCard}>
            <View style={styles.headerCardContent}>
              <View style={styles.headerCardIcon}>
                <Heart size={32} color={Colors.primary[600]} />
              </View>
              <View style={styles.headerCardText}>
                <Text style={[styles.headerCardTitle, { color: Colors.neutral[900] }]}>Prayer Journal</Text>
                <Text style={[styles.headerCardDescription, { color: Colors.neutral[700] }]}>Track your spiritual journey</Text>
                
                {/* Quick Stats */}
                <View style={styles.quickStatsContainer}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: Colors.neutral[900] }]}>{stats.total}</Text>
                    <Text style={[styles.statLabel, { color: Colors.neutral[700] }]}>Total</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: Colors.primary[500] }]}>{stats.active}</Text>
                    <Text style={[styles.statLabel, { color: Colors.neutral[700] }]}>Active</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: Colors.success[500] }]}>{stats.answered}</Text>
                    <Text style={[styles.statLabel, { color: Colors.neutral[700] }]}>Answered</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.headerCardActionButton, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}
                onPress={() => setIsAddModalVisible(true)}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Plus size={22} color={Colors.primary[600]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.neutral[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search prayers..."
              placeholderTextColor={Colors.neutral[400]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={Colors.neutral[400]} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(['all', 'active', 'answered', 'paused'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter && styles.filterTabTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced Prayers List with FlatList */}
        <Animated.View 
          style={[
            styles.prayersList,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <FlatList
            ref={flatListRef}
            data={filteredPrayers}
            renderItem={renderPrayerItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor={Colors.primary[500]}
                colors={[Colors.primary[500]]}
                progressBackgroundColor={Colors.white}
              />
            }
            contentContainerStyle={[styles.flatListContent, { paddingBottom: Spacing.xl + tabBarHeight }]}
            ListEmptyComponent={renderEmptyComponent}
            ListHeaderComponent={
              loading && prayers.length === 0 ? renderLoadingComponent : null
            }
            onScroll={handleScroll}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={10}
            windowSize={10}
            getItemLayout={(data, index) => ({
              length: 200, // Approximate item height
              offset: 200 * index,
              index,
            })}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </Animated.View>

        {/* Scroll Indicator */}
        {renderScrollIndicator()}

        {/* Scroll to Top Button */}
        {showScrollToTop && (
          <View style={styles.scrollToTopButton}>
            <TouchableOpacity
              style={styles.scrollToTopButtonInner}
              onPress={scrollToTop}
              activeOpacity={0.8}
            >
              <ChevronRight 
                size={20} 
                color={Colors.white} 
                style={{ transform: [{ rotate: '-90deg' }] }}
              />
            </TouchableOpacity>
          </View>
        )}

        <AddPrayerModal
          isVisible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAddPrayer={async (title, description, category, priority) => {
            setLoading(true);
            try {
              if (!user) {
                Alert.alert('Error', 'User not authenticated.');
                return;
              }
              
              await addDoc(collection(db, 'prayers'), {
                user_id: user.uid,
                title: title.trim(),
                description: description.trim() || null,
                category: category,
                priority: priority,
                status: 'active',
                createdAt: serverTimestamp(),
              });

              Alert.alert('Success', '🙏 Prayer added successfully!');
              setIsAddModalVisible(false);
              fetchPrayers();
            } catch (error: any) {
              console.error('Error adding prayer:', error);
              Alert.alert('Error', `Failed to add prayer: ${error.message || 'Unknown error'}`);
            } finally {
              setLoading(false);
            }
          }}
        />
      </BackgroundGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  
  // Header Styles - Matching Mood Tracker
  headerSimple: {
    paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 12,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    ...Shadows.sm,
  },
  headerSimpleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSimpleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerSimpleIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSimpleTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
  },
  headerSimpleSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    marginTop: 2,
  },
  headerSimpleAddButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.xs,
  },

  // Header Card Styles - Matching Mood Tracker
  headerCardContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 100 : (StatusBar.currentHeight || 0) + 60,
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  headerCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  headerCardIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
    ...Shadows.md,
  },
  headerCardText: {
    flex: 1,
  },
  headerCardTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
  },
  headerCardDescription: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    marginTop: Spacing.xs,
  },
  headerCardActionButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[600],
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.neutral[200],
    marginHorizontal: Spacing.sm,
  },


  // Search Styles
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 16,
    color: Colors.neutral[900],
  },

  // Filter Styles
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  filterTab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.neutral[100],
  },
  filterTabActive: {
    backgroundColor: Colors.primary[500],
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.neutral[600],
  },
  filterTabTextActive: {
    color: Colors.white,
  },

  // Prayers List Styles
  prayersList: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  flatListContent: {
    paddingBottom: Spacing.xl,
  },
  itemSeparator: {
    height: Spacing.sm,
  },

  // Scroll Indicator Styles
  scrollIndicator: {
    position: 'absolute',
    right: Spacing.md,
    top: '50%',
    transform: [{ translateY: -100 }],
    zIndex: 1000,
  },
  scrollIndicatorTrack: {
    width: 4,
    height: 200,
    backgroundColor: Colors.neutral[200],
    borderRadius: 2,
    overflow: 'hidden',
  },
  scrollIndicatorThumb: {
    width: 4,
    height: 40,
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
    opacity: 0.8,
  },

  // Scroll to Top Button Styles
  scrollToTopButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    zIndex: 1000,
  },
  scrollToTopButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },

  // Prayer Card Styles
  prayerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  prayerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  prayerCardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: 4,
  },
  prayerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  prayerDate: {
    fontSize: 12,
    color: Colors.neutral[500],
  },
  moreButton: {
    padding: 4,
  },
  prayerDescription: {
    fontSize: 14,
    color: Colors.neutral[600],
    lineHeight: 20,
    marginBottom: Spacing.md,
  },

  // Prayer Actions Styles
  prayerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  answeredButton: {
    backgroundColor: Colors.success[50],
  },
  pauseButton: {
    backgroundColor: Colors.warning[50],
  },
  resumeButton: {
    backgroundColor: Colors.primary[50],
  },
  deleteButton: {
    backgroundColor: Colors.error[50],
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 16,
    color: Colors.neutral[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.neutral[900],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
