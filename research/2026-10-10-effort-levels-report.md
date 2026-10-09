---
title: "DeepSWE 1.1: other effort levels for single-setting models"
run_id: dr_c1f17bdddff62a3d
question: "For each AI model below, find DeepSWE 1.1 (Datacurve's 113-task long-horizon software engineering benchmark) pass@1 scores at reasoning-effort levels OTHER than the one already recorded, published by the model's lab (launch post, model card, system card, Hugging Face card, eval PDF) or by an independent evaluator that ran the benchmark itself (Mercor, Artificial Analysis, Fireworks, Epoch, etc.). Each figure must be read at the page that published it, with the exact quote, effort level, harness, and cost/tokens per task if given. Aggregator sites that copy numbers (llm-stats, benchlm, benchmarklist, codingfleet, etc.) do not count. Models and what is already recorded (effort: score): Mistral Large 4 (thinking 61.7, Mistral); Beam (unstated 44.4, Reflection AI); Claude Haiku 5.5 (max 59.9 Mercor only; Anthropic published none); Claude Sonnet 5.5 (max 71.0); Gemini 4 Argon (unstated/highest 77.9); Ember-1 (thinking 75.2, Fireworks AI); Claude Opus 5.5 (max 74.2); MiMo-V2.6-Pro (max 71.9) and MiMo-V2.6-Flash (max 67.9, Xiaomi); Step 5 Preview (high 67.7, StepFun); DeepSeek V4.1 Flash (only max); SWE-2 (73.0) and SWE-1.7 (37.7, Cognition); Nex-N2.5 Max/Pro/Mini (Nex-AGI); Muse Spark 1.3 (max 75.4) and 1.2 (xhigh) and 1.1 (xhigh, Meta); Hy4 Preview and Hy3 (Tencent); GLM-5.3 and GLM-5.3 Flash (max), GLM-5.1 (Z.ai); Qwen3.8-Flash-Next, Qwen3.7 Plus, Qwen3.8-27B, Qwen3.6-27B, Qwen3.7 Max, Qwen3.6 Plus (Alibaba); DeepSeek V4 Flash (max); Gemini 3.6 Flash (high); Laguna S 2.1 (max, Poolside); Grok 4.5 (high); GPT-5.4 (xhigh) and GPT-5.4 mini (xhigh); Claude Sonnet 4.6 (high), Claude Opus 4.6 (max), Claude Haiku 4.5; Kimi K2.6; MiMo-V2.5-Pro; Grok Build 0.1; Gemini 3 Flash preview; Gemini 3.1 Pro; DeepSeek V4 Pro 0813; Inkling; Nemotron 3 Ultra; gpt-oss-120b; Kimi K2; Gemma 4 31B; GLM-5; DeepSeek V3.2; Qwen3.5. Also note whether Mercor's \"Gemini 3.1 Pro\" is the same model as Datacurve's \"gemini-3-1-pro-preview\"."
provider: local
tier: fast
archetype: technical
sources: 4
estimated_cost_usd: 0.00
completed: 2026-10-09T22:03:20.380Z
---
# DeepSWE 1.1: other effort levels for single-setting models

As of 10 Oct 2026. Question: for the 53 models the tracker held at one reasoning-effort level, has anyone published DeepSWE 1.1 scores at another level?

## Executive Summary

- **High confidence: labs and independents almost never publish a second effort level.** Of 53 models, one gained a genuinely new setting: Poolside reports Laguna S 2.1 at 16.5% with thinking off against 40.4% at max (https://poolside.ai/blog/introducing-laguna-s-2-1). Every other lab page and independent board read gives one setting per model.
- **High confidence: "DeepSeek V4 Pro" in the tracker was two models.** DeepSeek's own table separates V4-Pro-0813 (62.7) from V4-Pro (Preview) (12.8), and V4-Flash-0731 (54.4) from V4-Flash (Preview) (7.3), all at max effort in DeepSeek Harness minimal mode (https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813).
- **High confidence: Mercor's "Gemini 3.1 Pro" is the board's gemini-3.1-pro-preview.** Google released 3.1 Pro only under that id (https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview).
- **Medium confidence: the official board revised Gemini 3.5 Flash at medium effort** from 28.32% at launch to 37.39% at $7.34 per task in its 17 Jul data file, then dropped the configuration (Internet Archive capture of the board's v1.1 data file, registry entry 4).

## Detailed Findings

**New setting.** Poolside's launch post says Laguna S 2.1 has two thinking modes, off and max, and gives both scores on its pool harness. Its token figures are chart labels for mean completion tokens per trajectory, 99k off and 249k at max, so they are output tokens and cannot price a run on their own (https://poolside.ai/blog/introducing-laguna-s-2-1).

**Model identity.** DeepSeek re-released V4 Pro and V4 Flash in August under the same names. <INFERENCE from="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813">The official board's 7.52% launch row for deepseek-v4-pro and Mercor's 9.1% "DeepSeek V4 Pro" match the preview, and the board's live 62.83% row matches the 0813 release</INFERENCE>. The 62.7 and 54.4 the tracker had read from the V4.1-Flash card are reprints of the 0813 card, which names DeepSeek Harness rather than mini-swe-agent.

**Harness detail.** Qwen's Qwen3.8-27B card gives Qwen3.8-27B 42.2, Qwen3.6-27B 13.3 and Qwen3.7-Plus 14.2, all on the Claude Code harness (https://huggingface.co/Qwen/Qwen3.8-27B). Qwen3.7-Plus therefore has two lab readings from two cards on different harnesses.

**Independent runs.** Mercor lists each target model once (https://mercor.com/apex/oss-benchmarks/oss-deep-swe-leaderboard). Sleev ran GPT-5.5 at high, 57.5% ± 5.0 at $3.71 per task, one task per context window in Codex CLI. Its GPT-5.6 Sol medium figure (61.1%) chained six tasks through one context window, a different protocol (https://sleev.ai/performance).

**Archive.** The Internet Archive holds 38 captures of the board page; the two that embed rows add nothing the tracker lacks (registry entry 3).

**Repeats.** Z.ai's GLM-5.3-Flash eval file gives 63.4, the board's 63.39 at one decimal (https://huggingface.co/zai-org/GLM-5.3-Flash/raw/main/.eval_results/GLM-5.3-Flash.yaml). Xiaomi lists MiMo-V2.5 Pro at 19.0 against the launch board's 19.47 (https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL).

## Evidence Table

| Model | Setting | Score | Who | Source |
|---|---|---|---|---|
| Laguna S 2.1 | thinking off | 16.5% | Poolside | https://poolside.ai/blog/introducing-laguna-s-2-1 |
| DeepSeek V4 Pro (0813) | max | 62.7% | DeepSeek | https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813 |
| DeepSeek V4 Pro (preview) | max | 12.8% | DeepSeek | https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813 |
| DeepSeek V4 Flash (preview) | max | 7.3% | DeepSeek | https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro-0813 |
| Qwen3.7 Plus | unstated, Claude Code | 14.2% | Alibaba | https://huggingface.co/Qwen/Qwen3.8-27B |
| GPT-5.5 | high, Codex CLI | 57.5% | Sleev | https://sleev.ai/performance |

## Knowledge Gaps

- Several cards document a model's default reasoning setting without saying which one the DeepSWE run used (Hy4 preview, Qwen3.8-Flash-Next, Qwen3.7 Max, Nex-N2.5); those efforts stay unstated.
- The launch board's unstated-effort rows may have used each provider's default; the board does not say.
- OpenAI pages refuse automated reads, and StepFun's pages render client-side, so neither was read in full. Seven sources carry no publication date.
- A community sweep was not run separately; the October sweep found only copies of primary figures there.

## Recommended Next Steps

- Watch the official board and the labs' next cards; a second effort level will most likely appear when a lab ships an effort-control release, as Poolside says it has not yet.
- Re-read OpenAI's pages by hand for GPT-5.4 and GPT-5.4 mini settings.