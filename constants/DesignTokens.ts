/**
 * Modern Design System Tokens
 * Following iOS 18 and Material You design principles
 */

export const Colors = {
  // Primary Brand Colors - Modern Purple Gradient
  primary: {
    50: '#F8F7FF',
    100: '#EDEAFF',
    200: '#DDD7FF',
    300: '#C4B8FF',
    400: '#A792FF',
    500: '#8B5CF6', // Primary
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },

  // Secondary Colors - Modern Teal
  secondary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Secondary
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
    950: '#042F2E',
  },

  // Neutral Colors - Warm Grays
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
    950: '#0C0A09',
  },

  // Semantic Colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Basic colors
  white: '#FFFFFF',
  black: '#000000',

  // Modern Gradients
  gradients: {
    primary: ['#8B5CF6', '#6366F1', '#3B82F6'] as const,
    secondary: ['#14B8A6', '#06B6D4', '#0EA5E9'] as const,
    warm: ['#F59E0B', '#EF4444', '#EC4899'] as const,
    sunset: ['#F97316', '#EF4444', '#EC4899'] as const,
    ocean: ['#0EA5E9', '#06B6D4', '#14B8A6'] as const,
    purple: ['#A855F7', '#8B5CF6', '#7C3AED'] as const,
    spiritual: ['#8B5CF6', '#EC4899', '#F97316'] as const,
    // New beautiful gradient options
    aurora: ['#667eea', '#764ba2', '#f093fb'] as const,
    cosmic: ['#4c1d95', '#7c3aed', '#a855f7'] as const,
    nature: ['#10b981', '#34d399', '#6ee7b7'] as const,
    fire: ['#dc2626', '#ea580c', '#f59e0b'] as const,
    ice: ['#0284c7', '#0ea5e9', '#38bdf8'] as const,
    dawn: ['#fbbf24', '#f59e0b', '#ea580c'] as const,
    forest: ['#059669', '#0d9488', '#14b8a6'] as const,
    royal: ['#1e1b4b', '#4338ca', '#6366f1'] as const,
    // Beautiful soft gradient inspired by the screenshot
    soft: ['#E3F2FD', '#F3E5F5', '#FCE4EC'] as const,
    softGlow: ['#BBDEFB', '#E1BEE7', '#F8BBD9'] as const,
    // Ultra soft minimal gradient with light grey background
    minimal: ['#F8F9FA', '#F5F6F7', '#F2F3F4'] as const,
    lightGrey: ['#F9FAFB', '#F7F8F9', '#F5F6F7'] as const,
    // PREMIUM BACKGROUND GRADIENTS - Stunning & Modern
    
    // Divine Morning - Heavenly blue to golden warmth
    divineMorning: ['#667eea', '#764ba2', '#f093fb'] as const,
    
    // Ethereal Sunset - Mystical purple to warm coral
    etherealSunset: ['#a8edea', '#fed6e3', '#ff9a9e'] as const,
    
    // Celestial Dream - Deep space to light dawn
    celestialDream: ['#141e30', '#243b55', '#667eea'] as const,
    
    // Sacred Garden - Fresh mint to deep emerald
    sacredGarden: ['#11998e', '#38ef7d', '#a8edea'] as const,
    
    // Spiritual Light - Pure white to gentle lavender (current choice)
    spiritualLight: ['#fdfcfb', '#e2d1c3', '#c9d6ff'] as const,
    
    // Golden Hour - Warm amber to soft peach
    goldenHour: ['#ff9a9e', '#fecfef', '#fecfef'] as const,
    
    // Ocean Breeze - Turquoise to sky blue
    oceanBreeze: ['#667eea', '#764ba2', '#667eea'] as const,
    
    // ACCENT GRADIENTS - For buttons and highlights
    accent: {
      primary: ['#667eea', '#764ba2'] as const,
      secondary: ['#f093fb', '#f5576c'] as const,
      success: ['#11998e', '#38ef7d'] as const,
      warning: ['#FFB75E', '#ED8F03'] as const,
      danger: ['#FF416C', '#FF4B2B'] as const,
      info: ['#667eea', '#764ba2'] as const,
    },
  },

  // PREMIUM GLASS & CARD EFFECTS
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    heavy: 'rgba(255, 255, 255, 0.25)',
    dark: 'rgba(0, 0, 0, 0.1)',
    
    // Premium frosted glass effects
    frost: 'rgba(255, 255, 255, 0.3)',
    crystal: 'rgba(255, 255, 255, 0.2)',
    
    // Enhanced card backgrounds
    card: 'rgba(255, 255, 255, 0.85)',
    cardDark: 'rgba(255, 255, 255, 0.95)',
    cardSoft: 'rgba(255, 255, 255, 0.7)',
    
    // Overlay effects
    overlay: 'rgba(0, 0, 0, 0.3)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
};

export const Typography = {
  // Modern Font Weights
  weights: {
    thin: '100' as const,
    extraLight: '200' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
    black: '900' as const,
  },

  // Font Sizes - iOS Dynamic Type Inspired
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 42,
    '8xl': 48,
    '9xl': 56,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },
};

export const Spacing = {
  // 4px base unit system
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
  '9xl': 128,
};

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 32,
  full: 9999,
};

export const Shadows = {
  // Modern shadow system
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 16,
  },
};

export const Animations = {
  // Modern spring animations
  spring: {
    tension: 300,
    friction: 20,
  },
  fastSpring: {
    tension: 400,
    friction: 25,
  },
  slowSpring: {
    tension: 200,
    friction: 15,
  },
  
  // Timing animations
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  largeDesktop: 1440,
};
