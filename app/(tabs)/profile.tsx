import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
  Platform,
} from 'react-native';

import { ArrowLeft, Book, Bell, Heart, Cloud, Shield, HelpCircle, LogOut, User, Settings as SettingsIcon, ChevronRight, X, CreditCard as Edit3, Save, TestTube } from 'lucide-react-native';
import { Colors } from '@/constants/DesignTokens';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { LinearGradient } from 'expo-linear-gradient';
import BackgroundGradient from '@/components/BackgroundGradient';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SettingsScreen() {
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;
  
  const { user, signOut, loading } = useAuth();
  const { profile, updateProfile } = useProfile();
  
  // Simple settings state
  const [dailyVerse, setDailyVerse] = useState(true);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Simple entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Set initial edit name when profile loads
    if (profile?.full_name) {
      setEditName(profile.full_name);
    }
  }, [profile]);

  const handleSignOut = async () => {
    console.log('🔴 Sign out button pressed');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            console.log('🔴 User confirmed sign out');
            try {
              // Show loading state if needed
              const { error } = await signOut();
              console.log('🔴 Sign out result:', { error });
              
              if (error) {
                console.error('🔴 Sign out error:', error);
                Alert.alert('Error', error.message || 'Failed to sign out');
              } else {
                console.log('🔴 Successfully signed out');
                // The auth state change will trigger navigation to login
                // Add a small delay to ensure state updates properly
                setTimeout(() => {
                  console.log('🔴 Navigation should have occurred by now');
                }, 100);
              }
            } catch (error) {
              console.error('🔴 Unexpected sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    setEditName(profile?.full_name || '');
    setShowEditProfile(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    try {
      const { error } = await updateProfile({ full_name: editName.trim() });
      if (error) {
        Alert.alert('Error', 'Failed to update profile');
      } else {
        Alert.alert('Success', 'Profile updated successfully');
        setShowEditProfile(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const [showHelpSupport, setShowHelpSupport] = useState(false);

  const handleHelpSupport = () => {
    setShowHelpSupport(true);
  };

  const handlePrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
  };
  const SimpleSettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    rightElement,
    onPress
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={styles.simpleSettingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          {icon}
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (onPress && <ChevronRight size={20} color="#9CA3AF" />)}
    </TouchableOpacity>
  );

  const PrivacyPolicyModal = () => (
    <Modal
      visible={showPrivacyPolicy}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowPrivacyPolicy(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient
          colors={['#F8FAFC', '#F1F5F9']}
          style={styles.modalGradient}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity onPress={() => setShowPrivacyPolicy(false)}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.privacyContent}>
              <Text style={styles.privacySection}>Last updated: January 2025</Text>
              
              <Text style={styles.privacyHeading}>1. Information We Collect</Text>
              <Text style={styles.privacyText}>
                We collect information you provide directly to us, such as when you create an account, 
                add prayers, track your mood, or use our Bible study features. This includes your name, 
                email address, prayer requests, mood entries, and spiritual notes.
              </Text>
              
              <Text style={styles.privacyHeading}>2. How We Use Your Information</Text>
              <Text style={styles.privacyText}>
                We use your information to provide and improve our services, including personalizing 
                your spiritual journey, sending prayer reminders, and providing AI-powered biblical 
                insights. We never share your personal prayers or spiritual data with third parties.
              </Text>
              
              <Text style={styles.privacyHeading}>3. Data Security</Text>
              <Text style={styles.privacyText}>
                We implement appropriate security measures to protect your personal information. 
                Your data is encrypted in transit and at rest. We use Supabase for secure data 
                storage and authentication.
              </Text>
              
              <Text style={styles.privacyHeading}>4. Your Privacy Rights</Text>
              <Text style={styles.privacyText}>
                You have the right to access, update, or delete your personal information at any time. 
                You can also export your data or request account deletion through the app settings.
              </Text>
              
              <Text style={styles.privacyHeading}>5. Data Retention</Text>
              <Text style={styles.privacyText}>
                We retain your personal information for as long as your account is active or as needed 
                to provide you services. You may request deletion of your account and associated data 
                at any time through the app settings.
              </Text>
              
              <Text style={styles.privacyHeading}>6. Third-Party Services and Advertising</Text>
              <Text style={styles.privacyText}>
                We use third-party services for analytics, app functionality, and advertising.
                Specifically, we use Google AdMob to display advertisements within our app.
                AdMob may collect and use data to provide personalized ads. You can learn more
                about Google's privacy practices at https://policies.google.com/privacy.
              </Text>
              <Text style={styles.privacyText}>
                We also offer in-app subscriptions for premium features. Payment processing
                is handled by your device's app store (Apple App Store or Google Play Store).
                We do not store your payment information directly.
              </Text>
              <Text style={styles.privacyText}>
                These third-party services are bound by their own privacy policies and data
                protection standards. We do not sell or rent your personal information to third parties.
              </Text>
              
              <Text style={styles.privacyHeading}>7. Children's Privacy</Text>
              <Text style={styles.privacyText}>
                Our app is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If you believe we have collected such information, 
                please contact us immediately.
              </Text>
              
              <Text style={styles.privacyHeading}>9. Changes to This Policy</Text>
              <Text style={styles.privacyText}>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </Text>
              
              <Text style={styles.privacyHeading}>10. Contact Us</Text>
              <Text style={styles.privacyText}>
                If you have any questions about this Privacy Policy, please contact us:
              </Text>
              <Text style={styles.privacyText}>
                Good Technology LLC{'\n'}
                Support Team{'\n'}
                📧 Email: support@goodtechnologyllc.com{'\n'}
                🌐 Website: www.goodtechnologyllc.com{'\n'}
                📞 Phone: +13239168235
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  const EditProfileModal = () => (
    <Modal
      visible={showEditProfile}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowEditProfile(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient
          colors={['#F8FAFC', '#F1F5F9']}
          style={styles.modalGradient}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowEditProfile(false)}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.editProfileContent}>
            <View style={styles.editProfileForm}>
              <Text style={styles.editLabel}>Full Name</Text>
              <TextInput
                style={styles.editInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
              />
              
              <TouchableOpacity style={styles.saveProfileButton} onPress={handleSaveProfile}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.saveProfileGradient}
                >
                  <Save size={20} color="white" />
                  <Text style={styles.saveProfileText}>Save Changes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );

  const HelpSupportModal = () => (
    <Modal
      visible={showHelpSupport}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowHelpSupport(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <LinearGradient
          colors={['#F8FAFC', '#F1F5F9']}
          style={styles.modalGradient}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <TouchableOpacity onPress={() => setShowHelpSupport(false)}>
              <X size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.helpContent}>
              <Text style={styles.helpSection}>How can we help you?</Text>
              
              <Text style={styles.helpHeading}>Frequently Asked Questions</Text>
              
              <Text style={styles.helpSubheading}>Getting Started</Text>
              <Text style={styles.helpText}>
                • Create an account to sync your data across devices{'\n'}
                • Set up daily reminders for Bible reading and prayer{'\n'}
                • Customize your spiritual journey preferences
              </Text>
              
              <Text style={styles.helpSubheading}>Bible Study Features</Text>
              <Text style={styles.helpText}>
                • Access the complete Bible with search functionality{'\n'}
                • Take quizzes to test your biblical knowledge{'\n'}
                • Save favorite verses and create study notes
              </Text>
              
              <Text style={styles.helpSubheading}>Prayer Tracking</Text>
              <Text style={styles.helpText}>
                • Add prayer requests and track answered prayers{'\n'}
                • Set prayer reminders and daily prayer times{'\n'}
                • View your prayer history and spiritual growth
              </Text>
              
              <Text style={styles.helpSubheading}>Mood Tracking</Text>
              <Text style={styles.helpText}>
                • Log your daily mood and spiritual well-being{'\n'}
                • View trends and patterns in your spiritual journey{'\n'}
                • Connect your mood with Bible verses and prayers
              </Text>
              
              <Text style={styles.helpHeading}>Contact Support</Text>
              <Text style={styles.helpText}>
                Need additional help? Our support team is here for you:
              </Text>
              
              <View style={styles.contactInfo}>
                <Text style={styles.contactItem}>📧 Email: support@goodtechnologyllc.com</Text>
                <Text style={styles.contactItem}>🌐 Website: www.goodtechnologyllc.com</Text>
                <Text style={styles.contactItem}>📞 Phone: +13239168235</Text>
                <Text style={styles.contactItem}>⏰ Response Time: Within 24 hours</Text>
              </View>
              
              <Text style={styles.helpHeading}>App Version</Text>
              <Text style={styles.helpText}>
                Current Version: 1.0.0{'\n'}
                Last Updated: January 2025
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  );
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <BackgroundGradient>
        <Animated.ScrollView 
          style={[styles.scrollView, { opacity: fadeAnim }]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Simple Header */}
          <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Settings</Text>
              <SettingsIcon size={24} color="#6B7280" />
            </View>
          </Animated.View>

          {/* Simple Profile Section */}
          <Animated.View style={[styles.profileSection, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.profileCard}>
              <View style={styles.profileImage}>
                <User size={32} color="#6B7280" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {user ? (profile?.full_name || user.email || 'User') : 'Guest User'}
                </Text>
                <Text style={styles.profileEmail}>
                  {user ? (user.email || 'No email') : 'guest@example.com'}
                </Text>
              </View>
              <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
                <Edit3 size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Simple Settings */}
          <Animated.View style={[styles.settingsSection, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            
            
            <SimpleSettingItem
              icon={<Book size={20} color="#3B82F6" />}
              title="Daily Verse"
              subtitle="Morning inspiration"
              rightElement={
                <Switch
                  value={dailyVerse}
                  onValueChange={setDailyVerse}
                  trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                  thumbColor={dailyVerse ? '#FFFFFF' : '#FFFFFF'}
                />
              }
            />
            
          </Animated.View>


          <Animated.View style={[styles.settingsSection, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.sectionTitle}>Support</Text>
            
            <SimpleSettingItem
              icon={<HelpCircle size={20} color="#8B5CF6" />}
              title="Help & Support"
              subtitle="Get help with the app"
              onPress={handleHelpSupport}
            />
            
            <SimpleSettingItem
              icon={<Shield size={20} color="#6B7280" />}
              title="Privacy Policy"
              subtitle="How we protect your data"
              onPress={handlePrivacyPolicy}
            />
            


            {/* Logout Option in Settings */}
            <SimpleSettingItem
              icon={<LogOut size={20} color="#EF4444" />}
              title="Sign Out"
              subtitle="Log out of your account"
              onPress={async () => {
                console.log('🔴 Direct logout from settings pressed');
                console.log('🔴 User object:', user);
                console.log('🔴 signOut function:', typeof signOut);
                
                try {
                  console.log('🔴 Calling signOut...');
                  const result = await signOut();
                  console.log('🔴 signOut result:', result);
                  
                  if (result.error) {
                    console.error('🔴 Logout error:', result.error);
                    Alert.alert('Error', result.error.message || 'Failed to sign out');
                  } else {
                    console.log('🔴 Logout successful');
                    Alert.alert('Success', 'Logged out successfully');
                    
                    // Force clear user state manually
                    console.log('🔴 Manually clearing user state...');
                    
                    // Manually navigate to login screen
                    setTimeout(() => {
                      console.log('🔴 Manually navigating to login...');
                      router.replace('/login');
                    }, 500);
                  }
                } catch (error) {
                  console.error('🔴 Logout exception:', error);
                  Alert.alert('Error', 'Failed to sign out');
                }
              }}
            />
          </Animated.View>

          {/* Sign Out Button */}
          {user && (
            <Animated.View style={[styles.signOutSection, { transform: [{ scale: scaleAnim }] }]}>
              {/* Empty section - logout moved to settings */}
            </Animated.View>
          )}

          <View style={styles.bottomSpacing} />
        </Animated.ScrollView>

        {/* Modals */}
        <PrivacyPolicyModal />
        <EditProfileModal />
        <HelpSupportModal />
        
        {/* Banner Ad */}
        {/* Removed BannerAd component */}
      </BackgroundGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // Reduced padding since tab bar is no longer floating
  },
  gradient: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for floating tab bar
  },
  
  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Account for status bar
    paddingBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.neutral[800],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Profile Section
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'white',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.neutral[600],
    marginBottom: 8,
  },
  editProfileButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },

  // Settings Section
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[800],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 16,
  },

  // Simple Setting Item
  simpleSettingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Sign Out Button
  signOutSection: {
    marginTop: 20,
    alignItems: 'center',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Privacy Policy Styles
  privacyContent: {
    paddingBottom: 40,
  },
  privacySection: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  privacyHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    marginTop: 24,
  },
  privacyText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
  },

  // Help & Support Styles
  helpContent: {
    paddingBottom: 40,
  },
  helpSection: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  helpHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    marginTop: 24,
  },
  helpSubheading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 8,
    marginTop: 16,
  },
  helpText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  contactInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  contactItem: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 8,
  },

  // Edit Profile Styles
  editProfileContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  editProfileForm: {
    gap: 20,
  },
  editLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  saveProfileButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveProfileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  saveProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomSpacing: {
    height: 40,
  },
});
