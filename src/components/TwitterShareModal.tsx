import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyBriefing, HistoryEventItem } from '../types';
import { formatForTwitter } from '../utils/formatters';

interface TwitterShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: DailyBriefing | null;
  selectedEvent: HistoryEventItem | null;
}

export const TwitterShareModal: React.FC<TwitterShareModalProps> = ({
  isOpen,
  onClose,
  briefing,
  selectedEvent,
}) => {
  const [shareMode, setShareMode] = useState<'daily' | 'event'>(selectedEvent ? 'event' : 'daily');
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !briefing) return null;

  const activeItem = shareMode === 'event' && selectedEvent ? selectedEvent : briefing;
  const tweetText = formatForTwitter(activeItem);
  const charCount = tweetText.length;
  const isOverLimit = charCount > 280;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tweetText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (e) {
      console.warn('Copy failed:', e);
    }
  };

  const handleTwitterPost = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ChroniclePad 每日重大事件',
          text: tweetText,
          url: window.location.href,
        });
        confetti({ particleCount: 30, spread: 50 });
      } catch (err) {
        console.debug('Native share cancelled or failed:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-twitter-title"
        className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 id="modal-twitter-title" className="text-base sm:text-lg font-bold text-slate-900">
                分享至 Twitter / X 或多平台
              </h2>
              <p className="text-xs text-slate-500">
                支持一键跳转推特发布及 iPad 原生分享面板
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

        {/* Tab switcher: Daily Digest vs Current Event */}
        {selectedEvent && (
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">分享内容：</span>
            <button
              onClick={() => setShareMode('event')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                shareMode === 'event'
                  ? 'bg-sky-500 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
              }`}
            >
              选中单条要闻
            </button>
            <button
              onClick={() => setShareMode('daily')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                shareMode === 'daily'
                  ? 'bg-sky-500 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
              }`}
            >
              今日宏观总揽
            </button>
          </div>
        )}

        {/* Tweet Card Preview (looks like a modern Twitter / X card) */}
        <div className="p-4 sm:p-5 bg-slate-50/50">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 relative shadow-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center font-bold text-xs text-sky-600 border border-sky-200">
                CP
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">ChroniclePad</span>
                  <span className="text-[11px] text-slate-500">@ChroniclePad</span>
                </div>
                <span className="text-[10px] text-slate-400">刚刚 · iPadOS</span>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed select-text font-sans">
              {tweetText}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-slate-400" />
                iPad 自动排版
              </span>
              <span className={`font-mono ${isOverLimit ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
                {charCount} / 280 字符
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>复制文案</span>
                </>
              )}
            </button>

            {/* Native iPad Share */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
                title="呼出 iPad 原生分享菜单"
              >
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>系统原生分享</span>
              </button>
            )}
          </div>

          {/* Twitter Intent Button */}
          <button
            onClick={handleTwitterPost}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
            <span>直达推特发布</span>
          </button>
        </div>
      </div>
    </div>
  );
};
