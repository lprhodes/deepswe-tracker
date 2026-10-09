#!/usr/bin/env node
// One-off merge of the October 2026 research sweep (research/raw/*.json) into data/deepswe-1.1.csv
// and data/models.csv. Official rows are owned by scripts/sync-official.mjs and are not touched here.
//
// Policy, in order of preference for any (model, effort, harness, source kind):
//   1. A lab's own number read at the lab's own page (t2, t3, t5)  -> lab_self_reported, verified
//   2. An independent run read at the runner's page (Mercor, Artificial Analysis, t2-t5) -> third_party_run
// A number seen only on an aggregator is not ingested: the sweep found aggregators lose effort
// levels, mangle names and relabel the official board's runs as lab claims. Models that only
// aggregators listed were re-checked at the labs' own pages (t6) instead.
// Mirrors of another source (BenchLM mirrors Mercor; BenchmarkList and others mirror the official
// board) are dropped, because the original is already in.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, toCsv } from '../scripts/lib/csv.mjs';
import { OBS_COLUMNS, MODEL_COLUMNS } from '../scripts/lib/schema.mjs';
import { displayName, labFor } from '../scripts/lib/models.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const p = rel => join(root, rel);
const load = f => (existsSync(p(`research/raw/${f}`)) ? JSON.parse(readFileSync(p(`research/raw/${f}`), 'utf8')) : []);

export function keyFor(name) {
  let s = String(name).toLowerCase().trim()
    .replace(/\(.*?\)|\[.*?\]/g, ' ')
    .replace(/^[\w.-]+\//, '')                                   // HuggingFace org prefix, "Qwen/Qwen3.8-27B"
    .replace(/^(anthropic|openai|google|meta|xai)\s+/, '')
    .trim();
  s = s.replace(/^(k\d+)\s+(low|medium|high|xhigh|max)$/, '$1');   // Fireworks' "K3 High" names the effort, not the model
  if (/^(opus|sonnet|haiku|fable)\b/.test(s)) s = 'claude ' + s;
  if (/^k\d/.test(s)) s = 'kimi ' + s;
  s = s.replace(/^ds-/, 'deepseek-');
  s = s.replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/-$/, '')
    .replace(/(\d)-(?=\d+(?:-|$))/g, '$1.')
    .replace(/^gpt-?(\d)/, 'gpt-$1')
    .replace(/^glm-?(\d)/, 'glm-$1')
    .replace(/^qwen-?(\d)/, 'qwen$1');
  return ALIASES[s] ?? s;
}
const ALIASES = {
  'claude-opus-5.5-max': 'claude-opus-5.5',
  'gemini-3.1-pro': 'gemini-3.1-pro',
};

const nameFor = displayName;

const effortOf = e => {
  const s = String(e ?? '').toLowerCase().trim();
  if (!s || s === 'null' || s === 'none' || s === 'n/a' || s === 'unspecified') return '';
  return s.replace(/^x-?high$/, 'xhigh').replace(/^extra high$/, 'xhigh');
};
const harnessOf = h => {
  const s = String(h ?? '').toLowerCase();
  if (!s || s === 'null' || s === 'other name') return '';
  if (s.includes('mini-swe-agent') || s.includes('mini swe agent') || s.includes('mini-swe')) return 'mini-swe-agent';
  if (s.includes('grok build')) return 'Grok Build';
  if (s.includes('muse code')) return 'Muse Code';
  if (s.includes('devin')) return 'Devin CLI';
  if (s.includes('claude code')) return 'Claude Code';
  if (s.includes('codex')) return 'Codex';
  if (s.includes('openhands')) return 'OpenHands';
  if (s.includes('internal') || s.includes('proprietary') || s.includes('own harness')) return 'lab-internal';
  return String(h).trim();
};
const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
const MIRRORS = ['benchlm.ai', 'benchmarklist.com', 'deepswe.datacurve.ai'];
const AGGREGATORS = ['llm-stats.com', 'codingfleet.com', 'llmreference.com', 'lucaberton.com', 'edenai.co', 'itdoeswhatnow.com',
  'unifybench.ai', 'benchmarklist.com', 'benchlm.ai', 'datacamp.com', 'aiweekly.co', 'the-decoder.com', 'eweek.com',
  'kingy.ai', 'fonearena.com', 'marktechpost.com'];

const raw = [
  ...load('t2-us-labs.json').map(r => ({ ...r, _task: 't2' })),
  ...load('t3-cn-open-mistral.json').map(r => ({ ...r, _task: 't3' })),
  // t5 (community sweep) is not ingested: the fact-check (b1) found each of its numbers either
  // rounded from a primary that t2 read exactly, or misattributed (Grok 4.7's 73% Grok Build run is
  // Artificial Analysis's, not xAI's). Its findings live in research/raw/t5-notes.md.
  ...load('b1-factcheck.json').map(r => ({ ...r, _task: 'b1' })),
  ...load('t6-aggregator-only.json').map(r => ({ ...r, _task: 't6' })),
  ...load('t4-aggregators.json').map(r => ({ ...r, _task: 't4' })),
];

const rejected = [];
const candidates = [];
for (const r of raw) {
  const h = host(r.source_url);
  if (r.source_type === 'official_leaderboard' || (r.source_type === 'third_party_run' && MIRRORS.includes(h))) { rejected.push([r, 'mirror of a source already ingested']); continue; }
  if (typeof r.score_pct !== 'number' || !Number.isFinite(r.score_pct)) { rejected.push([r, 'no numeric score']); continue; }
  if (/nvfp4|quantiz/i.test(`${r.model} ${r.notes}`)) { rejected.push([r, 'quantised community variant, not the released model']); continue; }
  if (/RL end/i.test(r.model)) { rejected.push([r, 'training-run checkpoint, not the released model']); continue; }
  if (r.source_type !== 'third_party_run' && /official DeepSWE leaderboard|public leaderboard from deepswe\.datacurve\.ai|cited from Datacurve|cites? the Datacurve/i.test(`${r.quote} ${r.notes} ${r.source_name}`)) {
    rejected.push([r, 'lab citing the official board']); continue;
  }
  const onAggregator = AGGREGATORS.includes(h);
  if (onAggregator || r.source_type === 'aggregator') { rejected.push([r, 'seen only on an aggregator']); continue; }
  let kind = r.source_type === 'third_party_run' ? 'third_party_run' : 'lab_self_reported';
  const verified = !onAggregator && r.source_type !== 'aggregator';
  candidates.push({ r, kind, verified, key: keyFor(r.model), effort: effortOf(r.effort), harness: harnessOf(r.harness) });
}

// A lab table that repeats the official board's number for a model is a citation, not a separate
// measurement: OpenAI's launch charts and several system cards reprint Datacurve's runs. Match at
// the precision the lab printed (59.0 matches 58.99; 73.7 does not match 73.83).
const officialRows = parseCsv(readFileSync(p('data/deepswe-1.1.csv'), 'utf8')).filter(r => r.source_type === 'official_leaderboard');
const decimals = v => (String(v).split('.')[1] ?? '').length;
const citesOfficial = c => c.kind === 'lab_self_reported' && officialRows.some(o => (o.model_key === c.key || o.model_key === c.key.replace(/-\d{4}$/, ''))
  && (!c.effort || o.effort === c.effort)
  && Number(Number(o.score_pct).toFixed(decimals(c.r.score_pct))) === c.r.score_pct);
for (let i = candidates.length - 1; i >= 0; i--) if (citesOfficial(candidates[i])) {
  rejected.push([candidates[i].r, 'repeats the official board figure']);
  candidates.splice(i, 1);
}

// Keep one row per (model, effort, harness, kind, score). Prefer verified, then the lab-focused tasks.
const rank = c => (c.verified ? 0 : 10) + ({ b1: 0, t2: 1, t3: 1, t6: 1, t5: 2, t4: 3 }[c.r._task] ?? 5);
const best = new Map();
for (const c of candidates) {
  // A lab printing its figure in two places (card and blog) is one claim; two runners are two runs.
  const k = [c.key, c.effort, c.harness, c.kind, c.r.score_pct, c.kind === 'third_party_run' ? host(c.r.source_url) : ''].join('|');
  if (!best.has(k) || rank(c) < rank(best.get(k))) best.set(k, c);
}
// An unverified aggregator copy is dropped when a verified row for the same model and kind exists,
// whatever its effort label: aggregators routinely lose the effort level.
// Two tasks often read the same published figure at different precision (75.22 from a chart's data,
// 75.2 from its prose) or with the effort left blank. Those are one data point: keep the more
// precise reading, and between equals the better-ranked task.
const sameFigure = (a, b) => {
  const [fine, coarse] = decimals(a.r.score_pct) >= decimals(b.r.score_pct) ? [a, b] : [b, a];
  return Number(fine.r.score_pct.toFixed(decimals(coarse.r.score_pct))) === coarse.r.score_pct;
};
const pool = [...best.values()].sort((a, b) => decimals(b.r.score_pct) - decimals(a.r.score_pct) || rank(a) - rank(b));
const kept = [];
for (const c of pool) {
  const dup = kept.find(k => k.key === c.key && k.kind === c.kind && (c.kind === 'lab_self_reported' || host(k.r.source_url) === host(c.r.source_url))
    && (!k.effort || !c.effort || k.effort === c.effort) && (!k.harness || !c.harness || k.harness === c.harness || c.r._task === 't5' || k.r._task === 't5')
    && sameFigure(k, c));
  if (dup) { rejected.push([c.r, `same figure as ${dup.r.model} ${dup.r.score_pct} from ${dup.r._task}`]); if (!dup.effort && c.effort) dup.effort = c.effort; continue; }
  kept.push(c);
}

// Corrections settled at the primary source by the fact-check (research/raw/b1-notes.md) or by
// reading the PDF directly. Each names what it fixes, so a re-run applies the same judgement.
const CORRECTIONS = [
  { when: c => c.key === 'grok-4.7' && c.kind === 'lab_self_reported', set: { effort: 'high' },
    note: 'xAI card p.7: "Grok 4.7 scores 71.0% at high"; footnote: results taken from evaluations conducted by Datacurve, which never posted them on its public board.' },
  { when: c => c.key === 'gemini-4-argon', set: { effort: '' },
    note: 'Google eval PDF: self-computed with mini-swe-agent at the highest thinking setting; no level name given.' },
  { when: c => c.key === 'mistral-large-4', set: { harness: 'partner eval (Artificial Analysis, Surge AI)' },
    note: 'Mistral reports the run was done with Artificial Analysis and Surge AI.' },
  { when: c => c.key === 'gpt-5.6-luna' && c.kind === 'lab_self_reported', set: {},
    note: 'OpenAI re-ran GPT-5.6 Luna internally for its GPT-6 Sol/Luna post; the official board measured 67.2% at max.' },
  { when: c => c.key === 'step-5-preview', set: {},
    note: 'Source is StepFun\u2019s homepage rather than a dated release page; the figure has not been re-checked on a page that is still reachable.' },
  { when: c => host(c.r.source_url) === 'mercor.com', set: { published: '' },
    note: 'Mercor shows no per-model dates; on its board as of the 2026-10-07 capture.' },
];
for (const c of kept) for (const fix of CORRECTIONS) if (fix.when(c)) {
  if ('effort' in fix.set) c.effort = fix.set.effort;
  if ('harness' in fix.set) c.harness = fix.set.harness;
  if ('published' in fix.set) c.r = { ...c.r, published: fix.set.published };
  c.r = { ...c.r, notes: [fix.note, c.r.notes].filter(Boolean).join(' ') };
}
// Corrections can make two rows identical (Gemini 4 Argon read as "max" by one task and "high" by
// another); keep the first.
for (let i = kept.length - 1; i >= 0; i--) {
  const c = kept[i];
  if (kept.findIndex(k => k.key === c.key && k.kind === c.kind && k.effort === c.effort && k.harness === c.harness && sameFigure(k, c)) < i) kept.splice(i, 1);
}

const rows = kept.map(({ r, kind, verified, key, effort, harness }) => ({
  model_key: key,
  model_as_reported: r.model,
  effort,
  harness,
  score_pct: r.score_pct,
  ci_pct: r.ci_pct ?? '',
  n_samples: r.n_samples ?? '',
  cost_per_task_usd: r.cost_per_task_usd ?? '',
  tokens_per_task: r.tokens_per_task ?? '',
  input_tokens_per_task: r.input_tokens_per_task ?? '',
  output_tokens_per_task: r.output_tokens_per_task ?? '',
  steps_per_task: r.steps_per_task ?? '',
  source_type: kind,
  verified_primary: String(verified),
  source_name: r.source_name ?? host(r.source_url),
  source_url: r.source_url,
  published: /^\d{4}-\d{2}-\d{2}$/.test(r.published ?? '') ? r.published : '',
  accessed: r.accessed ?? '2026-10-09',
  quote: r.quote ?? '',
  notes: [r.notes, r.harness && harnessOf(r.harness) !== String(r.harness).trim() ? `harness as reported: ${r.harness}` : ''].filter(Boolean).join('; '),
}));

const existing = parseCsv(readFileSync(p('data/deepswe-1.1.csv'), 'utf8')).filter(r => r.source_type === 'official_leaderboard');
writeFileSync(p('data/deepswe-1.1.csv'), toCsv(OBS_COLUMNS, [...existing, ...rows]
  .sort((a, b) => a.model_key.localeCompare(b.model_key) || a.source_type.localeCompare(b.source_type) || String(a.effort).localeCompare(String(b.effort)))));

const models = parseCsv(readFileSync(p('data/models.csv'), 'utf8'));
const byKey = new Map(models.map(m => [m.model_key, m]));
const openWeights = new Map();
for (const r of raw) if (typeof r.open_weights === 'boolean') {
  const k = keyFor(r.model); openWeights.set(k, [...(openWeights.get(k) ?? []), r.open_weights]);
}
for (const key of new Set([...existing, ...rows].map(r => r.model_key))) {
  const m = byKey.get(key) ?? { model_key: key, display_name: nameFor(key), lab: labFor(key), open_weights: '', notes: '' };
  m.notes = '';
  const votes = openWeights.get(key) ?? [];
  if (!m.open_weights && votes.length && votes.every(v => v === votes[0])) m.open_weights = String(votes[0]);
  byKey.set(key, m);
}
const used = new Set([...existing, ...rows].map(r => r.model_key));
writeFileSync(p('data/models.csv'), toCsv(MODEL_COLUMNS, [...byKey.values()].filter(m => used.has(m.model_key)).sort((a, b) => a.model_key.localeCompare(b.model_key))));

const tally = k => rows.filter(r => r.source_type === k).length;
console.log(`raw ${raw.length}, candidates ${candidates.length}, kept ${rows.length} (lab ${tally('lab_self_reported')}, third-party ${tally('third_party_run')}, unverified ${rows.filter(r => r.verified_primary === 'false').length}); rejected ${rejected.length}`);
writeFileSync(p('research/ingest-log.txt'), [
  `kept ${rows.length} rows; rejected ${rejected.length}`,
  ...rejected.map(([r, why]) => `REJECT ${why}: ${r.model} [${r.effort ?? ''}] ${r.score_pct} ${r.source_url}`),
].join('\n') + '\n');
