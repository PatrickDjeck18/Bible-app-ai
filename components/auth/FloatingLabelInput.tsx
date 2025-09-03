import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/DesignTokens';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  success?: boolean;
  onRightIconPress?: () => void;
}

export default function FloatingLabelInput({
  label,
  icon,
  rightIcon,
  error,
  success,
  onRightIconPress,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...props
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  
  const labelAnimation = useRef(new Animated.Value(0)).current;
  const borderAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shouldFloat = isFocused || hasValue;
    
    Animated.parallel([
      Animated.timing(labelAnimation, {
        toValue: shouldFloat ? 1 : 0,
        useNativeDriver: false,
        duration: 200,
      }),
      Animated.timing(borderAnimation, {
        toValue: isFocused ? 1 : 0,
        useNativeDriver: false,
        duration: 200,
      }),
    ]).start();
  }, [isFocused, hasValue]);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleChangeText = (text: string) => {
    setHasValue(!!text);
    onChangeText?.(text);
  };

  const labelTop = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -8],
  });

  const labelFontSize = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const borderColor = borderAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.neutral[300], Colors.primary[500]],
  });

  const getInputStyle = () => {
    if (error) return styles.inputError;
    if (success) return styles.inputSuccess;
    return styles.input;
  };

  const getBorderColor = () => {
    if (error) return Colors.error[400];
    if (success) return Colors.success[400];
    return borderColor;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* Input Background */}
        <View style={styles.inputBackground}>
          {/* Animated Border */}
          <Animated.View
            style={[
              styles.animatedBorder,
              {
                borderColor: getBorderColor(),
              },
            ]}
          />
          
          {/* Content Container */}
          <View style={styles.contentContainer}>
            {/* Left Icon */}
            {icon && (
              <View style={styles.iconContainer}>
                {icon}
              </View>
            )}
            
            {/* Input Field */}
            <View style={styles.inputWrapper}>
              <TextInput
                {...props}
                value={value}
                onChangeText={handleChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={[getInputStyle(), { paddingTop: 24 }]}
                placeholderTextColor={Colors.neutral[400]}
                accessible={true}
                accessibilityLabel={label}
                accessibilityHint={error ? `Error: ${error}` : undefined}
                accessibilityRole="text"
              />
              
              {/* Floating Label */}
              <Animated.Text
                style={[
                  styles.label,
                  {
                    top: labelTop,
                    fontSize: labelFontSize,
                    color: error
                      ? Colors.error[500]
                      : success
                      ? Colors.success[500]
                      : isFocused
                      ? Colors.primary[500]
                      : Colors.neutral[500],
                  },
                ]}
                pointerEvents="none"
              >
                {label}
              </Animated.Text>
            </View>
            
            {/* Right Icon */}
            {rightIcon && (
              <TouchableOpacity
                style={styles.rightIconContainer}
                onPress={onRightIconPress}
                activeOpacity={0.7}
              >
                {rightIcon}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      
      {/* Error Message */}
      {error && (
        <Animated.View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    position: 'relative',
  },
  inputBackground: {
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    minHeight: 64,
  },
  animatedBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    minHeight: 64,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  input: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[800],
    paddingVertical: Spacing.sm,
    paddingHorizontal: 0,
  },
  inputError: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.error[600],
    paddingVertical: Spacing.sm,
    paddingHorizontal: 0,
  },
  inputSuccess: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.success[600],
    paddingVertical: Spacing.sm,
    paddingHorizontal: 0,
  },
  label: {
    position: 'absolute',
    left: 0,
    fontWeight: Typography.weights.medium,
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
  rightIconContainer: {
    marginLeft: Spacing.md,
    padding: Spacing.xs,
  },
  errorContainer: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  errorText: {
    fontSize: Typography.sizes.sm,
    color: Colors.error[500],
    fontWeight: Typography.weights.medium,
  },
});