import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Utility function to clean markdown formatting from AI responses
function cleanAIResponse(text: string): string {
  if (!text) return text;

  // Remove bold formatting (**text** or __text__)
  let cleanedText = text.replace(/\*\*(.*?)\*\*/g, '$1');
  cleanedText = cleanedText.replace(/__(.*?)__/g, '$1');
  
  // Remove italic formatting (*text* or _text_)
  cleanedText = cleanedText.replace(/\*(.*?)\*/g, '$1');
  cleanedText = cleanedText.replace(/_(.*?)_/g, '$1');
  
  // Remove strikethrough formatting (~~text~~)
  cleanedText = cleanedText.replace(/~~(.*?)~~/g, '$1');
  
  // Remove inline code formatting (`text`)
  cleanedText = cleanedText.replace(/`([^`]+)`/g, '$1');
  
  // Clean up any double spaces that might result from formatting removal
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
  
  // Ensure proper paragraph spacing
  cleanedText = cleanedText.replace(/\n\s*\n/g, '\n\n');
  
  return cleanedText;
}

interface ChatRequest {
  message: string;
  category: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

interface ChatResponse {
  response: string;
  category: string;
  timestamp: string;
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
    console.log('🚀 AI Bible Chat request received');
    
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const requestData = await req.json();
    const { message, category, conversationHistory = [] }: ChatRequest = requestData;

    if (!message || !category) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: message and category are required' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('📝 Processing chat message for category:', category);

    // DeepSeek API configuration
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY') || 'sk-a65800223d43491a818e11c4f6d27dbb';

    // Category-specific system prompts
    const systemPrompts = {
      'bible-study': 'You are a knowledgeable Bible study assistant. Help users understand Scripture, provide context, explain difficult passages, and offer practical applications. Always reference specific Bible verses and provide accurate biblical interpretation based on sound hermeneutics.',
      'prayer-life': 'You are a prayer mentor and spiritual guide. Help users develop their prayer life, understand different types of prayer, overcome prayer challenges, and deepen their relationship with God through prayer. Provide biblical examples and practical guidance.',
      'faith-life': 'You are a Christian life coach helping believers apply their faith to daily life. Provide biblical wisdom for life decisions, relationships, work, and personal growth. Help users see how their faith intersects with practical living.',
      'theology': 'You are a theological scholar with deep knowledge of Christian doctrine, church history, and biblical theology. Help users understand complex theological concepts, answer doctrinal questions, and explore the depths of Christian faith with biblical accuracy.',
      'relationships': 'You are a Christian counselor specializing in relationships. Provide biblical guidance for marriage, family, friendships, and community relationships. Help users navigate relationship challenges with wisdom from Scripture.',
      'spiritual-growth': 'You are a spiritual mentor focused on helping believers grow in their faith. Provide guidance on spiritual disciplines, overcoming spiritual obstacles, developing Christian character, and maturing in faith.',
      'life-questions': 'You are a wise biblical counselor who helps people find biblical answers to life\'s big questions. Address topics like purpose, suffering, decision-making, and finding God\'s will with compassion and biblical truth.',
      'holy-spirit': 'You are an expert on the Holy Spirit and spiritual gifts. Help users understand the role of the Holy Spirit, discover and develop their spiritual gifts, and learn to be led by the Spirit in their daily lives.',
      'service': 'You are a ministry leader who helps believers discover their calling and serve effectively. Provide guidance on finding your ministry, serving in the church, missions, and making a difference in your community for Christ.',
      'general-chat': 'You are a friendly Christian companion for open conversations about faith, life, and spiritual matters. Be encouraging, biblically sound, and ready to discuss any topic from a Christian perspective.'
    };

    const systemPrompt = systemPrompts[category as keyof typeof systemPrompts] || systemPrompts['general-chat'];

    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}

Guidelines:
- Always provide biblically accurate information
- Reference specific Bible verses when relevant (include book, chapter, and verse)
- Be encouraging and supportive
- Keep responses conversational and helpful
- If you're unsure about something, acknowledge it and suggest prayer or consulting Scripture
- Maintain a warm, pastoral tone
- Limit responses to 2-3 paragraphs for mobile readability
- Use proper formatting with line breaks for readability
- When quoting Scripture, use quotation marks and provide the reference`
        },
        ...conversationHistory.slice(-8), // Keep last 8 messages for context
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 0.9,
    };

    console.log('🔍 Calling DeepSeek API for Bible chat...');

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

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

    console.log('✅ DeepSeek response received for Bible chat');

    // Clean the AI response to remove markdown formatting
    const cleanedContent = cleanAIResponse(content);

    const chatResponse: ChatResponse = {
      response: cleanedContent,
      category: category,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(chatResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error in AI Bible chat:', error);
    
    // Provide a helpful fallback response
    const fallbackResponse = {
      response: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment. In the meantime, I encourage you to pray about your question and seek wisdom from God's Word. 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.' (James 1:5)",
      category: 'general-chat',
      timestamp: new Date().toISOString(),
    };
    
    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});