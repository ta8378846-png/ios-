import test from 'node:test';
import assert from 'node:assert';
import { generateDynamicLiveBriefing } from '../../server/geminiService';

test('generateDynamicLiveBriefing outputs all 7 categories and authentic sources', () => {
  const briefing = generateDynamicLiveBriefing('2026-11-01', 0);
  assert.strictEqual(briefing.date, '2026-11-01');
  assert.strictEqual(briefing.events.length, 7);

  const categories = briefing.events.map(e => e.category);
  assert.ok(categories.includes('stocks'));
  assert.ok(categories.includes('finance'));
  assert.ok(categories.includes('tech'));
  assert.ok(categories.includes('politics'));
  assert.ok(categories.includes('culture'));
  assert.ok(categories.includes('society'));
  assert.ok(categories.includes('international'));

  // Ensure every event has clickable authentic sources
  briefing.events.forEach(ev => {
    assert.ok(ev.sources && ev.sources.length > 0, `Event ${ev.id} should have sources`);
    assert.ok(ev.sources[0].uri.startsWith('http'), `Source uri should be valid`);
  });
});

test('generateDynamicLiveBriefing rotates headlines on different seeds', () => {
  const briefing1 = generateDynamicLiveBriefing('2026-11-01', 1);
  const briefing2 = generateDynamicLiveBriefing('2026-11-01', 2);

  // Headlines should rotate and not be identical
  assert.notStrictEqual(briefing1.events[0].title, briefing2.events[0].title);
  assert.ok(briefing1.updatedAt.length > 0);
  assert.ok(briefing2.updatedAt.length > 0);
});
