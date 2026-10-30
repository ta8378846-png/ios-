import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePdfFilename, DEFAULT_PDF_OPTIONS } from './pdfExport';

test('generatePdfFilename formats clean standard PDF report filename', () => {
  const filename = generatePdfFilename('2026-10-29');
  assert.equal(filename, 'ChroniclePad_宏观研报_2026-10-29.pdf');

  const filenameWithSymbols = generatePdfFilename('2026/10/29 (今日)');
  assert.equal(filenameWithSymbols, 'ChroniclePad_宏观研报_20261029.pdf');
});

test('DEFAULT_PDF_OPTIONS includes sentiment index and historical parallels by default', () => {
  assert.equal(DEFAULT_PDF_OPTIONS.includeSentiment, true);
  assert.equal(DEFAULT_PDF_OPTIONS.includeHistorical, true);
  assert.equal(DEFAULT_PDF_OPTIONS.includeImpact, true);
  assert.equal(DEFAULT_PDF_OPTIONS.theme, 'print-light');
  assert.equal(DEFAULT_PDF_OPTIONS.categories, 'all');
});
