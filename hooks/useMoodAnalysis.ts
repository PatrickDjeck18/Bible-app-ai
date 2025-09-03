import { useState, useCallback } from 'react';
import { MoodAnalysisService, MoodAnalysis, MoodAnalysisRequest } from '@/lib/services/moodAnalysisService';
import { MoodEntry } from '@/lib/services/moodAnalysisService';

export const useMoodAnalysis = () => {
  const [analysis, setAnalysis] = useState<MoodAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeMoodPatterns = useCallback(async (request: MoodAnalysisRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await MoodAnalysisService.analyzeMoodPatterns(request);
      setAnalysis(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze mood patterns';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRealTimeSuggestion = useCallback(async (context: {
    timeOfDay: string;
    recentActivities?: string[];
    currentLocation?: string;
    weather?: string;
  }) => {
    try {
      return await MoodAnalysisService.getRealTimeSuggestion(context);
    } catch (err) {
      console.error('Failed to get real-time suggestion:', err);
      return 'Take a moment to breathe and connect with God.';
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    analyzeMoodPatterns,
    getRealTimeSuggestion,
    clearAnalysis,
  };
};

// Additional utility hook for mood insights
export const useMoodInsights = (moodHistory: MoodEntry[]) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = useCallback(async () => {
    if (moodHistory.length < 3) {
      setInsights(['Track more moods to unlock personalized insights!']);
      return;
    }

    setLoading(true);
    try {
      const positiveDays = moodHistory.filter(entry => 
        ['Happy', 'Joyful', 'Peaceful', 'Grateful', 'Excited'].includes(entry.mood_type)
      ).length;

      const challengingDays = moodHistory.filter(entry => 
        ['Sad', 'Anxious', 'Stressed', 'Angry', 'Tired'].includes(entry.mood_type)
      ).length;

      const totalEntries = moodHistory.length;
      const positivePercentage = Math.round((positiveDays / totalEntries) * 100);

      const generatedInsights: string[] = [];

      // Basic pattern insights
      if (positivePercentage >= 70) {
        generatedInsights.push('🌟 You maintain strong positive energy most days!');
      } else if (positivePercentage >= 50) {
        generatedInsights.push('✨ Good emotional balance with room for growth');
      } else {
        generatedInsights.push('💭 You\'ve been through some challenges - every emotion is valid');
      }

      // Time-based insights
      const morningEntries = moodHistory.filter(entry => {
        const hour = new Date(entry.created_at).getHours();
        return hour >= 6 && hour < 12;
      }).length;

      if (morningEntries / totalEntries > 0.4) {
        generatedInsights.push('☀️ Strong morning tracking habit - great for setting daily intentions');
      }

      // Spiritual correlation
      const spiritualEntries = moodHistory.filter(entry => 
        ['Peaceful', 'Grateful', 'Connected'].includes(entry.mood_type)
      ).length;

      if (spiritualEntries > 0) {
        generatedInsights.push(`🙏 ${Math.round((spiritualEntries / totalEntries) * 100)}% of your entries show spiritual connection`);
      }

      setInsights(generatedInsights);

    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights(['Your mood journey is unique and valuable. Keep tracking!']);
    } finally {
      setLoading(false);
    }
  }, [moodHistory]);

  return {
    insights,
    loading,
    generateInsights,
  };
};