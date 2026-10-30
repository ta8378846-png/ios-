import { NotificationSettings } from '../types';

/**
 * Synthesizes an iPadOS-style gentle alert chime via Web Audio API
 */
export async function playChimeSound(): Promise<void> {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const now = ctx.currentTime;

    // Double chime (Marimba / iPad bell tone)
    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.35, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(880, now, 0.4);            // A5
    playTone(1318.51, now + 0.12, 0.55); // E6
  } catch (e) {
    console.debug('Audio play failed:', e);
  }
}

/**
 * Diagnostic environment inspection for iPad & web push capabilities
 */
export function getNotificationEnvironmentInfo() {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return {
      isIpad: false,
      isStandalone: false,
      isInIframe: false,
      hasNotificationApi: false,
      permission: 'denied' as NotificationPermission,
      canUseSystemPush: false,
    };
  }

  const userAgent = navigator.userAgent || '';
  const isIpad = /iPad|Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1;
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isInIframe = window.self !== window.top;
  const hasNotificationApi = 'Notification' in window;
  const permission: NotificationPermission = hasNotificationApi ? Notification.permission : 'denied';
  
  // On iOS / iPadOS, system push only functions reliably when installed as PWA (standalone)
  const canUseSystemPush = hasNotificationApi && !isInIframe && permission === 'granted';

  return {
    isIpad,
    isStandalone,
    isInIframe,
    hasNotificationApi,
    permission,
    canUseSystemPush,
  };
}

/**
 * Request browser push notification permission with callback & promise fallbacks
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  // If inside iframe, standard permission dialog cannot be triggered by browser security policy
  if (window.self !== window.top) {
    console.warn('Notification permission cannot be requested inside an iframe.');
    return Notification.permission;
  }

  try {
    let permission: NotificationPermission;
    try {
      permission = await Notification.requestPermission();
    } catch {
      permission = await new Promise<NotificationPermission>((resolve) => {
        Notification.requestPermission((p) => resolve(p));
      });
    }
    return permission;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Triggers a notification via Service Worker or native Notification constructor
 */
export async function triggerNotification(title: string, options?: NotificationOptions): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    // If ServiceWorker registration is ready, use it (recommended for PWA)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          icon: '/icon.svg',
          badge: '/icon.svg',
          ...options,
        });
        return true;
      }
    }

    // Fallback to desktop / browser Notification
    new Notification(title, {
      icon: '/icon.svg',
      ...options,
    });
    return true;
  } catch (err) {
    console.warn('Failed to trigger native notification:', err);
    return false;
  }
}

/**
 * Calculates the minutes until the next scheduled reminder time
 */
export function getMinutesUntilNextReminder(preferredTimes: string[], currentDate = new Date()): number {
  if (!preferredTimes || preferredTimes.length === 0) return 0;

  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  const timesInMinutes = preferredTimes
    .map((t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + (m || 0);
    })
    .sort((a, b) => a - b);

  // Find the next upcoming time today
  const nextToday = timesInMinutes.find((m) => m > currentMinutes);
  if (nextToday !== undefined) {
    return nextToday - currentMinutes;
  }

  // Otherwise, first time tomorrow
  return 24 * 60 - currentMinutes + timesInMinutes[0];
}

/**
 * Format minutes remaining to human readable string
 */
export function formatTimeRemaining(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} 分钟后`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  return remainingMins > 0 ? `${hours} 小时 ${remainingMins} 分钟后` : `${hours} 小时后`;
}
