// Chart renderers shared by the build (static SVGs for the README) and the page (interactive).
// Each returns an SVG string. Every mark carries data-i (its index into the rows passed in) and
// data-k (a stable key) so the page can attach tooltips and animate marks between renders.
// Styling is by class, so one stylesheet themes light and dark.
//
// The grammar follows the official DeepSWE board so the two can be read side by side: colour is
// the lab, each model's effort levels are joined by a line, and cost runs high-to-low so the most
// efficient results sit top right. Who measured a result is the second encoding: marker shape and
// line style (official solid circle, lab claim dashed diamond, independent run dotted square).

export const SERIES = [
  { key: 'official_leaderboard', label: 'Official board', long: 'Official Datacurve leaderboard', cls: 's1', mark: 'DC' },
  { key: 'lab_self_reported', label: 'Lab claim', long: 'Reported by the model’s own lab', cls: 's2', mark: 'LAB' },
  { key: 'third_party_run', label: 'Independent run', long: 'Run by an independent third party', cls: 's3', mark: 'IND' },
];
const CLS = Object.fromEntries(SERIES.map(s => [s.key, s.cls]));

// Eight labs get a colour, in the validated slot order (blue, orange, aqua, yellow, magenta, green,
// violet, red); every other lab is grey and identified by its label. Hues follow the official board
// where the palette allows: Google blue, Anthropic orange, OpenAI green, Moonshot red.
export const LAB_SLOTS = { Google: 'l1', Anthropic: 'l2', 'Z.ai': 'l3', Alibaba: 'l4', xAI: 'l5', OpenAI: 'l6', DeepSeek: 'l7', 'Moonshot AI': 'l8' };
export const labClass = lab => LAB_SLOTS[lab] || 'l0';

export const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];
export const effortRank = e => { const i = EFFORTS.indexOf(e); return i < 0 ? -1 : i; };

export const METRICS = {
  cost: { field: 'cost_per_task_usd', label: 'Avg cost per task', short: 'Cost', noun: 'cost per task', fmt: v => fmtUsd(v) },
  output: { field: 'output_tokens_per_task', label: 'Avg output tokens per task', short: 'Output tokens', noun: 'output-token count', fmt: v => fmtCount(v) },
  steps: { field: 'steps_per_task', label: 'Avg agent steps per task', short: 'Agent steps', noun: 'agent-step count', fmt: v => fmtCount(v) },
};

const LAB_LIGHT = ['#8a908d', '#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
const LAB_DARK = ['#7d8582', '#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'];
const labVars = list => list.map((c, i) => `--l${i}:${c}`).join(';');

// Colour tokens for a standalone SVG (the README charts). The page swaps this block for one that
// points at its own tokens, so the page has a single source of colour.
export const STYLE_TOKENS = `
.viz{--v-paper:#fbfcfa;--v-ink:#14212b;--v-ink2:#44535c;--v-muted:#5f6e74;--v-grid:#e3e9e4;--v-rule:#b9c8be;${labVars(LAB_LIGHT)};font-family:Archivo,system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:where(:not([data-theme="light"])) .viz{--v-paper:#141a18;--v-ink:#e8efe9;--v-ink2:#b4c2bb;--v-muted:#93a39c;--v-grid:#222b28;--v-rule:#34423c;${labVars(LAB_DARK)}}}
:root[data-theme="dark"] .viz{--v-paper:#141a18;--v-ink:#e8efe9;--v-ink2:#b4c2bb;--v-muted:#93a39c;--v-grid:#222b28;--v-rule:#34423c;${labVars(LAB_DARK)}}
`;
export const LAB_TOKENS_LIGHT = labVars(LAB_LIGHT);
export const LAB_TOKENS_DARK = labVars(LAB_DARK);
export const STYLE_RULES = `
.viz .bg{fill:var(--v-paper)}
.viz .grid{stroke:var(--v-grid);stroke-width:1}
.viz .axis{stroke:var(--v-rule);stroke-width:1}
.viz .tick{fill:var(--v-muted);font-size:11px;font-variant-numeric:tabular-nums}
.viz .axis-title{fill:var(--v-ink2);font-size:12px}
.viz .y-title{fill:var(--v-ink);font-size:13px;font-weight:620}
.viz .title{fill:var(--v-ink);font-size:16px;font-weight:650}
.viz .sub{fill:var(--v-ink2);font-size:12px}
.viz .lbl{fill:var(--v-ink);font-size:11.5px;font-weight:600}
.viz .lbl-eff{fill:var(--v-muted);font-size:9px;letter-spacing:.08em;font-family:"Spline Sans Mono",ui-monospace,monospace}
.viz .val{fill:var(--v-ink);font-size:11px;font-weight:650;font-variant-numeric:tabular-nums}
.viz .note{fill:var(--v-muted);font-size:11px;font-style:italic}
.viz .ref{stroke:var(--v-ink2);stroke-width:1}
.viz .ref-lbl{fill:var(--v-ink2);font-size:11px}
.viz .span{stroke:var(--v-rule);stroke-width:2;stroke-linecap:round}
.viz .eline{fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round;opacity:.8}
.viz .eline.s2{stroke-dasharray:6 4} .viz .eline.s3{stroke-dasharray:1.5 4}
.viz .mk{stroke:var(--v-paper);stroke-width:2}
.viz .key{fill:var(--v-ink2)}
${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `.viz .l${i}{--c:var(--l${i})}`).join(' ')}
.viz .eline{stroke:var(--c)} .viz .mk{fill:var(--c)} .viz .sw{fill:var(--c)}
.viz .hit{fill:transparent;cursor:pointer}
.viz .hit:focus-visible{fill:transparent;stroke:var(--v-ink);stroke-width:2}
.viz .hit:hover+.mk,.viz .hit:focus-visible+.mk{stroke:var(--v-ink)}
.viz.dim .grp{opacity:.12} .viz.dim .grp.on{opacity:1} .viz.dim .grp.on .eline{opacity:1;stroke-width:3}
`;
export const STYLE = STYLE_TOKENS + STYLE_RULES;

export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const textW = (s, size = 11.5) => String(s).length * size * 0.55;
export function fmtUsd(v) {
  if (v == null) return '';
  if (v === 0) return '$0';
  if (v >= 10) return `$${v.toFixed(0)}`;
  if (v >= 0.1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(3).replace(/0$/, '')}`;
}
export function fmtCount(v) {
  if (v == null) return '';
  if (v === 0) return '0';
  if (v >= 1e6) return `${(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(v >= 1e4 ? 0 : 1)}k`;
  return String(Math.round(v));
}
export const fmtPct = v => (v == null ? '' : `${(+v).toFixed(1).replace(/\.0$/, '')}%`);
export const pointLabel = r => `${r.display_name}${r.effort ? ` [${r.effort}]` : ''}`;
export const rowKey = r => [r.model_key, r.source_type, r.effort, r.harness, r.score_pct, r.source_url].join('|');
const groupKey = r => [r.model_key, r.source_type, r.harness, r.source_url].join('|');

// Marker shape encodes who measured the result; its fill encodes the lab.
function markPath(src, lab, x, y, cls = 'mk') {
  if (src === 's2') return `<path class="${cls} ${src} ${lab}" d="M${x} ${y - 6}L${x + 6} ${y}L${x} ${y + 6}L${x - 6} ${y}Z" pointer-events="none"/>`;
  if (src === 's3') return `<rect class="${cls} ${src} ${lab}" x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" pointer-events="none"/>`;
  return `<circle class="${cls} ${src} ${lab}" cx="${x}" cy="${y}" r="5" pointer-events="none"/>`;
}
function mark(r, i, x, y) {
  const fx = x.toFixed(1), fy = y.toFixed(1);
  return `<g class="pt" data-k="${esc(rowKey(r))}" data-x="${fx}" data-y="${fy}"><circle class="hit" data-i="${i}" tabindex="0" cx="${fx}" cy="${fy}" r="12"><title>${esc(pointLabel(r))}: ${fmtPct(r.score_pct)}</title></circle>${markPath(CLS[r.source_type], labClass(r.lab), +fx, +fy)}</g>`;
}

function open(w, h, id, title, desc, embedStyle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="viz" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="${id}-t ${id}-d">` +
    `<title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(desc)}</desc>` +
    (embedStyle ? `<style>${STYLE}</style>` : '') +
    `<rect class="bg" width="${w}" height="${h}"/>`;
}

// Two keys: shapes for who measured it (neutral ink), swatches for each lab present.
function legend(x, y, rows) {
  let out = '', cx = x;
  const present = new Set(rows.map(r => r.source_type));
  for (const s of SERIES.filter(s => present.has(s.key))) {
    out += markPath(s.cls, '', cx + 6, y - 4, 'key') + `<text class="tick" x="${cx + 16}" y="${y}">${esc(s.label)}</text>`;
    cx += 16 + textW(s.label, 11) + 20;
  }
  const labs = new Set(rows.map(r => r.lab));
  const named = Object.keys(LAB_SLOTS).filter(l => labs.has(l));
  const others = [...labs].some(l => !LAB_SLOTS[l]);
  cx += 12;
  for (const l of [...named, ...(others ? ['Other labs'] : [])]) {
    out += `<rect class="sw ${l === 'Other labs' ? 'l0' : labClass(l)}" x="${cx}" y="${y - 9}" width="10" height="10" rx="2"/><text class="tick" x="${cx + 14}" y="${y}">${esc(l)}</text>`;
    cx += 14 + textW(l, 11) + 14;
  }
  return out;
}

function yAxis(y0, y1, sy, left, right) {
  let out = '';
  for (let v = y0; v <= y1; v += 10) {
    const y = sy(v).toFixed(1);
    out += `<line class="grid" x1="${left}" x2="${right}" y1="${y}" y2="${y}"/><text class="tick" x="${left - 10}" y="${+y + 4}" text-anchor="end">${v}%</text>`;
  }
  return out;
}
const scoreTop = rows => Math.min(100, Math.ceil((Math.max(...rows.map(r => r.score_pct)) + 3) / 10) * 10);
const LOG_TICKS = [0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500, 1e3, 2.5e3, 5e3, 1e4, 2.5e4, 5e4, 1e5, 2.5e5, 5e5, 1e6, 2.5e6, 5e6, 1e7, 2.5e7, 5e7, 1e8];
function niceStep(max, target = 6) {
  const raw = max / target, p = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 2.5, 5, 10].map(m => m * p).find(s => s >= raw);
}

// Greedy label placement around a point. A label that collides with a placed label, any mark or the
// plot edge is dropped; its value stays in the tooltip and the table.
function placeLabels(items, bounds, marks) {
  const placed = [];
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  let out = '';
  for (const it of items) {
    const w = Math.max(textW(it.text), it.sub ? textW(it.sub, 9) + 6 : 0), h = it.sub ? 24 : 13;
    // Nearest first: above, beside and below the point, then the diagonals, at growing distances.
    const tries = [];
    for (const d of [8, 18, 30]) tries.push(
      { x: it.cx - w / 2, y: it.cy - d - h }, { x: it.cx + d, y: it.cy - h / 2 }, { x: it.cx - d - w, y: it.cy - h / 2 },
      { x: it.cx - w / 2, y: it.cy + d }, { x: it.cx + d * 0.7, y: it.cy - d * 0.7 - h }, { x: it.cx - d * 0.7 - w, y: it.cy - d * 0.7 - h },
      { x: it.cx + d * 0.7, y: it.cy + d * 0.7 }, { x: it.cx - d * 0.7 - w, y: it.cy + d * 0.7 });
    for (const t of tries) {
      const box = { x: t.x - 1, y: t.y - 1, w: w + 2, h: h + 2 };
      if (box.x < bounds.left || box.x + box.w > bounds.right || box.y < bounds.top || box.y + box.h > bounds.bottom) continue;
      if (placed.some(p => hit(p, box)) || marks.some(p => hit(p, box))) continue;
      placed.push(box);
      out += `<g class="glbl" data-g="${esc(it.g)}"><text class="lbl" x="${(t.x + w / 2).toFixed(1)}" y="${(t.y + 10).toFixed(1)}" text-anchor="middle">${esc(it.text)}</text>` +
        (it.sub ? `<text class="lbl-eff" x="${(t.x + w / 2).toFixed(1)}" y="${(t.y + 21).toFixed(1)}" text-anchor="middle">${esc(it.sub)}</text>` : '') + '</g>';
      break;
    }
  }
  return out;
}

export function frontier(rows, field) {
  const sorted = [...rows].sort((a, b) => a[field] - b[field] || b.score_pct - a.score_pct);
  const out = []; let best = -Infinity;
  for (const r of sorted) if (r.score_pct > best) { out.push(r); best = r.score_pct; }
  return out;
}

// Score against a per-task measure, drawn like the official board: y is the DeepSWE score from 0,
// x runs from the most expensive on the left to zero on the right (linear, or log when asked), and
// each model's effort levels are joined in order from low to max.
export function effortScatter(rows, { metric = 'cost', scale = 'linear', embedStyle = false, width = 1080, height = 660, id = 'sc', labelTop = 20 } = {}) {
  const M = METRICS[metric];
  const pts = rows.map((r, i) => ({ r, i })).filter(p => p.r[M.field] > 0);
  const title = `DeepSWE 1.1 score against ${M.noun}`;
  const desc = `Scatter of ${pts.length} results: pass@1 on the vertical axis, ${M.label.toLowerCase()} on the horizontal from highest at left to lowest at right; each model’s effort levels are joined in order from low to max.`;
  if (!pts.length) return open(width, 120, id, title, 'No results with this measure.', embedStyle) + `<text class="sub" x="24" y="64">No results in this selection report a ${esc(M.noun)}.</text></svg>`;
  const m = { left: 60, right: 28, top: embedStyle ? 112 : 44, bottom: 56 };
  const right = width - m.right, bottom = height - m.bottom;
  const vals = pts.map(p => p.r[M.field]);
  let sx, ticks;
  if (scale === 'log') {
    const lx0 = Math.log10(Math.min(...vals) / 1.35), lx1 = Math.log10(Math.max(...vals) * 1.35);
    sx = v => right - (Math.log10(v) - lx0) / (lx1 - lx0) * (right - m.left);
    const all = LOG_TICKS.filter(t => Math.log10(t) >= lx0 && Math.log10(t) <= lx1);
    ticks = all.filter((_, k) => k % Math.ceil(all.length / 8) === 0);
  } else {
    const step = niceStep(Math.max(...vals));
    const max = Math.ceil(Math.max(...vals) * 1.04 / step) * step;
    sx = v => right - (v / max) * (right - m.left);
    ticks = []; for (let t = 0; t <= max + 1e-9; t += step) ticks.push(+t.toFixed(6));
  }
  const y1 = scoreTop(pts.map(p => p.r));
  const sy = v => bottom - (v / y1) * (bottom - m.top);
  let svg = open(width, height, id, title, desc, embedStyle);
  if (embedStyle) {
    svg += `<text class="title" x="24" y="32">${esc(title)}</text><text class="sub" x="24" y="52">Lines join each model’s effort levels from low to max, as on the official board. Colour is the lab; shape is who measured it.</text>`;
    svg += legend(24, 80, pts.map(p => p.r));
  }
  svg += `<text class="y-title" x="${m.left}" y="${m.top - 18}">DeepSWE score</text>`;
  svg += `<text class="note" x="${right}" y="${m.top - 18}" text-anchor="end">most efficient ↗</text>`;
  svg += yAxis(0, y1, sy, m.left, right);
  for (const t of ticks) {
    const x = sx(t).toFixed(1);
    svg += `<line class="grid" x1="${x}" x2="${x}" y1="${m.top}" y2="${bottom}"/><text class="tick" x="${x}" y="${bottom + 18}" text-anchor="middle">${esc(M.fmt(t))}</text>`;
  }
  svg += `<line class="axis" x1="${m.left}" x2="${right}" y1="${bottom}" y2="${bottom}"/>`;
  svg += `<text class="axis-title" x="${(m.left + right) / 2}" y="${height - 12}" text-anchor="middle">${esc(M.label)}${scale === 'log' ? ' (log scale)' : ''}</text>`;

  const placed = pts.map(p => ({ ...p, cx: sx(p.r[M.field]), cy: sy(p.r.score_pct), g: groupKey(p.r) }));
  const groups = new Map();
  for (const p of placed) { if (!groups.has(p.g)) groups.set(p.g, []); groups.get(p.g).push(p); }
  for (const [g, ps] of groups) {
    const laddered = ps.filter(p => effortRank(p.r.effort) >= 0).sort((a, b) => effortRank(a.r.effort) - effortRank(b.r.effort));
    svg += `<g class="grp" data-g="${esc(g)}" data-model="${esc(ps[0].r.model_key)}">`;
    if (laddered.length > 1) svg += `<path class="eline ${CLS[ps[0].r.source_type]} ${labClass(ps[0].r.lab)}" d="M${laddered.map(p => `${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`).join('L')}"/>`;
    for (const p of ps) svg += mark(p.r, p.i, p.cx, p.cy);
    svg += '</g>';
  }
  // Labels as on the official board: the model's name over its best point, its effort beneath.
  const front = new Set(frontier(placed.map(p => p.r), M.field));
  const bestOf = [...groups.values()].map(ps => ps.reduce((a, b) => (b.r.score_pct > a.r.score_pct ? b : a)));
  const want = [...new Set([...bestOf.sort((a, b) => b.r.score_pct - a.r.score_pct).slice(0, labelTop), ...placed.filter(p => front.has(p.r))])];
  const items = want.sort((a, b) => b.r.score_pct - a.r.score_pct).map(p => ({ cx: p.cx, cy: p.cy, g: p.g, text: p.r.display_name, sub: (p.r.effort || '').toUpperCase() + (p.r.source_type === 'lab_self_reported' ? ' · LAB CLAIM' : p.r.source_type === 'third_party_run' ? ' · INDEPENDENT' : '') }));
  svg += placeLabels(items, { left: m.left, right, top: m.top, bottom }, placed.map(p => ({ x: p.cx - 6, y: p.cy - 6, w: 12, h: 12 })));
  return svg + '</svg>';
}

export function timeline(rows, { embedStyle = false, width = 1080, height = 420, marker = null, asOf, id = 'tl' } = {}) {
  const pts = rows.map((r, i) => ({ r, i })).filter(p => p.r.published);
  const title = 'DeepSWE 1.1 results by publication date';
  const desc = `Each of ${pts.length} dated results placed on the day its score was published; colour is the lab, shape is who measured it.`;
  if (!pts.length) return open(width, 120, id, title, desc, embedStyle) + `<text class="sub" x="24" y="64">No dated results in this selection.</text></svg>`;
  const m = { left: 60, right: 24, top: embedStyle ? 112 : 24, bottom: 44 };
  const right = width - m.right, bottom = height - m.bottom;
  const t = d => Date.parse(d + 'T00:00:00Z');
  const day = 864e5;
  const dates = pts.map(p => t(p.r.published));
  const x0 = Math.min(...dates) - 5 * day, x1 = Math.max(t(asOf || '1970-01-01'), ...dates) + 5 * day;
  const sx = v => m.left + (v - x0) / (x1 - x0) * (right - m.left);
  const y1 = scoreTop(pts.map(p => p.r));
  const sy = v => bottom - (v / y1) * (bottom - m.top);
  let svg = open(width, height, id, title, desc, embedStyle);
  if (embedStyle) {
    svg += `<text class="title" x="24" y="32">${esc(title)}</text><text class="sub" x="24" y="52">Each point is one model at one effort level, on the date its score was published.</text>`;
    svg += legend(24, 80, pts.map(p => p.r));
  }
  svg += yAxis(0, y1, sy, m.left, right);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(x0); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() + 1);
  for (; d.getTime() <= x1; d.setUTCMonth(d.getUTCMonth() + 1)) {
    const x = sx(d.getTime()).toFixed(1);
    svg += `<line class="grid" x1="${x}" x2="${x}" y1="${m.top}" y2="${bottom}"/><text class="tick" x="${x}" y="${bottom + 18}" text-anchor="middle">1 ${months[d.getUTCMonth()]}</text>`;
  }
  svg += `<line class="axis" x1="${m.left}" x2="${right}" y1="${bottom}" y2="${bottom}"/>`;
  if (marker) {
    const mx = sx(t(marker.date)).toFixed(1);
    svg += `<line class="ref" x1="${mx}" x2="${mx}" y1="${m.top}" y2="${bottom}"/><text class="ref-lbl" x="${+mx - 6}" y="${bottom - 8}" text-anchor="end">${esc(marker.label)}</text>`;
  }
  for (const p of pts) svg += mark(p.r, p.i, sx(t(p.r.published)), sy(p.r.score_pct));
  return svg + '</svg>';
}

// One row per model: its best official, lab-claimed and independent score, joined by a rule, so
// the distance between a lab's claim and an independent re-run is the thing you see.
export function spreadPlot(rows, { embedStyle = false, width = 1080, id = 'sp', onlyMulti = false } = {}) {
  const byModel = new Map();
  rows.forEach((r, i) => {
    if (!byModel.has(r.model_key)) byModel.set(r.model_key, { name: r.display_name, key: r.model_key, best: {} });
    const b = byModel.get(r.model_key).best;
    if (b[r.source_type] == null || rows[b[r.source_type]].score_pct < r.score_pct) b[r.source_type] = i;
  });
  let models = [...byModel.values()].map(mo => ({ ...mo, top: Math.max(...Object.values(mo.best).map(i => rows[i].score_pct)) }));
  if (onlyMulti) models = models.filter(mo => Object.keys(mo.best).length > 1);
  models.sort((a, b) => b.top - a.top);
  const rowH = 24;
  const m = { left: 200, right: 64, top: embedStyle ? 112 : 16, bottom: 40 };
  const height = m.top + models.length * rowH + m.bottom;
  const right = width - m.right, bottom = height - m.bottom;
  const title = 'Best DeepSWE 1.1 score per model, by who measured it';
  const desc = `${models.length} models; for each, the best official, lab-claimed and independent pass@1 at any effort level.`;
  if (!models.length) return open(width, 120, id, title, desc, embedStyle) + `<text class="sub" x="24" y="64">No models in this selection.</text></svg>`;
  const sx = v => m.left + (v / 100) * (right - m.left);
  let svg = open(width, height, id, title, desc, embedStyle);
  if (embedStyle) {
    svg += `<text class="title" x="24" y="32">${esc(title)}</text><text class="sub" x="24" y="52">The rule spans the gap between sources for the same model. Colour is the lab; shape is who measured it.</text>`;
    svg += legend(24, 80, rows);
  }
  for (let v = 0; v <= 100; v += 10) {
    const x = sx(v).toFixed(1);
    svg += `<line class="grid" x1="${x}" x2="${x}" y1="${m.top - 6}" y2="${bottom}"/><text class="tick" x="${x}" y="${bottom + 18}" text-anchor="middle">${v}%</text>`;
  }
  models.forEach((mo, k) => {
    const cy = m.top + k * rowH + rowH / 2;
    const idx = Object.values(mo.best);
    const xs = idx.map(i => sx(rows[i].score_pct));
    const name = mo.name.length > 28 ? mo.name.slice(0, 27) + '…' : mo.name;
    svg += `<g class="grp" data-model="${esc(mo.key)}"><text class="lbl" x="${m.left - 14}" y="${cy + 4}" text-anchor="end">${esc(name)}</text>`;
    if (xs.length > 1) svg += `<line class="span" x1="${Math.min(...xs).toFixed(1)}" x2="${Math.max(...xs).toFixed(1)}" y1="${cy}" y2="${cy}"/>`;
    for (const s of SERIES) if (s.key in mo.best) { const i = mo.best[s.key]; svg += mark(rows[i], i, sx(rows[i].score_pct), cy); }
    svg += `<text class="val" x="${(Math.max(...xs) + 12).toFixed(1)}" y="${cy + 4}">${fmtPct(mo.top)}</text></g>`;
  });
  return svg + '</svg>';
}

// ---------- readings table, shared by the build (pre-rendered, works without script) and the page ----------

// Stable short id from a string (FNV-1a), for row and source anchors that survive re-sorting.
export function hashId(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}

export function shapeSvg(cls) {
  const shape = cls === 's2' ? '<path d="M6 0L12 6L6 12L0 6Z" fill="currentColor"/>' : cls === 's3' ? '<rect x="1.5" y="1.5" width="9" height="9" fill="currentColor"/>' : '<circle cx="6" cy="6" r="5" fill="currentColor"/>';
  return `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">${shape}</svg>`;
}

const fmtDay = d => (d ? new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
// Eight columns sized to fit the content width without scrolling; each carries a class so narrow
// screens can fold the lowest-priority ones (the model cell repeats effort when its column folds).
export const TABLE_COLS = [
  ['rank', '#', 'n c-rank'], ['display_name', 'Model', 'c-model'], ['effort', 'Effort', 'c-eff'],
  ['source_type', 'Measured by', 'c-src'], ['score_pct', 'Pass@1', 'c-score'], ['cost_per_task_usd', 'Cost / task', 'n c-cost'],
  ['output_tokens_per_task', 'Usage per task', 'n c-use'], ['published', 'Published', 'n c-pub'],
];
export const TABLE_SORTABLE = new Set(['display_name', 'effort', 'source_type', 'score_pct', 'cost_per_task_usd', 'output_tokens_per_task', 'steps_per_task', 'published']);

export function theadHtml(sort) {
  return '<tr>' + TABLE_COLS.map(([k, label, cls]) => {
    const aria = sort && k === sort.key ? ` aria-sort="${sort.dir > 0 ? 'ascending' : 'descending'}"` : '';
    const inner = TABLE_SORTABLE.has(k) ? `<button type="button" data-sort="${k}">${label}</button>` : label;
    return `<th scope="col" class="${cls || ''}"${aria}>${inner}</th>`;
  }).join('') + '</tr>';
}

// One reading. The pass@1 figure carries its citation marker: an anchor into the source registry,
// so the claim-to-source link works with no script at all; the page layers a preview on top.
export function readingRowHtml(r, rank, src) {
  const s = SERIES.find(x => x.key === r.source_type);
  const na = t => `<span class="na">${t}</span>`;
  const ci = r.ci_pct != null
    ? `<div class="ci" style="left:${Math.max(0, r.score_pct - r.ci_pct)}%;width:${Math.min(100, r.score_pct + r.ci_pct) - Math.max(0, r.score_pct - r.ci_pct)}%"></div>` : '';
  // Attribute names held in a constant so this template is not itself read as a marker by tools
  // that scan the page source for data-cite.
  const CITE = 'data-cite';
  const cite = src ? `<a class="cite" href="#${src.id}" ${CITE}="${src.id}" data-n="${src.n}" aria-describedby="${src.id}">${src.n}</a>` : '';
  const usage = [r.output_tokens_per_task != null && `${fmtCount(r.output_tokens_per_task)} out tok`, r.steps_per_task != null && `${fmtCount(r.steps_per_task)} steps`].filter(Boolean);
  return `<tr id="${r.row_id}" data-flip-id="${r.row_id}" data-model="${esc(r.model_key)}">` +
    `<td class="n na c-rank">${rank}</td>` +
    `<td class="c-model"><span class="name">${esc(r.display_name)}</span>` +
      `<span class="id">${esc(r.lab)}${r.harness ? `<span class="hsep"> · <span class="h">${esc(r.harness)}</span></span>` : ''}<span class="eff-inline">${r.effort ? ' · ' + esc(r.effort) : ''}</span></span></td>` +
    `<td class="c-eff"><span class="eff">${esc(r.effort || '—')}</span></td>` +
    `<td class="c-src"><span class="hall ${s.cls}">${shapeSvg(s.cls)}${s.mark}</span><span class="via">${esc(src ? src.publisher : r.source_name)}</span></td>` +
    `<td class="c-score"><span class="sv">${fmtPct(r.score_pct)}${r.ci_pct != null ? `<small> ±${r.ci_pct}</small>` : ''}<sup>${cite}</sup></span>` +
      `<div class="bar" role="img" aria-label="${fmtPct(r.score_pct)}${r.ci_pct != null ? ` plus or minus ${r.ci_pct}` : ''}"><div class="track"></div><div class="fill ${labClass(r.lab)}" style="width:${r.score_pct}%"></div>${ci}</div></td>` +
    `<td class="n c-cost">${r.cost_per_task_usd != null ? fmtUsd(r.cost_per_task_usd) : na('not given')}</td>` +
    `<td class="n c-use">${usage.length ? usage.join('<br>') : na('not given')}</td>` +
    `<td class="n c-pub">${r.published ? fmtDay(r.published) : na('not given')}</td></tr>`;
}
