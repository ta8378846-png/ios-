export type EventCategory = 
  | 'stocks' 
  | 'finance' 
  | 'tech' 
  | 'politics' 
  | 'culture' 
  | 'society' 
  | 'international';

export interface EventImpact {
  market: string;
  sector: string;
  takeaway: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface HistoryEventItem {
  id: string;
  title: string;
  category: EventCategory;
  time: string;
  summary: string;
  importance: 'critical' | 'high' | 'medium';
  impact: EventImpact;
  sources?: GroundingSource[];
  tags: string[];
  year?: number;
  isSaved?: boolean;
}

export interface HistoricalParallel {
  year: number;
  event: string;
  significance: string;
}

export interface DailyBriefing {
  date: string; // YYYY-MM-DD
  displayDate: string;
  isToday: boolean;
  marketSentiment: {
    status: 'bullish' | 'bearish' | 'neutral' | 'volatile';
    label: string;
    score: number; // 0 - 100
    summary: string;
  };
  executiveSummary: string;
  events: HistoryEventItem[];
  historicalParallels: HistoricalParallel[];
  updatedAt: string;
}

export interface NotificationSettings {
  enabled: boolean;
  frequency: 'daily' | 'market-hours' | 'realtime';
  preferredTimes: string[]; // e.g. ["09:00", "18:30"]
  categories: EventCategory[];
  sound: boolean;
  vibrate: boolean;
  browserPermission: NotificationPermission;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  groundingSources?: GroundingSource[];
}
