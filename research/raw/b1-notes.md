# DeepSWE 1.1 Fact-Check Notes (Task b1)
*Date: 2026-10-09 | Investigator: b1 fact-checker*

---

## 1. Muse Spark 1.3 (Meta)
- **Verdict:** Harness is `mini-swe-agent`, not "Muse Code". Meta's primary methodology document explicitly states: *"We run Muse Spark 1.3 max with a mini-swe agent and obtained the benchmarks for all other models on the official leaderboard on Datacurve."* There is no task cost published by Meta in its methodology report or announcement post (cost is null). The ~$0.55/task claim originated from Artificial Analysis Intelligence Index estimates ($0.55 at $1.25/$4.25 per 1M tokens), not Meta's primary release.
- **Quote:** *"We run Muse Spark 1.3 max with a mini-swe agent and obtained the benchmarks for all other models on the official leaderboard on Datacurve."*
- **URL:** `https://research.meta.ai/static/muse-spark-1-3-multimodal-evaluation-methodology`
- **Wrong Raw Row:** `t5-community.json` ("Muse Spark 1.3", 75.4%, harness: "Muse Code", cost: 0.55) and `t4-aggregators.json` (CodingFleet entry attributing "Muse Code harness" and "$0.55" to Meta AI Research).

---

## 2. Grok 4.7
- **Verdict:** **xAI** published **71.0%** (xhigh reasoning effort) in its official model card using the standardized `mini-swe-agent` harness. **Artificial Analysis** published **73.0%** in their evaluation article using xAI's native **Grok Build** harness as part of their Coding Agent Index.
- **Quote (xAI Model Card):** *"Grok 4.7 (xHigh): 71.0% on DeepSWE v1.1"*
- **Quote (Artificial Analysis):** *"DeepSWE v1.1: 73% (improved from 65% on Grok 4.6 xhigh)"*
- **URLs:**
  - xAI: `https://media.x.ai/v1/website/card4p7-3a96f40b.pdf`
  - Artificial Analysis: `https://artificialanalysis.ai/articles/benchmarking-grok-4-7`
- **Wrong Raw Row:** `t5-community.json` (row 9: "Grok 4.7", 73.0%, harness: "Grok Build harness", source_type: "lab_self_reported", source_name: "xAI News Announcement") incorrectly attributed the 73.0% Grok Build result to xAI instead of Artificial Analysis.

---

## 3. GPT-6.1 Sol
- **Verdict:** The official scores for xhigh and max on OpenAI's launch page are **71.90%** (71.9%), NOT 71.0%. The 71.0% figure in `t5` originated from an unverified GitHub issue (#102) with rounded numbers. The embedded Vega-Lite spec on OpenAI's launch page provides exact per-effort scores and costs: Low: 64.38% ($0.1714), Medium: 73.01% ($0.4196), High: 75.22% ($0.6461), Xhigh: 71.90% ($0.7886), Max: 71.90% ($1.5711). No token counts are reported. OpenAI names no third-party harness in copy; it reports them under its own agent evaluation framework (*"In DeepSWE 1.1, AI agents solve original, long-horizon software engineering tasks"*).
- **Quote:** `{"model":"GPT-6.1 Sol","modelLabel":"GPT-6.1 Sol","cost":0.7886,"score":0.7190,"effortLabel":"Xhigh"}` and `{"model":"GPT-6.1 Sol","modelLabel":"GPT-6.1 Sol","cost":1.5711,"score":0.7190,"effortLabel":"Max"}`
- **URL:** `https://openai.com/index/introducing-gpt-6-1-sol/`
- **Wrong Raw Row:** `t5-community.json` (rows 1-5: GPT-6.1 Sol Max 71.0%, Xhigh 71.0%, Med 73.0%, Low 64.0% via GitHub issue #102).

---

## 4. GPT-5.6 Luna Max
- **Verdict:** The discrepancy between 62.17% and 67.2% stems from differing evaluation regimes. **67.19% (67.2%)** is Datacurve's official verified leaderboard score (4 passes of 113 tasks = 452 rollouts on `mini-swe-agent`), which OpenAI cited in its July 2026 GPT-5.6 launch table. **62.17%** is from OpenAI's subsequent September 2026 internal re-evaluation chart in the GPT-6 Sol and Luna post, where OpenAI ran an internal single-pass comparison across all effort levels (Low: 1.22%, Med: 9.29%, High: 42.37%, Xhigh: 56.19%, Max: 62.17% at $0.532/task) to benchmark predecessors on their own agent setup.
- **Quote:** `{"model":"GPT-5.6 Luna","cost_label":"$$0.532","score":0.6217,"cost":0.532,"effortLabel":"max"}`
- **URL:** `https://openai.com/index/introducing-gpt-6-sol-and-luna/` (and `https://openai.com/index/gpt-5-6/`)
- **Wrong Raw Row:** Aggregators in `t4-aggregators.json` (LLM Stats, BenchmarkList) conflated the two without noting the harness/evaluation regime difference.

---

## 5. Claude Opus 5.5 and Sonnet 5.5 System Cards
- **Verdict:** Section 8.3 of both system cards (Opus 5.5 p. 175; Sonnet 5.5 p. 110) reports capability pass rates evaluated over **5 trials** using Anthropic's **lab-internal** agent evaluation setup. Effort is adaptive thinking at maximum reasoning budget (mapped as "max"). No third-party harness (such as mini-swe-agent) is stated. Neither system card provides cost per task or token counts (both null).
- **Quote (Opus 5.5):** *"Claude Opus 5.5 scored an average of 74.2% over five trials."*
- **Quote (Sonnet 5.5):** *"Sonnet 5.5 scored an average of 71.0% over five trials."*
- **URLs:**
  - Opus 5.5: `https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf`
  - Sonnet 5.5: `https://www-cdn.anthropic.com/870c8f525702625d2c62fc6dd04c857e3250bec1/Claude%20Sonnet%205.5%20System%20Card.pdf`
- **Wrong Raw Row:** None in `t2-us-labs.json` (t2 correctly recorded 74.2% / 71.0%, lab-internal, max effort, 5 samples, null cost/tokens). Corrects aggregators in `t4-aggregators.json` that labeled them `mini-swe-agent`.

---

## 6. Claude Haiku 5.5
- **Verdict:** Confirmed that **no Anthropic DeepSWE 1.1 figure exists**. Anthropic's Haiku 5.5 System Card (Section 8), launch post, and platform docs report SWE-bench Pro (64.8%), FrontierSWE v2 (43.8%), and ProgramBench (82.0%), but completely omit DeepSWE. Mercor's independent third-party evaluation confirms Haiku 5.5 at **59.9% ± 7.7%** (effort: max, n_samples: 339, harness: mini-swe-agent).
- **Quote (Mercor):** *"Haiku 5.5 | effort: max | score: 59.9% ± 7.7% | n_samples: 339 | provider: Anthropic"*
- **URL:** `https://www.mercor.com/apex/oss-benchmarks/oss-deep-swe-leaderboard/`
- **Wrong Raw Row:** None (`t2-notes.md` correctly identified that Anthropic reported no DeepSWE score, and `t4-aggregators.json` captured Mercor's 59.9%).

---

## 7. "GPT-6.1 Luna"
- **Verdict:** **Does not exist.** OpenAI has not announced, listed, or released a "GPT-6.1 Luna" in its launch announcement, model documentation, or API pricing (only GPT-6.1 Sol exists in the 6.1 generation, alongside base GPT-6 Luna). There is no DeepSWE 1.1 score.
- **Quote:** N/A (zero occurrences on openai.com).
- **URL:** `https://openai.com/index/introducing-gpt-6-1-sol/`
- **Wrong Raw Row:** Confirmed absence; guards against aggregators creating a phantom 6.1 Luna row.

---

## 8. Gemini 4
- **Verdict:**
  1. Besides Gemini 4 Argon (**77.9%**), Google released **no other Gemini 4 tiers** with DeepSWE 1.1 numbers.
  2. The Gemini 4 Argon evaluation PDF specifies **effort: "highest thinking setting"** under a `mini-swe` agent harness (pass@1 single attempt), but gives **no cost per task** (token pricing of $2/$10 per 1M is in the blog, but cost per task is null).
  3. Google did **not** self-report a new independent evaluation for Gemini 3.7 Flash at its August 2026 launch; the 65.3% reported in Google's eval materials explicitly cites Datacurve's public leaderboard (65.27% ~ 65.3%).
- **Quote (Gemini 4 Argon):** *"Gemini 4 Argon achieved 77.9% on DeepSWE v1.1 with mini-swe agent harness under highest thinking setting."*
- **Quote (Gemini 3.7 Flash eval note):** *"Comparisons against baseline models... reference data from Datacurve's public leaderboard (deepswe.datacurve.ai)"*
- **URLs:**
  - `https://storage.googleapis.com/deepmind-media/gemini/gemini_4_argon_model_evaluation.pdf`
  - `https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/`
  - `https://storage.googleapis.com/deepmind-media/gemini/gemini_3-7_flash_model_evaluation.pdf`
- **Wrong Raw Row:** `t4-aggregators.json` rows listing Gemini 3.7 Flash as a self-reported lab run rather than an official leaderboard citation (properly rejected in `ingest-log.txt`).

---

## 9. Mistral
- **Verdict:** Mistral Large 4 (**61.7%**) was self-reported by Mistral AI in their October 6, 2026 launch announcement, evaluated in partnership with **Artificial Analysis and Surge AI** using the **Artificial Analysis coding agent harness**. No other Mistral model (Devstral 2, Codestral, Magistral, or Mistral Medium) has published a DeepSWE 1.1 score.
- **Quote:** *"scoring 61.7% on DeepSWE v1.1, 59.4% on SWE-Atlas-QnA, and 28.3% on Terminal-Bench 4."*
- **URL:** `https://mistral.ai/news/mistral-large-4/`
- **Wrong Raw Row:** `t3-cn-open-mistral.json` had harness labeled as "other name"; correctly clarified as Artificial Analysis / Surge partner harness.

---

## 10. Mercor's Run
- **Verdict:** Mercor's APEX leaderboard confirms evaluation on **DeepSWE v1.1** across the **same 113 tasks**. The evaluation harness is standardized on `mini-swe-agent` with strict bounds (500 max steps, 2-hour wall-clock limit, judge set to None, unit tests all must pass). Sample count is $k=3$ iterations (339 rollouts for most models). Confidence intervals are reported as **95% standard error intervals** (`± X.X%`). The page **does not show individual dates per model**; the entire leaderboard snapshot dates to **October 7, 2026**.
- **Quote:** *"Mercor independent evaluation using mini-swe-agent (500 max steps, 2 hour time limit), unit tests all must pass, judge of None, k=3 (113 tasks, 339 samples)"*
- **URL:** `https://www.mercor.com/apex/oss-benchmarks/oss-deep-swe-leaderboard/`
- **Wrong Raw Row:** None (`t4-aggregators.json` captured 53 Mercor configurations with 95% CIs).

---

## 11. New Additions Published 2026-10-01 to 2026-10-09
- **Verdict:** Only two primary models published new DeepSWE 1.1 scores during this week:
  1. **Mistral Large 4** (Mistral AI, 2026-10-06): **61.7%**
  2. **Beam** (Reflection AI, 2026-10-06): **44.4%**
  (A third model, **Laguna S 2.1** by Poolside at 40.4%, was indexed by aggregator llm-stats citing poolside.ai). No other frontier model additions occurred.
- **Quote (Mistral Large 4):** *"scoring 61.7% on DeepSWE v1.1"*
- **Quote (Beam):** *"Reflection's Beam scores 44.4% on DeepSWE v1.1"*
- **URLs:**
  - `https://mistral.ai/news/mistral-large-4/`
  - `https://the-decoder.com/reflections-beam-becomes-the-most-capable-open-weight-model-built-outside-china/`
- **Wrong Raw Row:** None (already properly ingested from t3; confirms no other uncaptured launches exist in the Oct 1-9 window).
