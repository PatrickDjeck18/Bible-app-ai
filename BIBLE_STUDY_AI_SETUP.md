# 🧠 **Bible Study AI Setup Guide**

## **Overview**
The Bible Study AI feature allows users to ask Bible questions and receive AI-powered responses using the Deepseek API. This creates an interactive, educational experience for deepening biblical knowledge.

## **🔧 Step 1: Deepseek API Setup**

### **1.1 Get Deepseek API Key**
1. Visit [Deepseek Console](https://platform.deepseek.com/)
2. Create an account or sign in
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy the API key (starts with `sk-`)

### **1.2 Configure Environment Variables**
Create or update your `.env` file in the project root:

```env
# Existing variables
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Add Deepseek API key
EXPO_PUBLIC_DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
```

### **1.3 Verify API Key**
The API key should be accessible in your app via:
```typescript
const apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
```

## **🔧 Step 2: Features Overview**

### **2.1 Core Features**
- **Interactive Chat Interface**: Modern chat UI with user and AI messages
- **Conversation Starters**: Pre-built Bible study topics to get started
- **Real-time Responses**: AI-powered answers using Deepseek API
- **Message Actions**: Copy and share functionality for responses
- **Session Management**: Start new study sessions
- **Loading States**: Visual feedback during AI processing

### **2.2 Conversation Starters**
The app includes 6 pre-built conversation starters:
1. **John 3:16** - Most famous Bible verse
2. **Trinity** - Fundamental Christian doctrine
3. **Fruit of the Spirit** - Galatians 5:22-23
4. **Beatitudes** - Jesus' teachings in Matthew 5
5. **Baptism** - Significance and meaning
6. **Armor of God** - Ephesians 6:10-18

## **🔧 Step 3: API Integration**

### **3.1 API Configuration**
The `callDeepseekAPI` function in `app/bible-study-ai.tsx`:

```typescript
const callDeepseekAPI = async (question: string): Promise<string> => {
  const apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('Deepseek API key not configured');
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable Bible scholar and Christian teacher...'
        },
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || 'Error generating response';
};
```

### **3.2 System Prompt**
The AI is configured with a specialized system prompt:
- Bible scholar and Christian teacher persona
- Accurate theological responses
- Bible verse references
- Accessible explanations
- Spiritually uplifting tone
- Concise but comprehensive answers

## **🔧 Step 4: User Interface**

### **4.1 Modern Design Elements**
- **Clean White Background**: Consistent with app theme
- **Message Bubbles**: User messages (right-aligned, primary color)
- **AI Responses**: Left-aligned with subtle background
- **Loading States**: "AI is thinking..." with spinner
- **Action Buttons**: Copy and share for AI responses
- **Conversation Starters**: Grid layout with icons

### **4.2 Navigation**
- **Header**: Back button, title, new session button
- **Quick Actions**: Added to home screen
- **Route**: `/bible-study-ai`

## **🔧 Step 5: Testing**

### **5.1 Development Testing**
1. **Start the app**: `npm start`
2. **Navigate to Bible Study AI**: Via Quick Actions or direct route
3. **Test conversation starters**: Tap on any starter topic
4. **Test custom questions**: Type your own Bible questions
5. **Test error handling**: Disconnect internet to test error states

### **5.2 Sample Questions to Test**
- "What does John 3:16 mean?"
- "Explain the Trinity"
- "What are the fruits of the Spirit?"
- "Tell me about the Beatitudes"
- "What is the significance of baptism?"
- "Explain the Armor of God"

## **🔧 Step 6: Error Handling**

### **6.1 Common Issues**
1. **API Key Missing**: Check `.env` file configuration
2. **Network Errors**: Verify internet connection
3. **Rate Limiting**: Deepseek API limits
4. **Invalid Responses**: API response parsing errors

### **6.2 Error Messages**
- **API Key Error**: "Deepseek API key not configured"
- **Network Error**: "Having trouble connecting right now"
- **Response Error**: "Couldn't generate a response at this time"

## **🔧 Step 7: Customization**

### **7.1 Adding More Conversation Starters**
Edit the `conversationStarters` array in `app/bible-study-ai.tsx`:

```typescript
const conversationStarters = [
  // Add new starters here
  {
    title: "Your Topic",
    description: "Your description",
    icon: "🎯"
  }
];
```

### **7.2 Modifying AI Behavior**
Update the system prompt in `callDeepseekAPI`:

```typescript
{
  role: 'system',
  content: 'Your custom system prompt here...'
}
```

### **7.3 Styling Customization**
Modify the styles in the StyleSheet to match your design preferences.

## **🔧 Step 8: Production Deployment**

### **8.1 Environment Variables**
Ensure your production environment has:
- `EXPO_PUBLIC_DEEPSEEK_API_KEY` configured
- API key has proper permissions
- Rate limits are appropriate for your user base

### **8.2 Monitoring**
- Monitor API usage in Deepseek console
- Track user engagement with the feature
- Monitor error rates and response times

## **🔧 Step 9: Security Considerations**

### **9.1 API Key Security**
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor API usage for unusual patterns

### **9.2 Content Filtering**
- The AI is configured to focus on Bible-related topics
- System prompt includes redirection for non-Bible questions
- Consider additional content filtering if needed

## **🔧 Step 10: Future Enhancements**

### **10.1 Potential Features**
- **Session History**: Save and retrieve past conversations
- **Bookmarking**: Save favorite responses
- **Voice Input**: Speech-to-text for questions
- **Offline Mode**: Cached responses for offline use
- **Multi-language**: Support for different languages
- **Citation Links**: Direct links to Bible verses

### **10.2 Integration Opportunities**
- **Bible Reading**: Link to specific Bible passages
- **Prayer Journal**: Connect insights to prayer requests
- **Quiz Integration**: Generate quiz questions from AI responses
- **Community Sharing**: Share insights with other users

---

## **🎯 Quick Start Checklist**

- [ ] Get Deepseek API key
- [ ] Add API key to `.env` file
- [ ] Test the feature in development
- [ ] Verify error handling works
- [ ] Test on different devices
- [ ] Deploy to production
- [ ] Monitor usage and performance

---

**Need Help?** Check the Deepseek API documentation or contact the development team for assistance.
