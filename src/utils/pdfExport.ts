import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DailyBriefing, EventCategory } from '../types';
import { CATEGORY_LABELS } from './formatters';

export interface PdfExportOptions {
  theme: 'print-light' | 'executive-dark';
  includeSentiment: boolean;
  includeHistorical: boolean;
  includeImpact: boolean;
  categories: EventCategory[] | 'all';
}

export const DEFAULT_PDF_OPTIONS: PdfExportOptions = {
  theme: 'print-light',
  includeSentiment: true,
  includeHistorical: true,
  includeImpact: true,
  categories: 'all',
};

/**
 * Generate a standard filename for the exported PDF
 */
export function generatePdfFilename(dateStr: string): string {
  const cleanDate = dateStr.replace(/[^0-9-]/g, '');
  return `ChroniclePad_宏观研报_${cleanDate}.pdf`;
}

/**
 * Generates an executive A4 PDF report using jsPDF and html2canvas
 */
export async function exportDailyBriefingPdf(
  briefing: DailyBriefing,
  options: PdfExportOptions = DEFAULT_PDF_OPTIONS,
  onProgress?: (progressText: string) => void
): Promise<void> {
  onProgress?.('正在构建高精度研报版面...');

  // Create an offscreen container specifically styled for A4 printable rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '840px'; // Approx A4 width at 96 DPI
  container.style.padding = '0';
  container.style.margin = '0';
  container.style.zIndex = '-1000';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';

  const isDark = options.theme === 'executive-dark';
  const bgColor = isDark ? '#090d16' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const cardBg = isDark ? '#111827' : '#f8fafc';
  const borderColor = isDark ? '#1f2937' : '#e2e8f0';
  const subtextColor = isDark ? '#94a3b8' : '#475569';

  const eventsToInclude = options.categories === 'all'
    ? briefing.events
    : briefing.events.filter((e) => options.categories.includes(e.category));

  // Build HTML Report
  container.innerHTML = `
    <div style="background-color: ${bgColor}; color: ${textColor}; padding: 36px 40px; box-sizing: border-box; line-height: 1.5;">
      <!-- Report Header -->
      <div style="border-bottom: 2px solid ${isDark ? '#374151' : '#0f172a'}; padding-bottom: 18px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: ${isDark ? '#818cf8' : '#4338ca'}; text-transform: uppercase;">
              ChroniclePad Executive Intelligence Briefing
            </div>
            <div style="font-size: 26px; font-weight: 800; color: ${textColor}; margin-top: 4px;">
              全球宏观、科技与资本市场重大事件研报
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12px; font-weight: 700; color: ${textColor};">
              ${briefing.displayDate}
            </div>
            <div style="font-size: 10px; color: ${subtextColor}; margin-top: 2px;">
              编号: CP-${briefing.date.replace(/-/g, '')}-R1 | 更新: ${briefing.updatedAt}
            </div>
          </div>
        </div>
      </div>

      <!-- Executive Summary & Sentiment Index Box -->
      ${options.includeSentiment ? `
        <div style="background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed ${borderColor}; padding-bottom: 12px; margin-bottom: 12px;">
            <div>
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${subtextColor};">
                全球资本市场情绪指数 (Market Sentiment)
              </span>
              <div style="font-size: 16px; font-weight: 800; color: #d97706; margin-top: 2px;">
                ${briefing.marketSentiment.label}
              </div>
            </div>
            <div style="font-size: 28px; font-weight: 900; font-family: monospace; color: ${isDark ? '#fbbf24' : '#b45309'};">
              ${briefing.marketSentiment.score} <span style="font-size: 14px; font-weight: 400; color: ${subtextColor};">/100</span>
            </div>
          </div>
          <div style="font-size: 11px; color: ${subtextColor}; margin-bottom: 4px; font-weight: 600;">
            今日核心综述脉络：
          </div>
          <div style="font-size: 13px; color: ${textColor}; line-height: 1.6;">
            ${briefing.executiveSummary}
          </div>
        </div>
      ` : ''}

      <!-- Major Events Breakdown -->
      <div style="margin-bottom: 24px;">
        <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px; color: ${textColor}; display: flex; align-items: center;">
          <span style="display: inline-block; width: 4px; height: 16px; background: #6366f1; border-radius: 2px; margin-right: 8px;"></span>
          重大事件多维拆解与权威信源 (Major Events & Sources Breakdown)
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${eventsToInclude.map((ev, idx) => {
            const cat = CATEGORY_LABELS[ev.category];
            const badgeColor = 
              ev.category === 'stocks' ? '#e11d48' : 
              ev.category === 'finance' ? '#d97706' : 
              ev.category === 'tech' ? '#0284c7' : 
              ev.category === 'politics' ? '#4f46e5' :
              ev.category === 'culture' ? '#9333ea' :
              ev.category === 'society' ? '#059669' : '#2563eb';
            return `
              <div style="background: ${cardBg}; border: 1px solid ${borderColor}; border-radius: 10px; padding: 14px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: ${badgeColor}18; color: ${badgeColor}; border: 1px solid ${badgeColor}40; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px;">
                      ${cat?.name || ev.category}
                    </span>
                    <span style="font-size: 13px; font-weight: 800; color: ${textColor};">
                      ${idx + 1}. ${ev.title}
                    </span>
                  </div>
                  <span style="font-size: 10px; font-weight: 600; color: ${subtextColor}; white-space: nowrap; margin-left: 12px;">
                    ${ev.time}
                  </span>
                </div>

                <div style="font-size: 11.5px; color: ${textColor}; margin-bottom: 8px; line-height: 1.5;">
                  ${ev.summary}
                </div>

                ${options.includeImpact && ev.impact ? `
                  <div style="background: ${isDark ? '#0b0f19' : '#f1f5f9'}; border-radius: 6px; padding: 8px 10px; font-size: 10.5px; display: flex; flex-direction: column; gap: 4px;">
                    <div><strong style="color: #e11d48;">📊 市场传导：</strong><span style="color: ${subtextColor};">${ev.impact.market}</span></div>
                    <div><strong style="color: #d97706;">🎯 行业启示：</strong><span style="color: ${subtextColor};">${ev.impact.takeaway}</span></div>
                    ${ev.impact.sector ? `<div><strong style="color: #0284c7;">🏢 联动板块：</strong><span style="color: ${subtextColor};">${ev.impact.sector}</span></div>` : ''}
                  </div>
                ` : ''}

                ${ev.sources && ev.sources.length > 0 ? `
                  <div style="margin-top: 6px; font-size: 10px; color: ${subtextColor}; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <strong style="color: #4f46e5;">🔗 权威信源：</strong>
                    ${ev.sources.map(s => `<span style="background: ${isDark ? '#1e293b' : '#e2e8f0'}; padding: 1px 6px; border-radius: 4px;">${s.title}</span>`).join(' ')}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Historical Parallels Spotlight -->
      ${options.includeHistorical && briefing.historicalParallels && briefing.historicalParallels.length > 0 ? `
        <div style="margin-bottom: 24px;">
          <div style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; color: ${textColor}; display: flex; align-items: center;">
            <span style="display: inline-block; width: 4px; height: 16px; background: #f59e0b; border-radius: 2px; margin-right: 8px;"></span>
            历史上的今天 · 穿越时空的启示 (Historical Parallels)
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${briefing.historicalParallels.map((hp) => `
              <div style="background: ${cardBg}; border: 1px solid ${borderColor}; border-left: 3px solid #f59e0b; border-radius: 8px; padding: 12px 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="font-size: 11px; font-weight: 800; color: #b45309;">
                    📍 ${hp.year} 年历史大事件
                  </span>
                </div>
                <div style="font-size: 12px; font-weight: 700; color: ${textColor}; margin-bottom: 4px;">
                  ${hp.event}
                </div>
                <div style="font-size: 11px; color: ${subtextColor};">
                  <strong>反思与启示：</strong>${hp.significance}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Report Footer & Disclaimer -->
      <div style="border-top: 1px solid ${borderColor}; padding-top: 14px; margin-top: 30px; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: ${subtextColor};">
        <div>
          由 ChroniclePad for iPad 智能生成 · 仅供宏观研判与备忘学习，不构成直接投资建议
        </div>
        <div>
          Confidential · Executive Briefing Edition
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    onProgress?.('正在执行 Canvas 高精度矢量渲染...');

    // Render HTML to Canvas with high scale for crisp print quality
    const canvas = await html2canvas(container, {
      scale: 2, // 2x retina scale
      useCORS: true,
      logging: false,
      backgroundColor: bgColor,
      onclone: (clonedDoc) => {
        // Strip external Tailwind v4 stylesheets to prevent oklch() color parse failure
        clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((el) => {
          el.remove();
        });
        clonedDoc.documentElement.style.backgroundColor = bgColor;
        clonedDoc.body.style.backgroundColor = bgColor;
        clonedDoc.body.style.color = textColor;
      },
    });

    onProgress?.('正在构建 PDF 页面并封装文档...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate height maintaining aspect ratio
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Multi-page handling if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    onProgress?.('正在保存 PDF 研报...');
    const filename = generatePdfFilename(briefing.date);
    pdf.save(filename);
  } finally {
    document.body.removeChild(container);
  }
}
