import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  Cpu, 
  Landmark, 
  BookOpen,
  Users,
  Globe,
  Clock, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Copy, 
  Sparkles, 
  Check,
  Newspaper
} from 'lucide-react';
import { HistoryEventItem } from '../types';
import { CATEGORY_LABELS } from '../utils/formatters';

interface EventCardProps {
  event: HistoryEventItem;
  isSaved: boolean;
  onToggleSave: (event: HistoryEventItem) => void;
  onCopySingleNote: (event: HistoryEventItem) => void;
  onShareTwitter: (event: HistoryEventItem) => void;
  onShareXiaohongshu: (event: HistoryEventItem) => void;
  onAskAI: (event: HistoryEventItem) => void;
  copiedId: string | null;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSaved,
  onToggleSave,
  onCopySingleNote,
  onShareTwitter,
  onShareXiaohongshu,
  onAskAI,
  copiedId,
}) => {
  const categoryInfo = CATEGORY_LABELS[event.category] || {
    name: '要闻',
    icon: 'Globe',
    color: 'text-slate-600',
    badgeBg: 'bg-slate-100 text-slate-700 border-slate-200'
  };
  const isCopied = copiedId === event.id;

  const renderIcon = () => {
    switch (event.category) {
      case 'stocks':
        return <TrendingUp className="w-4 h-4 text-rose-600" />;
      case 'finance':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'tech':
        return <Cpu className="w-4 h-4 text-cyan-600" />;
      case 'politics':
        return <Landmark className="w-4 h-4 text-indigo-600" />;
      case 'culture':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'society':
        return <Users className="w-4 h-4 text-emerald-600" />;
      case 'international':
        return <Globe className="w-4 h-4 text-blue-600" />;
      default:
        return <Globe className="w-4 h-4 text-slate-600" />;
    }
  };

  const getImportanceBadge = () => {
    switch (event.importance) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            重磅要闻
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            核心关注
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            常规要闻
          </span>
        );
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top meta bar: category + time + importance */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${categoryInfo.badgeBg}`}
            >
              {renderIcon()}
              <span>{categoryInfo.name}</span>
            </span>
            <span className="text-slate-500 text-xs flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              {event.time}
            </span>
          </div>
          <div>{getImportanceBadge()}</div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight mb-2 hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>

        {/* Summary text */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          {event.summary}
        </p>

        {/* Impact Breakdown (Market transmission & Sector Takeaway) */}
        {event.impact && (
          <div className="rounded-xl bg-slate-50/90 border border-slate-200/80 p-3.5 mb-4 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-rose-700 whitespace-nowrap">📊 市场传导：</span>
              <span className="text-slate-700 leading-normal">{event.impact.market}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-amber-700 whitespace-nowrap">🎯 行业启示：</span>
              <span className="text-slate-700 leading-normal">{event.impact.takeaway}</span>
            </div>
            {event.impact.sector && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-sky-700 whitespace-nowrap">🏢 联动板块：</span>
                <span className="text-slate-700 leading-normal">{event.impact.sector}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {event.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Grounding sources / News links (Prominently displayed) */}
        {event.sources && event.sources.length > 0 && (
          <div className="border-t border-slate-100 pt-2.5 mb-3">
            <span className="text-[11px] text-slate-500 font-semibold mb-1.5 flex items-center gap-1">
              <Newspaper className="w-3.5 h-3.5 text-indigo-600" />
              新闻来源链接与权威核验：
            </span>
            <div className="flex flex-wrap gap-1.5">
              {event.sources.map((s, idx) => (
                <a
                  key={idx}
                  href={s.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/80 text-[11px] text-indigo-700 hover:text-indigo-900 font-medium transition-colors shadow-2xs"
                  title={`点击查看新闻原件：${s.title}`}
                >
                  <span className="truncate max-w-[240px]">{s.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer (iPad optimized buttons in Apple light style) */}
      <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Bookmark for Notes */}
          <button
            onClick={() => onToggleSave(event)}
            className={`p-2 rounded-xl border text-xs font-medium transition active:scale-95 cursor-pointer ${
              isSaved
                ? 'bg-amber-100 text-amber-700 border-amber-300 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600 border-slate-200'
            }`}
            title={isSaved ? '从备忘录收藏中移除' : '收藏到备忘录清单'}
            aria-label="收藏事件"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          {/* Copy single event for Apple Notes */}
          <button
            onClick={() => onCopySingleNote(event)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition active:scale-95 cursor-pointer"
            title="复制此条至 Apple 备忘录"
            aria-label="复制备忘录格式"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>备忘录</span>
              </>
            )}
          </button>

          {/* Share to Twitter */}
          <button
            onClick={() => onShareTwitter(event)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-medium transition active:scale-95 cursor-pointer"
            title="分享此条到推特"
            aria-label="推特此条"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-600" />
            <span>推特</span>
          </button>

          {/* Share to Xiaohongshu */}
          <button
            onClick={() => onShareXiaohongshu(event)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-medium transition active:scale-95 cursor-pointer"
            title="生成小红书爆款图文"
            aria-label="小红书此条"
          >
            <span className="w-3 h-3 rounded-sm bg-rose-500 text-white font-bold text-[8px] flex items-center justify-center leading-none">
              红
            </span>
            <span>小红书</span>
          </button>
        </div>

        {/* Ask AI about this event */}
        <button
          onClick={() => onAskAI(event)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-medium transition active:scale-95 cursor-pointer"
          title="让 AI 深入剖析此事件背景与连锁反应"
          aria-label="AI分析"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>深度分析</span>
        </button>
      </div>
    </article>
  );
};
