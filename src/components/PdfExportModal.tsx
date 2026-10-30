import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Check, 
  Printer, 
  Share2, 
  Sparkles, 
  Palette, 
  Layers, 
  SlidersHorizontal,
  History,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyBriefing } from '../types';
import { exportDailyBriefingPdf, PdfExportOptions, DEFAULT_PDF_OPTIONS } from '../utils/pdfExport';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: DailyBriefing | null;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  briefing,
}) => {
  const [options, setOptions] = useState<PdfExportOptions>(DEFAULT_PDF_OPTIONS);
  const [isExporting, setIsExporting] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen || !briefing) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      await exportDailyBriefingPdf(briefing, options, (text) => setProgressText(text));
      setExportSuccess(true);
      confetti({ particleCount: 50, spread: 65, origin: { y: 0.7 } });
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
      setProgressText('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isDark = options.theme === 'executive-dark';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-pdf-title"
        className="w-full max-w-2xl max-h-[92vh] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 id="modal-pdf-title" className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                导出专业 PDF 研报
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  jsPDF 矢量渲染
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                A4 标准版面 · 包含市场情绪指数、历史上的今天对照与各维事件深度拆解
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

        {/* Configuration Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          {/* Theme switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>报告版面风格：</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setOptions({ ...options, theme: 'print-light' })}
                className={`px-3 py-1 rounded-xl font-semibold transition cursor-pointer ${
                  options.theme === 'print-light'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                经典打印亮色 (A4 Print-Friendly)
              </button>
              <button
                onClick={() => setOptions({ ...options, theme: 'executive-dark' })}
                className={`px-3 py-1 rounded-xl font-semibold transition cursor-pointer ${
                  options.theme === 'executive-dark'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                高管暗夜版 (Executive Dark)
              </button>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-slate-300 select-none">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeSentiment}
                onChange={(e) => setOptions({ ...options, includeSentiment: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-400" />
                全球市场情绪指数
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeHistorical}
                onChange={(e) => setOptions({ ...options, includeHistorical: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <History className="w-3 h-3 text-amber-400" />
                历史上的今天对照
              </span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeImpact}
                onChange={(e) => setOptions({ ...options, includeImpact: e.target.checked })}
                className="rounded bg-slate-800 border-slate-700 text-indigo-500 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                三维市场传导与行业启示
              </span>
            </label>
          </div>
        </div>

        {/* Live A4 Preview Card */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-slate-950 flex justify-center">
          <div
            className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl transition-colors duration-200 text-xs ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-200'
                : 'bg-white border-slate-300 text-slate-900 shadow-slate-200/50'
            }`}
          >
            {/* Report Header in preview */}
            <div className={`border-b pb-3 mb-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className={`font-mono text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
                    ChroniclePad Executive Intelligence Briefing
                  </div>
                  <h3 className={`text-base font-extrabold mt-0.5 ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    全球宏观、科技与资本市场重大事件研报
                  </h3>
                </div>
                <div className="text-right">
                  <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                    {briefing.displayDate}
                  </span>
                  <div className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    CP-{briefing.date.replace(/-/g, '')}-R1
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment Box */}
            {options.includeSentiment && (
              <div className={`rounded-xl p-3 mb-3 border ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-amber-600 uppercase">
                    全球市场情绪指数 (Market Sentiment)
                  </span>
                  <span className="font-mono font-black text-sm text-amber-500">
                    {briefing.marketSentiment.score} / 100
                  </span>
                </div>
                <p className={`text-[11px] line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {briefing.executiveSummary}
                </p>
              </div>
            )}

            {/* Events Snippet */}
            <div className="space-y-2 mb-3">
              <div className={`font-bold text-[11px] uppercase tracking-wide ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                ● 重大事件拆解 (已选 {briefing.events.length} 项要闻)
              </div>
              {briefing.events.slice(0, 3).map((ev, idx) => (
                <div
                  key={ev.id}
                  className={`p-2.5 rounded-lg border text-[11px] ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between font-bold mb-1">
                    <span>{idx + 1}. {ev.title}</span>
                    <span className="text-[9px] text-slate-400">{ev.time}</span>
                  </div>
                  <p className={`text-[10px] line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {ev.summary}
                  </p>
                  {options.includeImpact && ev.impact && (
                    <div className="mt-1 text-[9px] text-amber-600">
                      启示：{ev.impact.takeaway}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Historical Parallels Snippet */}
            {options.includeHistorical && briefing.historicalParallels[0] && (
              <div className={`p-2.5 rounded-lg border border-l-3 border-l-amber-500 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-amber-50/50 border-amber-200'
              }`}>
                <div className="text-[10px] font-bold text-amber-600">
                  📍 历史上的今天对照 ({briefing.historicalParallels[0].year} 年)
                </div>
                <div className="text-[10px] text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-1">
                  {briefing.historicalParallels[0].event}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
              title="使用浏览器或 iPad AirPrint 打印"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>AirPrint 打印</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {progressText && (
              <span className="text-xs text-indigo-600 animate-pulse font-medium">
                {progressText}
              </span>
            )}

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              {exportSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                  <span>PDF 导出成功！</span>
                </>
              ) : isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>正在导出 PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white stroke-[2.5]" />
                  <span>下载专业 PDF 研报</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
