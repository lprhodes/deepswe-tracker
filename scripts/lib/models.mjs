// Naming rules shared by the official sync and the research ingest.

// "gpt-5-6-sol" -> "gpt-5.6-sol"; "qwen3-8-max" -> "qwen3.8-max". Datacurve writes versions with dashes.
// A dash between digits is a version separator unless the right side is a size ("qwen3.6-27b").
export const versionDots = s => s.replace(/(\d)-(?=\d+(?:-|$))/g, '$1.');
export const modelKey = id => versionDots(id.toLowerCase());

const LAB_RULES = [[/^claude/, 'Anthropic'], [/^gpt|^o\d/, 'OpenAI'], [/^gemini|^gemma/, 'Google'], [/^grok/, 'xAI'],
  [/^glm/, 'Z.ai'], [/^kimi/, 'Moonshot AI'], [/^deepseek/, 'DeepSeek'], [/^qwen/, 'Alibaba'], [/^muse/, 'Meta'],
  [/^mistral|^devstral|^codestral|^magistral/, 'Mistral'], [/^minimax/, 'MiniMax'], [/^mimo/, 'Xiaomi'],
  [/^ember/, 'Fireworks AI'], [/^swe-/, 'Cognition'], [/^nemotron/, 'NVIDIA'], [/^laguna/, 'Poolside'],
  [/^inkling/, 'Thinking Machines'], [/^nex-/, 'Nex-AGI'], [/^step/, 'StepFun'], [/^seed|^doubao/, 'ByteDance'],
  [/^hunyuan|^hy\d/, 'Tencent'], [/^ernie/, 'Baidu'], [/^longcat/, 'Meituan'], [/^beam/, 'Reflection AI']];
export const labFor = key => (LAB_RULES.find(([re]) => re.test(key)) || [, 'Unknown'])[1];

const UPPER = { gpt: 'GPT', glm: 'GLM', deepseek: 'DeepSeek', minimax: 'MiniMax', mimo: 'MiMo', oss: 'OSS', swe: 'SWE' };
const NAMES = {
  'mimo-v2.6-pro': 'MiMo-V2.6-Pro', 'mimo-v2.6-flash': 'MiMo-V2.6-Flash', 'mimo-v2.5-pro': 'MiMo-V2.5-Pro',
  'gpt-oss-120b': 'gpt-oss-120b', 'grok-build-0.1': 'Grok Build 0.1', 'gemini-3.1-pro-preview': 'Gemini 3.1 Pro (preview)',
  'gemini-3-flash-preview': 'Gemini 3 Flash (preview)', 'gemma-4-31b': 'Gemma 4 31B', 'qwen3.6-27b': 'Qwen3.6-27B',
  'qwen3.8-27b': 'Qwen3.8-27B', 'qwen3.8-flash-next': 'Qwen3.8-Flash-Next', 'nex-n2.5-max': 'Nex-N2.5-Max', 'nex-n2.5-pro': 'Nex-N2.5-Pro',
  'nex-n2.5-mini': 'Nex-N2.5-Mini', 'gpt-5.4-mini': 'GPT-5.4 mini',
  'deepseek-v4-pro-preview': 'DeepSeek V4 Pro (preview)', 'deepseek-v4-flash-preview': 'DeepSeek V4 Flash (preview)',
};
export function displayName(key) {
  if (NAMES[key]) return NAMES[key];
  return key.split('-').map(w => UPPER[w] ?? (/^[kmvn]\d/.test(w) ? w.toUpperCase() : /^qwen\d/.test(w) ? 'Qwen' + w.slice(4) : w[0].toUpperCase() + w.slice(1)))
    .join(' ').replace(/^(GPT|GLM|SWE|Ember|Nex) (?=[\dN])/, '$1-').replace(/^Nex-N/, 'Nex-N').replace(/ (Max|Pro|Mini)$/, (m, w) => /^Nex/.test(key) ? `-${w}` : m);
}
