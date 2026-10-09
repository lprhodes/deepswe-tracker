// Chart renderers shared by the build (static SVGs for the README) and the page (interactive).
// Each returns an SVG string. Every mark carries data-i (its index into the rows passed in) and
// data-k (a stable key) so the page can attach tooltips and animate marks between renders.
// Styling is by class, so one stylesheet themes light and dark.

export const SERIES = [
  { key: 'official_leaderboard', label: 'Official board', long: 'Official Datacurve leaderboard', cls: 's1', mark: 'DC' },
  { key: 'lab_self_reported', label: 'Lab claim', long: 'Reported by the model’s own lab', cls: 's2', mark: 'LAB' },
  { key: 'third_party_run', label: 'Independent run', long: 'Run by an independent third party', cls: 's3', mark: 'IND' },
];
const CLS = Object.fromEntries(SERIES.map(s => [s.key, s.cls]));

export const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];
export const effortRank = e => { const i = EFFORTS.indexOf(e); return i < 0 ? -1 : i; };

export const METRICS = {
  cost: { field: 'cost_per_task_usd', label: 'Cost per task (USD, log scale)', short: 'Cost / task', noun: 'cost per task', fmt: v => fmtUsd(v) },
  output: { field: 'output_tokens_per_task', label: 'Output tokens per task (log scale)', short: 'Output tokens', noun: 'output-token count', fmt: v => fmtCount(v) },
  steps: { field: 'steps_per_task', label: 'Agent steps per task (log scale)', short: 'Agent steps', noun: 'agent-step count', fmt: v => fmtCount(v) },
};

// Colour tokens for a standalone SVG (the README charts). The page swaps this block for one that
// points at its own tokens, so the page has a single source of colour.
export const STYLE_TOKENS = `
.viz{--v-paper:#f3f6f1;--v-ink:#14212b;--v-ink2:#44535c;--v-muted:#5f6e74;--v-grid:#dde6df;--v-rule:#b9c8be;--s1:#2453a6;--s2:#d4502a;--s3:#118a6c;font-family:Archivo,system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:where(:not([data-theme="light"])) .viz{--v-paper:#141a18;--v-ink:#e8efe9;--v-ink2:#b4c2bb;--v-muted:#93a39c;--v-grid:#222b28;--v-rule:#34423c;--s1:#5b8be0;--s2:#e8693f;--s3:#28a682}}
:root[data-theme="dark"] .viz{--v-paper:#141a18;--v-ink:#e8efe9;--v-ink2:#b4c2bb;--v-muted:#93a39c;--v-grid:#222b28;--v-rule:#34423c;--s1:#5b8be0;--s2:#e8693f;--s3:#28a682}
`;
export const STYLE_RULES = `
.viz .bg{fill:var(--v-paper)}
.viz .grid{stroke:var(--v-grid);stroke-width:1}
.viz .axis{stroke:var(--v-rule);stroke-width:1}
.viz .tick{fill:var(--v-muted);font-size:11px;font-variant-numeric:tabular-nums}
.viz .axis-title{fill:var(--v-ink2);font-size:12px}
.viz .title{fill:var(--v-ink);font-size:16px;font-weight:650}
.viz .sub{fill:var(--v-ink2);font-size:12px}
.viz .lbl{fill:var(--v-ink);font-size:11.5px;font-weight:560}
.viz .lbl-eff{fill:var(--v-muted);font-size:9px;letter-spacing:.08em;font-family:"Spline Sans Mono",ui-monospace,monospace}
.viz .val{fill:var(--v-ink);font-size:11px;font-weight:650;font-variant-numeric:tabular-nums}
.viz .ref{stroke:var(--v-ink2);stroke-width:1}
.viz .ref-lbl{fill:var(--v-ink2);font-size:11px}
.viz .span{stroke:var(--v-rule);stroke-width:2;stroke-linecap:round}
.viz .eline{fill:none;stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round;opacity:.55}
.viz .eline.s1{stroke:var(--s1)} .viz .eline.s2{stroke:var(--s2)} .viz .eline.s3{stroke:var(--s3)}
.viz .mk{stroke:var(--v-paper);stroke-width:2}
.viz .mk.s1{fill:var(--s1)} .viz .mk.s2{fill:var(--s2)} .viz .mk.s3{fill:var(--s3)}
.viz .hit{fill:transparent;cursor:pointer}
.viz .hit:focus-visible{fill:transparent;stroke:var(--v-ink);stroke-width:2}
.viz .hit:hover+.mk,.viz .hit:focus-visible+.mk{stroke:var(--v-ink)}
.viz.dim .grp{opacity:.14} .viz.dim .grp.on{opacity:1} .viz.dim .grp.on .eline{opacity:1;stroke-width:2.5}
`;
export const STYLE = STYLE_TOKENS + STYLE_RULES;

export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const textW = (s, size = 11.5) => String(s).length * size * 0.53;
export function fmtUsd(v) {
  if (v == null) return '';
  if (v >= 10) return `$${v.toFixed(0)}`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  if (v >= 0.1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(3).replace(/0$/, '')}`;
}
export function fmtCount(v) {
  if (v == null) return '';
  if (v >= 1e6) return `${(v / 1e6).toFixed(v >= 1e7 ? 0 : 1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(v >= 1e4 ? 0 : 1)}k`;
  return String(Math.round(v));
}
export const fmtPct = v => (v == null ? '' : `${(+v).toFixed(1).replace(/\.0$/, '')}%`);
export const pointLabel = r => `${r.display_name}${r.effort ? ` [${r.effort}]` : ''}`;
export const rowKey = r => [r.model_key, r.source_type, r.effort, r.harness, r.score_pct, r.source_url].join('|');
const groupKey = r => [r.model_key, r.source_type, r.harness, r.source_url].join('|');

// Mark shapes are the second encoding of source, so identity survives without colour.
function markPath(type, x, y) {
  if (type === 's2') return `<path class="mk s2" d="M${x} ${y - 6}L${x + 6} ${y}L${x} ${y + 6}L${x - 6} ${y}Z" pointer-events="none"/>`;
  if (type === 's3') return `<rect class="mk s3" x="${x - 4.5}" y="${y - 4.5}" width="9" height="9" pointer-events="none"/>`;
  return `<circle class="mk s1" cx="${x}" cy="${y}" r="5" pointer-events="none"/>`;
}
function mark(r, i, x, y) {
  const c = CLS[r.source_type];
  const fx = x.toFixed(1), fy = y.toFixed(1);
  return `<g class="pt" data-k="${esc(rowKey(r))}" data-x="${fx}" data-y="${fy}"><circle class="hit" data-i="${i}" tabindex="0" cx="${fx}" cy="${fy}" r="12"><title>${esc(pointLabel(r))}: ${fmtPct(r.score_pct)}</title></circle>${markPath(c, +fx, +fy)}</g>`;
}

function open(w, h, id, title, desc, embedStyle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="viz" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="${id}-t ${id}-d">` +
    `<title id="${id}-t">${esc(title)}</title><desc id="${id}-d">${esc(desc)}</desc>` +
    (embedStyle ? `<style>${STYLE}</style>` : '') +
    `<rect class="bg" width="${w}" height="${h}"/>`;
}

function legend(x, y, present) {
  let out = '', cx = x;
  for (const s of SERIES.filter(s => present.has(s.key))) {
    out += markPath(s.cls, cx + 6, y - 4) + `<text class="tick" x="${cx + 16}" y="${y}">${esc(s.long)}</text>`;
    cx += 16 + textW(s.long, 11) + 24;
  }
  return out;
}

function scoreDomain(rows) {
  const s = rows.map(r => r.score_pct);
  return [Math.max(0, Math.floor((Math.min(...s) - 2) / 10) * 10), Math.min(100, Math.ceil((Math.max(...s) + 2) / 10) * 10)];
}
function yAxis(y0, y1, sy, left, right) {
  let out = '';
  for (let v = y0; v <= y1; v += 10) {
    const y = sy(v).toFixed(1);
    out += `<line class="grid" x1="${left}" x2="${right}" y1="${y}" y2="${y}"/><text class="tick" x="${left - 10}" y="${+y + 4}" text-anchor="end">${v}%</text>`;
  }
  return out;
}
const LOG_TICKS = [0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 100, 250, 500, 1e3, 2.5e3, 5e3, 1e4, 2.5e4, 5e4, 1e5, 2.5e5, 5e5, 1e6, 2.5e6, 5e6, 1e7, 2.5e7, 5e7, 1e8];

// Greedy label placement around a point: right, left, above, below. A label that collides with a
// placed label, any mark or the plot edge is dropped; its value stays in the tooltip and table.
function placeLabels(items, bounds, marks) {
  const placed = [];
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  let out = '';
  for (const it of items) {
    const w = Math.max(textW(it.text), it.sub ? textW(it.sub, 9) + 6 : 0), h = it.sub ? 24 : 13;
    const tries = [
      { x: it.cx + 9, y: it.cy - h / 2 }, { x: it.cx - 9 - w, y: it.cy - h / 2 },
      { x: it.cx - w / 2, y: it.cy - 10 - h }, { x: it.cx - w / 2, y: it.cy + 10 },
      { x: it.cx + 7, y: it.cy - 7 - h }, { x: it.cx + 7, y: it.cy + 7 },
      { x: it.cx - 7 - w, y: it.cy - 7 - h }, { x: it.cx - 7 - w, y: it.cy + 7 },
    ];
    for (const t of tries) {
      const box = { x: t.x - 1, y: t.y - 1, w: w + 2, h: h + 2 };
      if (box.x < bounds.left || box.x + box.w > bounds.right || box.y < bounds.top || box.y + box.h > bounds.bottom) continue;
      if (placed.some(p => hit(p, box)) || marks.some(p => hit(p, box))) continue;
      placed.push(box);
      out += `<g class="glbl" data-g="${esc(it.g)}"><text class="lbl" x="${t.x.toFixed(1)}" y="${(t.y + 10).toFixed(1)}">${esc(it.text)}</text>` +
        (it.sub ? `<text class="lbl-eff" x="${t.x.toFixed(1)}" y="${(t.y + 21).toFixed(1)}">${esc(it.sub)}</text>` : '') + '</g>';
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

// Score against a per-task metric. Each (model, source, harness) with two or more effort levels is
// drawn as a line through its efforts in order, the way the official board draws them.
export function effortScatter(rows, { metric = 'cost', embedStyle = false, width = 1080, height = 600, id = 'sc', labelTop = 12 } = {}) {
  const M = METRICS[metric];
  const pts = rows.map((r, i) => ({ r, i })).filter(p => p.r[M.field] > 0);
  const title = `DeepSWE 1.1 pass@1 against ${M.noun}`;
  const desc = `Scatter of ${pts.length} results: pass@1 on the vertical axis, ${M.label.toLowerCase()} on the horizontal; each model’s effort levels are joined in order from low to max.`;
  if (!pts.length) return open(width, 120, id, title, 'No results with this measure.', embedStyle) + `<text class="sub" x="24" y="64">No results in this selection report a ${esc(M.noun)}.</text></svg>`;
  const m = { left: 60, right: 24, top: embedStyle ? 92 : 24, bottom: 54 };
  const right = width - m.right, bottom = height - m.bottom;
  const vals = pts.map(p => p.r[M.field]);
  const lx0 = Math.log10(Math.min(...vals) / 1.35), lx1 = Math.log10(Math.max(...vals) * 1.35);
  const sx = v => m.left + (Math.log10(v) - lx0) / (lx1 - lx0) * (right - m.left);
  const [y0, y1] = scoreDomain(pts.map(p => p.r));
  const sy = v => bottom - (v - y0) / (y1 - y0) * (bottom - m.top);
  let svg = open(width, height, id, title, desc, embedStyle);
  if (embedStyle) {
    svg += `<text class="title" x="24" y="34">${esc(title)}</text><text class="sub" x="24" y="54">Each line joins one model’s effort levels from low to max. Labelled points are the best result per model and the cost frontier.</text>`;
    svg += legend(24, 78, new Set(pts.map(p => p.r.source_type)));
  }
  svg += yAxis(y0, y1, sy, m.left, right);
  const ticks = LOG_TICKS.filter(t => Math.log10(t) >= lx0 && Math.log10(t) <= lx1);
  const step = Math.ceil(ticks.length / 9);
  ticks.filter((_, k) => k % step === 0).forEach(t => {
    const x = sx(t).toFixed(1);
    svg += `<line class="grid" x1="${x}" x2="${x}" y1="${m.top}" y2="${bottom}"/><text class="tick" x="${x}" y="${bottom + 18}" text-anchor="middle">${esc(M.fmt(t))}</text>`;
  });
  svg += `<line class="axis" x1="${m.left}" x2="${right}" y1="${bottom}" y2="${bottom}"/>`;
  svg += `<text class="axis-title" x="${(m.left + right) / 2}" y="${height - 12}" text-anchor="middle">${esc(M.label)}</text>`;
  svg += `<text class="axis-title" x="${m.left + 8}" y="${m.top + 14}">↖ higher score for less</text>`;

  const placed = pts.map(p => ({ ...p, cx: sx(p.r[M.field]), cy: sy(p.r.score_pct), g: groupKey(p.r) }));
  const groups = new Map();
  for (const p of placed) { if (!groups.has(p.g)) groups.set(p.g, []); groups.get(p.g).push(p); }
  for (const [g, ps] of groups) {
    const laddered = ps.filter(p => effortRank(p.r.effort) >= 0).sort((a, b) => effortRank(a.r.effort) - effortRank(b.r.effort));
    svg += `<g class="grp" data-g="${esc(g)}" data-model="${esc(ps[0].r.model_key)}">`;
    if (laddered.length > 1) svg += `<path class="eline ${CLS[ps[0].r.source_type]}" d="M${laddered.map(p => `${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`).join('L')}"/>`;
    for (const p of ps) svg += mark(p.r, p.i, p.cx, p.cy);
    svg += '</g>';
  }
  // Labels: each group's best point, highest scores first, plus the cost frontier.
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
  const desc = `Each of ${pts.length} dated results placed on the day its score was published, by source.`;
  if (!pts.length) return open(width, 120, id, title, desc, embedStyle) + `<text class="sub" x="24" y="64">No dated results in this selection.</text></svg>`;
  const m = { left: 60, right: 24, top: embedStyle ? 92 : 24, bottom: 44 };
  const right = width - m.right, bottom = height - m.bottom;
  const t = d => Date.parse(d + 'T00:00:00Z');
  const day = 864e5;
  const dates = pts.map(p => t(p.r.published));
  const x0 = Math.min(...dates) - 5 * day, x1 = Math.max(t(asOf || '1970-01-01'), ...dates) + 5 * day;
  const sx = v => m.left + (v - x0) / (x1 - x0) * (right - m.left);
  const [y0, y1] = scoreDomain(pts.map(p => p.r));
  const sy = v => bottom - (v - y0) / (y1 - y0) * (bottom - m.top);
  let svg = open(width, height, id, title, desc, embedStyle);
  if (embedStyle) {
    svg += `<text class="title" x="24" y="34">${esc(title)}</text><text class="sub" x="24" y="54">Each point is one model at one effort level, on the date its score was published.</text>`;
    svg += legend(24, 78, new Set(pts.map(p => p.r.source_type)));
  }
  svg += yAxis(y0, y1, sy, m.left, right);
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
  const m = { left: 200, right: 64, top: embedStyle ? 92 : 16, bottom: 40 };
  const height = m.top + models.length * rowH + m.bottom;
  const right = width - m.right, bottom = height - m.bottom;
  const title = 'Best DeepSWE 1.1 score per model, by who measured it';
  const desc = `${models.length} models; for each, the best official, lab-claimed and independent pass@1 at any effort level.`;
  if (!models.length) return open(width, 120, id, title, desc, embedStyle) + `<text class="sub" x="24" y="64">No models in this selection.</text></svg>`;
  const x0 = 0, x1 = 100;
  const sx = v => m.left + (v - x0) / (x1 - x0) * (right - m.left);
  let svg = open(width, height, id, title, desc, embedStyle);
  if (embedStyle) {
    svg += `<text class="title" x="24" y="34">${esc(title)}</text><text class="sub" x="24" y="54">The rule spans the gap between sources for the same model.</text>`;
    svg += legend(24, 78, new Set(rows.map(r => r.source_type)));
  }
  for (let v = x0; v <= x1; v += 10) {
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
  const shape = cls === 's2' ? '<path d="M6 0L12 6L6 12L0 6Z" fill="var(--s2)"/>' : cls === 's3' ? '<rect x="1.5" y="1.5" width="9" height="9" fill="var(--s3)"/>' : '<circle cx="6" cy="6" r="5" fill="var(--s1)"/>';
  return `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">${shape}</svg>`;
}

const fmtDay = d => (d ? new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '');
export const TABLE_COLS = [
  ['rank', '#', 'n'], ['display_name', 'Model'], ['effort', 'Effort'], ['source_type', 'Measured by'],
  ['score_pct', 'Pass@1', 'n'], ['bar', 'Reading'], ['cost_per_task_usd', 'Cost / task', 'n'],
  ['output_tokens_per_task', 'Out tokens', 'n'], ['steps_per_task', 'Steps', 'n'], ['published', 'Published', 'n'],
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
  return `<tr id="${r.row_id}" data-flip-id="${r.row_id}" data-model="${esc(r.model_key)}">` +
    `<td class="n na">${rank}</td>` +
    `<td><span class="name">${esc(r.display_name)}</span><span class="id">${esc(r.lab)}${r.harness ? ' · ' + esc(r.harness) : ''}</span></td>` +
    `<td><span class="eff">${esc(r.effort || '—')}</span></td>` +
    `<td><span class="hall ${s.cls}">${shapeSvg(s.cls)}${s.mark}</span><span class="via">${esc(src ? src.publisher : r.source_name)}</span></td>` +
    `<td class="n score">${fmtPct(r.score_pct)}${r.ci_pct != null ? ` ±${r.ci_pct}` : ''}<sup>${cite}</sup></td>` +
    `<td><div class="bar" role="img" aria-label="${fmtPct(r.score_pct)}${r.ci_pct != null ? ` plus or minus ${r.ci_pct}` : ''}"><div class="track"></div><div class="fill ${s.cls}" style="width:${r.score_pct}%"></div>${ci}</div></td>` +
    `<td class="n">${r.cost_per_task_usd != null ? fmtUsd(r.cost_per_task_usd) : na('not given')}</td>` +
    `<td class="n">${r.output_tokens_per_task != null ? fmtCount(r.output_tokens_per_task) : na('—')}</td>` +
    `<td class="n">${r.steps_per_task != null ? fmtCount(r.steps_per_task) : na('—')}</td>` +
    `<td class="n">${r.published ? fmtDay(r.published) : na('not given')}</td></tr>`;
}
