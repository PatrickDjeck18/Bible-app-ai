
import { Tabs } from 'expo-router';
import { Chrome as Home, Book, Heart, Activity, Settings, Smile, Brain, MessageCircle } from 'lucide-react-native';
import { Colors, Shadows, BorderRadius } from '@/constants/DesignTokens';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          paddingHorizontal: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={Colors.gradients.spiritualLight}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        ),
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.neutral[500],
        tabBarIconStyle: {
          marginTop: 0,
        },
        tabBarItemStyle: {
          borderRadius: 0,
          marginHorizontal: 0,
          paddingVertical: 4,
          paddingHorizontal: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 2,
        },
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <Home 
              size={focused ? size + 1 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: 'Bible',
          tabBarIcon: ({ size, color, focused }) => (
            <Book 
              size={focused ? size + 1 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer-tracker"
        options={{
          title: 'Prayer',
          tabBarIcon: ({ size, color, focused }) => (
            <MessageCircle 
              size={focused ? size + 1 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mood-tracker"
        options={{
          title: 'Mood',
          tabBarIcon: ({ size, color, focused }) => (
            <Smile
              size={focused ? size + 1 : size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ size, color, focused }) => (
            <Brain
              size={focused ? size + 1 : size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'More',
          tabBarIcon: ({ size, color, focused }) => (
            <Settings
              size={focused ? size + 1 : size}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      
    </Tabs>
  );
}