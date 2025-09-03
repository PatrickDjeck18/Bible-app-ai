import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DreamAnalysisRequest {
  dreamTitle: string;
  dreamDescription: string;
  mood?: string;
}

interface DreamAnalysisResponse {
  interpretation: string;
  biblicalInsights: string[];
  spiritualMeaning: string;
  symbols: Array<{
    symbol: string;
    meaning: string;
    bibleVerse: string;
  }>;
  prayer: string;
  significance: 'low' | 'medium' | 'high';
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('🚀 Dream interpretation request received');
    
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const requestData: DreamAnalysisRequest = await req.json();
    const { dreamTitle, dreamDescription, mood }: DreamAnalysisRequest = requestData;

    if (!dreamTitle || !dreamDescription) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: dreamTitle and dreamDescription are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('📝 Analyzing dream:', { dreamTitle, mood });

    // DeepSeek API configuration with timeout
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
    const apiKey = Deno.env.get('DEEPSEEK_API_KEY') || 'sk-a65800223d43491a818e11c4f6d27dbb';
    const API_TIMEOUT = 25000; // 25 second timeout

    const prompt = `Analyze this dream from a biblical and spiritual perspective:

Dream Title: ${dreamTitle}
Dream Description: ${dreamDescription}
Mood: ${mood || 'Not specified'}

Please provide a comprehensive spiritual interpretation including:
1. A spiritual interpretation of the dream (2-3 sentences)
2. 3-5 biblical insights related to the dream themes
3. The overall spiritual meaning (1-2 sentences)
4. Analysis of 2-4 key symbols with biblical references
5. A heartfelt prayer based on the dream
6. Significance level (low/medium/high)

Format the response as valid JSON with these exact keys: interpretation, biblicalInsights, spiritualMeaning, symbols, prayer, significance.

The symbols should be an array of objects with keys: symbol, meaning, bibleVerse.
The response should be spiritually uplifting and biblically grounded.`;

    console.log('🔍 Calling DeepSeek API with timeout...');

    // Add timeout to the API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ API call timed out, aborting...');
      controller.abort();
    }, API_TIMEOUT);
    
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
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
      console.error('❌ DeepSeek API error:', errorText);
      throw new Error(`DeepSeek API request failed: ${response.status}`);
    }

    const responseData = await response.json();
    const content = responseData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from DeepSeek API');
    }

    console.log('✅ DeepSeek response received');

    // Parse JSON response with better error handling
    let parsedResponse: DreamAnalysisResponse;
    try {
      // Clean the content in case there's extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonContent = jsonMatch ? jsonMatch[0] : content;
      
      parsedResponse = JSON.parse(jsonContent);
      console.log('✅ Successfully parsed DeepSeek response');
    } catch (parseError) {
      console.error('❌ JSON parsing error, using fallback');
      // Fallback interpretation
      parsedResponse = {
        interpretation: content.substring(0, 500) + '...',
        biblicalInsights: [
          'Philippians 4:6-7 - "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."',
          'Jeremiah 29:11 - "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
          'Psalm 16:7 - "I will praise the Lord, who counsels me; even at night my heart instructs me."'
        ],
        spiritualMeaning: 'This dream may contain important spiritual messages that require prayerful reflection.',
        symbols: [
          { symbol: 'Light', meaning: 'Represents God\'s presence and guidance', bibleVerse: 'John 8:12' },
          { symbol: 'Water', meaning: 'Symbolizes spiritual cleansing and renewal', bibleVerse: 'John 4:14' }
        ],
        prayer: 'Lord, help me understand the meaning of this dream and guide me according to Your will. In Jesus\' name, Amen.',
        significance: 'medium'
      };
    }

    // Validate and ensure all required fields are present
    const finalResponse: DreamAnalysisResponse = {
      interpretation: parsedResponse.interpretation || 'Unable to interpret dream at this time.',
      biblicalInsights: Array.isArray(parsedResponse.biblicalInsights) ? parsedResponse.biblicalInsights : ['Seek God\'s wisdom in prayer'],
      spiritualMeaning: parsedResponse.spiritualMeaning || 'The dream may have personal spiritual significance',
      symbols: Array.isArray(parsedResponse.symbols) ? parsedResponse.symbols : [],
      prayer: parsedResponse.prayer || 'Lord, help me understand the meaning of this dream',
      significance: ['low', 'medium', 'high'].includes(parsedResponse.significance) ? parsedResponse.significance : 'medium'
    };

    console.log('🎉 Dream interpretation completed successfully');

    return new Response(JSON.stringify(finalResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error in dream interpretation:', error);
    
    // Handle timeout errors specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(JSON.stringify({ 
        error: 'Request timeout',
        details: 'The dream analysis took too long. Please try again with a shorter dream description.',
        fallback: true
      }), {
        status: 408,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: 'Failed to analyze dream. Please try again later.',
      fallback: true
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});