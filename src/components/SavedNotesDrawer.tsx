import React from 'react';
import { 
  X, 
  Bookmark, 
  FileText, 
  Trash2, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HistoryEventItem } from '../types';
import { CATEGORY_LABELS } from '../utils/formatters';

interface SavedNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedEvents: HistoryEventItem[];
  onRemoveSaved: (event: HistoryEventItem) => void;
  onClearAll: () => void;
  onCopyAllSaved: () => void;
}

export const SavedNotesDrawer: React.FC<SavedNotesDrawerProps> = ({
  isOpen,
  onClose,
  savedEvents,
  onRemoveSaved,
  onClearAll,
  onCopyAllSaved,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    onCopyAllSaved();
    setCopied(true);
    confetti({ particleCount: 30, spread: 60 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-800">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Bookmark className="w-4 h-4 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              备忘录收藏清单 ({savedEvents.length})
            </h3>
            <p className="text-[11px] text-slate-500">
              本地离线保存 · 可批量导入 iPad 备忘录
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
          aria-label="关闭清单"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8fafc]">
        {savedEvents.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">暂无收藏的事件条目</p>
            <p className="text-[11px] text-slate-400">
              在主界面卡片右下角轻点「书签」图标，即可加入此清单
            </p>
          </div>
        ) : (
          savedEvents.map((ev) => {
            const catInfo = CATEGORY_LABELS[ev.category];
            return (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-lg font-semibold border ${catInfo.badgeBg}`}>
                    {catInfo.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-mono">{ev.time}</span>
                    <button
                      onClick={() => onRemoveSaved(ev)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      title="移除此收藏"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">{ev.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {ev.summary}
                </p>

                {ev.impact && (
                  <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                    <span className="text-amber-700 font-medium">核心启示：</span>
                    {ev.impact.takeaway}
                  </div>
                )}

                {/* News sources in drawer */}
                {ev.sources && ev.sources.length > 0 && (
                  <div className="text-[11px] flex flex-wrap items-center gap-1 pt-1">
                    <span className="text-slate-400">信源:</span>
                    {ev.sources.map((s, sIdx) => (
                      <a
                        key={sIdx}
                        href={s.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-[10px]"
                      >
                        <span>{s.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer batch actions */}
      {savedEvents.length > 0 && (
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            onClick={onClearAll}
            className="text-xs text-slate-500 hover:text-rose-600 transition cursor-pointer"
          >
            清空列表
          </button>

          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>已复制全部！</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>一键批量复制导入备忘录</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
