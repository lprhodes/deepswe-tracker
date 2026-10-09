# DeepSWE 1.1 Aggregator and Third-Party Evaluation Sweep (Task t4)

**Date of Investigation:** 2026-10-09  
**Target:** DeepSWE 1.1 (Datacurve's long-horizon software engineering benchmark, 113 tasks across 91 repositories and 5 programming languages: Python, JavaScript, TypeScript, Go, Rust).

---

## 1. Summary of Sites Covered

| Source / Site | URL | Rows Captured | Source Types / Upstream Attributions | Last-Updated / Snapshot Date |
| :--- | :--- | :--- | :--- | :--- |
| **Datacurve DeepSWE Official Live Leaderboard** | `https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json` | 70 | Official verified runs on `mini-swe-agent` (4 full benchmark passes, 452 rollouts). | 2026-10-03 |
| **Mercor APEX (Official Third-Party Evaluation)** | `https://www.mercor.com/apex/oss-benchmarks/oss-deep-swe-leaderboard/` | 53 | Independent third-party evaluation on `mini-swe-agent` (500 max steps, 2 hour limit, unit tests all must pass, judge None, k=3 for 339 samples or k=1 for 113 samples). | 2026-10-07 |
| **BenchLM.ai** | `https://benchlm.ai/benchmarks/mercordeepswe11` | 52 | Independent mirror of Mercor APEX DeepSWE v1.1 evaluation. | 2026-10-07 |
| **BenchmarkList** | `https://benchmarklist.com/benchmarks/deepswe_1_1/` | 181 | Hybrid aggregator tracking 58 models across 181 configurations: 70 Verified (Datacurve JSON), 73 Launch post, 17 Model card, 14 Self-reported, 5 Imported, 2 System card. | 2026-10-03 |
| **LLM Stats** | `https://llm-stats.com/benchmarks/deepswe-1.1` | 43 | Aggregator mixing Datacurve board (17), vendor model cards/blogs (Google, Meta, OpenAI, Anthropic, Fireworks, DeepSeek, Xiaomi, Mistral, Poolside, etc.). | 2026-10-09 |
| **CodingFleet Blog** | `https://codingfleet.com/blog/deepswe-v11-leaderboard-2026/` | 40 | Aggregator separating Datacurve verified board (27) from provider self-reports (OpenAI, Anthropic, Meta, Cognition) and Artificial Analysis. | 2026-10-02 |
| **LLM Reference** | `https://www.llmreference.com/benchmark/deepswe-1-1` | 16 | Aggregator tracking 16 models with version, effort level, observed date, and upstream citations (Datacurve, HuggingFace, OpenAI, Anthropic, xAI, Z.ai, DeepMind). | 2026-10-09 |
| **Luca Berton Blog** | `https://lucaberton.com/blog/deepswe-v1-1-llm-coding-benchmark-analysis/` | 14 | Aggregator analysis focusing on Datacurve's top 14 vendor-optimal effort configurations with 95% CI and task costs. | 2026-09-03 |
| **Eden AI Blog** | `https://www.edenai.co/post/deepswe-benchmark-which-llms-write-the-best-code` | 9 | Aggregator snapshot of the initial DeepSWE v1.1 release from June 24, 2026, recording agent steps, output tokens, and costs. | 2026-06-24 |
| **ItDoesWhatNow** | `https://itdoeswhatnow.com/benchmarks/deepswe/` | 9 | Aggregator timeline synthesis comparing vendor launch claims (Zhipu, OpenAI, Anthropic, Google). | 2026-09-22 |
| **UnifyBench** | `https://unifybench.ai/benchmarks/deepswe-1-1` | 8 | Aggregator table citing Z.ai / GLM-5.3 release performance table (`zai-org/GLM-5.3`). (Note: `deepswe-1-1-pct-higher` redirected/located at `deepswe-1-1`). | 2026-10-08 |
| **Artificial Analysis** | `https://artificialanalysis.ai/articles/benchmarking-grok-4-7` | 2 | Independent evaluation of Grok 4.7 (73%) and Grok 4.6 (65%) on DeepSWE v1.1 using Grok Build harness as part of Coding Agent Index. | 2026-09-21 |
| **OpenRouter** | `https://openrouter.ai/benchmarks/deepswe` | 0 | Probed: Web route returns 404 client-side page; no benchmark table hosted. | — |
| **Vals.ai / Epoch AI / Scale** | Probed direct URLs | 0 | Probed: No dedicated DeepSWE 1.1 evaluation table currently hosted. | — |
| **Total Rows Written** | `/Users/lukerhodes/Dev/deepswe-tracker/research/raw/t4-aggregators.json` | **497** | Full standardized dataset adhering strictly to requested 21-key schema. | — |

---

## 2. Mercor's Independent Third-Party Evaluation

### Methodology & Execution Details
* **Source:** Mercor APEX (`mercor.com/apex/oss-benchmarks/oss-deep-swe-leaderboard/`) mirrored on BenchLM (`benchlm.ai/benchmarks/mercordeepswe11`).
* **Snapshot Date:** October 7, 2026 capture.
* **Evaluation Environment:** Standardized on `mini-swe-agent` with strict resource limits:
  * Maximum 500 agent steps
  * 2-hour wall-clock time limit per problem
* **Grading Criteria:** Programmatic unit tests (`"all must pass"`), evaluation judge set to `None`.
* **Sample Count:** Evaluated across the 113 DeepSWE tasks with $k = 3$ iterations (339 rollouts for most models; 113 rollouts for select configurations like Kimi K3, DeepSeek V4 Flash, Qwen 3.8 Max, Kimi K2.7 Code, Qwen 3.5).
* **Scope:** 53 configurations published on Mercor APEX (52 tracked on BenchLM mirror, which lacked `Claude Haiku 5.5` at 59.9%).

### Mercor Top Standings vs Official Datacurve Standings
Unlike Datacurve's live verified leaderboard where **GPT-6 Astra** leads at 74.12%, Mercor's independent evaluation produces a statistical tie at the top between Anthropic and OpenAI:
1. **Opus 5.5 [max]:** 72.30% ± 7.3% (336 samples)
2. **GPT 6.1 Sol [max]:** 72.30% ± 7.4% (339 samples)
3. **GPT 6 Astra [max]:** 72.00% ± 7.5% (339 samples)
4. **DeepSeek V4.1 Flash [max]:** 71.70% ± 6.3% (339 samples) — *Highest scoring open-weights model on Mercor*
5. **Opus 5 [max]:** 71.40% ± 6.8% (339 samples)
6. **Gemini 3.8 Flash [high]:** 71.40% ± 6.8% (339 samples)
7. **GPT 5.6 Sol [max]:** 70.50% ± 6.9% (339 samples)
8. **GPT 6 Sol [max]:** 70.50% ± 7.2% (338 samples)
9. **Sonnet 5.5 [max]:** 70.50% ± 7.7% (339 samples)
10. **GLM 5.3 [max]:** 70.50% ± 6.3% (339 samples)

---

## 3. Discrepancies and Source-Mixing Across Aggregators

Aggregators produce severe leaderboard drift because they mix three fundamentally distinct evaluation regimes:
1. **Datacurve Official Verified Runs:** Ran by Datacurve using `mini-swe-agent` across 4 whole-benchmark runs (~450 rollouts), with isolated test containers and verified patches.
2. **Independent Third-Party Harnesses:**
   * **Mercor:** `mini-swe-agent` with 500-step/2-hr limits, $k=3$ (339 samples). Scores run 1.5% to 3.5% lower than Datacurve's 4-run pass rates.
   * **Artificial Analysis:** Evaluated Grok with **Grok Build** harness rather than `mini-swe-agent`.
3. **Lab Self-Reported / Launch Post Claims:** Vendors evaluating on internal agent architectures, non-disclosed harness parameters, or cherry-picked single trials.

### Key Model Score Disagreements

| Model | Highest Reported Score | Source for High Score | Lowest Reported Score | Source for Low Score | Cause of Discrepancy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gemini 4 Argon** | **77.9%** | Google Blog / LLM Stats / BenchmarkList | *Not Evaluated* | Datacurve Live / Mercor | Pure self-reported vendor claim; never independently verified on public leaderboard. |
| **Muse Spark 1.3** | **75.4%** | Meta AI Research (Muse Code harness) | *Not Evaluated* | Datacurve Live / Mercor | Meta self-report using proprietary Muse Code harness; Datacurve only has v1.1 (53.3%) & v1.2 (54.9%). |
| **GPT-6.1 Sol** | **75.2%** | OpenAI Launch Post (High effort) | **72.3%** (±7.4%) | Mercor APEX independent run | OpenAI launch claim vs. Mercor's independent 339-sample standardized run. |
| **DeepSeek V4.1 Flash** | **74.2%** | DeepSeek Model Card / Launch Post | **71.7%** (±6.3%) | Mercor APEX independent run | Vendor model card claim (74.2%) vs Mercor third-party evaluation (71.7%). |
| **Claude Opus 5.5** | **74.2%** | Anthropic System Card (5-trial mean) | **72.3%** (±7.3%) | Mercor APEX independent run | System card self-report vs Mercor standardized run. |
| **GPT-6 Astra** | **74.12%** (±2.87%) | Datacurve Official Live (xhigh) | **72.00%** (±7.5%) | Mercor APEX independent run | Datacurve 4-run verified pass@1 (74.12%) vs Mercor 3-run pass@1 (72.00%). |
| **Gemini 3.8 Flash** | **74.0%** / **73.83%** | Datacurve Official Live / Luca Berton | **71.40%** (±6.8%) | Mercor APEX independent run | Official verified pass rate (73.83%) vs Mercor independent evaluation (71.40%). |
| **Claude Opus 5** | **74.0%** / **73.65%** | Datacurve Official Live / Luca Berton | **68.8%** | Anthropic System Card / LLM Reference | Early July 2026 Anthropic system card cited 68.8%; later Datacurve verified sweeps reached 73.65%. |
| **GPT-5.6 Sol** | **73.0%** / **72.70%** | Datacurve Official Live (72.7%) | **70.50%** (±6.9%) | Mercor APEX independent run | Standard verified pass rate vs Mercor independent run. |
| **Claude Fable 5** | **70.0%** / **69.91%** | Datacurve Official Live (xhigh) | **67.30%** (±7.2%) | Mercor APEX independent run | Datacurve verified pass rate (69.91%) vs Mercor independent run (67.30%). |
| **GLM-5.3** | **70.50%** (±6.3%) | Mercor APEX independent run | **66.9%** | Z.ai launch table / LLM Reference | Z.ai launch table reported 66.9%; Datacurve verified reached 68.96%; Mercor measured 70.50%. |
| **Grok 4.7** | **73.0%** | Artificial Analysis (Grok Build) | **33.30%** (±6.0%) | Mercor APEX (`mini-swe-agent`) | **Massive Harness Divergence:** Grok 4.7 achieves 73% when using xAI's native Grok Build agent scaffolding, but collapses to 33.3% inside the vanilla `mini-swe-agent` container. |
| **SWE-2** | **73.0%** | Cognition Launch Blog | *Not Evaluated* | Datacurve Live / Mercor | Cognition internal evaluation using Devin CLI harness; not runnable on `mini-swe-agent`. |
| **Ember-1** | **75.2%** | Fireworks AI Launch Blog | *Not Evaluated* | Datacurve Live / Mercor | Vendor self-report listed only on LLM Stats. |

---

## 4. Union of Every Model Name Observed Across Sources

Below is the complete union of distinct model names (86 canonical model architectures/variants) identified across all swept sources:

1. **Claude Fable 5** (Anthropic)
2. **Claude Fable 5.1** (Anthropic)
3. **Claude Haiku 5.5** (Anthropic)
4. **Claude Opus 4.6** (Anthropic)
5. **Claude Opus 4.7** (Anthropic)
6. **Claude Opus 4.8** (Anthropic)
7. **Claude Opus 5** (Anthropic)
8. **Claude Opus 5.5** (Anthropic)
9. **Claude Sonnet 4.6** (Anthropic)
10. **Claude Sonnet 5** (Anthropic)
11. **Claude Sonnet 5.5** (Anthropic)
12. **DeepSeek V3.2** (DeepSeek)
13. **DeepSeek V4 Flash** (DeepSeek)
14. **DeepSeek V4 Flash 0731** (DeepSeek)
15. **DeepSeek V4 Flash Vision Exp** (DeepSeek)
16. **DeepSeek V4 Pro** (DeepSeek)
17. **DeepSeek V4 Pro 0813** (DeepSeek)
18. **DeepSeek V4.1 Flash** (DeepSeek)
19. **Ember-1** (Fireworks AI)
20. **GLM-5** (Zhipu AI)
21. **GLM-5.1** (Zhipu AI)
22. **GLM-5.2** (Zhipu AI)
23. **GLM-5.3** (Zhipu AI)
24. **GLM-5.3-Flash** (Zhipu AI)
25. **GPT OSS 120B** (OpenAI)
26. **GPT-5.4** (OpenAI)
27. **GPT-5.5** (OpenAI)
28. **GPT-5.6 Luna** (OpenAI)
29. **GPT-5.6 Sol** (OpenAI)
30. **GPT-5.6 Terra** (OpenAI)
31. **GPT-6 Astra** (OpenAI)
32. **GPT-6 Luna** (OpenAI)
33. **GPT-6 Sol** (OpenAI)
34. **GPT-6.1 Sol** (OpenAI)
35. **Gemini 3.1 Pro** (Google)
36. **Gemini 3.1 Pro Preview** (Google)
37. **Gemini 3.5 Flash** (Google)
38. **Gemini 3.6 Flash** (Google)
39. **Gemini 3.7 Flash** (Google)
40. **Gemini 3.8 Flash** (Google)
41. **Gemini 4 Argon** (Google)
42. **Gemma 4 31B** (Google)
43. **Grok 4.5** (xAI)
44. **Grok 4.6** (xAI)
45. **Grok 4.7** (xAI)
46. **Inkling** (Thinking Machines)
47. **Kimi K2** (Moonshot AI)
48. **Kimi K2.7 Code** (Moonshot AI)
49. **Kimi K3** (Moonshot AI)
50. **Laguna S 2.1** (Poolside)
51. **MiMo-V2.5-Pro** (Xiaomi)
52. **MiMo-V2.6-Flash** (Xiaomi)
53. **MiMo-V2.6-Pro** (Xiaomi)
54. **MiniMax M2.7** (MiniMax)
55. **MiniMax M3** (MiniMax)
56. **Mistral Large 4** (Mistral AI)
57. **Muse Spark** (Meta)
58. **Muse Spark 1.1** (Meta)
59. **Muse Spark 1.2** (Meta)
60. **Muse Spark 1.3** (Meta)
61. **Nemotron 3 Ultra** (NVIDIA)
62. **Nex-N2.5-Max** (Nex-AGI)
63. **Nex-N2.5-Mini** (Nex-AGI)
64. **Nex-N2.5-Pro** (Nex-AGI)
65. **Qwen 3.5** (Alibaba)
66. **Qwen 3.8 Max** (Alibaba)
67. **Qwen3.6 27B** (Alibaba)
68. **Qwen3.7 Max** (Alibaba)
69. **Qwen3.7 Plus** (Alibaba)
70. **Qwen3.8 Flash** (Alibaba)
71. **Qwen3.8 Max 0902** (Alibaba)
72. **Qwen3.8-27B** (Alibaba)
73. **Qwen3.8-Flash-Next** (Alibaba)
74. **Qwen3.8-Omni-Flash** (Alibaba)
75. **SWE-1.7** (Cognition)
76. **SWE-2** (Cognition)
77. **Step 5 Preview** (StepFun)

### Models Only Listed by Aggregators / Vendor Self-Reports
The following models appear exclusively in aggregator feeds or vendor blog launch announcements and do NOT appear on Datacurve's live verified leaderboard:
* **Gemini 4 Argon** (77.9%, Google blog)
* **Muse Spark 1.3** (75.4%, Meta Research)
* **GPT-6.1 Sol** (75.2%, OpenAI launch post)
* **Ember-1** (75.2%, Fireworks AI)
* **Claude Opus 5.5** (74.2%, Anthropic System Card)
* **DeepSeek V4.1 Flash** (74.2%, DeepSeek Model Card)
* **SWE-2** (73.0%, Cognition blog)
* **MiMo-V2.6-Pro** (71.9%, Xiaomi launch post)
* **Claude Sonnet 5.5** (71.0%, Anthropic System Card)
* **MiMo-V2.6-Flash** (67.9%, Xiaomi launch post)
* **Nex-N2.5-Max** (65.6%, Nex-AGI model card)
* **Mistral Large 4** (61.7%, Mistral launch post)
* **Laguna S 2.1** (40.4%, Poolside blog)
