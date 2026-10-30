import React, { useEffect } from 'react';
import { Tablet, X, ChevronRight, BellRing } from 'lucide-react';

interface InAppNotificationBannerProps {
  notification: {
    title: string;
    message: string;
  } | null;
  onClose: () => void;
  onOpen: () => void;
}

export const InAppNotificationBanner: React.FC<InAppNotificationBannerProps> = ({
  notification,
  onClose,
  onOpen,
}) => {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 8000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] w-[94%] max-w-lg animate-in fade-in slide-in-from-top-6 duration-300 pointer-events-auto">
      <div 
        role="alert" 
        className="rounded-2xl bg-white/95 border-2 border-indigo-500/30 shadow-[0_20px_50px_rgba(15,23,42,0.25)] backdrop-blur-2xl p-4 flex items-start gap-3.5 select-none text-slate-800 ring-4 ring-indigo-500/10"
      >
        {/* App Icon */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-[2px] shrink-0 shadow-sm">
          <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
            <BellRing className="w-5 h-5 text-indigo-600 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 cursor-pointer pr-1" onClick={onOpen}>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-bold text-slate-900 tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              CHRONICLEPAD · iPad 实时要闻推送
            </span>
            <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              刚刚
            </span>
          </div>
          <div className="text-sm font-bold text-slate-900 mb-1 leading-snug">
            {notification.title}
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          <div className="mt-2 text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
            <span>点击立即在备忘录中查看详情</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Close */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition cursor-pointer shrink-0"
          aria-label="关闭提醒"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
