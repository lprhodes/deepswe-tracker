// Chart renderers shared by the build (static SVGs for the README) and the page (interactive).
// Each returns an SVG string. Every mark carries data-i (its index into the rows passed in) and
// data-k (a stable key) so the page can attach tooltips and animate marks between renders.
// Styling is by class, so one stylesheet themes light and dark.
//
// The grammar follows the official DeepSWE board so the two can be read side by side: colour is
// the lab (the official board's brand-led colours), each model's effort levels are joined by a line,
// and cost runs high-to-low so the most efficient results sit top right. Who measured a result is the second encoding: marker shape and
// line style (official solid circle, lab claim dashed diamond, independent run dotted square).

export const SERIES = [
  { key: 'official_leaderboard', label: 'Official board', long: 'Official Datacurve leaderboard', cls: 's1', mark: 'DC' },
  { key: 'lab_self_reported', label: 'Lab claim', long: 'Reported by the model’s own lab', cls: 's2', mark: 'LAB' },
  { key: 'third_party_run', label: 'Independent run', long: 'Run by an independent third party', cls: 's3', mark: 'IND' },
];
const CLS = Object.fromEntries(SERIES.map(s => [s.key, s.cls]));

// Lab colours follow each lab's branding. The nine labs on the official board use the exact values
// it renders (sampled from deepswe.datacurve.ai on 2026-10-09) so the two charts can be compared at a
// glance; the rest take their own brand colour where they have a distinctive one, and grey otherwise.
// Several brands share a hue (Google, Meta and Tencent are all blue; Anthropic, Mistral and Xiaomi
// orange), so labels, hover emphasis and the table carry identity rather than colour alone.
export const LAB_COLORS = {
  OpenAI: 'oklch(0.58 0.13 155)', Anthropic: 'oklch(0.62 0.15 50)', Google: 'oklch(0.58 0.17 255)',
  'Z.ai': 'oklch(0.62 0.12 195)', DeepSeek: 'oklch(0.55 0.18 295)', Meta: 'oklch(0.61 0.2 255)',
  Alibaba: 'oklch(0.6 0.15 220)', xAI: 'oklch(0.56 0.08 265)', 'Moonshot AI': 'oklch(0.6 0.18 20)',
  Mistral: 'oklch(0.66 0.21 38)', Xiaomi: 'oklch(0.69 0.2 47)', NVIDIA: 'oklch(0.72 0.19 130)',
  'Fireworks AI': 'oklch(0.5 0.27 285)', MiniMax: 'oklch(0.6 0.2 5)', Tencent: 'oklch(0.5 0.2 262)',
};
const OTHER_LAB = 'oklch(0.64 0.01 160)';
const slug = l => l.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const labClass = lab => (LAB_COLORS[lab] ? 'lab-' + slug(lab) : 'lab-other');
export const LAB_CSS = Object.entries(LAB_COLORS).map(([l, c]) => `.lab-${slug(l)}{--c:${c}}`).join('') + `.lab-other{--c:${OTHER_LAB}}`;

export const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'];
// Order for effort lines and sorting. "off" (thinking disabled) sits below low; it has no filter chip
// of its own and falls under "other".
const LADDER = ['off', ...EFFORTS];
export const effortRank = e => LADDER.indexOf(e);

export const METRICS = {
  cost: { field: 'cost_per_task_usd', label: 'Avg cost per task', short: 'Cost', noun: 'cost per task', better: 'cheaper', fmt: v => fmtUsd(v) },
  output: { field: 'output_tokens_per_task', label: 'Avg output tokens per task', short: 'Output tokens', noun: 'output-token count', better: 'fewer tokens', fmt: v => fmtCount(v) },
  steps: { field: 'steps_per_task', label: 'Avg agent steps per task', short: 'Agent steps', noun: 'agent-step count', better: 'fewer steps', fmt: v => fmtCount(v) },
};

// The release-date window: a model is shown when it was released within the last N days of the
// anchor, which is the data's as-of date or the newest release in it, whichever is later. A model's
// release date is the one its source states (models.csv), else the date its first DeepSWE 1.1 result
// was published. Models with neither appear only when the window is "any time".
export const WINDOWS = [7, 14, 30, 60, 90, null];
export const DEFAULT_WINDOW = 2;
export const windowAnchor = (rows, asOf) => rows.reduce((a, r) => (r.model_released && r.model_released > a ? r.model_released : a), asOf);
export const windowStart = (anchor, days) => new Date(Date.parse(anchor + 'T00:00:00Z') - (days - 1) * 864e5).toISOString().slice(0, 10);
export const inWindow = (r, days, anchor) => days == null || (!!r.model_released && r.model_released >= windowStart(anchor, days));
export const windowPhrase = days => (days == null ? 'at any time' : `in the last ${days} days`);

// Colour tokens for a standalone SVG (the README charts). The page swaps this block for one that
// points at its own tokens, so the page has a single source of colour.
export const STYLE_TOKENS = `
.viz{--v-good:#2f9e5a;--v-good-ink:#1d6b3b;--v-paper:#fbfcfa;--v-ink:#14212b;--v-ink2:#44535c;--v-muted:#5f6e74;--v-grid:#e3e9e4;--v-rule:#b9c8be;font-family:Archivo,system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:where(:not([data-theme="light"])) .viz{--v-good:#4cc27a;--v-good-ink:#8fdcab;--v-paper:#141a18;--v-ink:#e8efe9;--v-ink2:#b4c2bb;--v-muted:#93a39c;--v-grid:#222b28;--v-rule:#34423c}}
:root[data-theme="dark"] .viz{--v-good:#4cc27a;--v-good-ink:#8fdcab;--v-paper:#141a18;--v-ink:#e8efe9;--v-ink2:#b4c2bb;--v-muted:#93a39c;--v-grid:#222b28;--v-rule:#34423c}
`;
export const STYLE_RULES = `
.viz .bg{fill:var(--v-paper)}
.viz .grid{stroke:var(--v-grid);stroke-width:1}
.viz .axis{stroke:var(--v-rule);stroke-width:1}
.viz .tick{fill:var(--v-muted);font-size:11px;font-variant-numeric:tabular-nums}
.viz .axis-title{fill:var(--v-ink2);font-size:12px}
.viz .y-title{fill:var(--v-ink);font-size:13px;font-weight:620}
.viz .title{fill:var(--v-ink);font-size:16px;font-weight:650}
.viz .sub{fill:var(--v-ink2);font-size:12px}
.viz .lbl{fill:var(--v-ink);font-size:12px;font-weight:650;paint-order:stroke;stroke:var(--v-paper);stroke-width:3.5px;stroke-linejoin:round}
.viz .glbl .lbl{fill:color-mix(in oklch, var(--c) 62%, var(--v-ink))}
.viz .leader{stroke:var(--c);stroke-width:1;opacity:.7}
.viz .lbl-eff{fill:var(--v-ink2);font-size:9px;letter-spacing:.08em;font-family:"Spline Sans Mono",ui-monospace,monospace;paint-order:stroke;stroke:var(--v-paper);stroke-width:3px;stroke-linejoin:round}
.viz .front{fill:none;stroke:var(--v-ink);stroke-width:11;stroke-linejoin:round;stroke-linecap:round;opacity:.07}
.viz .front-lbl{fill:var(--v-ink2);font-size:12px}
.viz .rail-bg{fill:var(--v-grid);opacity:.45}
.viz .rail-h{fill:var(--v-ink);font-size:12px;font-weight:650}
.viz .glbl text,.viz .glbl .leader{pointer-events:none}
.viz .val{fill:var(--v-ink);font-size:11px;font-weight:650;font-variant-numeric:tabular-nums}
.viz .note{fill:var(--v-muted);font-size:11px;font-style:italic}
.viz .best-a{stop-color:var(--v-good);stop-opacity:.16} .viz .best-b{stop-color:var(--v-good);stop-opacity:0}
.viz .best-lbl{fill:var(--v-good-ink);font-size:12px;font-weight:650} .viz .best-sub{fill:var(--v-good-ink);font-size:11px}
.viz .dir{fill:var(--v-ink2);font-size:12px;font-weight:600}
.viz .ref{stroke:var(--v-ink2);stroke-width:1}
.viz .ref-lbl{fill:var(--v-ink2);font-size:11px}
.viz .span{stroke:var(--v-rule);stroke-width:2;stroke-linecap:round}
.viz .eline{fill:none;stroke-width:1.6;stroke-linejoin:round;stroke-linecap:round;opacity:.55}
.viz .solo .mk{stroke-width:2.5}
.viz .solo circle.mk{r:6.5}
.viz .eline.s2{stroke-dasharray:6 4} .viz .eline.s3{stroke-dasharray:1.5 4}
.viz .mk{stroke:var(--v-paper);stroke-width:2}
.viz .key{fill:var(--v-ink2)}
${LAB_CSS}
.viz .eline{stroke:var(--c)} .viz .mk{fill:var(--c)} .viz .sw{fill:var(--c)}
.viz .track{fill:var(--v-grid)} .viz .whisk{stroke:var(--v-ink);stroke-width:1.2;fill:none}
.viz .hit{fill:transparent;cursor:pointer}
.viz .hit:focus-visible{fill:transparent;stroke:var(--v-ink);stroke-width:2}
.viz .hit:hover+.mk,.viz .hit:focus-visible+.mk{stroke:var(--v-ink)}
.viz.dim .grp{opacity:.12} .viz.dim .grp.on{opacity:1} .viz.dim .grp.on .eline{opacity:1;stroke-width:3}
.viz.dim .front{opacity:.03}
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
// One effort line per measurer: the official board's live page and its archived copies are one
// measurer, as is a lab across its blog and system card; independent runners stay apart by site.
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
const groupKey = r => [r.model_key, r.source_type, r.harness, r.source_type === 'third_party_run' ? hostOf(r.source_url) : ''].join('|');

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
// Key to shape (who measured) and colour (lab), wrapping before maxX. Returns the markup and the
// baseline of its last row, so the chart below can start clear of it.
function legend(x, y0, rows, maxX = 1050) {
  let y = y0;
  let out = '';
  let cx = x;
  const present = new Set(rows.map(r => r.source_type));
  for (const s of SERIES.filter(s => present.has(s.key))) {
    out += markPath(s.cls, '', cx + 6, y - 4, 'key') + `<text class="tick" x="${cx + 16}" y="${y}">${esc(s.label)}</text>`;
    cx += 16 + textW(s.label, 11) + 20;
  }
  const labs = [...new Set(rows.map(r => r.lab))];
  const named = Object.keys(LAB_COLORS).filter(l => labs.includes(l));
  const others = labs.some(l => !LAB_COLORS[l]);
  cx += 12;
  for (const l of [...named, ...(others ? ['Other labs'] : [])]) {
    if (cx + 14 + textW(l, 11) > maxX) { cx = x; y += 18; }
    out += `<rect class="sw ${l === 'Other labs' ? 'lab-other' : labClass(l)}" x="${cx}" y="${y - 9}" width="10" height="10" rx="2"/><text class="tick" x="${cx + 14}" y="${y}">${esc(l)}</text>`;
    cx += 14 + textW(l, 11) + 14;
  }
  return { svg: out, y };
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

// Label placement: nearest free spot around the point (above, beside, below, then the diagonals) at
// growing distances. A label that lands away from its point gets a leader line back to it. A label
// that fits nowhere is dropped; its value stays in the tooltip and the table.
function placeLabels(items, bounds, marks) {
  const placed = [];
  const hit = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  let out = '';
  for (const it of items) {
    const w = Math.max(textW(it.text, 12), it.sub ? textW(it.sub, 9) + 4 : 0), h = it.sub ? 24 : 14;
    const tries = [];
    for (const d of [7, 16, 28, 42]) tries.push(
      { x: it.cx - w / 2, y: it.cy - d - h, d }, { x: it.cx + d, y: it.cy - h / 2, d }, { x: it.cx - d - w, y: it.cy - h / 2, d },
      { x: it.cx - w / 2, y: it.cy + d, d }, { x: it.cx + d * 0.7, y: it.cy - d * 0.7 - h, d }, { x: it.cx - d * 0.7 - w, y: it.cy - d * 0.7 - h, d },
      { x: it.cx + d * 0.7, y: it.cy + d * 0.7, d }, { x: it.cx - d * 0.7 - w, y: it.cy + d * 0.7, d });
    for (const t of tries) {
      const box = { x: t.x - 2, y: t.y - 1, w: w + 4, h: h + 2 };
      if (box.x < bounds.left || box.x + box.w > bounds.right || box.y < bounds.top || box.y + box.h > bounds.bottom) continue;
      if (placed.some(p => hit(p, box)) || marks.some(p => hit(p, box))) continue;
      placed.push(box);
      const cx = t.x + w / 2;
      // Leader from the label's nearest edge to the point, when the label sits away from it.
      let leader = '';
      if (t.d > 12) {
        const lx = Math.max(t.x, Math.min(it.cx, t.x + w)), ly = it.cy < t.y ? t.y : it.cy > t.y + h ? t.y + h : t.y + h / 2;
        leader = `<line class="leader" x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${it.cx.toFixed(1)}" y2="${it.cy.toFixed(1)}"/>`;
      }
      out += `<g class="grp glbl ${it.cls}" data-model="${esc(it.model)}">${leader}<text class="lbl" x="${cx.toFixed(1)}" y="${(t.y + 11).toFixed(1)}" text-anchor="middle">${esc(it.text)}</text>` +
        (it.sub ? `<text class="lbl-eff" x="${cx.toFixed(1)}" y="${(t.y + 22).toFixed(1)}" text-anchor="middle">${esc(it.sub)}</text>` : '') + '</g>';
      break;
    }
  }
  return out;
}

// The results no other result beats on both score and cost: walking from cheapest up, each point that
// scores higher than everything cheaper than it.
export function frontier(rows, field) {
  const sorted = [...rows].sort((a, b) => a[field] - b[field] || b.score_pct - a.score_pct);
  const out = []; let best = -Infinity;
  for (const r of sorted) if (r.score_pct > best) { out.push(r); best = r.score_pct; }
  return out;
}

// Score against a per-task measure, drawn like the official board: y is the DeepSWE score from 0, x
// runs from the most expensive on the left to the cheapest on the right (log by default, or linear),
// and each model's effort levels are joined in order from low to max. Lines are drawn first and every
// point after, so a model measured at one effort level is never hidden under another model's line.
// A model with no result that publishes this measure is listed beside the plot by its best score, so a
// model without a published cost still appears. Other unmeasured readings are in the table.
export function effortScatter(rows, { metric = 'cost', scale = 'log', embedStyle = false, width = 1080, height = 680, id = 'sc', labelTop = 30, title: titleText } = {}) {
  const M = METRICS[metric];
  const all = rows.map((r, i) => ({ r, i }));
  const pts = all.filter(p => p.r[M.field] > 0);
  const plotted = new Set(pts.map(p => p.r.model_key));
  const unlisted = bestOf(all.filter(p => !plotted.has(p.r.model_key))).sort((a, b) => b.r.score_pct - a.r.score_pct);
  const title = titleText || `DeepSWE 1.1 score against ${M.noun}`;
  const desc = `Scatter of ${pts.length} results: pass@1 on the vertical axis, ${M.label.toLowerCase()} on the horizontal from highest at left to lowest at right; each model’s effort levels are joined in order from low to max.` +
    (unlisted.length ? ` Beside it, ${unlisted.length} models with no published ${M.noun}, listed by best score.` : '');
  if (!all.length) return open(width, 120, id, title, 'No results in this selection.', embedStyle) + `<text class="sub" x="24" y="64">No results in this selection.</text></svg>`;
  const key = embedStyle ? legend(24, 80, rows, width - 28) : null;
  const railW = unlisted.length ? 236 : 0;
  const m = { left: 60, right: 28 + railW, top: key ? key.y + 44 : 48, bottom: 58 };
  const right = width - m.right, bottom = height - m.bottom;
  const railX = right + 30, railR = width - 28;
  const y1 = scoreTop(rows);
  const sy = v => bottom - (v / y1) * (bottom - m.top);
  const plotW = right - m.left, plotH = bottom - m.top;
  const vals = pts.map(p => p.r[M.field]).sort((a, b) => a - b);
  let sx = () => right, ticks = [], clampAt = Infinity;
  if (!vals.length) { /* no x scale: only the column of unmeasured results is drawn */ }
  else if (scale === 'log') {
    const lx0 = Math.log10(vals[0] / 1.35), lx1 = Math.log10(vals.at(-1) * 1.35);
    sx = v => right - (Math.log10(v) - lx0) / (lx1 - lx0) * plotW;
    const all = LOG_TICKS.filter(t => Math.log10(t) >= lx0 && Math.log10(t) <= lx1);
    ticks = all.filter((_, k) => k % Math.ceil(all.length / 8) === 0);
  } else {
    // A long expensive tail would squeeze every other result against zero, so the axis stops at
    // about 1.25x the 90th percentile; results beyond it are pinned to the left edge and counted.
    const p90 = vals[Math.floor(vals.length * 0.9)] ?? vals.at(-1);
    const top = Math.min(vals.at(-1), p90 * 1.25);
    const step = niceStep(top);
    const max = Math.ceil(top * 1.02 / step) * step;
    if (vals.at(-1) > max) clampAt = max;
    sx = v => right - (Math.min(v, max) / max) * plotW;
    for (let t = 0; t <= max + 1e-9; t += step) ticks.push(+t.toFixed(6));
  }
  let svg = open(width, height, id, title, desc, embedStyle);
  if (embedStyle) {
    svg += `<text class="title" x="24" y="32">${esc(title)}</text><text class="sub" x="24" y="52">Lines join each model’s effort levels from low to max, as on the official board. Colour is the lab; shape is who measured it.</text>`;
    svg += key.svg;
  }
  svg += `<text class="y-title" x="${m.left}" y="${m.top - 20}">DeepSWE score <tspan class="dir">↑ more of the 113 tasks solved</tspan></text>`;
  const bestText = `Best: higher score, ${M.better} ↗`;
  if (vals.length) svg += `<text class="best-lbl" x="${right}" y="${m.top - 20}" text-anchor="end">${esc(bestText)}</text>`;
  if (vals.length && scale !== 'log') {
    // In linear mode the cheapest results sit hard against the right edge, so the top-right corner is
    // the target region itself; a wash fades out from it.
    svg += `<defs><radialGradient id="${id}-best" cx="1" cy="0" r="0.7"><stop offset="0" class="best-a"/><stop offset="1" class="best-b"/></radialGradient></defs>`;
    svg += `<rect x="${m.left}" y="${m.top}" width="${plotW}" height="${plotH}" fill="url(#${id}-best)" aria-hidden="true"/>`;
  }
  svg += yAxis(0, y1, sy, m.left, right);
  for (const t of ticks) {
    const x = sx(t).toFixed(1);
    svg += `<line class="grid" x1="${x}" x2="${x}" y1="${m.top}" y2="${bottom}"/><text class="tick" x="${x}" y="${bottom + 18}" text-anchor="middle">${esc(M.fmt(t))}</text>`;
  }
  svg += `<line class="axis" x1="${m.left}" x2="${right}" y1="${bottom}" y2="${bottom}"/>`;
  if (vals.length) svg += `<text class="axis-title" x="${(m.left + right) / 2}" y="${height - 12}" text-anchor="middle">${esc(M.label)}${scale === 'log' ? ' (log scale)' : ''} · <tspan class="dir">${esc(M.better)} →</tspan></text>`;
  else svg += `<text class="note" x="${(m.left + right) / 2}" y="${(m.top + bottom) / 2}" text-anchor="middle">No result in this selection publishes a ${esc(M.noun)}.</text>`;
  const clamped = pts.filter(p => p.r[M.field] > clampAt).length;
  if (clamped) svg += `<text class="note" x="${m.left + 6}" y="${bottom - 8}">◂ ${clamped} result${clamped === 1 ? '' : 's'} above ${esc(M.fmt(clampAt))}, pinned to this edge</text>`;

  const placed = pts.map(p => ({ ...p, cx: sx(p.r[M.field]), cy: sy(p.r.score_pct), g: groupKey(p.r) }));

  // The efficient frontier, a wide neutral band under the data in both scales. It is keyed in the
  // header rather than labelled on the plot, where its label would compete with the model labels.
  const front = frontier(placed.map(p => p.r), M.field);
  const frontPts = placed.filter(p => front.includes(p.r)).sort((a, b) => a.cx - b.cx);
  if (frontPts.length > 1) {
    svg += `<path class="front" d="M${frontPts.map(p => `${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`).join('L')}" aria-hidden="true"/>`;
    const kx = right - textW(bestText, 12) - 24 - textW('Efficient frontier', 12);
    svg += `<line class="front" x1="${(kx - 26).toFixed(1)}" x2="${(kx - 8).toFixed(1)}" y1="${m.top - 24}" y2="${m.top - 24}"/>` +
      `<text class="front-lbl" x="${kx.toFixed(1)}" y="${m.top - 20}"><title>No other result here scores higher for less</title>Efficient frontier</text>`;
  }
  // Layer 1: every line. Layer 2: every point, single-effort models drawn larger.
  let lines = '', points = '';
  const groups = new Map();
  for (const p of placed) { if (!groups.has(p.g)) groups.set(p.g, []); groups.get(p.g).push(p); }
  for (const [g, ps] of groups) {
    const model = esc(ps[0].r.model_key);
    // The line runs through one point per effort level (the best, where a measurer gave several).
    const byEffort = new Map();
    for (const p of ps) if (effortRank(p.r.effort) >= 0 && !(byEffort.get(p.r.effort)?.r.score_pct >= p.r.score_pct)) byEffort.set(p.r.effort, p);
    const laddered = [...byEffort.values()].sort((a, b) => effortRank(a.r.effort) - effortRank(b.r.effort));
    if (laddered.length > 1) lines += `<g class="grp" data-model="${model}"><path class="eline ${CLS[ps[0].r.source_type]} ${labClass(ps[0].r.lab)}" d="M${laddered.map(p => `${p.cx.toFixed(1)} ${p.cy.toFixed(1)}`).join('L')}"/></g>`;
    points += `<g class="grp${ps.length === 1 ? ' solo' : ''}" data-g="${esc(g)}" data-model="${model}">` + ps.map(p => mark(p.r, p.i, p.cx, p.cy)).join('') + '</g>';
  }
  svg += lines + points;
  // Layer 3: one label per model, at its best visible result, tinted in its lab colour.
  const frontModels = new Set(front.map(r => r.model_key));
  const chosen = bestOf(placed).sort((a, b) => b.r.score_pct - a.r.score_pct)
    .filter((p, k) => k < labelTop || frontModels.has(p.r.model_key));
  const items = chosen.map(p => ({ cx: p.cx, cy: p.cy, model: p.r.model_key, cls: labClass(p.r.lab), text: p.r.display_name, sub: (p.r.effort || '').toUpperCase() }));
  svg += placeLabels(items, { left: m.left, right, top: m.top, bottom }, placed.map(p => ({ x: p.cx - 5, y: p.cy - 5, w: 10, h: 10 })));
  if (unlisted.length) svg += unlistedPanel(unlisted, M, { x: railX, right: railR, top: m.top, bottom });
  return svg + '</svg>';
}

// The line under the score chart: what the list beside it holds and what only the table holds.
export function unplottedNote(rows, M) {
  const plotted = new Set(rows.filter(r => r[M.field] > 0).map(r => r.model_key));
  const listed = new Set(rows.filter(r => !plotted.has(r.model_key)).map(r => r.model_key)).size;
  const loose = rows.filter(r => !(r[M.field] > 0) && plotted.has(r.model_key)).length;
  return (listed ? ` ${listed} model${listed === 1 ? ' publishes' : 's publish'} a score but no ${M.noun}; ${listed === 1 ? 'it is' : 'they are'} listed beside the chart.` : '') +
    (loose ? ` ${loose} more reading${loose === 1 ? '' : 's'} without ${/^[aeiou]/i.test(M.noun) ? 'an' : 'a'} ${M.noun} ${loose === 1 ? 'is' : 'are'} in the table.` : '');
}

// Each model's best result in a set of placed or unplaced results.
function bestOf(set) {
  const b = new Map();
  for (const p of set) { const x = b.get(p.r.model_key); if (!x || p.r.score_pct > x.r.score_pct) b.set(p.r.model_key, p); }
  return [...b.values()];
}

// The models a chart cannot place, as a short ranked list beside it: mark, name, effort, best score.
// Rows that do not fit are counted rather than drawn; the table has every reading.
function unlistedPanel(list, M, box) {
  const H = 22, cap = Math.floor((box.bottom - box.top - 12) / H);
  const shown = list.length > cap ? list.slice(0, cap - 1) : list;
  const scoreX = box.right - 6, nameX = box.x + 14;
  let out = `<rect class="rail-bg" x="${box.x - 10}" y="${box.top}" width="${box.right - box.x + 10}" height="${box.bottom - box.top}" rx="6" aria-hidden="true"/>` +
    `<text class="rail-h" x="${box.x - 2}" y="${box.top - 20}">No ${esc(M.short.toLowerCase())} published</text>` +
    `<text class="tick" x="${scoreX}" y="${box.top - 20}" text-anchor="end">best</text>`;
  shown.forEach((p, k) => {
    const y = box.top + 18 + k * H, r = p.r;
    const room = scoreX - 38 - nameX;
    let name = r.display_name;
    if (textW(name, 12) > room) name = name.slice(0, Math.max(4, Math.floor(room / (12 * 0.55)) - 1)) + '…';
    const eff = (r.effort || '').toUpperCase();
    const showEff = eff && textW(name, 12) + textW(eff, 9) + 6 <= room;
    out += `<g class="grp glbl ${labClass(r.lab)}" data-model="${esc(r.model_key)}"><g class="pt" data-k="${esc(rowKey(r))}">` +
      `<rect class="hit" data-i="${p.i}" tabindex="0" x="${box.x - 6}" y="${y - 11}" width="${box.right - box.x + 2}" height="${H}"><title>${esc(pointLabel(r))}: ${fmtPct(r.score_pct)}</title></rect>` +
      markPath(CLS[r.source_type], labClass(r.lab), box.x + 4, y - 4) + '</g>' +
      `<text class="lbl" x="${nameX}" y="${y}">${esc(name)}${showEff ? `<tspan class="lbl-eff" dx="6">${esc(eff)}</tspan>` : ''}</text>` +
      `<text class="val" x="${scoreX}" y="${y}" text-anchor="end">${fmtPct(r.score_pct)}</text></g>`;
  });
  if (shown.length < list.length) out += `<text class="note" x="${nameX}" y="${box.top + 18 + shown.length * H}">and ${list.length - shown.length} more in the table</text>`;
  return out;
}

// The bar scale both leaderboard forms share: 0 to 80%, as on the official board, widening to 100%
// only if a score ever passes 80.
export const barMax = rows => (rows.some(r => r.score_pct > 80) ? 100 : 80);

// "Same model, different measurer", in the official leaderboard's form: under each model, one bar per
// source (official board, lab claim, independent run), each with its interval where one was given.
export function spreadBars(rows, { embedStyle = false, width = 1080, id = 'sp', onlyMulti = false } = {}) {
  const byModel = new Map();
  rows.forEach((r, i) => {
    if (!byModel.has(r.model_key)) byModel.set(r.model_key, { name: r.display_name, key: r.model_key, lab: r.lab, best: {} });
    const b = byModel.get(r.model_key).best;
    if (b[r.source_type] == null || rows[b[r.source_type]].score_pct < r.score_pct) b[r.source_type] = i;
  });
  let models = [...byModel.values()].map(mo => ({ ...mo, top: Math.max(...Object.values(mo.best).map(i => rows[i].score_pct)) }));
  if (onlyMulti) models = models.filter(mo => Object.keys(mo.best).length > 1);
  models.sort((a, b) => b.top - a.top);
  const title = 'Best DeepSWE 1.1 score per model, by who measured it';
  const desc = `${models.length} models; for each, a bar for its best official, lab-claimed and independent pass@1 at any effort level.`;
  if (!models.length) return open(width, 120, id, title, desc, embedStyle) + `<text class="sub" x="24" y="64">No models in this selection.</text></svg>`;
  const max = barMax(rows);
  const key = embedStyle ? legend(24, 80, rows, width - 24) : null;
  const m = { left: 220, srcW: 104, right: 70, top: key ? key.y + 32 : 16, bottom: 36 };
  const x0 = m.left + m.srcW, x1 = width - m.right;
  const sx = v => x0 + (v / max) * (x1 - x0);
  const barH = 9, gap = 6, pad = 10;
  let y = m.top, body = '';
  for (const mo of models) {
    const srcs = SERIES.filter(s => s.key in mo.best);
    const blockH = pad * 2 + srcs.length * barH + (srcs.length - 1) * gap;
    body += `<g class="grp" data-model="${esc(mo.key)}"><line class="grid" x1="24" x2="${width - 24}" y1="${y}" y2="${y}"/>`;
    body += `<rect class="sw ${labClass(mo.lab)}" x="${m.left - 196}" y="${y + blockH / 2 - 5}" width="10" height="10" rx="2"/><text class="lbl" x="${m.left - 180}" y="${y + blockH / 2 + 4}">${esc(mo.name.length > 26 ? mo.name.slice(0, 25) + '…' : mo.name)}</text>`;
    srcs.forEach((s, k) => {
      const i = mo.best[s.key], r = rows[i], cy = y + pad + k * (barH + gap) + barH / 2;
      body += `<g class="pt" data-k="${esc(rowKey(r))}" data-x="${sx(r.score_pct).toFixed(1)}" data-y="${cy.toFixed(1)}">`;
      body += markPath(s.cls, '', m.left + 6, cy, 'key') + `<text class="tick" x="${m.left + 16}" y="${cy + 4}">${esc(s.label)}</text>`;
      body += `<rect class="track" x="${x0}" y="${cy - barH / 2}" width="${(x1 - x0).toFixed(1)}" height="${barH}"/>`;
      body += `<rect class="sw ${labClass(r.lab)}" x="${x0}" y="${cy - barH / 2}" width="${(sx(r.score_pct) - x0).toFixed(1)}" height="${barH}"/>`;
      if (r.ci_pct != null) {
        const a = sx(Math.max(0, r.score_pct - r.ci_pct)), b = sx(Math.min(max, r.score_pct + r.ci_pct));
        body += `<path class="whisk" d="M${a.toFixed(1)} ${cy}H${b.toFixed(1)}M${a.toFixed(1)} ${cy - 5}V${cy + 5}M${b.toFixed(1)} ${cy - 5}V${cy + 5}"/>`;
      }
      body += `<text class="val" x="${x1 + 8}" y="${cy + 4}">${fmtPct(r.score_pct)}</text>`;
      body += `<rect class="hit" data-i="${i}" tabindex="0" x="${x0}" y="${cy - 8}" width="${(x1 - x0).toFixed(1)}" height="16"><title>${esc(pointLabel(r))} · ${esc(s.label)}: ${fmtPct(r.score_pct)}</title></rect></g>`;
    });
    body += '</g>';
    y += blockH;
  }
  const height = y + m.bottom;
  let svg = open(width, height, id, title, desc, embedStyle);
  if (embedStyle) {
    svg += `<text class="title" x="24" y="32">${esc(title)}</text><text class="sub" x="24" y="52">Each model’s best result from each source, on the official leaderboard’s 0–${max}% bar scale.</text>`;
    svg += key.svg;
  }
  for (let v = 0; v <= max; v += 20) svg += `<line class="grid" x1="${sx(v).toFixed(1)}" x2="${sx(v).toFixed(1)}" y1="${m.top}" y2="${y}"/><text class="tick" x="${sx(v).toFixed(1)}" y="${y + 18}" text-anchor="middle">${v}%</text>`;
  return svg + body + '</svg>';
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
// The readings table in the official leaderboard's form: model with its effort in brackets, a bar on
// a 0–80% scale with the interval as a whisker, then the score and per-task figures. Each column has a
// class so narrow screens fold the lowest-priority ones instead of scrolling.
export const TABLE_COLS = [
  ['display_name', 'Model', 'c-model'], ['source_type', 'Measured by', 'c-src'], ['bar', '', 'c-bar'],
  ['score_pct', 'Pass@1', 'n c-score'], ['cost_per_task_usd', 'Avg cost', 'n c-cost'],
  ['output_tokens_per_task', 'Out tok', 'n c-tok'], ['steps_per_task', 'Steps', 'n c-steps'], ['published', 'Published', 'n c-pub'],
];
export const TABLE_SORTABLE = new Set(['display_name', 'source_type', 'score_pct', 'cost_per_task_usd', 'output_tokens_per_task', 'steps_per_task', 'published']);

export function theadHtml(sort) {
  return '<tr>' + TABLE_COLS.map(([k, label, cls]) => {
    const aria = sort && k === sort.key ? ` aria-sort="${sort.dir > 0 ? 'ascending' : 'descending'}"` : '';
    const inner = TABLE_SORTABLE.has(k) ? `<button type="button" data-sort="${k}">${label}</button>` : (label || '<span class="sr">Bar</span>');
    return `<th scope="col" class="${cls}"${aria}>${inner}</th>`;
  }).join('') + '</tr>';
}
// The bar column's axis, as on the official leaderboard: tick labels under the bars.
export function tfootHtml(max) {
  const ticks = []; for (let v = 0; v <= max; v += 20) ticks.push(`<span style="left:${(v / max) * 100}%">${v}%</span>`);
  return '<tr class="axis-row">' + TABLE_COLS.map(([k, , cls]) => `<td class="${cls}">${k === 'bar' ? `<div class="ticks" aria-hidden="true">${ticks.join('')}</div>` : ''}</td>`).join('') + '</tr>';
}

const fmtUsdRange = (lo, hi) => (fmtUsd(lo) === fmtUsd(hi) ? `≈${fmtUsd(lo)}` : `≈${fmtUsd(lo)}–${fmtUsd(hi).slice(1)}`);

// One reading. The pass@1 figure carries its citation marker: an anchor into the source registry,
// so the claim-to-source link works with no script at all; the page layers a preview on top. A cost
// the source did not publish but that can be estimated from its token count shows as an estimate,
// cited to the price list it came from.
export function readingRowHtml(r, src, max = 80, priceSrc = null) {
  const s = SERIES.find(x => x.key === r.source_type);
  const na = t => `<span class="na">${t}</span>`;
  // Attribute names held in a constant so this template is not itself read as a marker by tools
  // that scan the page source for data-cite.
  const CITE = 'data-cite';
  const marker = x => (x ? `<a class="cite" href="#${x.id}" ${CITE}="${x.id}" data-n="${x.n}" aria-describedby="${x.id}">${x.n}</a>` : '');
  const w = v => `${Math.min(100, (v / max) * 100).toFixed(2)}%`;
  const ci = r.ci_pct != null ? `<div class="ci" style="left:${w(Math.max(0, r.score_pct - r.ci_pct))};width:${(Math.min(max, r.score_pct + r.ci_pct) - Math.max(0, r.score_pct - r.ci_pct)) / max * 100}%"></div>` : '';
  const est = r.cost_estimate;
  const cost = r.cost_per_task_usd != null ? fmtUsd(r.cost_per_task_usd)
    : est ? `<span class="estc" title="${esc(est.basis)}">${fmtUsdRange(est.low, est.high)} <span class="esttag">est.</span></span><sup>${marker(priceSrc)}</sup>` : na('not given');
  return `<tr id="${r.row_id}" data-flip-id="${r.row_id}" data-model="${esc(r.model_key)}">` +
    `<td class="c-model"><span class="swatch ${labClass(r.lab)}"></span><span class="name">${esc(r.display_name)}</span>${r.effort ? ` <span class="effb">[${esc(r.effort)}]</span>` : ''}` +
      `<span class="id">${esc(r.lab)}${r.harness ? `<span class="hsep"> · <span class="h">${esc(r.harness)}</span></span>` : ''}<span class="src-inline"> · ${s.mark}</span></span></td>` +
    `<td class="c-src"><span class="hall ${s.cls}">${shapeSvg(s.cls)}${s.mark}</span><span class="via">${esc(src ? src.publisher : r.source_name)}</span></td>` +
    `<td class="c-bar"><div class="bar" role="img" aria-label="${fmtPct(r.score_pct)}${r.ci_pct != null ? ` plus or minus ${r.ci_pct}` : ''}"><div class="track"></div><div class="fill ${labClass(r.lab)}" style="width:${w(r.score_pct)}"></div>${ci}</div></td>` +
    `<td class="n c-score"><span class="sv">${fmtPct(r.score_pct)}${r.ci_pct != null ? `<small> ±${r.ci_pct}</small>` : ''}</span><sup>${marker(src)}</sup></td>` +
    `<td class="n c-cost">${cost}</td>` +
    `<td class="n c-tok">${r.output_tokens_per_task != null ? fmtCount(r.output_tokens_per_task) : r.tokens_per_task != null ? `<span title="total tokens; no input/output split published">${fmtCount(r.tokens_per_task)} total</span>` : na('—')}</td>` +
    `<td class="n c-steps">${r.steps_per_task != null ? fmtCount(r.steps_per_task) : na('—')}</td>` +
    `<td class="n c-pub">${r.published ? fmtDay(r.published) : na('not given')}</td></tr>`;
}
