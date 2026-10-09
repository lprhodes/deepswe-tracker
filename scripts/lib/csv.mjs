// Minimal RFC 4180 CSV reader/writer. No dependencies, so the repo builds with a bare Node.

export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', i = 0, quoted = false;
  text = text.replace(/^﻿/, '');
  while (i < text.length) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i += 2; continue; }
      if (c === '"') { quoted = false; i++; continue; }
      field += c; i++; continue;
    }
    if (c === '"') { quoted = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }
    field += c; i++;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows.filter(r => r.some(v => v !== ''));
  return body.map((r, n) => {
    if (r.length !== header.length) throw new Error(`CSV line ${n + 2}: ${r.length} fields, header has ${header.length}`);
    return Object.fromEntries(header.map((h, j) => [h, r[j]]));
  });
}

function cell(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(columns, records) {
  return [columns.join(','), ...records.map(r => columns.map(c => cell(r[c])).join(','))].join('\n') + '\n';
}
