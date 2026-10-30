import React, { useState } from 'react';
import { 
  X, 
  LayoutGrid, 
  TrendingUp, 
  Sparkles, 
  Copy, 
  Check, 
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { DailyBriefing } from '../types';

interface IPadWidgetPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: DailyBriefing | null;
}

export const IPadWidgetPreview: React.FC<IPadWidgetPreviewProps> = ({
  isOpen,
  onClose,
  briefing,
}) => {
  const [size, setSize] = useState<'medium' | 'large' | 'small'>('medium');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !briefing) return null;

  const topEvent = briefing.events[0];
  const secondEvent = briefing.events[1];

  const handleCopyScript = async () => {
    const text = `// ChroniclePad iPad Widget Data Feed\nDate: ${briefing.date}\nSentiment: ${briefing.marketSentiment.label} (${briefing.marketSentiment.score}/100)\nTop Event: ${topEvent?.title}\nImpact: ${topEvent?.impact.takeaway}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-widget-title"
        className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h2 id="modal-widget-title" className="text-base sm:text-lg font-bold text-slate-900">
                iPad 桌面小组件预览 (iPadOS Widget)
              </h2>
              <p className="text-xs text-slate-500">
                支持放置于 iPad 主屏幕与锁屏视图 · 实时查看宏观与多维要闻
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

        {/* Size switcher */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">小组件尺寸：</span>
            {[
              { id: 'small', label: '小尺寸 (2×2)' },
              { id: 'medium', label: '中尺寸 (4×2 推荐)' },
              { id: 'large', label: '大尺寸 (4×4 全景)' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setSize(btn.id as any)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  size === btn.id
                    ? 'bg-cyan-600 text-white font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyScript}
            className="flex items-center gap-1 text-cyan-700 hover:text-cyan-800 font-medium cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制数据' : '复制数据源'}</span>
          </button>
        </div>

        {/* Widget Preview Canvas (Styled like Apple iPad desktop wallpaper + widget) */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/60 flex items-center justify-center min-h-[320px]">
          {/* Small Widget */}
          {size === 'small' && (
            <div className="w-44 h-44 rounded-3xl bg-white border border-slate-200 p-4 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-100/60 rounded-full blur-xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-cyan-700 mb-1">
                  <span>CHRONICLE</span>
                  <span>{briefing.date.slice(5)}</span>
                </div>
                <div className="text-[10px] text-slate-500 mb-2">
                  情绪：{briefing.marketSentiment.label}
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-3 leading-snug">
                  {topEvent?.title}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 border-t border-slate-100 pt-1.5 flex items-center justify-between">
                <span>{topEvent?.category.toUpperCase()}</span>
                <span className="text-amber-700 font-semibold">{briefing.marketSentiment.score}分</span>
              </div>
            </div>
          )}

          {/* Medium Widget */}
          {size === 'medium' && (
            <div className="w-full max-w-md h-48 rounded-3xl bg-white border border-slate-200 p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-50 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div>
                {/* Header of widget */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-xs font-bold text-slate-900 tracking-wide">
                      {briefing.displayDate}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {briefing.marketSentiment.label} ({briefing.marketSentiment.score})
                  </span>
                </div>

                {/* Top event 1 */}
                <div className="space-y-2 mb-2">
                  <div className="flex items-start gap-1.5 text-xs text-slate-900 font-medium line-clamp-2">
                    <span className="text-rose-600 shrink-0 font-bold">1.</span>
                    <span>{topEvent?.title}</span>
                  </div>
                  {secondEvent && (
                    <div className="flex items-start gap-1.5 text-xs text-slate-600 line-clamp-2">
                      <span className="text-cyan-700 shrink-0 font-bold">2.</span>
                      <span>{secondEvent?.title}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>多维宏观与社会扫描已就绪</span>
                <span className="text-indigo-600 font-medium">轻点唤醒 ChroniclePad 备忘录</span>
              </div>
            </div>
          )}

          {/* Large Widget */}
          {size === 'large' && (
            <div className="w-full max-w-md h-80 rounded-3xl bg-white border border-slate-200 p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">ChroniclePad 宏观全景</h3>
                    <div className="text-[11px] text-slate-500">{briefing.displayDate}</div>
                  </div>
                  <div className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-amber-700">
                    {briefing.marketSentiment.label}
                  </div>
                </div>

                {/* Executive summary */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                  {briefing.executiveSummary}
                </div>

                {/* Events list */}
                <div className="space-y-2">
                  {briefing.events.slice(0, 3).map((ev, idx) => (
                    <div key={ev.id} className="flex items-start gap-2 text-xs">
                      <span className="text-indigo-600 font-bold">#{idx + 1}</span>
                      <div className="flex-1 truncate">
                        <span className="text-slate-900 font-medium">{ev.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical parallel highlight */}
              {briefing.historicalParallels[0] && (
                <div className="border-t border-slate-100 pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="text-amber-700 font-medium">
                    🕰 历史对照 ({briefing.historicalParallels[0].year}年)
                  </span>
                  <span className="truncate max-w-[200px]">
                    {briefing.historicalParallels[0].event}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            在 Safari 中点击「分享」按钮，选择「添加到主屏幕」即可成为 iPad 独立应用。
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition cursor-pointer"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
