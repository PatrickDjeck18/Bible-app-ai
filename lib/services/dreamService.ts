import { db } from '../firebase'; // Assuming your Firebase initialization file
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Note: Ensure your DreamEntry, DreamAnalysisRequest, etc. are defined correctly.
import { DreamEntry, DreamAnalysisRequest, DreamAnalysisResponse } from '../types/dreams';

export class DreamService {
  // Enhanced cache for dreams data with better performance
  private static dreamsCache: DreamEntry[] | null = null;
  private static lastFetchTime: number = 0;
  private static readonly CACHE_DURATION = 10 * 60 * 1000; // Increased to 10 minutes for better performance
  private static readonly API_TIMEOUT = 15000; // 15 second timeout for API calls

  // Clear cache (useful for testing or when data might be stale)
  static clearCache(): void {
    this.dreamsCache = null;
    this.lastFetchTime = 0;
  }

  // Test DeepSeek API connection with timeout
  static async testDeepSeekAPI(): Promise<boolean> {
    const API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
    
    if (!API_KEY) {
      console.log('❌ No DeepSeek API key found');
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test message.'
            }
          ],
          max_tokens: 10,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log('✅ DeepSeek API connection successful');
        return true;
      } else {
        console.error('❌ DeepSeek API test failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ DeepSeek API test error:', error);
      return false;
    }
  }

  // Get all dreams for the current user (optimized with better caching)
  static async getDreams(userId: string, forceRefresh: boolean = false): Promise<DreamEntry[]> {
    try {
      const now = Date.now();
      if (!forceRefresh && this.dreamsCache !== null && (now - this.lastFetchTime) < this.CACHE_DURATION) {
        console.log('📦 Returning cached dreams data');
        return this.dreamsCache;
      }

      if (!userId) {
        console.log('No authenticated user found');
        this.dreamsCache = [];
        this.lastFetchTime = now;
        return [];
      }

      console.log('🔄 Fetching dreams from database...');
      
      const dreamsCollection = collection(db, 'dreams');
      const q = query(
        dreamsCollection,
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const dreamsData: DreamEntry[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as DreamEntry)); // Type assertion for type safety

      // Update cache
      this.dreamsCache = dreamsData;
      this.lastFetchTime = now;
      console.log(`✅ Fetched ${this.dreamsCache.length} dreams`);
      
      return this.dreamsCache;
    } catch (error) {
      console.error('Error fetching dreams:', error);
      this.dreamsCache = [];
      this.lastFetchTime = Date.now();
      return [];
    }
  }

  // Add a new dream and get real AI interpretation
  static async addAndInterpretDream(request: DreamAnalysisRequest, userId: string): Promise<DreamEntry> {
    try {
      console.log('🚀 Starting dream analysis with real DeepSeek API');
      
      if (!userId) {
        console.error('❌ No authenticated user found');
        throw new Error('User not authenticated');
      }
      
      console.log('✅ User authenticated:', userId);

      // First, save the dream without interpretation (fast operation)
      const dreamDataToInsert = {
        user_id: userId,
        title: request.dreamTitle,
        description: request.dreamDescription,
        mood: request.mood,
        is_analyzed: false,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };
      
      console.log('📝 Inserting dream data:', dreamDataToInsert);
      
      const docRef = await addDoc(collection(db, 'dreams'), dreamDataToInsert);

      console.log('✅ Dream saved successfully with ID:', docRef.id);

      // Get AI interpretation (will use fallback if API fails)
      console.log('🔍 Getting AI interpretation...');
      const interpretation = await this.getDeepSeekInterpretationWithTimeout(request);
      console.log('✅ AI interpretation received:', interpretation);
      
      // Update the dream with AI interpretation
      const updateData = {
        interpretation: interpretation.interpretation,
        biblical_insights: interpretation.biblicalInsights,
        spiritual_meaning: interpretation.spiritualMeaning,
        symbols: interpretation.symbols,
        prayer: interpretation.prayer,
        significance: interpretation.significance,
        is_analyzed: true,
        updated_at: serverTimestamp()
      };
      
      console.log('📝 Updating dream with interpretation:', updateData);
      
      await updateDoc(doc(db, 'dreams', docRef.id), updateData);
      
      const updatedDocSnapshot = await getDoc(doc(db, 'dreams', docRef.id));
      const updatedDream = {
        id: updatedDocSnapshot.id,
        ...updatedDocSnapshot.data()
      } as DreamEntry;

      console.log('✅ Dream updated with AI interpretation successfully');
      console.log('🎉 Final dream data:', updatedDream);
      
      // Clear cache since we added a new dream
      this.clearCache();
      
      return updatedDream;

    } catch (error) {
      console.error('❌ Error in addAndInterpretDream:', error);
      throw error;
    }
  }

  // Get real interpretation from DeepSeek API with timeout
  static async getDeepSeekInterpretationWithTimeout(request: DreamAnalysisRequest): Promise<DreamAnalysisResponse> {
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
    const API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;

    if (!API_KEY) {
      console.log('⚠️ No DeepSeek API key found, using fallback interpretation');
      return this.createBasicInterpretation(request);
    }

    const prompt = `You are a biblical dream interpreter. Analyze this dream from a Christian perspective and provide spiritual insights.

Dream Title: ${request.dreamTitle}
Dream Description: ${request.dreamDescription}
Dreamer's Mood: ${request.mood}

Please analyze this dream and provide a comprehensive biblical interpretation. Focus on:
1. What this dream might mean spiritually
2. Biblical connections and relevant scripture verses
3. Spiritual symbols and their meanings
4. A prayer based on the dream's themes
5. The spiritual significance level

Respond ONLY with valid JSON in this exact format (no additional text):
{
  "interpretation": "A 2-3 sentence spiritual interpretation of the dream",
  "biblicalInsights": ["Bible verse 1 with reference", "Bible verse 2 with reference", "Bible verse 3 with reference"],
  "spiritualMeaning": "1-2 sentences about the overall spiritual meaning",
  "symbols": [
    {"symbol": "symbol name", "meaning": "biblical meaning", "bibleVerse": "relevant verse with reference"}
  ],
  "prayer": "A heartfelt prayer based on the dream's themes",
  "significance": "low|medium|high"
}

Make the interpretation specific to the dream content, not generic. Reference actual elements from the dream description.`;

    console.log('🔍 Calling DeepSeek API with prompt...');

    try {
      // Add timeout to the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are a biblical dream interpreter. Always respond with valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DeepSeek API error response:', errorText);
        throw new Error(`DeepSeek API request failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      const content = responseData.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from DeepSeek API');
      }

      let parsedResponse: DreamAnalysisResponse;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonContent = jsonMatch ? jsonMatch[0] : content;
        
        parsedResponse = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('❌ JSON parsing error:', parseError);
        console.error('❌ Content that failed to parse:', content);
        throw new Error('Failed to parse DeepSeek API response as JSON');
      }

      const finalResponse: DreamAnalysisResponse = {
        interpretation: parsedResponse.interpretation || 'Unable to interpret dream at this time.',
        biblicalInsights: Array.isArray(parsedResponse.biblicalInsights) ? parsedResponse.biblicalInsights : ['Seek God\'s wisdom in prayer'],
        spiritualMeaning: parsedResponse.spiritualMeaning || 'The dream may have personal spiritual significance',
        symbols: Array.isArray(parsedResponse.symbols) ? parsedResponse.symbols : [],
        prayer: parsedResponse.prayer || 'Lord, help me understand the meaning of this dream',
        significance: ['low', 'medium', 'high'].includes(parsedResponse.significance) ? parsedResponse.significance : 'medium'
      };

      return finalResponse;
    } catch (error) {
      console.error('❌ DeepSeek API call failed:', error);
      console.log('🔄 Falling back to basic interpretation due to API error');
      return this.createBasicInterpretation(request);
    }
  }

  // Create basic interpretation as fallback
  static createBasicInterpretation(request: DreamAnalysisRequest): DreamAnalysisResponse {
    const { dreamTitle, dreamDescription, mood } = request;
    const desc = dreamDescription.toLowerCase();
    const title = dreamTitle.toLowerCase();
    
    let interpretation = '';
    let spiritualMeaning = '';
    let symbols: Array<{symbol: string, meaning: string, bibleVerse: string}> = [];
    let significance: 'low' | 'medium' | 'high' = 'medium';

    if (desc.includes('money') || desc.includes('counting') || title.includes('money')) {
      interpretation = 'Dreams about money often reflect concerns about provision, stewardship, or material security. From a biblical perspective, this dream may be calling you to examine your relationship with material possessions and trust in God as your ultimate provider.';
      spiritualMeaning = 'This dream may be highlighting the importance of seeking God\'s kingdom first and trusting Him for your material needs, as taught in Matthew 6:33.';
      symbols.push({
        symbol: 'Money',
        meaning: 'Represents provision, stewardship, and trust in God as provider',
        bibleVerse: 'Matthew 6:26 - "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?"'
      });
      significance = 'medium';
    } else if (desc.includes('water') || desc.includes('river') || desc.includes('ocean')) {
      interpretation = 'Water in dreams often symbolizes spiritual cleansing, renewal, and the Holy Spirit. This dream may indicate God is bringing refreshment and new life to areas of your spiritual journey.';
      spiritualMeaning = 'The water represents God\'s cleansing power and the flow of His Spirit in your life, bringing renewal and spiritual refreshment.';
      symbols.push({
        symbol: 'Water',
        meaning: 'Symbolizes spiritual cleansing, renewal, and the Holy Spirit',
        bibleVerse: 'John 4:14 - "Whoever drinks the water I give them will never thirst. Indeed, the water I give them will become in them a spring of water welling up to eternal life."'
      });
      significance = 'high';
    } else if (desc.includes('light') || desc.includes('bright') || desc.includes('sun')) {
      interpretation = 'Light in dreams represents God\'s presence, truth, and guidance. This dream suggests divine illumination and clarity coming into your life situation.';
      spiritualMeaning = 'The light symbolizes God\'s truth breaking through darkness and His guidance illuminating your path forward.';
      symbols.push({
        symbol: 'Light',
        meaning: 'Represents God\'s presence, truth, and divine guidance',
        bibleVerse: 'John 8:12 - "I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life."'
      });
      significance = 'high';
    } else if (desc.includes('family') || desc.includes('mother') || desc.includes('father') || desc.includes('child')) {
      interpretation = 'Dreams about family often reflect your relationships, responsibilities, and God\'s calling on your life. This dream may be highlighting the importance of family bonds and God\'s design for relationships.';
      spiritualMeaning = 'Family in dreams can represent God\'s care for His children and the importance of community in your spiritual journey.';
      symbols.push({
        symbol: 'Family',
        meaning: 'Represents relationships, community, and God\'s care for His children',
        bibleVerse: 'Psalm 127:3 - "Children are a heritage from the Lord, offspring a reward from him."'
      });
      significance = 'medium';
    } else {
      interpretation = this.generateMoodBasedInterpretation(mood, dreamDescription);
      spiritualMeaning = this.getSpiritualMeaning(mood);
      symbols = this.analyzeSymbols(dreamDescription);
      significance = this.determineSignificance(mood, dreamDescription);
    }

    const result = {
      interpretation,
      biblicalInsights: this.getBiblicalInsights(mood, dreamDescription),
      spiritualMeaning,
      symbols,
      prayer: this.generatePrayer(dreamTitle, mood, dreamDescription),
      significance
    };
    
    return result;
  }

  static generateMoodBasedInterpretation(mood: string, description: string): string {
    const moodInterpretations = {
      peaceful: 'This peaceful dream suggests divine comfort and guidance in your life. The serene nature indicates that God is bringing you into a season of rest and spiritual clarity.',
      joyful: 'This joyful dream reflects God\'s blessing and favor upon your life. The happiness you experienced may be a glimpse of the joy that comes from walking in God\'s will.',
      anxious: 'While this dream may have caused anxiety, it could be God\'s way of highlighting areas where you need to trust Him more deeply. Consider this an invitation to cast your cares upon Him.',
      confused: 'This confusing dream may represent a season of spiritual discernment. God sometimes speaks through unclear dreams to encourage us to seek His wisdom more earnestly.',
      hopeful: 'This hopeful dream appears to be a message of encouragement from God. The hope you felt may be a confirmation of His promises and plans for your future.'
    };

    return moodInterpretations[mood as keyof typeof moodInterpretations] || 
           'This dream may contain important spiritual messages that require prayerful reflection and seeking God\'s wisdom.';
  }

  static getBiblicalInsights(mood: string, description: string): string[] {
    const desc = description.toLowerCase();
    
    if (desc.includes('money') || desc.includes('counting') || desc.includes('wealth')) {
      return [
        'Matthew 6:19-21 - "Do not store up for yourselves treasures on earth, where moths and vermin destroy, and where thieves break in and steal. But store up for yourselves treasures in heaven... For where your treasure is, there your heart will be also."',
        '1 Timothy 6:10 - "For the love of money is a root of all kinds of evil. Some people, eager for money, have wandered from the faith and pierced themselves with many griefs."',
        'Philippians 4:19 - "And my God will meet all your needs according to the riches of his glory in Christ Jesus."',
        'Proverbs 3:9-10 - "Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing."'
      ];
    }
    
    const insights = [
      'Philippians 4:6-7 - "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."',
      'Jeremiah 29:11 - "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."',
      'Psalm 16:7 - "I will praise the Lord, who counsels me; even at night my heart instructs me."',
      'Proverbs 3:5-6 - "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."',
      'James 1:5 - "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you."'
    ];

    return insights.slice(0, 3);
  }

  static getSpiritualMeaning(mood: string): string {
    const meanings = {
      peaceful: 'This dream reflects God\'s peace and presence in your life, indicating you are walking in alignment with His will.',
      joyful: 'The joy in this dream represents the fruit of the Spirit and God\'s delight in your spiritual journey.',
      anxious: 'This dream may be calling you to surrender your worries to God and trust in His perfect plan for your life.',
      confused: 'The confusion in this dream suggests a need for spiritual discernment and seeking God\'s wisdom through prayer and scripture.',
      hopeful: 'This dream embodies the hope we have in Christ and may be God\'s way of encouraging you in your faith journey.'
    };

    return meanings[mood as keyof typeof meanings] || 
           'This dream invites you to seek God\'s wisdom and understanding through prayer and meditation on His word.';
  }

  static analyzeSymbols(description: string): Array<{symbol: string, meaning: string, bibleVerse: string}> {
    const symbols = [];
    const desc = description.toLowerCase();

    if (desc.includes('money') || desc.includes('coins') || desc.includes('counting')) {
      symbols.push({
        symbol: 'Money/Counting',
        meaning: 'Represents stewardship, provision, and trust in God as your ultimate source',
        bibleVerse: 'Matthew 6:26 - "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?"'
      });
    }

    if (desc.includes('light') || desc.includes('bright') || desc.includes('sun')) {
      symbols.push({
        symbol: 'Light',
        meaning: 'Represents God\'s presence, truth, and guidance in your life',
        bibleVerse: 'John 8:12 - "I am the light of the world. Whoever follows me will never walk in darkness."'
      });
    }

    if (desc.includes('water') || desc.includes('river') || desc.includes('ocean') || desc.includes('rain')) {
      symbols.push({
        symbol: 'Water',
        meaning: 'Symbolizes spiritual cleansing, renewal, and the Holy Spirit',
        bibleVerse: 'John 4:14 - "Whoever drinks the water I give them will never thirst."'
      });
    }

    if (desc.includes('mountain') || desc.includes('hill') || desc.includes('high')) {
      symbols.push({
        symbol: 'Mountain',
        meaning: 'Represents challenges, spiritual growth, and God\'s majesty',
        bibleVerse: 'Psalm 121:1-2 - "I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord."'
      });
    }

    if (desc.includes('path') || desc.includes('road') || desc.includes('journey') || desc.includes('walking')) {
      symbols.push({
        symbol: 'Path/Journey',
        meaning: 'Represents your spiritual journey and life direction',
        bibleVerse: 'Psalm 119:105 - "Your word is a lamp for my feet, a light on my path."'
      });
    }

    if (desc.includes('house') || desc.includes('home') || desc.includes('building')) {
      symbols.push({
        symbol: 'House/Building',
        meaning: 'Represents your spiritual foundation and relationship with God',
        bibleVerse: 'Matthew 7:24 - "Everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock."'
      });
    }

    if (symbols.length === 0) {
      symbols.push({
        symbol: 'Spiritual Journey',
        meaning: 'Represents your ongoing walk with God and spiritual growth',
        bibleVerse: 'Jeremiah 29:11 - "For I know the plans I have for you," declares the Lord.'
      });
    }

    return symbols.slice(0, 3);
  }

  static generatePrayer(title: string, mood: string, description: string): string {
    const desc = description.toLowerCase();
    
    if (desc.includes('money') || desc.includes('counting') || desc.includes('wealth')) {
      return 'Heavenly Father, I bring before You my concerns about provision and financial security. Help me to trust in You as my ultimate provider and to be a faithful steward of the resources You have given me. Teach me to seek first Your kingdom, knowing that You will provide for all my needs. Remove any anxiety about money and help me to find my security in You alone. In Jesus\' name, Amen.';
    }
    
    const prayers = {
      peaceful: 'Heavenly Father, thank You for the peace You bring through this dream. Help me to rest in Your presence and trust in Your guidance. May I continue to experience Your peace in all areas of my life. In Jesus\' name, Amen.',
      joyful: 'Lord, I praise You for the joy reflected in this dream. Thank You for the reminder of the joy that comes from knowing You. Help me to share this joy with others and live in the fullness of Your blessings. In Jesus\' name, Amen.',
      anxious: 'Father God, I bring before You the anxieties this dream has revealed. Grant me Your peace that surpasses understanding and help me to cast all my cares upon You. Strengthen my faith and trust in Your perfect plan. In Jesus\' name, Amen.',
      confused: 'Lord, as I seek to understand this dream, grant me wisdom and discernment. Help me to hear Your voice clearly and to follow Your guidance. Remove confusion and bring clarity to my path. In Jesus\' name, Amen.',
      hopeful: 'Thank You, God, for the hope this dream represents. Strengthen my faith and help me to hold fast to the hope I have in You. May this hope be an anchor for my soul in all circumstances. In Jesus\' name, Amen.'
    };

    return prayers[mood as keyof typeof prayers] || 
           'Lord, help me to understand the meaning of this dream and to discern Your voice. Guide me according to Your will and grant me wisdom. In Jesus\' name, Amen.';
  }

  static determineSignificance(mood: string, description: string): 'low' | 'medium' | 'high' {
    const desc = description.toLowerCase();
    
    if (mood === 'peaceful' || mood === 'joyful' || mood === 'hopeful' ||
        desc.includes('god') || desc.includes('jesus') || desc.includes('angel') ||
        desc.includes('light') || desc.includes('heaven') || desc.includes('church') ||
        desc.includes('money') || desc.includes('counting')) {
      return 'high';
    }
    
    if (mood === 'confused' || desc.length < 50) {
      return 'low';
    }
    
    return 'medium';
  }

  // Update an existing dream
  static async updateDream(id: string, updates: Partial<DreamEntry>, userId: string): Promise<void> {
    try {
      if (!userId) throw new Error('User not authenticated');

      const dreamDocRef = doc(db, 'dreams', id);
      const docSnapshot = await getDoc(dreamDocRef);

      if (!docSnapshot.exists() || docSnapshot.data()?.user_id !== userId) {
        throw new Error('Dream not found or user not authorized');
      }

      await updateDoc(dreamDocRef, { ...updates, updated_at: serverTimestamp() });
    } catch (error) {
      console.error('Error updating dream:', error);
      throw error;
    }
  }

  // Delete a dream
  static async deleteDream(id: string, userId: string): Promise<void> {
    try {
      console.log('🗑️ DreamService: Attempting to delete dream with ID:', id);
      
      if (!userId) {
        console.error('❌ User not authenticated');
        throw new Error('User not authenticated');
      }
      
      console.log('👤 User authenticated:', userId);

      const dreamDocRef = doc(db, 'dreams', id);
      const docSnapshot = await getDoc(dreamDocRef);

      if (!docSnapshot.exists() || docSnapshot.data()?.user_id !== userId) {
        throw new Error('Dream not found or user not authorized');
      }

      await deleteDoc(dreamDocRef);
      
      console.log('✅ Dream deleted successfully from database');
      
      this.clearCache();
    } catch (error) {
      console.error('❌ Error in deleteDream service:', error);
      throw error;
    }
  }

  // Get a single dream by ID
  static async getDreamById(id: string, userId: string): Promise<DreamEntry | null> {
    try {
      if (!userId) throw new Error('User not authenticated');

      const dreamDocRef = doc(db, 'dreams', id);
      const docSnapshot = await getDoc(dreamDocRef);

      if (!docSnapshot.exists() || docSnapshot.data()?.user_id !== userId) {
        return null;
      }

      return {
        id: docSnapshot.id,
        ...docSnapshot.data()
      } as DreamEntry;
    } catch (error) {
      console.error('Error fetching dream:', error);
      throw error;
    }
  }
}