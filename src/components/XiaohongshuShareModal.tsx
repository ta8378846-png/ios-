import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ExternalLink, 
  Image as ImageIcon,
  Sparkles,
  Smartphone,
  Hash
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyBriefing, HistoryEventItem } from '../types';
import { formatForXiaohongshu } from '../utils/formatters';

interface XiaohongshuShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: DailyBriefing | null;
  selectedEvent: HistoryEventItem | null;
}

export const XiaohongshuShareModal: React.FC<XiaohongshuShareModalProps> = ({
  isOpen,
  onClose,
  briefing,
  selectedEvent,
}) => {
  const [shareMode, setShareMode] = useState<'daily' | 'event'>(selectedEvent ? 'event' : 'daily');
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (selectedEvent) {
      setShareMode('event');
    } else {
      setShareMode('daily');
    }
  }, [selectedEvent, isOpen]);

  if (!isOpen || !briefing) return null;

  const activeItem = shareMode === 'event' && selectedEvent ? selectedEvent : briefing;
  const { title, body, tags, fullPost } = formatForXiaohongshu(activeItem);

  const handleCopyTitle = async () => {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCopyFullPost = async () => {
    try {
      await navigator.clipboard.writeText(fullPost);
      setCopiedBody(true);
      confetti({ particleCount: 40, spread: 55 });
      setTimeout(() => setCopiedBody(false), 2500);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleOpenXiaohongshu = () => {
    // Attempt Xiaohongshu URL scheme on iOS/iPad, with fallback to web
    const appUrl = 'xhsdiscover://';
    const webUrl = 'https://www.xiaohongshu.com';
    
    const start = Date.now();
    window.location.href = appUrl;

    setTimeout(() => {
      // If still in page after 1.5s, open web
      if (Date.now() - start < 1800) {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1200);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: fullPost,
        });
        confetti({ particleCount: 30, spread: 45 });
      } catch (err) {
        console.debug('Share cancelled or not completed:', err);
      }
    } else {
      handleCopyFullPost();
    }
  };

  // Generate 3:4 Xiaohongshu Card onto HTML Canvas
  const handleDownloadCard = () => {
    setIsGeneratingImage(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setIsGeneratingImage(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingImage(false);
      return;
    }

    // 3:4 Xiaohongshu ratio: 900 x 1200 high-res
    const width = 900;
    const height = 1200;
    canvas.width = width;
    canvas.height = height;

    // Background gradient: Deep slate with warm luxury glow
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#090d16');
    grad.addColorStop(1, '#1e112a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative top-right red-orange orb for Xiaohongshu feel
    const orb = ctx.createRadialGradient(800, 100, 20, 800, 100, 400);
    orb.addColorStop(0, 'rgba(255, 36, 66, 0.25)');
    orb.addColorStop(1, 'rgba(255, 36, 66, 0)');
    ctx.fillStyle = orb;
    ctx.fillRect(0, 0, width, height);

    // Outer border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Top Header: App Pill & Date
    ctx.fillStyle = '#ff2442';
    ctx.beginPath();
    ctx.roundRect(60, 60, 200, 48, 24);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.fillText('ChroniclePad', 85, 92);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 22px system-ui, -apple-system, sans-serif';
    ctx.fillText(briefing.displayDate, 280, 92);

    // Main Card Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px system-ui, -apple-system, sans-serif';
    const mainTitle = '历史上的今天 · 全球重大事件复盘';
    ctx.fillText(mainTitle, 60, 175);

    // Sentiment Gauge Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(60, 210, width - 120, 90, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(`📊 市场情绪：${briefing.marketSentiment.label}`, 90, 262);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 36px monospace';
    ctx.fillText(`${briefing.marketSentiment.score}/100`, width - 240, 265);

    // Events list (Top 3 events)
    let yOffset = 345;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText('【今日四大核心脉搏】', 60, yOffset);
    yOffset += 45;

    const topEvents = briefing.events.slice(0, 3);
    topEvents.forEach((ev, i) => {
      // Event container
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.beginPath();
      ctx.roundRect(60, yOffset, width - 120, 160, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.stroke();

      // Number badge
      ctx.fillStyle = '#ff2442';
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
      ctx.fillText(`0${i + 1}`, 85, yOffset + 42);

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
      const truncatedTitle = ev.title.length > 24 ? ev.title.slice(0, 23) + '...' : ev.title;
      ctx.fillText(truncatedTitle, 135, yOffset + 42);

      // Summary
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '20px system-ui, -apple-system, sans-serif';
      const truncatedSummary = ev.summary.length > 38 ? ev.summary.slice(0, 37) + '...' : ev.summary;
      ctx.fillText(`• 概要：${truncatedSummary}`, 85, yOffset + 85);

      // Impact
      ctx.fillStyle = '#f59e0b';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      const truncatedImpact = ev.impact.takeaway.length > 38 ? ev.impact.takeaway.slice(0, 37) + '...' : ev.impact.takeaway;
      ctx.fillText(`• 启示：${truncatedImpact}`, 85, yOffset + 125);

      yOffset += 185;
    });

    // Historical Parallel section
    if (briefing.historicalParallels[0]) {
      const hp = briefing.historicalParallels[0];
      ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.beginPath();
      ctx.roundRect(60, yOffset, width - 120, 110, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText(`🕰 历史上的今天对照 (${hp.year}年)`, 85, yOffset + 40);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '20px system-ui, -apple-system, sans-serif';
      const hpText = hp.event.length > 38 ? hp.event.slice(0, 37) + '...' : hp.event;
      ctx.fillText(hpText, 85, yOffset + 78);

      yOffset += 135;
    }

    // Bottom Watermark & Tags
    ctx.fillStyle = '#ff2442';
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('#每日简报 #历史上的今天 #财经知识 #科技前沿', 60, height - 70);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 18px system-ui, -apple-system, sans-serif';
    ctx.fillText('整理自 ChroniclePad for iPad · 苹果备忘录与小红书同步插件', 60, height - 42);

    // Convert to PNG and download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `小红书图文卡片_${briefing.date}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsGeneratingImage(false);
    confetti({ particleCount: 35, spread: 60 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-xhs-title"
        className="w-full max-w-2xl max-h-[92vh] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
              <span className="font-black text-sm">RED</span>
            </div>
            <div>
              <h2 id="modal-xhs-title" className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                分享至小红书 (Xiaohongshu)
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  爆款文案 + 3:4 图文卡片
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                自动生成小红书爆款排版文案，支持一键生成 3:4 高清图文长图
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

        {/* Share Mode Switcher */}
        {selectedEvent && (
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">文案模式：</span>
            <button
              onClick={() => setShareMode('event')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                shareMode === 'event'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
              }`}
            >
              选中单条深度解读
            </button>
            <button
              onClick={() => setShareMode('daily')}
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                shareMode === 'daily'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs'
              }`}
            >
              今日宏观全景复盘
            </button>
          </div>
        )}

        {/* Content Preview & Formatter */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {/* Post Title Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-rose-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                小红书标题 (点击复制)
              </span>
              <button
                onClick={handleCopyTitle}
                className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer font-medium"
              >
                {copiedTitle ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedTitle ? '已复制标题' : '复制标题'}</span>
              </button>
            </div>
            <div className="text-sm font-bold text-slate-900 select-text">
              {title}
            </div>
          </div>

          {/* Post Body Card (Styled like Xiaohongshu note viewer) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-rose-600" />
                小红书正文与标签
              </span>
              <button
                onClick={handleCopyFullPost}
                className="flex items-center gap-1 text-[11px] text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 cursor-pointer font-semibold"
              >
                {copiedBody ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedBody ? '已复制全文！' : '一键复制全文'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed select-text font-sans max-h-56 overflow-y-auto">
              {body}
            </div>
          </div>

          {/* 3:4 Visual Card Generator Banner */}
          <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50/70 via-white to-amber-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <ImageIcon className="w-4 h-4 text-rose-600" />
                小红书 3:4 高清精美图文卡片
              </span>
              <p className="text-slate-600 text-[11px]">
                小红书以图文卡片为主。点击右侧按钮直接在 iPad 本地渲染并下载 3:4 比例长图，保存至相册即可发布。
              </p>
            </div>

            <button
              onClick={handleDownloadCard}
              disabled={isGeneratingImage}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isGeneratingImage ? '正在生成...' : '下载 3:4 高清长图'}</span>
            </button>
          </div>

          {/* Hidden Canvas for generation */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            {/* Native iPad Share Sheet */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
                title="呼出 iPad 原生分享菜单"
              >
                <Share2 className="w-3.5 h-3.5 text-rose-600" />
                <span>系统原生分享</span>
              </button>
            )}

            {/* Open Xiaohongshu App */}
            <button
              onClick={handleOpenXiaohongshu}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
              title="在 iPad 上唤醒小红书客户端"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
              <span>打开小红书 App</span>
            </button>
          </div>

          {/* Primary Action: Copy Full Post */}
          <button
            onClick={handleCopyFullPost}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
          >
            {copiedBody ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>已复制全文文案！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.5]" />
                <span>一键复制小红书文案</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
