import { DailyBriefing, HistoryEventItem, NotificationSettings } from '../types';

const STORAGE_KEYS = {
  BRIEFINGS_CACHE: 'chroniclepad_briefings_cache_v1',
  SAVED_NOTES: 'chroniclepad_saved_notes_v1',
  REMINDER_SETTINGS: 'chroniclepad_reminder_settings_v1',
  OFFLINE_READ_HISTORY: 'chroniclepad_offline_history_v1',
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  frequency: 'daily',
  preferredTimes: ['08:30', '18:00'],
  categories: ['stocks', 'finance', 'tech', 'politics', 'culture', 'society', 'international'],
  sound: true,
  vibrate: true,
  browserPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
};

/**
 * Cache a day's briefing for offline access
 */
export function cacheBriefing(briefing: DailyBriefing): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRIEFINGS_CACHE);
    const map: Record<string, DailyBriefing> = raw ? JSON.parse(raw) : {};
    map[briefing.date] = briefing;
    localStorage.setItem(STORAGE_KEYS.BRIEFINGS_CACHE, JSON.stringify(map));
  } catch (err) {
    console.warn('Failed to cache briefing offline:', err);
  }
}

/**
 * Retrieve cached briefing by date string YYYY-MM-DD
 */
export function getCachedBriefing(date: string): DailyBriefing | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRIEFINGS_CACHE);
    if (!raw) return null;
    const map: Record<string, DailyBriefing> = JSON.parse(raw);
    return map[date] || null;
  } catch (err) {
    console.warn('Failed to read cached briefing:', err);
    return null;
  }
}

/**
 * Get all dates available offline
 */
export function getAvailableOfflineDates(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRIEFINGS_CACHE);
    if (!raw) return [];
    const map: Record<string, DailyBriefing> = JSON.parse(raw);
    return Object.keys(map).sort().reverse();
  } catch {
    return [];
  }
}

/**
 * Bookmark an event for Apple Notes collection
 */
export function toggleSaveEvent(event: HistoryEventItem): { isSaved: boolean; allSaved: HistoryEventItem[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_NOTES);
    const list: HistoryEventItem[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((e) => e.id === event.id);

    let isSaved = false;
    if (index >= 0) {
      list.splice(index, 1);
      isSaved = false;
    } else {
      list.unshift({ ...event, isSaved: true });
      isSaved = true;
    }

    localStorage.setItem(STORAGE_KEYS.SAVED_NOTES, JSON.stringify(list));
    return { isSaved, allSaved: list };
  } catch (err) {
    console.warn('Error saving note:', err);
    return { isSaved: false, allSaved: [] };
  }
}

/**
 * Get all bookmarked events
 */
export function getSavedEvents(): HistoryEventItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_NOTES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Load notification reminder settings
 */
export function loadNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDER_SETTINGS);
    if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
    return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

/**
 * Save notification reminder settings
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REMINDER_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save reminder settings:', err);
  }
}
