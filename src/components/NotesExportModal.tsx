import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyBriefing, EventCategory } from '../types';
import { formatForAppleNotes, buildAppleShortcutsNotesUrl } from '../utils/formatters';

interface NotesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: DailyBriefing | null;
}

export const NotesExportModal: React.FC<NotesExportModalProps> = ({
  isOpen,
  onClose,
  briefing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');
  const [includeImpact, setIncludeImpact] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !briefing) return null;

  const { title, content } = formatForAppleNotes(briefing, {
    selectedCategory,
    includeImpact,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[\/\\:*?"<>|]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShortcutsOpen = () => {
    const url = buildAppleShortcutsNotesUrl(title, content);
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-notes-title"
        className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 id="modal-notes-title" className="text-base sm:text-lg font-bold text-slate-900">
                导入到 Apple 备忘录
              </h2>
              <p className="text-xs text-slate-500">
                专为 iPadOS 排版优化 · 支持格式化富文本与快捷指令快速导入
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

        {/* Filter controls */}
        <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
            <span className="text-slate-500 font-medium whitespace-nowrap">筛选维度：</span>
            {[
              { id: 'all', label: '全部七大维度' },
              { id: 'stocks', label: '股市' },
              { id: 'finance', label: '金融' },
              { id: 'tech', label: '科技' },
              { id: 'politics', label: '政治' },
              { id: 'culture', label: '文化' },
              { id: 'society', label: '社会' },
              { id: 'international', label: '国际' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === tab.id
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toggle impact */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none font-medium">
            <input
              type="checkbox"
              checked={includeImpact}
              onChange={(e) => setIncludeImpact(e.target.checked)}
              className="rounded bg-white border-slate-300 text-amber-500 focus:ring-0"
            />
            <span>包含市场传导与行业启示</span>
          </label>
        </div>

        {/* Note Preview area (Stylized like Apple Notes yellow pad styling in light mode) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-50/50">
          <div className="rounded-xl border border-amber-200 bg-[#fffdf5] p-5 text-xs sm:text-sm font-sans text-slate-800 leading-relaxed whitespace-pre-wrap select-text shadow-xs">
            {content}
          </div>
        </div>

        {/* iPad Tips bar */}
        <div className="px-4 py-2.5 bg-indigo-50 border-t border-indigo-100 flex items-center gap-2 text-xs text-indigo-800">
          <Info className="w-4 h-4 shrink-0 text-indigo-600" />
          <span>
            iPad 使用技巧：点击「一键复制」，随后在 iPad 侧滑分屏或打开「备忘录」App 中长按粘贴即可；或点击「快捷指令直达」。
          </span>
        </div>

        {/* Actions Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Apple Shortcuts URL trigger */}
            <button
              onClick={handleShortcutsOpen}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
              title="通过 iPad 快捷指令一键加入备忘录"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>快捷指令直达</span>
            </button>

            {/* Download file */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
              title="下载为 .md 文档文件"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>下载 .md</span>
            </button>
          </div>

          {/* Primary Action: Copy to clipboard */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            aria-label="一键复制全部内容"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>已复制至剪贴板！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.5]" />
                <span>一键复制全部内容</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
