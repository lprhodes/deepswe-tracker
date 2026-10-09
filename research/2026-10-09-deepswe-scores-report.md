---
title: "DeepSWE 1.1 scores since 12 September 2026: official board, lab claims and independent runs"
run_id: dr_0fdbe30f547ec720
question: "Compile every DeepSWE 1.1 (Datacurve's long-horizon coding benchmark, 113 tasks) score for every model, with emphasis on scores published since 12 September 2026. Two sources of truth: (1) the official Datacurve DeepSWE leaderboard (website + github datacurve-ai/deep-swe), which reports pass@1, confidence interval, effort level and cost per task for mini-swe-agent runs; (2) scores self-reported by labs in model launch posts, model cards, system cards and technical reports — OpenAI GPT-6.1 Sol and Luna (and GPT-6 Astra, GPT-5.6 Sol/Terra/Luna), Anthropic Claude Haiku 5.5, Sonnet 5.5, Opus 5.5, Fable 5, Google Gemini 3.7 Flash, Gemini 3.8 Flash, Gemini 4 (Argon etc.), Mistral, xAI Grok, Meta Muse Spark, and Chinese/open-weight labs (DeepSeek, Qwen, Kimi/Moonshot, GLM/Zhipu, MiniMax, Xiaomi MiMo, Fireworks Ember). For each data point capture: model, lab, effort/reasoning level, harness/scaffold, pass@1 %, CI, cost per task USD, tokens per task, date published, source URL, and whether it is official-leaderboard or self-reported."
provider: local
tier: fast
archetype: competitive
sources: 22
estimated_cost_usd: 0.00
completed: 2026-10-09T05:41:15.245Z
---
# DeepSWE 1.1 scores since 12 September 2026: official board, lab claims and independent runs

As of 2026-10-09.

## Executive Summary

- **High confidence:** The official Datacurve leaderboard has added no model since GPT-6 Astra on 3 September 2026; its 22 September timestamp is a re-export with no new runs. The live board holds 70 configurations across 28 models ([changelog](https://deepswe.datacurve.ai/changelog), [artifact](https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json)).
- **High confidence:** Since then, labs have kept self-reporting DeepSWE 1.1 scores: GPT-6.1 Sol 75.2% at high effort for about $0.65 per task ([OpenAI](https://openai.com/index/introducing-gpt-6-1-sol)), Claude Opus 5.5 74.2% and Sonnet 5.5 71.0% as five-trial averages ([Opus 5.5 card](https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf), [Sonnet 5.5 card](https://www-cdn.anthropic.com/870c8f525702625d2c62fc6dd04c857e3250bec1/Claude%20Sonnet%205.5%20System%20Card.pdf)), Gemini 4 Argon 77.9% ([Google](https://storage.googleapis.com/deepmind-media/gemini/gemini_4_argon_model_evaluation.pdf)), Grok 4.7 71.0% at high ([xAI card](https://media.x.ai/v1/website/card4p7-3a96f40b.pdf)), Mistral Large 4 61.7% ([Mistral](https://mistral.ai/news/mistral-large-4)).
- **High confidence:** Mercor runs an independent DeepSWE 1.1 evaluation on mini-swe-agent covering 53 configurations; it scores the frontier 2 to 3 points below the labs' own claims (Opus 5.5 and GPT-6.1 Sol both 72.3% at max) ([Mercor](https://mercor.com/apex/oss-benchmarks/oss-deep-swe-leaderboard)).
- **Medium confidence:** The pause coincides with Epoch AI rating the benchmark "flawed" (grading defects in 23 of 113 tasks) and Datacurve saying it is building the next version ([Epoch](https://epoch.ai/benchmarks/deepswe/review), [issue #103](https://github.com/datacurve-ai/deep-swe/issues/103), [Tokenless](https://usetokenless.com/blog/envcheck)). No source states the two are causally linked.
- **High confidence:** Harness choice moves scores more than effort level does for some models: Grok 4.7 scored 73.0% on the Grok Build harness ([Artificial Analysis](https://artificialanalysis.ai/articles/benchmarking-grok-4-7)) against 33.3% on Mercor's mini-swe-agent run.

## Detailed Findings

**Official board.** Datacurve runs every configuration on mini-swe-agent, four passes over 113 tasks, graded in isolated containers ([run docs](https://deepswe.datacurve.ai/run), [v1.1 post](https://deepswe.datacurve.ai/blog/deepswe-v1-1)). Nineteen configurations from the 15 June launch snapshot (Wayback Machine capture of the board) are no longer on the live board. Top live results: GPT-6 Astra 74.1% [xhigh, $4.43], Gemini 3.8 Flash 73.8% [high, $2.36], Claude Opus 5 73.7% [max, $11.84].

**Lab claims after 3 September.** OpenAI publishes a score and cost per effort level: GPT-6.1 Sol low 64.4% ($0.17), medium 73.0% ($0.42), high 75.2% ($0.65), xhigh and max 71.9% ($0.79, $1.57) ([OpenAI](https://openai.com/index/introducing-gpt-6-1-sol)); GPT-6 Sol 68.8% and GPT-6 Luna 66.6% at max ([OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna)). Gemini 4 Argon is the only Gemini 4 tier with a score, self-computed with mini-swe-agent at the highest thinking setting ([Google](https://storage.googleapis.com/deepmind-media/gemini/gemini_4_argon_model_evaluation.pdf)). Muse Spark 1.3 75.4% at max was run on mini-swe-agent, not Meta's Muse Code harness as one aggregator states ([Meta methodology](https://research.meta.ai/static/muse-spark-1-3-multimodal-evaluation-methodology)). xAI's Grok 4.7 card says its DeepSWE results come from evaluations Datacurve conducted, which never appeared on the public board ([xAI card](https://media.x.ai/v1/website/card4p7-3a96f40b.pdf)). Open-weight and Chinese labs: DeepSeek V4.1 Flash 74.2% on mini-swe-agent and 65.5 to 72.6% across six other harnesses ([DeepSeek](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash)), Fireworks Ember-1 75.2% at $3.62 ([Fireworks](https://fireworks.ai/blog/ember-1)), MiMo-V2.6-Pro 71.9% ([Xiaomi](https://mimo.xiaomi.com/mimo-v2-6)), Step 5 Preview 67.7% ([StepFun](https://stepfun.com/)), Hy4 preview 64.3% ([Tencent](https://huggingface.co/tencent/Hy4-preview)).

**No figure exists** for Claude Haiku 5.5 from Anthropic (Mercor measured 59.9%), and there is no GPT-6.1 Luna.

**Cost disagreement inside the official source.** <INFERENCE from="https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json">The leaderboard page and its JSON artifact give different mean costs for 19 of 70 configurations, so any cost comparison should name which official figure it uses.</INFERENCE>

## Evidence Table

| Model | Source | Effort | Harness | Pass@1 | Cost/task |
|---|---|---|---|---|---|
| Gemini 4 Argon | Google | highest | mini-swe-agent | 77.9% | — |
| Muse Spark 1.3 | Meta | max | mini-swe-agent | 75.4% | — |
| GPT-6.1 Sol | OpenAI | high | OpenAI | 75.2% | $0.65 |
| Ember-1 | Fireworks | thinking | mini-swe-agent | 75.2% | $3.62 |
| Claude Opus 5.5 | Anthropic | max | Anthropic | 74.2% | — |
| DeepSeek V4.1 Flash | DeepSeek | max | mini-swe-agent | 74.2% | — |
| GPT-6 Astra | Official board | xhigh | mini-swe-agent | 74.1% | $4.43 |
| Claude Opus 5.5 | Mercor | max | mini-swe-agent | 72.3% | — |
| Claude Sonnet 5.5 | Anthropic | max | Anthropic | 71.0% | — |
| Grok 4.7 | xAI (Datacurve-run) | high | mini-swe-agent | 71.0% | — |
| Mistral Large 4 | Mistral (partner eval) | thinking | AA / Surge | 61.7% | — |

## Knowledge Gaps

- Mercor publishes no per-model dates, so its results cannot be placed in time.
- Anthropic, Google and Meta publish no cost or token figures for their DeepSWE runs.
- No source explains why Datacurve ran Grok 4.7 without posting it.

## Recommended Next Steps

- Re-run the official sync daily; a new configuration on the board is the signal the pause has ended.
- Track Datacurve's announced next version; scores from it will not be comparable with 1.1.
