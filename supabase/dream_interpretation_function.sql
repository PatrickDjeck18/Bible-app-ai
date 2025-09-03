-- Dream Interpretation Function for Supabase
-- This function provides AI-powered dream interpretation using DeepSeek API via Edge Functions

-- First, create the dreams table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.dreams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    mood TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    interpretation TEXT,
    biblical_insights JSONB,
    spiritual_meaning TEXT,
    symbols JSONB,
    prayer TEXT,
    significance TEXT CHECK (significance IN ('low', 'medium', 'high')),
    is_analyzed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.dreams ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own dreams" ON public.dreams
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own dreams" ON public.dreams
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own dreams" ON public.dreams
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own dreams" ON public.dreams
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_dreams_updated_at
    BEFORE UPDATE ON public.dreams
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create the dream interpretation function that calls Edge Function
CREATE OR REPLACE FUNCTION public.interpret_dream_with_deepseek(
    dream_title TEXT,
    dream_description TEXT,
    dream_mood TEXT DEFAULT 'neutral'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    edge_function_url TEXT;
    http_response JSONB;
BEGIN
    -- Set the Edge Function URL (you'll need to update this with your actual function URL)
    edge_function_url := 'https://rlzngxvmqcufzgxwdnyg.supabase.co/functions/v1/interpret-dream';
    
    -- Call the Edge Function to get DeepSeek interpretation
    SELECT content::jsonb INTO http_response
    FROM http((
        'POST',
        edge_function_url,
        ARRAY[
            http_header('Authorization', 'Bearer ' || current_setting('request.header.apikey')),
            http_header('Content-Type', 'application/json')
        ],
        'application/json',
        json_build_object(
            'dreamTitle', dream_title,
            'dreamDescription', dream_description,
            'mood', dream_mood
        )::text
    ));
    
    -- Check if the response is successful
    IF http_response IS NULL OR http_response->>'error' IS NOT NULL THEN
        -- Fallback to local interpretation if Edge Function fails
        result := public.interpret_dream_local(dream_title, dream_description, dream_mood);
    ELSE
        -- Use the DeepSeek API response
        result := http_response;
    END IF;
    
    RETURN result;
END;
$$;

-- Create a local fallback interpretation function
CREATE OR REPLACE FUNCTION public.interpret_dream_local(
    dream_title TEXT,
    dream_description TEXT,
    dream_mood TEXT DEFAULT 'neutral'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    -- Create the interpretation result based on mood
    result := jsonb_build_object(
        'interpretation', 
        CASE 
            WHEN dream_mood IN ('peaceful', 'joyful', 'blessed') THEN
                'This dream appears to carry positive spiritual significance. The peaceful and blessed nature suggests divine guidance and favor in your life. Consider this dream as a reminder of God''s presence and His plans for your future.'
            WHEN dream_mood IN ('prayerful', 'neutral') THEN
                'This dream may contain important spiritual messages that require prayerful reflection. The neutral nature suggests a time of spiritual discernment and seeking God''s wisdom.'
            ELSE
                'This dream may be processing emotions or concerns. While it may feel unsettling, it could be an invitation to bring these feelings before God in prayer and seek His comfort and guidance.'
        END,
        'biblicalInsights', 
        jsonb_build_array(
            'Philippians 4:6-7 - "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."',
            'Jeremiah 29:11 - "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
            'Psalm 16:7-8 - "I will praise the Lord, who counsels me; even at night my heart instructs me. I keep my eyes always on the Lord. With him at my right hand, I will not be shaken."',
            'Proverbs 3:5-6 - "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."',
            'James 1:5 - "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you."'
        ),
        'spiritualMeaning',
        CASE 
            WHEN dream_mood IN ('peaceful', 'joyful', 'blessed') THEN
                'This dream reflects God''s blessing and favor in your life. It suggests a season of spiritual growth and divine guidance. The peaceful atmosphere indicates that you are walking in God''s will and experiencing His peace.'
            WHEN dream_mood IN ('prayerful', 'neutral') THEN
                'This dream represents a call to deeper spiritual reflection and prayer. It may be highlighting areas in your life where God wants to bring clarity or direction. This is a time to seek His wisdom.'
            ELSE
                'This dream may be highlighting areas of concern or uncertainty in your spiritual journey. It''s an invitation to bring these matters before God and trust in His guidance and comfort.'
        END,
        'symbols',
        jsonb_build_array(
            jsonb_build_object('symbol', 'Light', 'meaning', 'Represents God''s presence, truth, and guidance', 'bibleVerse', 'John 8:12 - "I am the light of the world. Whoever follows me will never walk in darkness."'),
            jsonb_build_object('symbol', 'Water', 'meaning', 'Symbolizes spiritual cleansing, renewal, and the Holy Spirit', 'bibleVerse', 'John 4:14 - "Whoever drinks the water I give them will never thirst."'),
            jsonb_build_object('symbol', 'Path/Road', 'meaning', 'Represents your spiritual journey and life direction', 'bibleVerse', 'Psalm 119:105 - "Your word is a lamp for my feet, a light on my path."'),
            jsonb_build_object('symbol', 'Mountains', 'meaning', 'Symbolize challenges, spiritual growth, and God''s majesty', 'bibleVerse', 'Psalm 121:1-2 - "I lift up my eyes to the mountains—where does my help come from? My help comes from the Lord."')
        ),
        'prayer',
        CASE 
            WHEN dream_mood IN ('peaceful', 'joyful', 'blessed') THEN
                'Heavenly Father, thank You for the blessing of this dream and the peace it brings. Help me to recognize Your guidance in my life and to walk confidently in the path You have set before me. May I continue to experience Your presence and favor. In Jesus'' name, Amen.'
            WHEN dream_mood IN ('prayerful', 'neutral') THEN
                'Lord, as I reflect on this dream, grant me wisdom and discernment. Help me to understand the spiritual messages You may be sending and guide me in the decisions I need to make. Open my heart to receive Your direction. In Jesus'' name, Amen.'
            ELSE
                'Father God, I bring before You the concerns and emotions this dream has brought to light. Grant me Your peace that surpasses understanding and help me to trust in Your guidance. Comfort me with Your presence and show me the way forward. In Jesus'' name, Amen.'
        END,
        'significance',
        CASE 
            WHEN dream_mood = 'peaceful' THEN 'high'
            WHEN dream_mood = 'joyful' THEN 'high'
            WHEN dream_mood = 'blessed' THEN 'high'
            WHEN dream_mood = 'prayerful' THEN 'medium'
            WHEN dream_mood = 'neutral' THEN 'medium'
            WHEN dream_mood = 'anxious' THEN 'medium'
            WHEN dream_mood = 'sad' THEN 'low'
            WHEN dream_mood = 'fearful' THEN 'low'
            ELSE 'medium'
        END
    );
    
    RETURN result;
END;
$$;

-- Create a function to insert and interpret a dream in one call
CREATE OR REPLACE FUNCTION public.add_and_interpret_dream(
    dream_title TEXT,
    dream_description TEXT,
    dream_mood TEXT DEFAULT 'neutral'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_dream_id UUID;
    interpretation_result JSONB;
    final_result JSONB;
BEGIN
    -- Insert the dream
    INSERT INTO public.dreams (
        user_id,
        title,
        description,
        mood,
        is_analyzed
    ) VALUES (
        auth.uid(),
        dream_title,
        dream_description,
        dream_mood,
        FALSE
    ) RETURNING id INTO new_dream_id;

    -- Get the interpretation using DeepSeek API via Edge Function
    interpretation_result := public.interpret_dream_with_deepseek(dream_title, dream_description, dream_mood);

    -- Update the dream with interpretation results
    UPDATE public.dreams 
    SET 
        interpretation = interpretation_result->>'interpretation',
        biblical_insights = interpretation_result->'biblicalInsights',
        spiritual_meaning = interpretation_result->>'spiritualMeaning',
        symbols = interpretation_result->'symbols',
        prayer = interpretation_result->>'prayer',
        significance = interpretation_result->>'significance',
        is_analyzed = TRUE,
        updated_at = NOW()
    WHERE id = new_dream_id;

    -- Return the complete result
    final_result := jsonb_build_object(
        'id', new_dream_id,
        'title', dream_title,
        'description', dream_description,
        'mood', dream_mood,
        'date', NOW(),
        'interpretation', interpretation_result->>'interpretation',
        'biblicalInsights', interpretation_result->'biblicalInsights',
        'spiritualMeaning', interpretation_result->>'spiritualMeaning',
        'symbols', interpretation_result->'symbols',
        'prayer', interpretation_result->>'prayer',
        'significance', interpretation_result->>'significance',
        'isAnalyzed', TRUE
    );

    RETURN final_result;
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.dreams TO authenticated;
GRANT EXECUTE ON FUNCTION public.interpret_dream_with_deepseek(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.interpret_dream_local(TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_and_interpret_dream(TEXT, TEXT, TEXT) TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dreams_user_id ON public.dreams(user_id);
CREATE INDEX IF NOT EXISTS idx_dreams_date ON public.dreams(date);
CREATE INDEX IF NOT EXISTS idx_dreams_is_analyzed ON public.dreams(is_analyzed);

-- Enable the http extension for Edge Function calls
CREATE EXTENSION IF NOT EXISTS http;
