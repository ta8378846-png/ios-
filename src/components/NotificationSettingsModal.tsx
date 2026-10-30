import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Clock, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Check, 
  Play, 
  Sparkles, 
  Zap,
  Info,
  Tablet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { NotificationSettings, EventCategory, DailyBriefing } from '../types';
import { 
  playChimeSound, 
  requestNotificationPermission, 
  triggerNotification, 
  getMinutesUntilNextReminder, 
  formatTimeRemaining,
  getNotificationEnvironmentInfo
} from '../utils/reminder';
import { saveNotificationSettings } from '../utils/storage';
import { CATEGORY_LABELS } from '../utils/formatters';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onUpdateSettings: (newSettings: NotificationSettings) => void;
  onShowInAppNotification: (title: string, message: string) => void;
  briefing?: DailyBriefing | null;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onShowInAppNotification,
  briefing,
}) => {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
  const [newTimeInput, setNewTimeInput] = useState('08:30');
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testTriggered, setTestTriggered] = useState(false);
  const [pushFeedbackMsg, setPushFeedbackMsg] = useState<string | null>(null);
  const [showDiagnosticDetail, setShowDiagnosticDetail] = useState(false);

  if (!isOpen) return null;

  const envInfo = getNotificationEnvironmentInfo();
  const minutesUntilNext = getMinutesUntilNextReminder(localSettings.preferredTimes);

  const handleToggleCategory = (cat: EventCategory) => {
    const current = localSettings.categories;
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    const updated = { ...localSettings, categories: next };
    setLocalSettings(updated);
  };

  const handleAddTime = () => {
    if (!newTimeInput || localSettings.preferredTimes.includes(newTimeInput)) return;
    const sorted = [...localSettings.preferredTimes, newTimeInput].sort();
    const updated = { ...localSettings, preferredTimes: sorted };
    setLocalSettings(updated);
  };

  const handleRemoveTime = (time: string) => {
    const updated = {
      ...localSettings,
      preferredTimes: localSettings.preferredTimes.filter((t) => t !== time),
    };
    setLocalSettings(updated);
  };

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setPermissionState(perm);
    const updated = { ...localSettings, browserPermission: perm };
    setLocalSettings(updated);
    saveNotificationSettings(updated);
    onUpdateSettings(updated);
    if (perm === 'granted') {
      setPushFeedbackMsg('系统通知已成功授权！');
      setTimeout(() => setPushFeedbackMsg(null), 3000);
    }
  };

  const handleSave = () => {
    saveNotificationSettings(localSettings);
    onUpdateSettings(localSettings);
    onClose();
  };

  // Push today's actual breaking news
  const handlePushTodayNews = async () => {
    if (localSettings.sound) {
      await playChimeSound();
    }
    setTestTriggered(true);

    const todayTopEvent = briefing?.events?.[0];
    const catName = todayTopEvent ? (CATEGORY_LABELS[todayTopEvent.category]?.name || '重磅') : '快讯';
    
    const pushTitle = todayTopEvent 
      ? `🔴 今日要闻推送 · [${catName}]`
      : '🔔 今日重大事件实时推送';
      
    const pushBody = todayTopEvent
      ? `${todayTopEvent.title}：${todayTopEvent.summary}`
      : (briefing?.executiveSummary || '今日各维度重大事件扫描已更新，点击查看详情。');

    // 1. In-app iPad banner alert (Guaranteed 100% visible on top)
    onShowInAppNotification(pushTitle, pushBody);

    // 2. Native browser system notification
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      await triggerNotification(pushTitle, { body: pushBody });
    }

    setPushFeedbackMsg('今日重大要闻已成功推送到屏幕顶部！');
    setTimeout(() => {
      setTestTriggered(false);
      setPushFeedbackMsg(null);
    }, 4000);
  };

  const allCategories: EventCategory[] = ['stocks', 'finance', 'tech', 'politics', 'culture', 'society', 'international'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-reminder-title"
        className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Bell className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 id="modal-reminder-title" className="text-base sm:text-lg font-bold text-slate-900">
                自定义推送提醒与定时配置
              </h2>
              <p className="text-xs text-slate-500">
                推送当天最新要闻 · 七大维度可选 · 支持 iPadOS 声音与屏幕通知
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            aria-label="关闭窗口"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Instant feedback banner if triggered */}
          {pushFeedbackMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{pushFeedbackMsg}</span>
            </div>
          )}

          {/* Instant Today's News Push Hero Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50 border border-indigo-100 flex items-center justify-between gap-3 shadow-2xs">
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>立即推送今日实时重大事件</span>
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                实时抓取今天最重磅要闻并以 iPad 顶置横幅与系统通知弹出
              </div>
            </div>
            <button
              onClick={handlePushTodayNews}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <Play className={`w-3.5 h-3.5 ${testTriggered ? 'animate-bounce' : ''}`} />
              <span>{testTriggered ? '已推送!' : '立即推送当天'}</span>
            </button>
          </div>

          {/* iPad Push Status Diagnostic Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>推送机制与 iPadOS 状态诊断</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDiagnosticDetail(!showDiagnosticDetail)}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                {showDiagnosticDetail ? '收起说明' : '推送原理说明'}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px]">
                <Check className="w-3 h-3 text-emerald-600" />
                引擎一：应用内置顶横幅 (100% 正常生效)
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium text-[11px] ${
                permissionState === 'granted'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {permissionState === 'granted' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    引擎二：系统锁屏通知 (已授权)
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    引擎二：系统锁屏通知 ({permissionState === 'denied' ? '受环境限制' : '未授权'})
                  </>
                )}
              </span>
            </div>

            {showDiagnosticDetail && (
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1.5 leading-relaxed mt-1">
                <p className="font-semibold text-slate-800">为什么有时系统原生通知显示“已被拒绝”？</p>
                <p>
                  1. <strong>苹果 iPadOS 系统限制</strong>：从 iPadOS 16.4 开始，苹果规定<strong>网页原生锁屏通知必须在「添加到主屏幕」模式下才能使用</strong>。在普通 Safari 标签页中，苹果禁止弹出后台锁屏提醒。
                </p>
                <p>
                  2. <strong>双引擎保障机制</strong>：ChroniclePad 为此内置了<strong>高优先级置顶灵动横幅</strong>与<strong>典雅提示音</strong>，只要打开页面或添加到桌面，就会准时弹出当天重大事件，100% 不漏要闻。
                </p>
                <p>
                  3. <strong>如需激活 iPad 锁屏外后台推送</strong>：请在 Safari 中点击顶部「分享」图标，选择<strong>「添加到主屏幕」</strong>，从桌面图标打开即可！
                </p>
              </div>
            )}
          </div>

          {/* Browser Permission State */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="font-medium text-slate-700">系统通知授权：</span>
                <span className={`ml-1 font-semibold ${
                  permissionState === 'granted' ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {permissionState === 'granted' ? '已授权允许' : permissionState === 'denied' ? '已被拒绝' : '尚未授权'}
                </span>
              </div>
            </div>
            {permissionState !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition cursor-pointer shadow-xs"
              >
                授权通知
              </button>
            )}
          </div>

          {/* Scheduled Times */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                每日提醒时刻表
              </span>
              <span className="text-[11px] text-indigo-600 font-medium">
                下次提醒：{formatTimeRemaining(minutesUntilNext)}
              </span>
            </div>

            {/* Existing times list */}
            <div className="flex flex-wrap gap-2 mb-2.5">
              {localSettings.preferredTimes.map((time) => (
                <div
                  key={time}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-mono font-semibold text-slate-800 shadow-2xs"
                >
                  <span>{time}</span>
                  <button
                    onClick={() => handleRemoveTime(time)}
                    className="text-slate-400 hover:text-rose-600 transition ml-1 cursor-pointer"
                    title="删除该时间"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add time row */}
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="time"
                value={newTimeInput}
                onChange={(e) => setNewTimeInput(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono shadow-2xs"
              />
              <button
                onClick={handleAddTime}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                + 添加时刻
              </button>
              <div className="text-[11px] text-slate-500">
                推荐：开盘前 (08:30)、午盘 (12:00)、收盘晚报 (18:00)
              </div>
            </div>
          </div>

          {/* Category Filter (All 7 dimensions) */}
          <div>
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              推送维度偏好 (支持股市、金融、科技、政治、文化、社会、国际)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {allCategories.map((cat) => {
                const info = CATEGORY_LABELS[cat];
                const checked = localSettings.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleToggleCategory(cat)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                      checked
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={info.color}>●</span>
                      <span>{info.name}</span>
                    </span>
                    {checked && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              {localSettings.sound ? (
                <Volume2 className="w-4 h-4 text-indigo-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-slate-700 font-medium">播放 iPadOS 典雅提示音 (Chime)</span>
            </div>
            <button
              onClick={() => setLocalSettings({ ...localSettings, sound: !localSettings.sound })}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                localSettings.sound ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {localSettings.sound ? '已开启' : '已静音'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handlePushTodayNews}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
          >
            <Play className={`w-3.5 h-3.5 text-indigo-600 ${testTriggered ? 'animate-bounce' : ''}`} />
            <span>{testTriggered ? '推送中...' : '测试当天推送'}</span>
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            保存提醒配置
          </button>
        </div>
      </div>
    </div>
  );
};
