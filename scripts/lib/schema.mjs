// Column contracts for the two hand-edited CSVs. The build refuses a row that breaks them,
// so a typo surfaces in CI rather than as a silently missing point on the chart.

export const MODEL_COLUMNS = ['model_key', 'display_name', 'lab', 'open_weights', 'notes'];

export const OBS_COLUMNS = [
  'model_key',          // joins data/models.csv
  'model_as_reported',  // the name exactly as the source writes it
  'effort',             // reasoning/effort level as the source states it; blank when unstated
  'harness',            // scaffold: mini-swe-agent, lab-internal, or a named agent; blank when unstated
  'score_pct',          // pass@1, percent of the 113 tasks
  'ci_pct',             // ± half-width the source gives; blank when not given
  'n_samples',          // runs averaged, when stated
  'cost_per_task_usd',
  'tokens_per_task',
  'input_tokens_per_task',
  'output_tokens_per_task',
  'steps_per_task',
  'source_type',        // see SOURCE_TYPES
  'verified_primary',   // true when the number was read at the primary source itself
  'source_name',
  'source_url',
  'published',          // YYYY-MM-DD the number was published
  'accessed',           // YYYY-MM-DD we last read it
  'quote',              // the verbatim row or sentence carrying the number
  'notes',
];

export const SOURCE_TYPES = {
  official_leaderboard: 'Official Datacurve leaderboard',
  lab_self_reported: 'Reported by the model’s lab',
  third_party_run: 'Independent third-party run',
};

const NUMERIC = ['score_pct', 'ci_pct', 'n_samples', 'cost_per_task_usd', 'tokens_per_task',
  'input_tokens_per_task', 'output_tokens_per_task', 'steps_per_task'];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const num = v => (v === '' || v == null ? null : Number(v));
const bool = v => String(v).toLowerCase() === 'true';
const triState = v => (v === '' || v == null ? null : bool(v));

export function typeModels(rows) {
  const errors = [];
  const seen = new Set();
  const models = rows.map((r, i) => {
    const where = `models.csv row ${i + 2}`;
    if (!/^[a-z0-9][a-z0-9.\-]*$/.test(r.model_key)) errors.push(`${where}: model_key "${r.model_key}" must be lowercase kebab-case`);
    if (seen.has(r.model_key)) errors.push(`${where}: duplicate model_key "${r.model_key}"`);
    seen.add(r.model_key);
    if (!r.display_name) errors.push(`${where}: display_name is empty`);
    if (!r.lab) errors.push(`${where}: lab is empty`);
    if (!['', 'true', 'false'].includes(String(r.open_weights ?? '').toLowerCase())) errors.push(`${where}: open_weights must be true, false or blank`);
    return { ...r, open_weights: triState(r.open_weights) };
  });
  return { models, errors };
}

export function typeObservations(rows, modelKeys) {
  const errors = [];
  const obs = rows.map((r, i) => {
    const where = `deepswe-1.1.csv row ${i + 2} (${r.model_key || '?'})`;
    const o = { ...r };
    for (const k of NUMERIC) {
      o[k] = num(r[k]);
      if (o[k] !== null && !Number.isFinite(o[k])) errors.push(`${where}: ${k} "${r[k]}" is not a number`);
    }
    o.verified_primary = bool(r.verified_primary);
    if (!modelKeys.has(r.model_key)) errors.push(`${where}: model_key not in data/models.csv`);
    if (o.score_pct === null || o.score_pct < 0 || o.score_pct > 100) errors.push(`${where}: score_pct must be 0-100`);
    if (!(r.source_type in SOURCE_TYPES)) errors.push(`${where}: source_type "${r.source_type}" not one of ${Object.keys(SOURCE_TYPES).join(', ')}`);
    if (!/^https?:\/\//.test(r.source_url)) errors.push(`${where}: source_url must be an http(s) URL`);
    for (const k of ['published', 'accessed']) {
      if (r[k] && !DATE.test(r[k])) errors.push(`${where}: ${k} "${r[k]}" is not YYYY-MM-DD`);
    }
    if (!r.accessed) errors.push(`${where}: accessed is empty`);
    if (/^(null|nan|none|undefined)$/i.test(r.effort)) errors.push(`${where}: effort "${r.effort}" is a placeholder; leave it blank when the source states none`);
    return o;
  });
  const dupes = new Map();
  for (const o of obs) {
    const k = [o.model_key, o.effort, o.harness, o.source_type, o.score_pct, o.source_url].join('|');
    dupes.set(k, (dupes.get(k) || 0) + 1);
  }
  for (const [k, n] of dupes) if (n > 1) errors.push(`duplicate observation (${n}x): ${k}`);
  return { obs, errors };
}
