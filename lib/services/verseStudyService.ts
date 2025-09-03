
export interface VerseStudyRequest {
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
  bibleVersion?: string;
}

export interface VerseStudyResponse {
  explanation: string;
  historicalContext: string;
  theologicalInterpretation: string;
  relatedScriptures: string[];
  keyThemes: string[];
  application: string;
}

export class VerseStudyService {
  private static readonly DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
  private static readonly API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
  private static readonly API_TIMEOUT = 15000; // 15 second timeout

  static async analyzeVerse(request: VerseStudyRequest): Promise<VerseStudyResponse> {
    // If no API key, return fallback content
    if (!this.API_KEY) {
      console.log('⚠️ No DeepSeek API key found, using fallback verse study content');
      return this.createFallbackStudyContent(request);
    }

    const prompt = this.createStudyPrompt(request);

    console.log('🔍 Calling DeepSeek API for verse study...');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

      const response = await fetch(this.DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a biblical scholar and theologian. Provide comprehensive, accurate, and spiritually enriching analysis of Bible verses.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DeepSeek API error:', errorText);
        throw new Error(`DeepSeek API request failed: ${response.status}`);
      }

      const responseData = await response.json();
      const content = responseData.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from DeepSeek API');
      }

      console.log('✅ DeepSeek verse study response received');
      return this.parseStudyResponse(content);

    } catch (error) {
      console.error('❌ DeepSeek API call failed:', error);
      console.log('🔄 Falling back to basic verse study content');
      return this.createFallbackStudyContent(request);
    }
  }

  private static createStudyPrompt(request: VerseStudyRequest): string {
    return `As a biblical scholar, provide a comprehensive analysis of this Bible verse:

Verse: ${request.bookName} ${request.chapterNumber}:${request.verseNumber}
Text: "${request.verseText}"
${request.bibleVersion ? `Version: ${request.bibleVersion}` : ''}

Please provide analysis in the following areas:

1. EXPLANATION: Clear explanation of the verse's meaning in context
2. HISTORICAL CONTEXT: Background about when this was written, cultural context, original audience
3. THEOLOGICAL INTERPRETATION: Doctrinal significance, theological themes, connection to broader biblical themes
4. RELATED SCRIPTURES: 3-5 related Bible verses with references that provide additional insight
5. KEY THEMES: Main theological or spiritual themes in this verse
6. APPLICATION: Practical application for modern Christian life

Respond ONLY with valid JSON in this exact format (no additional text):
{
  "explanation": "Detailed explanation of the verse's meaning...",
  "historicalContext": "Historical background and context...",
  "theologicalInterpretation": "Theological significance and interpretation...",
  "relatedScriptures": ["Reference 1", "Reference 2", "Reference 3", "Reference 4"],
  "keyThemes": ["Theme 1", "Theme 2", "Theme 3"],
  "application": "Practical application for today..."
}

Make the analysis specific, accurate, and spiritually enriching.`;
  }

  private static parseStudyResponse(content: string): VerseStudyResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/{[\s\S]*}/);
      const jsonContent = jsonMatch ? jsonMatch[0].replace(/```json|```/g, '').trim() : content;
      
      const parsed = JSON.parse(jsonContent);
      
      return {
        explanation: parsed.explanation || '',
        historicalContext: parsed.historicalContext || '',
        theologicalInterpretation: parsed.theologicalInterpretation || '',
        relatedScriptures: Array.isArray(parsed.relatedScriptures) ? parsed.relatedScriptures : [],
        keyThemes: Array.isArray(parsed.keyThemes) ? parsed.keyThemes : [],
        application: parsed.application || '',
      };
    } catch (error) {
      console.error('❌ Failed to parse DeepSeek response as JSON:', error);
      console.log('📄 Raw content that failed to parse:', content);
      throw new Error('Failed to parse AI response');
    }
  }

  private static createFallbackStudyContent(request: VerseStudyRequest): VerseStudyResponse {
    return {
      explanation: `This verse from ${request.bookName} ${request.chapterNumber}:${request.verseNumber} speaks about God's faithfulness and promises. The language emphasizes the enduring nature of divine commitment and the relationship between God and His people.`,
      historicalContext: `Written during a period of ${request.bookName === 'Psalms' ? 'worship and reflection' : 'prophetic ministry'}, this verse reflects the historical circumstances of its time. The original audience would have understood this in the context of their covenant relationship with God.`,
      theologicalInterpretation: `Theologically, this verse underscores important doctrines of God's character - His immutability, faithfulness, and covenantal love. It points to the unchanging nature of God's promises throughout generations.`,
      relatedScriptures: [
        'Hebrews 13:8',
        'Numbers 23:19',
        'Malachi 3:6',
        '2 Timothy 2:13',
        'Psalm 33:11'
      ],
      keyThemes: ['Faithfulness', 'Covenant', 'Divine Promises', 'God\'s Character'],
      application: `This verse encourages us to trust in God's unchanging nature. In times of uncertainty, we can find comfort in knowing that God's promises remain steadfast and His character never changes.`
    };
  }

  // Test API connection
  static async testConnection(): Promise<boolean> {
    if (!this.API_KEY) {
      console.log('❌ No DeepSeek API key found');
      return false;
    }

    try {
      const response = await fetch(this.DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: 'Test connection' }],
          max_tokens: 5,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('❌ DeepSeek API test failed:', error);
      return false;
    }
  }
}