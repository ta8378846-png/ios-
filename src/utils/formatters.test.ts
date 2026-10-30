import test from 'node:test';
import assert from 'node:assert/strict';
import { formatForAppleNotes, formatForTwitter, formatForXiaohongshu, filterEvents, buildAppleShortcutsNotesUrl } from './formatters';
import { getMinutesUntilNextReminder, formatTimeRemaining } from './reminder';
import { DailyBriefing, HistoryEventItem } from '../types';

const mockEvent: HistoryEventItem = {
  id: 'ev-1',
  title: '美联储利率决议公布，美股标普500指数大幅高开',
  category: 'stocks',
  time: '14:00 EST',
  summary: '美联储宣布降息25个基点，科技与金融板块领涨，市场流动性预期显著改善。',
  importance: 'critical',
  impact: {
    market: '纳斯达克及标普指数创下阶段新高',
    sector: '半导体与成长型科技股直接受益',
    takeaway: '短期偏好成长股与降息周期受益标的',
  },
  tags: ['美联储', '降息', '美股'],
};

const mockBriefing: DailyBriefing = {
  date: '2026-10-29',
  displayDate: '2026年10月29日 星期四',
  isToday: true,
  marketSentiment: {
    status: 'bullish',
    label: '积极偏多',
    score: 82,
    summary: '流动性宽松利好全球主要风险资产',
  },
  executiveSummary: '今日全球市场核心聚焦美联储降息与人工智能芯片架构发布。',
  events: [mockEvent],
  historicalParallels: [
    {
      year: 1929,
      event: '黑色星期四：纽约股市崩盘前夕的大震荡',
      significance: '警惕高杠杆配资与过度投机风险',
    },
  ],
  updatedAt: '2026-10-29 18:00',
};

test('formatForAppleNotes generates title and markdown structure correctly', () => {
  const result = formatForAppleNotes(mockBriefing);
  assert.equal(result.title.includes('2026年10月29日'), true);
  assert.equal(result.content.includes('# 📅 重大事件备忘录'), true);
  assert.equal(result.content.includes('美联储利率决议公布'), true);
  assert.equal(result.content.includes('美联储宣布降息25个基点'), true);
  assert.equal(result.content.includes('历史上的今天对照'), true);
  assert.equal(result.content.includes('1929年'), true);
  assert.equal(result.content.includes('Apple 备忘录'), true);
});

test('formatForTwitter produces bounded length with hashtags', () => {
  const tweetFromEvent = formatForTwitter(mockEvent);
  assert.equal(tweetFromEvent.length <= 280, true);
  assert.equal(tweetFromEvent.includes('#美联储'), true);
  assert.equal(tweetFromEvent.includes('股市动态'), true);

  const tweetFromBriefing = formatForTwitter(mockBriefing);
  assert.equal(tweetFromBriefing.length <= 280, true);
  assert.equal(tweetFromBriefing.includes('重点扫描'), true);
});

test('buildAppleShortcutsNotesUrl formats encoded shortcuts URI', () => {
  const url = buildAppleShortcutsNotesUrl('测试标题', '测试内容');
  assert.equal(url.startsWith('shortcuts://run-shortcut?name=Add%20to%20Notes'), true);
  assert.equal(url.includes('text='), true);
});

test('filterEvents filters correctly by category and keyword', () => {
  const events: HistoryEventItem[] = [
    mockEvent,
    {
      id: 'ev-2',
      title: '欧洲议会通过最新AI监管法案修订案',
      category: 'politics',
      time: '11:00 CET',
      summary: '强化对大模型开发商的透明度合规要求。',
      importance: 'high',
      impact: {
        market: '欧洲科技合规成本提升',
        sector: '人工智能初创企业',
        takeaway: '加大国际化部署合规审查',
      },
      tags: ['欧盟', 'AI法案'],
    },
  ];

  const stocksOnly = filterEvents(events, 'stocks', '');
  assert.equal(stocksOnly.length, 1);
  assert.equal(stocksOnly[0].id, 'ev-1');

  const politicsOnly = filterEvents(events, 'politics', '');
  assert.equal(politicsOnly.length, 1);
  assert.equal(politicsOnly[0].id, 'ev-2');

  const searchKeyword = filterEvents(events, 'all', '监管法案');
  assert.equal(searchKeyword.length, 1);
  assert.equal(searchKeyword[0].id, 'ev-2');

  const nonExistent = filterEvents(events, 'all', '不存在的关键词xyz');
  assert.equal(nonExistent.length, 0);
});

test('getMinutesUntilNextReminder calculates future reminder delta', () => {
  const mockDate = new Date('2026-10-29T10:00:00');
  const preferredTimes = ['12:30', '18:00'];
  const minutes = getMinutesUntilNextReminder(preferredTimes, mockDate);
  // 12:30 is 2.5 hours = 150 minutes after 10:00
  assert.equal(minutes, 150);

  const formatted = formatTimeRemaining(minutes);
  assert.equal(formatted, '2 小时 30 分钟后');
});

test('formatForXiaohongshu formats daily briefing with catchy title and structured emoji sections', () => {
  const xhsBriefing = formatForXiaohongshu(mockBriefing);
  assert.equal(xhsBriefing.title.includes('历史上的今天'), true);
  assert.equal(xhsBriefing.body.includes('今日核心综述'), true);
  assert.equal(xhsBriefing.body.includes('全球四大核心脉搏'), true);
  assert.equal(xhsBriefing.body.includes('美联储利率决议公布'), true);
  assert.equal(xhsBriefing.body.includes('#财经知识'), true);
  assert.equal(xhsBriefing.tags.includes('#每日简报'), true);

  const xhsEvent = formatForXiaohongshu(mockEvent);
  assert.equal(xhsEvent.title.includes('深度解读'), true);
  assert.equal(xhsEvent.body.includes('市场传导机制'), true);
  assert.equal(xhsEvent.body.includes('行业与个人启示'), true);
  assert.equal(xhsEvent.tags.includes('#美联储'), true);
});

