import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Coins, 
  Cpu, 
  Landmark, 
  Search, 
  Calendar, 
  FileText, 
  Share2, 
  Sparkles, 
  Layers, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  History,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyBriefing, HistoryEventItem, EventCategory, NotificationSettings } from './types';
import { Header } from './components/Header';
import { EventCard } from './components/EventCard';
import { NotesExportModal } from './components/NotesExportModal';
import { TwitterShareModal } from './components/TwitterShareModal';
import { XiaohongshuShareModal } from './components/XiaohongshuShareModal';
import { PdfExportModal } from './components/PdfExportModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { IPadWidgetPreview } from './components/IPadWidgetPreview';
import { SavedNotesDrawer } from './components/SavedNotesDrawer';
import { InAppNotificationBanner } from './components/InAppNotificationBanner';
import { IPadInstallBanner } from './components/IPadInstallBanner';
import { filterEvents, CATEGORY_LABELS, formatForAppleNotes } from './utils/formatters';
import { 
  cacheBriefing, 
  getCachedBriefing, 
  toggleSaveEvent, 
  getSavedEvents, 
  loadNotificationSettings, 
  saveNotificationSettings 
} from './utils/storage';
import { playChimeSound, triggerNotification, getMinutesUntilNextReminder } from './utils/reminder';

export default function App() {
  const getLocalDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getLocalDateStr();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);
  const [justRefreshed, setJustRefreshed] = useState<boolean>(false);

  // Filters
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Modals & Drawers
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isTwitterModalOpen, setIsTwitterModalOpen] = useState(false);
  const [isXiaohongshuModalOpen, setIsXiaohongshuModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isWidgetPreviewOpen, setIsWidgetPreviewOpen] = useState(false);

  // Actions context
  const [selectedEventForShare, setSelectedEventForShare] = useState<HistoryEventItem | null>(null);
  const [aiChatInitialQuery, setAIChatInitialQuery] = useState<string | undefined>(undefined);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Saved items & settings
  const [savedEvents, setSavedEvents] = useState<HistoryEventItem[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(loadNotificationSettings());
  const [inAppNotification, setInAppNotification] = useState<{ title: string; message: string } | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load saved events
    setSavedEvents(getSavedEvents());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch briefing on date change or force refresh
  const loadBriefing = async (date: string, force = false) => {
    setIsLoading(true);

    // If not forcing, check offline cache first for instant render
    if (!force) {
      const cached = getCachedBriefing(date);
      if (cached) {
        setBriefing(cached);
      }
    }

    try {
      const queryUrl = force 
        ? `/api/briefing?date=${encodeURIComponent(date)}&refresh=true&_t=${Date.now()}`
        : `/api/briefing?date=${encodeURIComponent(date)}`;
      
      const res = await fetch(queryUrl, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      if (res.ok) {
        const data: DailyBriefing = await res.json();
        setBriefing(data);
        cacheBriefing(data);
        if (force) {
          setJustRefreshed(true);
          setTimeout(() => setJustRefreshed(false), 3800);
          setRefreshToast(`✨ 已为您成功刷新 ${data.displayDate} 最新事件（更新于 ${data.updatedAt || '刚刚'}）`);
          setTimeout(() => setRefreshToast(null), 3800);
          try {
            confetti({ particleCount: 26, spread: 60, origin: { y: 0.12 } });
          } catch (e) {}
        }
      } else {
        throw new Error('Failed to fetch from server');
      }
    } catch (err) {
      console.warn('Network fetch error, falling back to cached:', err);
      const fallback = getCachedBriefing(date) || getCachedBriefing(todayStr);
      if (fallback) setBriefing(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBriefing(selectedDate, false);
  }, [selectedDate]);

  // Push reminder interval check: pushes today's real breaking headline!
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, '0');
      const currentM = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentH}:${currentM}`;

      if (notificationSettings.preferredTimes.includes(currentTimeStr)) {
        if (notificationSettings.sound) {
          playChimeSound();
        }

        const topEvent = briefing?.events?.[0];
        const title = topEvent ? `🔔 今日要闻推送 · ${CATEGORY_LABELS[topEvent.category].name}` : '🔔 每日重大事件定时推送';
        const msg = topEvent
          ? `【${topEvent.title}】${topEvent.summary}`
          : (briefing?.executiveSummary || '今日重大股市、金融、科技、社会、文化与国际要闻已整理完成，点击查看。');

        setInAppNotification({ title, message: msg });
        triggerNotification(title, { body: msg });
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [notificationSettings, briefing]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (!briefing) return [];
    return filterEvents(briefing.events, activeCategory, searchKeyword);
  }, [briefing, activeCategory, searchKeyword]);

  // Category counts across all 7 dimensions
  const categoryCounts = useMemo(() => {
    if (!briefing) {
      return { all: 0, stocks: 0, finance: 0, tech: 0, politics: 0, culture: 0, society: 0, international: 0 };
    }
    return {
      all: briefing.events.length,
      stocks: briefing.events.filter((e) => e.category === 'stocks').length,
      finance: briefing.events.filter((e) => e.category === 'finance').length,
      tech: briefing.events.filter((e) => e.category === 'tech').length,
      politics: briefing.events.filter((e) => e.category === 'politics').length,
      culture: briefing.events.filter((e) => e.category === 'culture').length,
      society: briefing.events.filter((e) => e.category === 'society').length,
      international: briefing.events.filter((e) => e.category === 'international').length,
    };
  }, [briefing]);

  // Saved map
  const savedIdsSet = useMemo(() => new Set(savedEvents.map((e) => e.id)), [savedEvents]);

  // Handlers
  const handleToggleSave = (ev: HistoryEventItem) => {
    const { allSaved } = toggleSaveEvent(ev);
    setSavedEvents(allSaved);
  };

  const handleCopySingleNote = async (ev: HistoryEventItem) => {
    const sourcesText = ev.sources && ev.sources.length > 0 
      ? `\n权威信源：${ev.sources.map(s => `${s.title} (${s.uri})`).join(' | ')}` 
      : '';
    const singleText = `【${CATEGORY_LABELS[ev.category].name}】${ev.title}\n时间：${ev.time}\n核心概要：${ev.summary}\n市场传导：${ev.impact.market}\n行业启示：${ev.impact.takeaway}${sourcesText}\n\n*ChroniclePad 备忘录条目*`;
    try {
      await navigator.clipboard.writeText(singleText);
      setCopiedId(ev.id);
      confetti({ particleCount: 20, spread: 45 });
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleShareTwitter = (ev: HistoryEventItem) => {
    setSelectedEventForShare(ev);
    setIsTwitterModalOpen(true);
  };

  const handleAskAI = (ev: HistoryEventItem) => {
    const query = `请深度分析事件「${ev.title}」的发生动因，它对资本市场与相关产业链将产生怎样的中长期连锁反应？历史上是否有过类似的经典行情对照？`;
    setAIChatInitialQuery(query);
    setIsAIChatOpen(true);
  };

  const handleCopyAllSaved = async () => {
    const lines = savedEvents.map((ev, idx) => {
      const src = ev.sources && ev.sources.length > 0 ? `\n   - 信源：${ev.sources.map(s => s.title).join(', ')}` : '';
      return `${idx + 1}. 【${CATEGORY_LABELS[ev.category].name}】${ev.title}\n   - 概要：${ev.summary}\n   - 启示：${ev.impact.takeaway}${src}\n`;
    });
    const content = `# 📑 ChroniclePad 个人收藏备忘录\n\n${lines.join('\n')}\n*保存自 ChroniclePad for iPad*`;
    await navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* iPad In-App Notification Banner (Alerts & push simulations) */}
      <InAppNotificationBanner
        notification={inAppNotification}
        onClose={() => setInAppNotification(null)}
        onOpen={() => {
          setInAppNotification(null);
          setIsNotesModalOpen(true);
        }}
      />

      {/* iPad PWA Install Guidance Banner */}
      <IPadInstallBanner />

      {/* App Header */}
      <Header
        briefing={briefing}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isOnline={isOnline}
        isLoading={isLoading}
        onRefresh={() => loadBriefing(selectedDate, true)}
        onOpenNotesModal={() => setIsNotesModalOpen(true)}
        onOpenTwitterModal={() => {
          setSelectedEventForShare(null);
          setIsTwitterModalOpen(true);
        }}
        onOpenXiaohongshuModal={() => {
          setSelectedEventForShare(null);
          setIsXiaohongshuModalOpen(true);
        }}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onToggleAIChat={() => {
          setAIChatInitialQuery(undefined);
          setIsAIChatOpen(true);
        }}
        onToggleWidgetPreview={() => setIsWidgetPreviewOpen(true)}
        savedCount={savedEvents.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Refresh success banner */}
        {refreshToast && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{refreshToast}</span>
            </div>
            <button
              onClick={() => setRefreshToast(null)}
              className="text-emerald-700 hover:text-emerald-950 p-1 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Offline notification bar if disconnected */}
        {!isOnline && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>
                <strong>离线模式已激活：</strong>
                正在展示本地离线缓存的重大事件，全部导出备忘录、推特文案与推送提醒功能均完全可用。
              </span>
            </div>
            <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-mono border border-amber-200">
              100% 本地可用
            </span>
          </div>
        )}

        {/* Executive Summary & Market Sentiment Dashboard (Apple Light Frosted Card) */}
        {briefing && (
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
            {/* Background subtle light ambient tint */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-50/50 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left: Headline & Executive Summary */}
              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 tracking-wide">
                    {briefing.displayDate}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    更新于 {briefing.updatedAt}
                  </span>
                  {justRefreshed && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                      刚刚实时刷新
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  全球宏观、科技、社会文化与资本市场全景扫描
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {briefing.executiveSummary}
                </p>
              </div>

              {/* Right: Market Sentiment Gauge & 1-tap Export to Notes */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 shrink-0 lg:min-w-[280px]">
                {/* Sentiment box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 shadow-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      全球市场情绪指数
                    </span>
                    <span className="text-sm font-bold text-amber-700">
                      {briefing.marketSentiment.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      {briefing.marketSentiment.score}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                  </div>
                </div>

                {/* Big 1-tap Apple Notes button */}
                <button
                  onClick={() => setIsNotesModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition active:scale-95 cursor-pointer"
                  aria-label="一键导入全部事件至备忘录"
                >
                  <FileText className="w-4 h-4 stroke-[2.5]" />
                  <span>一键导入今日事件至备忘录</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Filter Toolbar: All 7 Categories Tabs + Search Box */}
        <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white border border-slate-200/90 p-2.5 rounded-2xl shadow-xs">
          {/* Category Tabs: Stocks, Finance, Tech, Politics, Culture, Society, International */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
            {[
              { id: 'all', label: '全部维度', count: categoryCounts.all },
              { id: 'stocks', label: '股市动态', count: categoryCounts.stocks },
              { id: 'finance', label: '金融宏观', count: categoryCounts.finance },
              { id: 'tech', label: '科技前沿', count: categoryCounts.tech },
              { id: 'politics', label: '政治地缘', count: categoryCounts.politics },
              { id: 'culture', label: '文化浪潮', count: categoryCounts.culture },
              { id: 'society', label: '社会民生', count: categoryCounts.society },
              { id: 'international', label: '国际视野', count: categoryCounts.international },
            ].map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200/70'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      active ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索事件、公司、题材、启示..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* Events Grid (2 columns on iPad / Desktop, 1 column on smaller tablets/phones) */}
        <section aria-label="重大事件列表">
          {isLoading && !briefing ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-medium">
                正在通过 Gemini 3.8 Flash 与谷歌搜索实时搜集核验事件...
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/90 p-8 space-y-2 shadow-xs">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">未找到匹配的事件</p>
              <p className="text-xs text-slate-500">
                请尝试更换筛选类别，或在上方选择其他日期。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSaved={savedIdsSet.has(event.id)}
                  onToggleSave={handleToggleSave}
                  onCopySingleNote={handleCopySingleNote}
                  onShareTwitter={handleShareTwitter}
                  onShareXiaohongshu={(ev) => {
                    setSelectedEventForShare(ev);
                    setIsXiaohongshuModalOpen(true);
                  }}
                  onAskAI={handleAskAI}
                  copiedId={copiedId}
                />
              ))}
            </div>
          )}
        </section>

        {/* Historical Parallels Spotlight (历史上的今天对照) */}
        {briefing && briefing.historicalParallels && briefing.historicalParallels.length > 0 && (
          <section className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <History className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    历史上的今天 · 穿越时空的启示
                  </h3>
                  <p className="text-xs text-slate-500">
                    重大金融危机与科技突围的历史回溯，以史为鉴
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const q = `请帮我深入剖析【历史上的今天】：${briefing.historicalParallels.map((p) => `${p.year}年 ${p.event}`).join('；')}。它对当下的投资与科技周期有哪些最重要的反思？`;
                  setAIChatInitialQuery(q);
                  setIsAIChatOpen(true);
                }}
                className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>AI 历史深度回眸</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {briefing.historicalParallels.map((parallel, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-2 hover:border-amber-300 hover:bg-amber-50/20 transition shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-700 font-mono">
                      📅 {parallel.year} 年
                    </span>
                    <span className="text-[11px] text-slate-500">历史经典事件</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {parallel.event}
                  </h4>
                  <div className="text-xs text-slate-600 border-t border-slate-200 pt-2 flex items-start gap-1.5">
                    <span className="text-indigo-600 font-medium shrink-0">启示：</span>
                    <span>{parallel.significance}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating iPad Quick Action Dock (iPadOS floating pill in Light Mode) */}
      <aside aria-label="快捷操作悬浮栏" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-3 py-2 rounded-full bg-white/95 border border-slate-200/90 shadow-xl backdrop-blur-xl flex items-center gap-2 select-none">
        <button
          onClick={() => setIsNotesModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>导入备忘录</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-200" />

        <button
          onClick={() => {
            setSelectedEventForShare(null);
            setIsTwitterModalOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-slate-100 text-slate-700 text-xs font-medium transition cursor-pointer"
          title="分享推特"
        >
          <Share2 className="w-3.5 h-3.5 text-sky-500" />
          <span className="hidden sm:inline">推特</span>
        </button>

        <button
          onClick={() => {
            setSelectedEventForShare(null);
            setIsXiaohongshuModalOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-slate-100 text-rose-600 text-xs font-medium transition cursor-pointer"
          title="分享小红书"
        >
          <span className="w-3 h-3 rounded-sm bg-rose-500 text-white font-bold text-[8px] flex items-center justify-center leading-none">
            红
          </span>
          <span className="hidden sm:inline">小红书</span>
        </button>

        <button
          onClick={() => setIsPdfModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-slate-100 text-indigo-700 text-xs font-medium transition cursor-pointer"
          title="导出 PDF 研报"
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">PDF</span>
        </button>

        <button
          onClick={() => setIsNotificationModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-slate-100 text-slate-700 text-xs font-medium transition cursor-pointer"
          title="定时推送配置"
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">推送</span>
        </button>

        <button
          onClick={() => {
            setAIChatInitialQuery(undefined);
            setIsAIChatOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold transition active:scale-95 cursor-pointer hover:bg-indigo-100"
          title="开启AI洞察"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI 洞察</span>
        </button>
      </aside>

      {/* Modals & Slide-out Drawers */}
      <NotesExportModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        briefing={briefing}
      />

      <TwitterShareModal
        isOpen={isTwitterModalOpen}
        onClose={() => setIsTwitterModalOpen(false)}
        briefing={briefing}
        selectedEvent={selectedEventForShare}
      />

      <XiaohongshuShareModal
        isOpen={isXiaohongshuModalOpen}
        onClose={() => setIsXiaohongshuModalOpen(false)}
        briefing={briefing}
        selectedEvent={selectedEventForShare}
      />

      <PdfExportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        briefing={briefing}
      />

      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={setNotificationSettings}
        onShowInAppNotification={(title, message) => setInAppNotification({ title, message })}
        briefing={briefing}
      />

      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        currentBriefing={briefing}
        initialQuery={aiChatInitialQuery}
      />

      <SavedNotesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedEvents={savedEvents}
        onRemoveSaved={handleToggleSave}
        onClearAll={() => {
          localStorage.removeItem('chroniclepad_saved_notes_v1');
          setSavedEvents([]);
        }}
        onCopyAllSaved={handleCopyAllSaved}
      />

      <IPadWidgetPreview
        isOpen={isWidgetPreviewOpen}
        onClose={() => setIsWidgetPreviewOpen(false)}
        briefing={briefing}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-6 mt-12 text-center text-xs text-slate-500 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 ChroniclePad · 专为 iPad 打造的每日宏观与历史大事件备忘录插件</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="text-slate-500 hover:text-indigo-600 transition"
            >
              PDF 研报
            </button>
            <button
              onClick={() => setIsWidgetPreviewOpen(true)}
              className="text-slate-500 hover:text-indigo-600 transition"
            >
              桌面小组件
            </button>
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="text-slate-500 hover:text-indigo-600 transition"
            >
              定时推送
            </button>
            <button
              onClick={() => setIsNotesModalOpen(true)}
              className="text-slate-500 hover:text-indigo-600 transition"
            >
              备忘录规范
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
