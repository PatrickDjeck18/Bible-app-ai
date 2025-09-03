import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Mail, ArrowLeft, ArrowRight, Eye, EyeOff, Lock, User, Book } from 'lucide-react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/DesignTokens';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

// Modern Components
import ModernAuthCard from '@/components/auth/ModernAuthCard';
import FloatingLabelInput from '@/components/auth/FloatingLabelInput';
import ModernButton from '@/components/auth/ModernButton';
import SocialLoginButton from '@/components/auth/SocialLoginButton';

const { width, height } = Dimensions.get('window');

export default function SignUpScreen() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form validation errors
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateFullName = (name: string) => {
    if (!name.trim()) {
      setFullNameError('Full name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setFullNameError('Name must be at least 2 characters');
      return false;
    }
    setFullNameError('');
    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      setPasswordError('Password must contain uppercase and lowercase letters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleFullNameChange = (text: string) => {
    setFullName(text);
    if (fullNameError) {
      validateFullName(text);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      validatePassword(text);
    }
    if (confirmPassword && confirmPasswordError) {
      validateConfirmPassword(confirmPassword, text);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      validateConfirmPassword(text, password);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Weak', color: Colors.error[500] };
      case 2:
        return { text: 'Fair', color: Colors.warning[500] };
      case 3:
        return { text: 'Good', color: Colors.primary[500] };
      case 4:
        return { text: 'Strong', color: Colors.success[500] };
      default:
        return { text: '', color: Colors.neutral[400] };
    }
  };

  const handleSignUp = async () => {
    const isFullNameValid = validateFullName(fullName);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);

    if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await signUpWithEmail(email.trim(), password, fullName.trim());
      
      if (error) {
        if (error.message?.includes('User already registered')) {
          Alert.alert('Account Exists', 'An account with this email already exists. Please sign in instead.');
        } else {
          Alert.alert('Sign Up Error', error.message || 'Failed to create account. Please try again.');
        }
      } else if (data?.user) {
        Alert.alert(
          'Account Created Successfully! 🎉',
          'Welcome to Daily Bread! You can now sign in with your new account.',
          [
            { text: 'Continue to Sign In', onPress: () => router.back() }
          ]
        );
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'google') {
      try {
        setLoading(true);
        console.log('🔴 Starting Google Sign-Up process...');
        
        const { data, error } = await signInWithGoogle();
        
        if (error) {
          console.error('🔴 Google Sign-Up error:', error);
          if (error.code === 'cancelled') {
            // Don't show alert for user cancellation
            console.log('🔴 Google Sign-Up was cancelled by user');
          } else if (error.code === 'redirect') {
            // Don't show alert for redirect, it's expected
            console.log('🔴 Redirecting to Google Sign-Up...');
          } else {
            Alert.alert(
              'Google Sign-Up Error', 
              error.message || 'Failed to sign up with Google. Please try again.'
            );
          }
        } else if (data && 'user' in data && data.user) {
          console.log('🔴 Google sign up successful, user:', data.user?.uid);
          // User will be automatically redirected by the auth state change
        }
      } catch (error) {
        console.error('🔴 Google sign up error:', error);
        Alert.alert(
          'Connection Error', 
          'Unable to connect to the server. Please check your internet connection and try again.'
        );
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Coming Soon', `${provider} signup will be available soon!`);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
              <View style={styles.backButtonInner}>
                <ArrowLeft size={24} color={Colors.neutral[700]} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <View style={styles.logoInner}>
                  <Book size={48} color="white" />
                </View>
              </View>
            </View>
            
            <Text style={styles.welcomeText}>Join</Text>
            <Text style={styles.appName}>Daily Bread</Text>
            <Text style={styles.tagline}>
              Create your account and begin your spiritual journey with AI-powered Bible study
            </Text>
          </View>

          {/* Signup Form */}
          <View style={styles.formSection}>
            <ModernAuthCard>
              <Text style={styles.formTitle}>Create Account</Text>
              <Text style={styles.formSubtitle}>
                Fill in your details to get started on your spiritual journey
              </Text>
              
              {/* Full Name Input */}
              <FloatingLabelInput
                label="Full Name"
                value={fullName}
                onChangeText={handleFullNameChange}
                autoCapitalize="words"
                autoCorrect={false}
                error={fullNameError}
                icon={<User size={20} color={Colors.neutral[600]} />}
              />

              {/* Email Input */}
              <FloatingLabelInput
                label="Email Address"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={emailError}
                icon={<Mail size={20} color={Colors.neutral[600]} />}
              />

              {/* Password Input */}
              <FloatingLabelInput
                label="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                error={passwordError}
                icon={<Lock size={20} color={Colors.neutral[600]} />}
                rightIcon={
                  showPassword ? (
                    <EyeOff size={20} color={Colors.neutral[600]} />
                  ) : (
                    <Eye size={20} color={Colors.neutral[600]} />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
              />

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <View style={styles.passwordStrength}>
                    <View style={styles.strengthBar}>
                      <View 
                        style={[
                          styles.strengthFill, 
                          { 
                            width: `${(passwordStrength / 4) * 100}%`,
                            backgroundColor: passwordStrengthInfo.color 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.strengthText, { color: passwordStrengthInfo.color }]}>
                      {passwordStrengthInfo.text}
                    </Text>
                  </View>
                )}

              {/* Confirm Password Input */}
              <FloatingLabelInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                error={confirmPasswordError}
                success={confirmPassword.length > 0 && !confirmPasswordError}
                icon={<Lock size={20} color={Colors.neutral[600]} />}
                rightIcon={
                  showConfirmPassword ? (
                    <EyeOff size={20} color={Colors.neutral[600]} />
                  ) : (
                    <Eye size={20} color={Colors.neutral[600]} />
                  )
                }
                onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />

                {/* Terms and Conditions */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By creating an account, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>

                {/* Sign Up Button */}
                <ModernButton
                  title="Create Account"
                  onPress={handleSignUp}
                  loading={loading}
                  rightIcon={<ArrowRight size={20} color="white" />}
                  style={styles.signUpButton}
                />

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or sign up with</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Login Buttons */}
                <View style={styles.socialContainer}>
                  <SocialLoginButton
                    provider="google"
                    onPress={() => handleSocialLogin('google')}
                  />
                </View>

                {/* Sign In Link */}
                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>Already have an account? </Text>
                  <TouchableOpacity onPress={handleBackToLogin}>
                    <Text style={styles.signInLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
            </ModernAuthCard>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  
  // Header
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  backButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['3xl'],
    minHeight: height * 0.3,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: Spacing['3xl'],
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: Typography.sizes.xl,
    color: Colors.neutral[600],
    marginBottom: Spacing.xs,
    fontWeight: Typography.weights.medium,
    textAlign: 'center',
  },
  appName: {
    fontSize: Typography.sizes['5xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.lg,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.sizes.lg,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: Typography.sizes.lg * 1.5,
    paddingHorizontal: Spacing.lg,
    fontWeight: Typography.weights.regular,
  },

  // Form Section
  formSection: {
    flex: 1,
    paddingBottom: Spacing.xl,
  },
  formTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.sizes.base * 1.5,
  },
  
  // Password Strength
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.neutral[200],
    borderRadius: 2,
    marginRight: Spacing.sm,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  
  // Terms
  termsContainer: {
    marginBottom: Spacing.lg,
  },
  termsText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[600],
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary[600],
    fontWeight: Typography.weights.medium,
  },
  
  signUpButton: {
    marginBottom: Spacing.lg,
  },
  
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral[200],
  },
  dividerText: {
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[500],
    marginHorizontal: Spacing.lg,
    fontWeight: Typography.weights.medium,
  },
  
  // Social Login
  socialContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  
  // Sign In Link
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  signInText: {
    fontSize: Typography.sizes.base,
    color: Colors.neutral[600],
    fontWeight: Typography.weights.regular,
  },
  signInLink: {
    fontSize: Typography.sizes.base,
    color: Colors.primary[600],
    fontWeight: Typography.weights.bold,
  },
  
  bottomSpacing: {
    height: Spacing['2xl'],
  },
});