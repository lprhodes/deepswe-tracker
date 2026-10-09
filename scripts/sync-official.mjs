#!/usr/bin/env node
// Pulls the official Datacurve leaderboard and regenerates every official_leaderboard row in
// data/deepswe-1.1.csv from it. Rows from other sources are left untouched.
//
//   node scripts/sync-official.mjs                                   fetch both sources live
//   node scripts/sync-official.mjs --page x.html --artifact y.json   use local copies
//
// Two official sources disagree on cost, so both are read. The leaderboard page embeds the rows it
// displays; the JSON artifact (leaderboard-live.json) carries the same scores with a different cost
// basis for 19 of 70 configurations (gpt-5.6-luna [max]: $0.61 on the page, $3.03 in the artifact).
// The page is what readers see, so its numbers are primary and the artifact's cost goes in notes.
// If the page stops parsing, the artifact is used and the run says so.
//
// Each configuration's `published` date comes from data/official/first-seen.json; a configuration
// never seen before is stamped with the artifact's generated_at date, the earliest date we can
// prove it was on the board. Unknown models are appended to data/models.csv with a derived name
// and a lab guessed from the id prefix; review those rows in the diff.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, toCsv } from './lib/csv.mjs';
import { OBS_COLUMNS, MODEL_COLUMNS } from './lib/schema.mjs';
import { modelKey, displayName, labFor } from './lib/models.mjs';
import { extractRows } from './lib/jslit.mjs';

export const ARTIFACT_URL = 'https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json';
export const PAGE_URL = 'https://deepswe.datacurve.ai/';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = rel => join(root, rel);
const today = new Date().toISOString().slice(0, 10);
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const UA = { headers: { 'user-agent': 'deepswe-tracker (github.com/lprhodes/deepswe-tracker)' } };

const round = (v, dp) => (v == null ? '' : Number(v.toFixed(dp)));

async function get(url, local, kind) {
  if (local) return readFileSync(local, 'utf8');
  const res = await fetch(url, UA);
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return kind === 'json' ? res.text() : res.text();
}

const art = JSON.parse(await get(ARTIFACT_URL, arg('--artifact'), 'json'));
if (!Array.isArray(art.rows) || !art.rows.length) throw new Error('artifact has no rows; refusing to wipe the official data');
const pageRows = extractRows(await get(PAGE_URL, arg('--page'), 'html'));
const usePage = pageRows.length >= art.rows.length * 0.9;
if (!usePage) console.warn(`Page parse found ${pageRows.length} rows against ${art.rows.length} in the artifact; using the artifact.`);
const artByConfig = new Map(art.rows.map(r => [r.config, r]));
const boardRows = usePage ? pageRows : art.rows;
const generated = String(art.generated_at || today).slice(0, 10);

mkdirSync(p('data/official'), { recursive: true });
writeFileSync(p('data/official/leaderboard-live.json'), JSON.stringify(art, null, 2) + '\n');
writeFileSync(p('data/official/page-rows.json'), JSON.stringify(pageRows, null, 2) + '\n');

const firstSeenPath = p('data/official/first-seen.json');
const firstSeen = JSON.parse(readFileSync(firstSeenPath, 'utf8'));
const newConfigs = [];
for (const r of boardRows) if (!firstSeen[r.config]) { firstSeen[r.config] = { date: generated, basis: `first seen in artifact generated_at ${art.generated_at}` }; newConfigs.push(r.config); }
writeFileSync(firstSeenPath, JSON.stringify(Object.fromEntries(Object.entries(firstSeen).sort()), null, 2) + '\n');

const models = parseCsv(readFileSync(p('data/models.csv'), 'utf8'));
const known = new Set(models.map(m => m.model_key));
const newModels = [];
for (const r of boardRows) {
  const key = modelKey(r.model);
  if (known.has(key)) continue;
  known.add(key);
  models.push({ model_key: key, display_name: displayName(key), lab: labFor(key), open_weights: '', notes: `added by sync-official on ${today}; review name and lab` });
  newModels.push(key);
}
models.sort((a, b) => a.model_key.localeCompare(b.model_key));
writeFileSync(p('data/models.csv'), toCsv(MODEL_COLUMNS, models));

function artCostNote(r) {
  const a = artByConfig.get(r.config);
  if (!a || a.mean_cost_usd == null || r.mean_cost_usd == null || Math.abs(a.mean_cost_usd - r.mean_cost_usd) < 0.005) return '';
  return `leaderboard-live.json gives $${a.mean_cost_usd.toFixed(2)} per task under its own cost basis`;
}

const official = boardRows.map(r => ({
  model_key: modelKey(r.model),
  model_as_reported: r.model,
  effort: typeof r.reasoning_effort === 'string' && !/^(null|nan|none)$/i.test(r.reasoning_effort) ? r.reasoning_effort : '',
  harness: r.harness ?? '',
  score_pct: round(r.pass_at_1 * 100, 2),
  ci_pct: r.ci_half == null ? '' : round(r.ci_half * 100, 2),
  n_samples: r.n_runs ?? '',
  cost_per_task_usd: round(r.mean_cost_usd, 4),
  tokens_per_task: r.mean_input_tokens == null ? '' : Math.round(r.mean_input_tokens + (r.mean_output_tokens ?? 0)),
  input_tokens_per_task: r.mean_input_tokens == null ? '' : Math.round(r.mean_input_tokens),
  output_tokens_per_task: r.mean_output_tokens == null ? '' : Math.round(r.mean_output_tokens),
  steps_per_task: round(r.mean_agent_steps, 1),
  source_type: 'official_leaderboard',
  verified_primary: 'true',
  source_name: 'Datacurve DeepSWE 1.1 leaderboard',
  source_url: PAGE_URL,
  published: firstSeen[r.config].date,
  accessed: today,
  quote: `config ${r.config}: pass_at_1 ${r.pass_at_1}, ci_half ${r.ci_half}, n_runs ${r.n_runs}, mean_cost_usd ${r.mean_cost_usd}`,
  notes: [`pass@4 ${round((r.pass_at_4 ?? NaN) * 100, 1)}%`, r.mean_duration_seconds && `mean ${Math.round(r.mean_duration_seconds / 60)} min per attempt`,
    r.cost_basis && `cost basis: ${r.cost_basis}`,
    usePage && artCostNote(r), `source: ${usePage ? 'rows embedded in ' + PAGE_URL : ARTIFACT_URL}`].filter(Boolean).join('; '),
}));

// Official rows from archived snapshots (models since removed from the live board) are history, not
// live data, so they are kept as they are; only rows sourced from the live board are regenerated.
const others = parseCsv(readFileSync(p('data/deepswe-1.1.csv'), 'utf8'))
  .filter(r => !(r.source_type === 'official_leaderboard' && r.source_url === PAGE_URL));
const all = [...official, ...others].sort((a, b) => a.model_key.localeCompare(b.model_key) || a.source_type.localeCompare(b.source_type) || String(a.effort).localeCompare(String(b.effort)));
writeFileSync(p('data/deepswe-1.1.csv'), toCsv(OBS_COLUMNS, all));

const meta = JSON.parse(readFileSync(p('data/meta.json'), 'utf8'));
meta.official_generated_at = art.generated_at;
meta.official_latest_job = art.latest_job;
meta.official_configs = boardRows.length;
meta.official_rows_from = usePage ? 'page' : 'artifact';
meta.official_checked = today;
writeFileSync(p('data/meta.json'), JSON.stringify(meta, null, 2) + '\n');

console.log(`Official artifact generated_at ${art.generated_at}, latest job ${art.latest_job?.name} (${art.latest_job?.finished_at}).`);
console.log(`${official.length} official rows written from the ${usePage ? 'page' : 'artifact'}; ${newConfigs.length} new configuration(s)${newConfigs.length ? ': ' + newConfigs.join(', ') : ''}.`);
if (newModels.length) console.log(`New models appended to data/models.csv for review: ${newModels.join(', ')}`);
