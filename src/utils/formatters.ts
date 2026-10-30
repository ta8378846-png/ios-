import { DailyBriefing, HistoryEventItem, EventCategory } from '../types';

export const CATEGORY_LABELS: Record<EventCategory, { name: string; icon: string; color: string; badgeBg: string }> = {
  stocks: { name: '股市动态', icon: 'TrendingUp', color: 'text-rose-600', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' },
  finance: { name: '金融宏观', icon: 'Coins', color: 'text-amber-600', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
  tech: { name: '科技前沿', icon: 'Cpu', color: 'text-cyan-600', badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  politics: { name: '政治地缘', icon: 'Landmark', color: 'text-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  culture: { name: '文化思想', icon: 'BookOpen', color: 'text-purple-600', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
  society: { name: '社会民生', icon: 'Users', color: 'text-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  international: { name: '国际视野', icon: 'Globe', color: 'text-blue-600', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
};

/**
 * Formats a daily briefing into rich text suitable for Apple Notes (备忘录)
 */
export function formatForAppleNotes(
  briefing: DailyBriefing,
  options?: {
    includeHeader?: boolean;
    selectedCategory?: EventCategory | 'all';
    includeImpact?: boolean;
  }
): { title: string; content: string } {
  const { includeHeader = true, selectedCategory = 'all', includeImpact = true } = options || {};

  const title = `📅 重大事件备忘录 · ${briefing.displayDate}`;

  const eventsToInclude = selectedCategory === 'all'
    ? briefing.events
    : briefing.events.filter((e) => e.category === selectedCategory);

  const lines: string[] = [];

  if (includeHeader) {
    lines.push(`# ${title}`);
    lines.push(`> 整理时间：${briefing.updatedAt} | 情绪指数：${briefing.marketSentiment.label} (${briefing.marketSentiment.score}/100)`);
    lines.push('');
    lines.push(`### 📌 今日执行摘要`);
    lines.push(briefing.executiveSummary);
    lines.push('');
  }

  // Group events by category
  const categories: EventCategory[] = ['stocks', 'finance', 'tech', 'politics', 'culture', 'society', 'international'];
  
  for (const cat of categories) {
    if (selectedCategory !== 'all' && selectedCategory !== cat) continue;

    const catEvents = eventsToInclude.filter((e) => e.category === cat);
    if (catEvents.length === 0) continue;

    lines.push(`## 🏛 ${CATEGORY_LABELS[cat].name}`);

    catEvents.forEach((ev, idx) => {
      const importanceBadge = ev.importance === 'critical' ? '🔴 [重磅]' : ev.importance === 'high' ? '🟡 [重要]' : '⚪';
      lines.push(`${idx + 1}. **${ev.title}** ${importanceBadge}`);
      lines.push(`   - ⏱ 时间/年份：${ev.time}`);
      lines.push(`   - 📝 核心概要：${ev.summary}`);
      
      if (includeImpact && ev.impact) {
        lines.push(`   - 📊 市场传导：${ev.impact.market}`);
        lines.push(`   - 🎯 行业启示：${ev.impact.takeaway}`);
      }
      
      if (ev.sources && ev.sources.length > 0) {
        lines.push(`   - 🔗 权威信源：${ev.sources.map((s) => `[${s.title}](${s.uri})`).join(' | ')}`);
      }
      
      if (ev.tags && ev.tags.length > 0) {
        lines.push(`   - 🏷 标签：${ev.tags.map((t) => `#${t}`).join(' ')}`);
      }
      lines.push('');
    });
  }

  if (briefing.historicalParallels && briefing.historicalParallels.length > 0) {
    lines.push(`## 🕰 历史上的今天对照`);
    briefing.historicalParallels.forEach((hp) => {
      lines.push(`- **${hp.year}年**：${hp.event}`);
      lines.push(`  *启示*：${hp.significance}`);
    });
    lines.push('');
  }

  lines.push('---');
  lines.push('*由 ChroniclePad for iPad 智能同步至 Apple 备忘录*');

  return {
    title,
    content: lines.join('\n'),
  };
}

/**
 * Formats a single event or daily summary for Twitter / X
 */
export function formatForTwitter(
  item: HistoryEventItem | DailyBriefing,
  customTag = '#每日简报'
): string {
  if ('displayDate' in item) {
    // It's a DailyBriefing
    const topEvents = item.events.slice(0, 3).map((e) => `• ${e.title}`).join('\n');
    const text = `📢 【${item.displayDate} 重点扫描】\n市场情绪：${item.marketSentiment.label}\n\n${topEvents}\n\n${customTag} #股市 #金融 #科技 #政治 via @ChroniclePad`;
    return text.length > 280 ? text.slice(0, 277) + '...' : text;
  }

  // It's a HistoryEventItem
  const catLabel = CATEGORY_LABELS[item.category]?.name || '快讯';
  const tagList = item.tags ? item.tags.slice(0, 3).map((t) => `#${t}`).join(' ') : '';
  const text = `⚡️【${catLabel}】${item.title}\n\n${item.summary}\n\n📊 核心启示：${item.impact.takeaway}\n\n${tagList} ${customTag}`;
  return text.length > 280 ? text.slice(0, 277) + '...' : text;
}

/**
 * Builds Apple Shortcuts URL or Notes URL scheme for instant iPad addition
 */
export function buildAppleShortcutsNotesUrl(title: string, text: string): string {
  // If the user has an Apple shortcut named "CreateNote" or similar, or encode text
  const encodedText = encodeURIComponent(`${title}\n\n${text}`);
  return `shortcuts://run-shortcut?name=Add%20to%20Notes&input=text&text=${encodedText}`;
}

/**
 * Xiaohongshu post structured representation
 */
export interface XiaohongshuPost {
  title: string;
  body: string;
  tags: string[];
  fullPost: string;
}

/**
 * Formats a daily briefing or event for Xiaohongshu (小红书)
 */
export function formatForXiaohongshu(
  item: HistoryEventItem | DailyBriefing
): XiaohongshuPost {
  const commonTags = ['#每日简报', '#历史上的今天', '#财经知识', '#商业思维', '#科技前沿', '#iPad效率工具', '#笔记分享'];

  if ('displayDate' in item) {
    // DailyBriefing
    const title = `📌 历史上的今天 | 全球重大事件深度复盘 🔥`;
    const lines: string[] = [];

    lines.push(`📅 日期：${item.displayDate}`);
    lines.push(`📊 市场情绪：${item.marketSentiment.label} (${item.marketSentiment.score}/100)`);
    lines.push('');
    lines.push(`💡 今日核心综述：`);
    lines.push(item.executiveSummary);
    lines.push('');
    lines.push(`━━━━━━━━━━━━━━━`);
    lines.push(`🔍 全球四大核心脉搏：`);

    item.events.slice(0, 4).forEach((ev, i) => {
      const cat = CATEGORY_LABELS[ev.category]?.name || '要闻';
      lines.push(`${i + 1}️⃣ 【${cat}】${ev.title}`);
      lines.push(`  • 核心概要：${ev.summary}`);
      if (ev.impact) {
        lines.push(`  • 市场传导：${ev.impact.market}`);
        lines.push(`  • 核心启示：${ev.impact.takeaway}`);
      }
      lines.push('');
    });

    if (item.historicalParallels && item.historicalParallels.length > 0) {
      lines.push(`━━━━━━━━━━━━━━━`);
      lines.push(`🕰 历史上的今天穿越对照：`);
      item.historicalParallels.slice(0, 2).forEach((hp) => {
        lines.push(`📍 ${hp.year}年：${hp.event}`);
        lines.push(`   启示：${hp.significance}`);
      });
      lines.push('');
    }

    lines.push(`💬 今日思考：历史不会简单地重复，但总是押着相同的韵脚。在周期面前，保持敏锐与敬畏。`);
    lines.push('');
    lines.push(commonTags.join(' '));

    const body = lines.join('\n');
    return {
      title,
      body,
      tags: commonTags,
      fullPost: `${title}\n\n${body}`,
    };
  }

  // Single HistoryEventItem
  const catLabel = CATEGORY_LABELS[item.category]?.name || '重大要闻';
  const title = `⚡️ 深度解读：${item.title.length > 18 ? item.title.slice(0, 17) + '…' : item.title} 💡`;
  const lines: string[] = [];

  lines.push(`🏛 板块分类：${catLabel}`);
  lines.push(`⏱ 发生时间：${item.time}`);
  lines.push('');
  lines.push(`📖 事件原貌：`);
  lines.push(item.summary);
  lines.push('');
  lines.push(`━━━━━━━━━━━━━━━`);
  lines.push(`📊 市场传导机制：`);
  lines.push(item.impact.market);
  lines.push('');
  lines.push(`🎯 行业与个人启示：`);
  lines.push(item.impact.takeaway);
  lines.push('');
  if (item.sources && item.sources.length > 0) {
    lines.push(`🔗 权威核验信源：`);
    item.sources.forEach((s) => lines.push(`• ${s.title} (${s.uri})`));
    lines.push('');
  }

  const tags = [...commonTags, ...((item.tags || []).map((t) => `#${t}`))];
  lines.push(tags.slice(0, 8).join(' '));

  const body = lines.join('\n');
  return {
    title,
    body,
    tags,
    fullPost: `${title}\n\n${body}`,
  };
}

/**
 * Filter events by category and keyword search
 */
export function filterEvents(
  events: HistoryEventItem[],
  category: EventCategory | 'all',
  keyword: string
): HistoryEventItem[] {
  const trimmed = keyword.trim().toLowerCase();
  return events.filter((ev) => {
    const matchesCategory = category === 'all' || ev.category === category;
    if (!matchesCategory) return false;

    if (!trimmed) return true;

    const inTitle = ev.title.toLowerCase().includes(trimmed);
    const inSummary = ev.summary.toLowerCase().includes(trimmed);
    const inTags = ev.tags?.some((t) => t.toLowerCase().includes(trimmed));
    const inImpact = ev.impact?.takeaway.toLowerCase().includes(trimmed) || ev.impact?.market.toLowerCase().includes(trimmed);

    return inTitle || inSummary || inTags || inImpact;
  });
}
