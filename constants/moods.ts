export const moodCategories = {
  positive: {
    title: 'Positive',
    icon: '✨',
    moods: [
      { id: 'positive_001_blessed', label: '🙏 Blessed', color: '#FFD700', gradient: ['#FFD700', '#FFA500', '#FF8C00'] as const },
      { id: 'positive_002_happy', label: '😊 Happy', color: '#10B981', gradient: ['#10B981', '#059669', '#047857'] as const },
      { id: 'positive_003_joyful', label: '😄 Joyful', color: '#22C55E', gradient: ['#22C55E', '#16A34A', '#15803D'] as const },
      { id: 'positive_004_grateful', label: '🙏 Grateful', color: '#84CC16', gradient: ['#84CC16', '#65A30D', '#4D7C0F'] as const },
      { id: 'positive_005_excited', label: '🤩 Excited', color: '#F59E0B', gradient: ['#F59E0B', '#D97706', '#B45309'] as const },
      { id: 'positive_006_loved', label: '💕 Loved', color: '#EC4899', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
      { id: 'positive_007_proud', label: '🏆 Proud', color: '#10B981', gradient: ['#10B981', '#059669', '#047857'] as const },
    ]
  },
  calm: {
    title: 'Calm',
    icon: '🧘',
    moods: [
      { id: 'calm_001_peaceful', label: '😇 Peaceful', color: '#06B6D4', gradient: ['#06B6D4', '#0891B2', '#0E7490'] as const },
      { id: 'calm_002_calm', label: '😌 Calm', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB', '#1D4ED8'] as const },
      { id: 'calm_003_content', label: '😊 Content', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
      { id: 'calm_004_prayerful', label: '🙏 Prayerful', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
    ]
  },
  energetic: {
    title: 'Energetic',
    icon: '⚡',
    moods: [
      { id: 'energetic_001_motivated', label: '💪 Motivated', color: '#10B981', gradient: ['#10B981', '#059669', '#047857'] as const },
      { id: 'energetic_002_focused', label: '🎯 Focused', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB', '#1D4ED8'] as const },
      { id: 'energetic_003_creative', label: '🎨 Creative', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
      { id: 'energetic_004_inspired', label: '✨ Inspired', color: '#EC4899', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
      { id: 'energetic_005_accomplished', label: '🎉 Accomplished', color: '#22C55E', gradient: ['#22C55E', '#16A34A', '#15803D'] as const },
    ]
  },
  challenging: {
    title: 'Challenging',
    icon: '💭',
    moods: [
      { id: 'challenging_001_sad', label: '😔 Sad', color: '#6B7280', gradient: ['#6B7280', '#4B5563', '#374151'] as const },
      { id: 'challenging_002_anxious', label: '😰 Anxious', color: '#8B5CF6', gradient: ['#8B5CF6', '#7C3AED', '#6D28D9'] as const },
      { id: 'challenging_003_stressed', label: '😓 Stressed', color: '#EC4899', gradient: ['#EC4899', '#DB2777', '#BE185D'] as const },
      { id: 'challenging_004_angry', label: '😠 Angry', color: '#EF4444', gradient: ['#EF4444', '#DC2626', '#B91C1C'] as const },
      { id: 'challenging_005_frustrated', label: '😤 Frustrated', color: '#F97316', gradient: ['#F97316', '#EA580C', '#C2410C'] as const },
      { id: 'challenging_006_tired', label: '😴 Tired', color: '#A855F7', gradient: ['#A855F7', '#9333EA', '#7C3AED'] as const },
      { id: 'challenging_007_lonely', label: '🥺 Lonely', color: '#6B7280', gradient: ['#6B7280', '#4B5563', '#374151'] as const },
      { id: 'challenging_008_confused', label: '😕 Confused', color: '#F59E0B', gradient: ['#F59E0B', '#D97706', '#B45309'] as const },
      { id: 'challenging_009_fearful', label: '😨 Fearful', color: '#DC2626', gradient: ['#DC2626', '#B91C1C', '#991B1B'] as const },
    ]
  },
  curious: {
    title: 'Curious',
    icon: '🤔',
    moods: [
      { id: 'curious_001_curious', label: '🤔 Curious', color: '#14B8A6', gradient: ['#14B8A6', '#0D9488', '#0F766E'] as const },
      { id: 'curious_002_surprised', label: '😲 Surprised', color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B', '#D97706'] as const },
      { id: 'curious_003_hopeful', label: '🌟 Hopeful', color: '#FBBF24', gradient: ['#FBBF24', '#F59E0B', '#D97706'] as const },
    ]
  },
  spiritual: {
    title: 'Spiritual',
    icon: '🕊️',
    moods: [
      { id: 'spiritual_001_inspired', label: '✨ Inspired', color: '#A78BFA', gradient: ['#A78BFA', '#8B5CF6', '#7C3AED'] as const },
      { id: 'spiritual_002_connected', label: '🔗 Connected', color: '#6EE7B7', gradient: ['#6EE7B7', '#34D399', '#10B981'] as const },
      { id: 'spiritual_003_faithful', label: '✝️ Faithful', color: '#F472B6', gradient: ['#F472B6', '#EC4899', '#DB2777'] as const },
    ]
  },
  health: {
    title: 'Health',
    icon: '💪',
    moods: [
      { id: 'health_001_healthy', label: '🍎 Healthy', color: '#6EE7B7', gradient: ['#6EE7B7', '#34D399', '#10B981'] as const },
      { id: 'health_002_rested', label: '😴 Rested', color: '#A78BFA', gradient: ['#A78BFA', '#8B5CF6', '#7C3AED'] as const },
      { id: 'health_003_balanced', label: '🧘 Balanced', color: '#F472B6', gradient: ['#F472B6', '#EC4899', '#DB2777'] as const },
    ]
  }
};
