#!/usr/bin/env node
// Refreshes data/pricing/ai-gateway.json from Vercel AI Gateway's public model list, for the models
// mapped in it. The build uses these prices only to estimate cost per task for a reading whose source
// published token counts but no cost; an estimate is always labelled as one and cited to this list.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const URL_ = 'https://ai-gateway.vercel.sh/v1/models';
const p = join(dirname(fileURLToPath(import.meta.url)), '..', 'data/pricing/ai-gateway.json');
const file = JSON.parse(readFileSync(p, 'utf8'));
const res = await fetch(URL_);
if (!res.ok) throw new Error(`${URL_} returned ${res.status}`);
const byId = new Map((await res.json()).data.map(m => [m.id, m]));
for (const [key, entry] of Object.entries(file.models)) {
  const m = byId.get(entry.gateway_id);
  if (!m?.pricing) { console.warn(`${entry.gateway_id} (${key}) is not priced on the gateway; keeping the previous price`); continue; }
  Object.assign(entry, {
    input_per_token: Number(m.pricing.input), output_per_token: Number(m.pricing.output),
    input_cache_read_per_token: m.pricing.input_cache_read != null ? Number(m.pricing.input_cache_read) : null,
  });
}
file.fetched = new Date().toISOString().slice(0, 10);
writeFileSync(p, JSON.stringify(file, null, 2) + '\n');
console.log(`Prices refreshed for ${Object.keys(file.models).length} model(s) from ${URL_}.`);
