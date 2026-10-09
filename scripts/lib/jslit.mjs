// A small reader for the JavaScript object literals the official DeepSWE page embeds in its HTML
// (`$R[12]={model:"gpt-6-astra",pass_at_1:0.74,...}`). It parses data only: strings, numbers,
// true/false/null, arrays, objects and `$R[n]` back-references. Nothing is evaluated, so a
// changed page can fail to parse but cannot run code here.

export function parseLiteral(src, refs = new Map()) {
  let i = 0;
  const ws = () => { while (i < src.length && /\s/.test(src[i])) i++; };
  const fail = msg => { throw new Error(`${msg} at ${i}: ${src.slice(i, i + 40)}`); };
  function value() {
    ws();
    const c = src[i];
    if (c === '{') return object();
    if (c === '[') return array();
    if (c === '"' || c === "'") return string();
    if (c === '$' && src.startsWith('$R[', i)) {
      const m = /^\$R\[(\d+)\](=)?/.exec(src.slice(i));
      i += m[0].length;
      if (m[2]) { const v = value(); refs.set(+m[1], v); return v; }
      return refs.has(+m[1]) ? refs.get(+m[1]) : null;
    }
    const m = /^(-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?|true|false|null|undefined|void 0|!0|!1|NaN|Infinity)/.exec(src.slice(i));
    if (!m) fail('unexpected token');
    i += m[0].length;
    const WORDS = { true: true, '!0': true, false: false, '!1': false, null: null, undefined: null, 'void 0': null, NaN: null, Infinity: null };
    return m[0] in WORDS ? WORDS[m[0]] : Number(m[0]);
  }
  function string() {
    const q = src[i++]; let out = '';
    while (i < src.length && src[i] !== q) {
      if (src[i] === '\\') {
        const n = src[i + 1];
        if (n === 'u') { out += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16)); i += 6; continue; }
        out += { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f' }[n] ?? n; i += 2; continue;
      }
      out += src[i++];
    }
    i++;
    return out;
  }
  function key() {
    ws();
    if (src[i] === '"' || src[i] === "'") return string();
    const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i)) || /^\d+/.exec(src.slice(i));
    if (!m) fail('expected key');
    i += m[0].length;
    return m[0];
  }
  function object() {
    i++; const o = {}; ws();
    if (src[i] === '}') { i++; return o; }
    for (;;) {
      const k = key(); ws();
      if (src[i] !== ':') fail('expected :');
      i++; o[k] = value(); ws();
      if (src[i] === ',') { i++; continue; }
      if (src[i] === '}') { i++; return o; }
      fail('expected , or }');
    }
  }
  function array() {
    i++; const a = []; ws();
    if (src[i] === ']') { i++; return a; }
    for (;;) {
      a.push(value()); ws();
      if (src[i] === ',') { i++; continue; }
      if (src[i] === ']') { i++; return a; }
      fail('expected , or ]');
    }
  }
  const v = value();
  return { value: v, end: i };
}

// Every leaderboard row object on the page: objects carrying model, config and pass_at_1.
export function extractRows(html) {
  const rows = [];
  const refs = new Map();
  const re = /\$R\[(\d+)\]=\{model:/g;
  let m;
  while ((m = re.exec(html))) {
    const start = m.index;
    try {
      const { value, end } = parseLiteral(html.slice(start), refs);
      re.lastIndex = start + end;
      if (value && typeof value === 'object' && 'config' in value && 'pass_at_1' in value) rows.push(value);
    } catch { /* a fragment that is not a row object; skip it */ }
  }
  return rows;
}
