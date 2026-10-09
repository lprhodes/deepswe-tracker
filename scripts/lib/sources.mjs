// The source registry: one entry per original data source, numbered once and cited everywhere.
// Every row's source_url becomes an entry; data/meta.json adds the context sources the notes cite
// (the changelog, the audits). Ids are derived from the URL so they stay stable as rows are added.

import { hashId } from '../../site/charts.mjs';

const TYPE = {
  official_leaderboard: 'Official leaderboard',
  lab_self_reported: 'Lab self-report',
  third_party_run: 'Independent run',
};
const ORDER = ['Official leaderboard', 'Official changelog', 'Official documentation', 'Official data file',
  'Lab self-report', 'Lab system card', 'Independent run', 'Independent audit', 'Discussion', 'Price list'];

const PUBLISHERS = [
  [/(^|\.)deepswe\.datacurve\.ai$/, 'Datacurve'], [/web\.archive\.org$/, 'Internet Archive (capture of the Datacurve board)'],
  [/openai\.com$/, 'OpenAI'], [/anthropic\.com$/, 'Anthropic'], [/blog\.google$|storage\.googleapis\.com$/, 'Google DeepMind'],
  [/x\.ai$/, 'xAI'], [/meta\.ai$/, 'Meta'], [/mercor\.com$/, 'Mercor'], [/artificialanalysis\.ai$/, 'Artificial Analysis'],
  [/fireworks\.ai$/, 'Fireworks AI'], [/entrpi\.github\.io$/, 'entrpi (independent)'], [/mistral\.ai$/, 'Mistral AI'],
  [/cognition\.com$/, 'Cognition'], [/poolside\.ai$/, 'Poolside'], [/reflection\.ai$/, 'Reflection AI'],
  [/xiaomi\.com$/, 'Xiaomi'], [/stepfun\.com$/, 'StepFun'], [/z\.ai$/, 'Z.ai'],
];
const HF_ORGS = { 'deepseek-ai': 'DeepSeek', 'zai-org': 'Z.ai', moonshotai: 'Moonshot AI', Qwen: 'Alibaba (Qwen)', tencent: 'Tencent' };

function publisherOf(url, rows) {
  const u = new URL(url);
  if (u.hostname === 'huggingface.co') return HF_ORGS[u.pathname.split('/')[1]] ?? u.pathname.split('/')[1];
  if (u.hostname === 'github.com') return rows[0]?.lab ?? u.pathname.split('/')[1];
  const hit = PUBLISHERS.find(([re]) => re.test(u.hostname));
  return hit ? hit[1] : rows[0]?.lab ?? u.hostname;
}

const pct = v => `${(+v).toFixed(1).replace(/\.0$/, '')}%`;
const usd = v => `$${(+v).toFixed(2)}`;

// One sentence on what this source establishes, built from the readings it carries.
function establishes(rows) {
  const byModel = new Map();
  for (const r of rows) { if (!byModel.has(r.display_name)) byModel.set(r.display_name, []); byModel.get(r.display_name).push(r); }
  const parts = [...byModel].sort((a, b) => Math.max(...b[1].map(r => r.score_pct)) - Math.max(...a[1].map(r => r.score_pct))).map(([name, rs]) => {
    const scores = rs.map(r => r.score_pct);
    const lo = Math.min(...scores), hi = Math.max(...scores);
    const effort = rs.length > 1 ? ` across ${rs.length} settings` : rs[0].effort ? ` [${rs[0].effort}]` : '';
    return `${name} ${lo === hi ? pct(hi) : `${pct(lo)}–${pct(hi)}`}${effort}`;
  });
  const shown = parts.slice(0, 6).join('; ') + (parts.length > 6 ? `; and ${parts.length - 6} more models` : '');
  const extras = [rows.some(r => r.cost_per_task_usd != null) && 'cost per task', rows.some(r => r.output_tokens_per_task != null) && 'tokens',
    rows.some(r => r.ci_pct != null) && 'confidence intervals'].filter(Boolean);
  return `Pass@1 for ${shown}${extras.length ? `, with ${extras.join(', ')}` : ''}.`;
}

export function buildSources(rows, meta) {
  const byUrl = new Map();
  for (const r of rows) { if (!byUrl.has(r.source_url)) byUrl.set(r.source_url, []); byUrl.get(r.source_url).push(r); }
  const sources = [];
  for (const [url, rs] of byUrl) {
    const names = new Map(); for (const r of rs) names.set(r.source_name, (names.get(r.source_name) || 0) + 1);
    const dates = rs.map(r => r.published).filter(Boolean).sort();
    sources.push({
      id: 'r-' + hashId(url), url,
      title: [...names].sort((a, b) => b[1] - a[1])[0][0],
      publisher: publisherOf(url, rs),
      type: TYPE[rs[0].source_type],
      published: dates[0] || '',
      accessed: rs.map(r => r.accessed).sort().at(-1),
      establishes: establishes(rs),
      readings: rs.length,
      rowIds: rs.map(r => r.row_id),
    });
  }
  for (const c of meta.context_sources || []) sources.push({ ...c, id: 'r-' + hashId(c.url), key: c.id, readings: 0, rowIds: [] });
  sources.sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type) || (a.published || '9').localeCompare(b.published || '9') || a.publisher.localeCompare(b.publisher));
  sources.forEach((s, i) => (s.n = i + 1));
  return sources;
}

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = d => (d ? new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : 'undated');

export const citeHtml = s => `<a class="cite" href="#${s.id}" data-cite="${s.id}" data-n="${s.n}" aria-describedby="${s.id}">${s.n}</a>`;

// Notes carry {{context-id}} or {{url:…}} placeholders where a source supports the sentence before it.
export function renderNotes(notes, sources) {
  const byKey = new Map(sources.filter(s => s.key).map(s => [s.key, s]));
  const byUrl = new Map(sources.map(s => [s.url, s]));
  return notes.map(n => {
    const html = esc(n).replace(/\{\{(url:)?([^}]+)\}\}/g, (_, isUrl, k) => {
      const s = isUrl ? byUrl.get(k) : byKey.get(k);
      if (!s) throw new Error(`note cites unknown source ${k}`);
      return `<sup>${citeHtml(s)}</sup>`;
    });
    return `<li>${html}</li>`;
  }).join('\n');
}

export function registryHtml(sources, rowsById) {
  return sources.map(s => {
    const back = s.rowIds.map(id => rowsById.get(id)).filter(Boolean)
      .sort((a, b) => b.score_pct - a.score_pct)
      .map(r => `<a href="#${r.row_id}">${esc(r.display_name)}${r.effort ? ` [${esc(r.effort)}]` : ''}</a>`);
    return `<li id="${s.id}" value="${s.n}">` +
      `<a class="reg-title" href="${esc(s.url)}" rel="noopener">${esc(s.title)}</a>` +
      `<span class="src">${esc(s.publisher)} · ${esc(s.type)} · published ${esc(fmtDate(s.published))} · read ${esc(fmtDate(s.accessed))}</span>` +
      `<span class="est">${esc(s.establishes)}</span>` +
      (back.length <= 12 ? (back.length ? `<span class="back">Cited by ${back.length} reading${back.length === 1 ? '' : 's'}: ${back.join(', ')}</span>` : `<span class="back">Cited in the notes above.</span>`)
        : `<span class="back">Cited by ${back.length} readings: ${back.slice(0, 12).join(', ')}, <details><summary>and ${back.length - 12} more</summary>${back.slice(12).join(', ')}</details></span>`) +
      `</li>`;
  }).join('\n');
}

export function sourcesMarkdown(sources) {
  return ['# Sources', '',
    `Every original source behind the DeepSWE 1.1 tracker, numbered as on the page. ${sources.length} sources; generated by \`npm run build\` from \`data/deepswe-1.1.csv\` and \`data/meta.json\`.`, '',
    ...sources.map(s => `${s.n}. [${s.title}](${s.url}) — ${s.publisher} · ${s.type} · published ${fmtDate(s.published)} · read ${fmtDate(s.accessed)}. ${s.establishes}${s.readings ? ` (${s.readings} reading${s.readings === 1 ? '' : 's'})` : ''}`),
    ''].join('\n');
}
