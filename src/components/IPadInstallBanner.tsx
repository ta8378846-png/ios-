import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Download, Tablet } from 'lucide-react';

export const IPadInstallBanner: React.FC = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const dismissed = localStorage.getItem('chroniclepad_install_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (isStandalone || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('chroniclepad_install_dismissed', 'true');
  };

  return (
    <>
      <aside aria-label="安装提示" className="bg-indigo-50/90 border-b border-indigo-100 px-4 py-2 text-xs text-indigo-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tablet className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              已针对 iPad 视网膜屏与触摸屏深度优化，添加到主屏幕即可获得沉浸式独立插件体验。
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowGuide(true)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition active:scale-95 cursor-pointer shadow-xs"
            >
              添加到 iPad 主屏幕
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-lg hover:bg-indigo-100 text-indigo-600 hover:text-indigo-900 transition cursor-pointer"
              title="不再提示"
              aria-label="关闭提示"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* iPad Installation Instructions Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-pwa-title"
            className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl text-slate-800"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="modal-pwa-title" className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Tablet className="w-4 h-4 text-indigo-600" />
                安装到 iPad 主屏幕
              </h2>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-800"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="space-y-3.5 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </span>
                <span>
                  在 iPad 的 <strong>Safari 浏览器</strong> 顶部或底部工具栏中，轻点 <strong>「分享」</strong> 图标（带有向上箭头的正方形）。
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <span>
                  在弹出的操作面板中，向下滑动并轻点 <strong>「添加到主屏幕」</strong> (Add to Home Screen)。
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </span>
                <span>
                  轻点右上角的 <strong>「添加」</strong>，即可随时从桌面以全屏插件模式离线使用。
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
    </>
  );
};
