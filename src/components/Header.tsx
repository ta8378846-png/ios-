import React from 'react';
import { 
  Calendar, 
  FileText, 
  Share2, 
  Bell, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Bookmark, 
  LayoutGrid,
  RefreshCw,
  Tablet
} from 'lucide-react';
import { DailyBriefing } from '../types';

interface HeaderProps {
  briefing: DailyBriefing | null;
  selectedDate: string;
  onDateChange: (newDate: string) => void;
  isOnline: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenNotesModal: () => void;
  onOpenTwitterModal: () => void;
  onOpenXiaohongshuModal: () => void;
  onOpenPdfModal: () => void;
  onOpenNotificationModal: () => void;
  onOpenSavedDrawer: () => void;
  onToggleAIChat: () => void;
  onToggleWidgetPreview: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  briefing,
  selectedDate,
  onDateChange,
  isOnline,
  isLoading,
  onRefresh,
  onOpenNotesModal,
  onOpenTwitterModal,
  onOpenXiaohongshuModal,
  onOpenPdfModal,
  onOpenNotificationModal,
  onOpenSavedDrawer,
  onToggleAIChat,
  onToggleWidgetPreview,
  savedCount,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  const presetDates = [
    { label: '今天', date: todayStr },
    { label: '1929 黑色大崩盘', date: '1929-10-29' },
    { label: '2008 雷曼破产', date: '2008-09-15' },
    { label: '1971 黄金脱钩', date: '1971-08-15' },
    { label: '1969 阿帕网诞生', date: '1969-10-29' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top bar: Brand + iPad Badge + Status + Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & iPad identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[2px] shadow-sm">
              <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                <Tablet className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  ChroniclePad
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    iPad 插件版
                  </span>
                </h1>
                {/* Network / Offline pill */}
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                    isOnline
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                  title={isOnline ? '在线同步中' : '离线模式，已启用本地缓存'}
                >
                  {isOnline ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-amber-600" />}
                  <span>{isOnline ? '已连接' : '离线可用'}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                每日重大事件扫描 · 股市 / 金融 / 科技 / 政治 / 文化 / 社会 / 国际 · 一键导入 Apple 备忘录
              </p>
            </div>
          </div>

          {/* Action buttons (Touch-friendly iPad buttons) */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Apple Notes Export button */}
            <button
              onClick={onOpenNotesModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
              title="导入至 Apple 备忘录"
              aria-label="导入到备忘录"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>导入备忘录</span>
            </button>

            {/* Twitter Share button */}
            <button
              onClick={onOpenTwitterModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
              title="分享至推特 / X"
              aria-label="推特分享"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-600" />
              <span>推特分享</span>
            </button>

            {/* Xiaohongshu Share button */}
            <button
              onClick={onOpenXiaohongshuModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
              title="分享至小红书 (文案 + 3:4 图文卡片)"
              aria-label="小红书分享"
            >
              <span className="w-3.5 h-3.5 rounded-md bg-rose-500 text-white font-black text-[9px] flex items-center justify-center leading-none">
                红
              </span>
              <span>小红书</span>
            </button>

            {/* Professional PDF Export button */}
            <button
              onClick={onOpenPdfModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
              title="导出为标准 A4 专业 PDF 研报"
              aria-label="导出PDF研报"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>导出 PDF</span>
            </button>

            {/* Notification Reminder Settings */}
            <button
              onClick={onOpenNotificationModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition active:scale-95 cursor-pointer relative"
              title="自定义推送与定时提醒"
              aria-label="自定义推送提醒"
            >
              <Bell className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">推送提醒</span>
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute -top-0.5 -right-0.5 animate-pulse" />
            </button>

            {/* Saved Notes Drawer Toggle */}
            <button
              onClick={onOpenSavedDrawer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition active:scale-95 cursor-pointer"
              title="查看已收藏条目"
              aria-label="备忘录收藏夹"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>收藏 ({savedCount})</span>
            </button>

            {/* iPad Widget Preview toggle */}
            <button
              onClick={onToggleWidgetPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition active:scale-95 cursor-pointer"
              title="预览 iPad 桌面小组件样式"
              aria-label="iPad小组件"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden lg:inline">小组件</span>
            </button>

            {/* Gemini AI Assistant Drawer button */}
            <button
              onClick={onToggleAIChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
              title="开启 AI 历史与金融智能洞察"
              aria-label="AI助手"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI 洞察</span>
            </button>
          </div>
        </div>

        {/* Date Selector & Historical Timewarp Presets */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Custom Date Input */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              选择日期：
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs"
              aria-label="选择历史日期"
            />
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition disabled:opacity-50 cursor-pointer shadow-xs"
              title="重新获取最新事件"
              aria-label="刷新事件"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
            <span className="text-slate-500 text-[11px] whitespace-nowrap">经典历史对照：</span>
            {presetDates.map((item) => (
              <button
                key={item.date}
                onClick={() => onDateChange(item.date)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedDate === item.date
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
