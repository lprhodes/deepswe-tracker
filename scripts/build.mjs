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
import { effortScatter, timeline, spreadPlot } from '../site/charts.mjs';

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

const dataset = {
  benchmark: 'DeepSWE 1.1',
  description: 'Pass@1 on Datacurve DeepSWE 1.1 (113 long-horizon engineering tasks), from the official leaderboard, lab reports and independent runs.',
  generated_from: ['data/models.csv', 'data/deepswe-1.1.csv', 'data/meta.json'],
  meta,
  source_types: SOURCE_TYPES,
  models: models.length,
  observations: rows.length,
  rows,
};

const marker = meta.official_last_added ? { date: meta.official_last_added, label: `Official board’s last addition · ${meta.official_last_added}` } : null;
// README charts show each model's best result per source, which is the page's default view.
const best = new Map();
for (const r of rows) {
  const k = r.model_key + '|' + r.source_type;
  const b = best.get(k);
  if (!b || r.score_pct > b.score_pct) best.set(k, r);
}
const bestRows = rows.filter(r => best.get(r.model_key + '|' + r.source_type) === r);
// Inside the page, chart colours resolve to the page's own tokens, which already switch with the theme.
const PAGE_TOKENS = '.viz{--v-paper:var(--sheet);--v-ink:var(--ink);--v-ink2:var(--ink-2);--v-muted:var(--muted);--v-grid:var(--grid);--v-rule:var(--rule);font-family:var(--sans)}';
const outputs = {
  'data/deepswe-1.1.json': JSON.stringify(dataset, null, 2) + '\n',
  'charts/score-vs-cost.svg': effortScatter(rows, { embedStyle: true, id: 'readme-sc', height: 640 }) + '\n',
  'charts/score-over-time.svg': timeline(rows, { embedStyle: true, marker, asOf: meta.as_of, id: 'readme-tl', height: 460 }) + '\n',
  'charts/best-per-model.svg': spreadPlot(bestRows, { embedStyle: true, id: 'readme-sp' }) + '\n',
  'index.html': readFileSync(p('site/template.html'), 'utf8')
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
console.log(`${check ? 'OK' : 'Built'}: ${models.length} models, ${rows.length} observations (${bySource}).`);
