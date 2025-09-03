export interface DreamEntry {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  mood: string;
  date: string;
  interpretation?: string;
  biblical_insights?: string[];
  spiritual_meaning?: string;
  symbols?: Array<{
    symbol: string;
    meaning: string;
    bibleVerse?: string;
  }>;
  prayer?: string;
  significance?: 'low' | 'medium' | 'high';
  is_analyzed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DreamAnalysisRequest {
  dreamTitle: string;
  dreamDescription: string;
  mood: string;
}

export interface DreamAnalysisResponse {
  interpretation: string;
  biblicalInsights: string[];
  spiritualMeaning: string;
  symbols: Array<{
    symbol: string;
    meaning: string;
    bibleVerse?: string;
  }>;
  prayer: string;
  significance: 'low' | 'medium' | 'high';
}
