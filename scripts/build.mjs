#!/usr/bin/env node
// Validates the two hand-edited CSVs, then regenerates every derived file:
//   data/deepswe-1.1.json   joined, typed observations
//   charts/*.svg            static charts for the README
//   index.html              the interactive page (data and chart code inlined, works from file://)
// `--check` regenerates in memory and exits 1 if any committed file is stale or a row is invalid.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv } from './lib/csv.mjs';
import { typeModels, typeObservations, SOURCE_TYPES } from './lib/schema.mjs';
import { effortScatter, spreadBars, readingRowHtml, theadHtml, tfootHtml, barMax, hashId, rowKey, STYLE_RULES, WINDOWS, DEFAULT_WINDOW, windowAnchor, windowStart, inWindow, METRICS, unplottedNote } from '../site/charts.mjs';
import { buildSources, registryHtml, renderNotes, sourcesMarkdown, citeHtml } from './lib/sources.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = rel => join(root, rel);
const check = process.argv.includes('--check');

const meta = JSON.parse(readFileSync(p('data/meta.json'), 'utf8'));
const { models, errors: modelErrors } = typeModels(parseCsv(readFileSync(p('data/models.csv'), 'utf8')));
const modelByKey = new Map(models.map(m => [m.model_key, m]));
const { obs, errors: obsErrors } = typeObservations(parseCsv(readFileSync(p('data/deepswe-1.1.csv'), 'utf8')), new Set(modelByKey.keys()));
const errors = [...modelErrors, ...obsErrors];
if (errors.length) {
  console.error(`${errors.length} validation error(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}

const rows = obs
  .map(o => ({ ...o, display_name: modelByKey.get(o.model_key).display_name, lab: modelByKey.get(o.model_key).lab, open_weights: modelByKey.get(o.model_key).open_weights }))
  .sort((a, b) => b.score_pct - a.score_pct || a.model_key.localeCompare(b.model_key));
for (const r of rows) r.row_id = 'row-' + hashId(rowKey(r));

// A model's release date: the one models.csv states, with its source, else the date its first DeepSWE
// 1.1 result was published. Blank when neither is known.
const firstPublished = new Map();
for (const r of rows) if (r.published && (!firstPublished.has(r.model_key) || r.published < firstPublished.get(r.model_key))) firstPublished.set(r.model_key, r.published);
for (const r of rows) {
  const m = modelByKey.get(r.model_key);
  r.model_released = m.released || firstPublished.get(r.model_key) || null;
  r.model_released_basis = m.released ? 'stated' : r.model_released ? 'first DeepSWE 1.1 result' : null;
}

// Estimated cost, only where a source published tokens but no cost and the model has a list price in
// data/pricing/ai-gateway.json. With an input/output split the estimate is a single figure; with only
// a total it is a range, every token priced as input at the low end and as output at the high end.
const pricing = JSON.parse(readFileSync(p('data/pricing/ai-gateway.json'), 'utf8'));
for (const r of rows) {
  const price = pricing.models[r.model_key];
  if (r.cost_per_task_usd != null || !price) continue;
  const round = v => Number(v.toFixed(4));
  if (r.input_tokens_per_task != null && r.output_tokens_per_task != null) {
    const v = r.input_tokens_per_task * price.input_per_token + r.output_tokens_per_task * price.output_per_token;
    r.cost_estimate = { low: round(v), high: round(v), basis: `${r.input_tokens_per_task} input and ${r.output_tokens_per_task} output tokens at ${price.gateway_id} list prices (AI Gateway, ${pricing.fetched}); cached input would cost less` };
  } else if (r.tokens_per_task != null) {
    r.cost_estimate = { low: round(r.tokens_per_task * price.input_per_token), high: round(r.tokens_per_task * price.output_per_token),
      basis: `${r.tokens_per_task} total tokens with no input/output split, priced all as input (low) to all as output (high) at ${price.gateway_id} list prices (AI Gateway, ${pricing.fetched}); cached input would cost less` };
  }
}
if (new Set(rows.map(r => r.row_id)).size !== rows.length) { console.error('row id collision'); process.exit(1); }

// The source registry: every original source, numbered once; every row points into it.
const sources = buildSources(rows, meta);
const srcByUrl = new Map(sources.map(s => [s.url, s]));
for (const r of rows) { const s = srcByUrl.get(r.source_url); r.source_id = s.id; r.source_n = s.n; }
const rowsById = new Map(rows.map(r => [r.row_id, r]));
const unknownRelease = models.filter(m => m.released_source && !srcByUrl.has(m.released_source));
if (unknownRelease.length) {
  console.error(`released_source not in the source registry (add it to data/meta.json context_sources):\n  ${unknownRelease.map(m => `${m.model_key}: ${m.released_source}`).join('\n  ')}`);
  process.exit(1);
}

const dataset = {
  benchmark: 'DeepSWE 1.1',
  description: 'Pass@1 on Datacurve DeepSWE 1.1 (113 long-horizon engineering tasks), from the official leaderboard, lab reports and independent runs.',
  generated_from: ['data/models.csv', 'data/deepswe-1.1.csv', 'data/meta.json'],
  meta,
  source_types: SOURCE_TYPES,
  models: models.length,
  observations: rows.length,
  sources: sources.map(({ rowIds, ...s }) => s),
  rows,
};

const max = barMax(rows);
// The page opens on models released in the last 30 days; the static views match that opening state.
const anchor = windowAnchor(rows, meta.as_of);
const days = WINDOWS[DEFAULT_WINDOW];
const recent = rows.filter(r => inWindow(r, days, anchor));
const fmtDay = d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const span = `${fmtDay(windowStart(anchor, days)).replace(/ \d{4}$/, '')} – ${fmtDay(anchor)}`;
const unplotted = `Models released ${span}.` + unplottedNote(recent, METRICS.cost);
const priceSrc = sources.find(x => x.key === 'ai-gateway-pricing');
// The README's bar chart shows each model's best result per source across every date.
const best = new Map();
for (const r of rows) {
  const k = r.model_key + '|' + r.source_type;
  const b = best.get(k);
  if (!b || r.score_pct > b.score_pct) best.set(k, r);
}
const bestRows = rows.filter(r => best.get(r.model_key + '|' + r.source_type) === r);
// Inside the page, chart colours resolve to the page's own tokens, which already switch with the theme.
const PAGE_TOKENS = '.viz{--v-good:var(--good);--v-good-ink:var(--good-ink);--v-paper:var(--sheet);--v-ink:var(--ink);--v-ink2:var(--ink-2);--v-muted:var(--muted);--v-grid:var(--grid);--v-rule:var(--rule);font-family:var(--sans)}';
const outputs = {
  'data/deepswe-1.1.json': JSON.stringify(dataset, null, 2) + '\n',
  'charts/score-vs-cost.svg': effortScatter(recent, { embedStyle: true, id: 'readme-sc', height: 640, title: `DeepSWE 1.1 score against cost per task: models released ${span}` }) + '\n',
  'charts/best-per-model.svg': spreadBars(bestRows, { embedStyle: true, id: 'readme-sp' }) + '\n',
  'SOURCES.md': sourcesMarkdown(sources),
  'index.html': readFileSync(p('site/template.html'), 'utf8')
    .replace('/*__VIZSTYLE__*/', () => PAGE_TOKENS + STYLE_RULES)
    .replace('<!--__THEAD__-->', () => theadHtml({ key: 'score_pct', dir: -1 }))
    .replace('<!--__TFOOT__-->', () => tfootHtml(max))
    // Every reading is in the table without scripts; older ones are hidden only once scripts run.
    .replace('<!--__ROWS__-->', () => rows.map(r => readingRowHtml(r, srcByUrl.get(r.source_url), max, priceSrc).replace(/^<tr /, inWindow(r, days, anchor) ? '<tr ' : '<tr class="out" ')).join('\n'))
    .replace('<!--__SCATTER__-->', () => effortScatter(recent, { id: 'sc' }))
    .replace('<!--__UNPLOTTED__-->', () => unplotted)
    .replace('<!--__SPREAD__-->', () => spreadBars(recent, { id: 'sp', onlyMulti: true }))
    .replace('<!--__NOTES__-->', () => renderNotes(meta.notes, sources))
    .replace('<!--__REGISTRY__-->', () => registryHtml(sources, rowsById))
    .replace('<!--__CITE_CHANGELOG__-->', () => `<sup>${citeHtml(sources.find(x => x.key === 'datacurve-changelog'))}</sup>`)
    .replaceAll('{{SOURCE_COUNT}}', String(sources.length))
    .replaceAll('{{READING_COUNT}}', String(rows.length))
    .replaceAll('{{MODEL_COUNT}}', String(models.length))
    .replace('/*__DATA__*/null', () => JSON.stringify(dataset).replace(/</g, '\\u003c'))
    .replace('/*__CHARTS__*/', () => readFileSync(p('site/charts.mjs'), 'utf8').replace(/^export /gm, '')
      .replace(/const STYLE_TOKENS = `[\s\S]*?`;/, () => `const STYLE_TOKENS = \`${PAGE_TOKENS}\`;`)),
};

let stale = [];
for (const [rel, content] of Object.entries(outputs)) {
  const current = existsSync(p(rel)) ? readFileSync(p(rel), 'utf8') : null;
  if (current === content) continue;
  if (check) stale.push(rel);
  else writeFileSync(p(rel), content);
}
if (check && stale.length) {
  console.error(`Stale generated files (run \`npm run build\` and commit):\n  ${stale.join('\n  ')}`);
  process.exit(1);
}
const bySource = Object.keys(SOURCE_TYPES).map(k => `${k} ${rows.filter(r => r.source_type === k).length}`).join(', ');
console.log(`${check ? 'OK' : 'Built'}: ${models.length} models, ${rows.length} observations (${bySource}), ${sources.length} sources.`);
