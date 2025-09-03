import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, Sparkles, Circle, Heart } from 'lucide-react-native';
import { Colors } from '@/constants/DesignTokens';

interface AnimatedBackgroundProps {
  variant?: 'login' | 'signup';
  children: React.ReactNode;
}

const { width, height } = Dimensions.get('window');

interface ParticleProps {
  id: number;
  icon: React.ComponentType<any>;
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
}

const Particle: React.FC<ParticleProps> = ({
  icon: Icon,
  size,
  color,
  initialX,
  initialY,
  duration,
  delay,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Reset values
      translateY.setValue(0);
      translateX.setValue(0);
      opacity.setValue(0);
      scale.setValue(0);
      rotate.setValue(0);

      // Start animations
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          delay,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -height * 0.3,
          duration: duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: (Math.random() - 0.5) * width * 0.2,
          duration: duration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: duration,
          delay,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Fade out and restart
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(startAnimation, Math.random() * 3000 + 1000);
        });
      });
    };

    const timeout = setTimeout(startAnimation, delay);
    return () => clearTimeout(timeout);
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: initialX,
          top: initialY,
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate: rotateInterpolate },
          ],
          opacity,
        },
      ]}
    >
      <Icon size={size} color={color} />
    </Animated.View>
  );
};

export default function AnimatedBackground({ variant = 'login', children }: AnimatedBackgroundProps) {
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Background gradient animation
    const backgroundLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnimation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    );

    // Pulse animation for ambient effect
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    backgroundLoop.start();
    pulseLoop.start();

    return () => {
      backgroundLoop.stop();
      pulseLoop.stop();
    };
  }, []);

  // Generate particles
  const particles: ParticleProps[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    icon: [Star, Sparkles, Circle, Heart][Math.floor(Math.random() * 4)],
    size: Math.random() * 12 + 8,
    color: [
      'rgba(255, 255, 255, 0.6)',
      'rgba(139, 92, 246, 0.4)',
      'rgba(99, 102, 241, 0.3)',
      'rgba(236, 72, 153, 0.3)',
      'rgba(251, 191, 36, 0.4)',
    ][Math.floor(Math.random() * 5)],
    initialX: Math.random() * width,
    initialY: height + Math.random() * 200,
    duration: Math.random() * 15000 + 10000,
    delay: Math.random() * 5000,
  }));

  const getGradientColors = () => {
    const loginGradients = [
      Colors.gradients.etherealSunset,
      Colors.gradients.divineMorning,
      Colors.gradients.spiritualLight,
    ];
    
    const signupGradients = [
      Colors.gradients.celestialDream,
      Colors.gradients.sacredGarden,
      Colors.gradients.goldenHour,
    ];

    return variant === 'login' ? loginGradients : signupGradients;
  };

  const gradientSets = getGradientColors();
  
  const backgroundInterpolate = backgroundAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <View style={styles.container}>
      {/* Animated Background Layers */}
      <Animated.View style={[styles.backgroundLayer, { transform: [{ scale: pulseAnimation }] }]}>
        <LinearGradient
          colors={gradientSets[0]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.backgroundLayer,
          {
            opacity: backgroundInterpolate,
            transform: [{ scale: pulseAnimation }],
          },
        ]}
      >
        <LinearGradient
          colors={gradientSets[1]}
          style={styles.gradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Geometric Patterns */}
      <View style={styles.patternContainer}>
        <Animated.View
          style={[
            styles.geometricShape,
            styles.shape1,
            {
              transform: [
                { scale: pulseAnimation },
                {
                  rotate: backgroundAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '45deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
            style={styles.shapeGradient}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.geometricShape,
            styles.shape2,
            {
              transform: [
                { scale: pulseAnimation },
                {
                  rotate: backgroundAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['45deg', '0deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.03)']}
            style={styles.shapeGradient}
          />
        </Animated.View>
      </View>

      {/* Floating Particles */}
      <View style={styles.particleContainer}>
        {particles.map((particle) => (
          <Particle key={particle.id} {...particle} />
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  patternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  geometricShape: {
    position: 'absolute',
    borderRadius: 20,
  },
  shape1: {
    width: width * 0.6,
    height: width * 0.6,
    top: -width * 0.2,
    right: -width * 0.2,
  },
  shape2: {
    width: width * 0.4,
    height: width * 0.4,
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
  shapeGradient: {
    flex: 1,
    borderRadius: 20,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
});