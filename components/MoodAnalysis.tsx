import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/DesignTokens';
import { X } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface MoodAnalysisProps {
  mood: any;
  onClose: () => void;
}

const analysisDataByCategory = {
  positive: {
    recommendations: [
      "Share your joy with someone close to you to multiply the blessing.",
      "Take a moment to write down three things you're grateful for right now.",
      "Channel this positive energy into a creative or productive activity."
    ],
    verses: [
      { reference: 'Psalm 118:24', text: 'This is the day that the Lord has made; let us rejoice and be glad in it.' },
      { reference: 'Philippians 4:8', text: 'Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things.' },
      { reference: 'Nehemiah 8:10', text: 'The joy of the Lord is your strength.' },
      { reference: '1 Thessalonians 5:16-18', text: 'Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.' },
      { reference: 'Psalm 100:1-2', text: 'Make a joyful noise to the Lord, all the earth! Serve the Lord with gladness! Come into his presence with singing!' },
    ],
    prayer: "Heavenly Father, thank you for the joy and happiness I feel today. I am grateful for the blessings you have poured into my life. Help me to be a beacon of your light and to spread this positivity to others. May I always remember that you are the source of all good things. Amen."
  },
  challenging: {
    recommendations: [
      'Take a few deep breaths and focus on the present moment, casting your anxieties on Him.',
      'Listen to some calming worship music or a faith-based podcast.',
      'Reach out to a trusted friend, family member, or spiritual mentor for support.'
    ],
    verses: [
      { reference: 'Psalm 34:18', text: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' },
      { reference: 'Matthew 11:28', text: 'Come to me, all you who are weary and burdened, and I will give you rest.' },
      { reference: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.' },
      { reference: 'Isaiah 41:10', text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.' },
      { reference: 'Psalm 23:4', text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },
    ],
    prayer: 'Dear Lord, I come to you today with a heavy heart. I feel overwhelmed by my emotions, and I ask for your peace to wash over me. Help me to trust in your plan and to find strength in your presence. Amen.'
  },
  calm: {
    recommendations: [
      "Spend some quiet time in meditation or prayer, embracing the peace you feel.",
      "Read a chapter from a book of the Bible that you find comforting, like Psalms or John.",
      "Use this state of calm to reflect on your spiritual journey and set intentions."
    ],
    verses: [
      { reference: 'John 14:27', text: 'Peace I leave with you; my peace I give to you. Not as the world gives do I give to you. Let not your hearts be troubled, neither let them be afraid.' },
      { reference: 'Isaiah 26:3', text: 'You keep him in perfect peace whose mind is stayed on you, because he trusts in you.' },
      { reference: 'Psalm 4:8', text: 'In peace I will both lie down and sleep; for you alone, O Lord, make me dwell in safety.' },
      { reference: 'Colossians 3:15', text: 'And let the peace of Christ rule in your hearts, to which indeed you were called in one body. And be thankful.' },
      { reference: 'Psalm 29:11', text: 'May the Lord give strength to his people! May the Lord bless his people with peace!' },
    ],
    prayer: "Lord, thank you for this moment of peace and calm. I am grateful for the stillness in my heart and the quiet in my mind. Help me to carry this peace with me throughout my day and to be a source of calm for others. Amen."
  },
  default: {
    recommendations: [
      "Take a moment to reflect on what might be causing this feeling.",
      "Engage in a simple, enjoyable activity to shift your focus.",
      "Talk to God about what's on your mind, no matter how small it seems."
    ],
    verses: [
      { reference: 'Psalm 139:23-24', text: 'Search me, O God, and know my heart! Try me and know my thoughts! And see if there be any grievous way in me, and lead me in the way everlasting!' },
      { reference: 'Proverbs 3:5-6', text: 'Trust in the Lord with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.' },
      { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.' },
      { reference: 'Lamentations 3:22-23', text: 'The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.' },
      { reference: 'Psalm 62:8', text: 'Trust in him at all times, O people; pour out your heart before him; God is a refuge for us.' },
    ],
    prayer: "Father, I come before you in this moment, seeking your guidance. I'm not entirely sure what I'm feeling, but I know that you do. I open my heart to you and ask for clarity and direction. Lead me in your truth and teach me, for you are the God of my salvation. Amen."
  }
};

const getAnalysisForCategory = (category: string) => {
  return analysisDataByCategory[category] || analysisDataByCategory.default;
};

const getDeepseekAnalysis = async (mood: any) => {
  const DEEPSEEK_API_KEY = 'YOUR_DEEPSEEK_API_KEY'; // Replace with your actual API key

  const prompt = `
    You are a Christian spiritual guide. A user is feeling ${mood.mood_type}.
    If they have provided notes, consider them as well: "${mood.notes}".

    Please provide the following in a JSON format:
    1.  **recommendations**: 3 actionable recommendations to help them.
    2.  **verses**: 5 relevant Bible verses with their references.
    3.  **prayer**: A short, comforting prayer.
  `;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Deepseek API');
    }

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error fetching from Deepseek API:', error);
    return null;
  }
};

const MoodAnalysis: React.FC<MoodAnalysisProps> = ({ mood, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (mood) {
      getAnalysis();
    }
  }, [mood]);

  const getAnalysis = async () => {
    setLoading(true);
    setAnalysis(null);

    const analysisData = await getDeepseekAnalysis(mood);

    if (analysisData) {
      setAnalysis(analysisData);
    } else {
      // Fallback to local data if API fails
      const moodCategory = mood.mood_id.split('_')[0] as keyof typeof analysisDataByCategory;
      let fallbackData = getAnalysisForCategory(moodCategory as any);
      if (mood.notes) {
        const personalizedPrayer = fallbackData.prayer.replace("Amen.", ` I also bring before you these specific thoughts: "${mood.notes}". Please guide me through them. Amen.`);
        fallbackData = { ...fallbackData, prayer: personalizedPrayer };
      }
      setAnalysis(fallbackData);
    }

    setLoading(false);
  };

  return (
    <Modal
      visible={!!mood}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>AI Mood Analysis</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.neutral[600]} />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary[500]} />
            ) : (
              analysis && (
                <View>
                  <Text style={styles.sectionTitle}>Recommendations</Text>
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <Text key={index} style={styles.text}>- {rec}</Text>
                  ))}

                  <Text style={styles.sectionTitle}>Bible Verses</Text>
                  {analysis.verses.map((verse: any, index: number) => (
                    <View key={index} style={styles.verseContainer}>
                      <Text style={styles.verseReference}>{verse.reference}</Text>
                      <Text style={styles.verseText}>{verse.text}</Text>
                    </View>
                  ))}

                  <Text style={styles.sectionTitle}>Prayer</Text>
                  <Text style={styles.text}>{analysis.prayer}</Text>
                </View>
              )
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.lg,
    width: '100%',
    maxHeight: screenHeight * 0.9,
    ...Shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[800],
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[700],
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  text: {
    fontSize: Typography.sizes.base,
    lineHeight: Typography.lineHeights.relaxed,
    color: Colors.neutral[600],
  },
  verseContainer: {
    marginBottom: Spacing.md,
    paddingLeft: Spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary[200],
  },
  verseReference: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primary[800],
  },
  verseText: {
    fontSize: Typography.sizes.base,
    fontStyle: 'italic',
    color: Colors.neutral[600],
  },
});

export default MoodAnalysis;
