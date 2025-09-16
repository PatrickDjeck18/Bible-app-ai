export interface Prayer {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: string;
  status: 'active' | 'answered' | 'paused';
  created_at: string;
  answered_at?: string;
  prayer_count?: number;
  last_prayed_at?: string;
  mood?: string;
  location?: string;
  voice_note?: string;
  images?: string[];
  tags?: string[];
  is_shared?: boolean;
  reminder_time?: string;
  frequency?: string;
  user_id: string; // ✅ Add this line

}