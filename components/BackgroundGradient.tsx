import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/DesignTokens';

interface BackgroundGradientProps {
  children: React.ReactNode;
  style?: any;
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ 
  children, 
  style 
}) => {
  return (
    <LinearGradient
      colors={Colors.gradients.spiritualLight}
      style={[
        StyleSheet.absoluteFillObject, 
        { 
          top: -(StatusBar.currentHeight ?? 0),
          height: '100%',
        },
        style
      ]}
    >
      {children}
    </LinearGradient>
  );
};

export default BackgroundGradient;
