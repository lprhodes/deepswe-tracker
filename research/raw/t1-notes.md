# Official Datacurve DeepSWE 1.1 Leaderboard Notes

## Leaderboard & Data URLs
- **Official Leaderboard URL:** https://deepswe.datacurve.ai/
- **Live Leaderboard JSON Artifact:** https://deepswe.datacurve.ai/artifacts/v1.1/leaderboard-live.json (94.8 KB, 70 configurations)
- **Full Trials Dataset JSON:** https://deepswe.datacurve.ai/artifacts/v1.1/trials.json (48.7 MB, 31,617 individual trial records with timestamps)
- **Task Catalogue JSON:** https://deepswe.datacurve.ai/artifacts/v1.1/tasks.json (57.6 KB, 113 benchmark tasks)
- **v1 to v1.1 Delta Artifact:** https://deepswe.datacurve.ai/artifacts/v1.1/v1-delta.json (21.6 KB, 9 re-graded shared configs)
- **Release Manifest:** https://deepswe.datacurve.ai/artifacts/v1.1/release.json
- **v1 Frozen Baseline JSON:** https://deepswe.datacurve.ai/artifacts/v1/leaderboard.json (15.9 KB, 16 models)
- **v1.1 Launch Snapshot (June 15, 2026):** http://web.archive.org/web/20260615111157/https://deepswe.datacurve.ai/
- **Official Changelog:** https://deepswe.datacurve.ai/changelog
- **DeepSWE GitHub Repository:** https://github.com/datacurve-ai/deep-swe

## Column & Field Definitions
- **Pass@1 (`score_pct` / `pass_at_1`):** Unweighted pass rate across scored rollout attempts (typically 4 runs of 113 tasks = 452 attempts per configuration). Graded in clean, isolated Docker containers via Harbor's separate verifier environment and Pier `[[verifier.collect]]` hooks. Context-window overflow and agent step timeouts count as failures; upstream provider/network errors are excluded.
- **Confidence Interval (`ci_pct` / `ci_half`):** 95% run-to-run confidence interval computed as standard error across repeated benchmark passes: `1.96 * std(runs) / sqrt(R)`, where R = 4 repeated passes.
- **Cost per Task (`cost_per_task_usd` / `mean_cost_usd`):** Mean dollar cost per task rollout based on actual provider rate cards at evaluation time, factoring in prompt caching (cache reads vs cache writes). Reflects retroactive adjustments for provider price cuts (e.g., DeepSeek Aug 16, OpenAI Aug 20, Google Aug 13). GPT-6 Astra is priced at its projected launch rate card ($10/M uncached input, $12.50/M cache write, $1/M cache read, $50/M output).
- **Token Metrics (`input_tokens_per_task`, `output_tokens_per_task`, `tokens_per_task`):** Arithmetic mean across all scored attempts.
- **Agent Steps (`steps_per_task` / `mean_agent_steps`):** Mean interaction turns taken by `mini-swe-agent` before issuing the final patch commit.
- **Wall-Clock Duration:** Excluded from main leaderboard table because execution time is confounded by provider latency, rate limiting, and host load.

## Date of Last Addition & Post-2026-09-12 Status
- **Date of Most Recent Model Addition:** **September 3, 2026** (GPT-6 Astra added across `low`, `medium`, `high`, `xhigh`, and `max` reasoning effort levels; rollout completed September 1, 2026 at 07:35:13 UTC).
- **Latest Evaluation Job in Live Dataset:** `20260901-deep-swe-1-1-gpt-6-astra` (finished 2026-09-01T07:35:13Z).
- **Site Re-export Date:** September 22, 2026 (`generated_at: 2026-09-22T06:27:15.860279+00:00`).
- **Models Added After 2026-09-12:** **None (0 models).** No new model evaluations or additions occurred after September 3, 2026. The September 22, 2026 timestamp indicates an automated website re-export rather than new benchmark runs.

## Inclusion Policy & Submission Rules
- **Selection Criteria:** "New frontier models are added to the DeepSWE leaderboard as they're released."
- **Standard Harness:** "All models run on mini-swe-agent for consistency."
- **Execution Stack:** "All leaderboard scores were produced with Pier running mini-swe-agent on Modal."
- **External Submissions:** "To submit your model or agent to the leaderboard, reach out to serena@datacurve.ai and we'll add your results."

## Methodology for Dating Rows
- **Changelog Chronology:** Official timestamps mapped from `https://deepswe.datacurve.ai/changelog`:
  - 2026-09-03: GPT-6 Astra (all efforts)
  - 2026-09-01: Gemini 3.8 Flash (medium, high)
  - 2026-08-13: Gemini 3.7 Flash (low, medium, high)
  - 2026-08-12: DeepSeek v4 Pro (max), Grok 4.6 (low, medium, high, xhigh)
  - 2026-08-07: Muse Spark 1.2 (xhigh)
  - 2026-08-06: DeepSeek v4 Flash (max)
  - 2026-08-04: Qwen 3.8 Max (xhigh)
  - 2026-07-25: Claude Opus 5 (low, medium, high, xhigh, max)
  - 2026-07-22: Gemini 3.6 Flash (high)
  - 2026-07-18: Kimi K3 (max)
  - 2026-07-16: Grok 4.5 (high)
  - 2026-07-14: Muse Spark 1.1 (xhigh)
  - 2026-07-10: GPT-5.6 Sol, GPT-5.6 Terra, GPT-5.6 Luna (all efforts)
  - 2026-07-02: Claude Sonnet 5 (all efforts)
  - 2026-06-21: GLM 5.2 (high, max)
  - 2026-06-15: v1.1 Launch models: Claude Fable 5, Claude Opus 4.8, Claude Sonnet 4.6, Gemini 3.1 Pro, Gemini 3.5 Flash, GPT-5.4, GPT-5.5, Kimi K2.7 Code.
- **Trial-Level Audit:** For models without explicit changelog entries (GLM-5.3 and GLM-5.3 Flash), trial timestamps were extracted directly from `trials.json`:
  - GLM-5.3: finished 2026-08-20T07:35:00Z -> dated `2026-08-20`
  - GLM-5.3 Flash: finished 2026-08-26T07:16:35Z -> dated `2026-08-26`
- **Launch Baseline Rows:** 19 legacy models present in the June 15, 2026 v1.1 launch snapshot that were dropped from the live v1.1 view (due to deprecation or v1-only execution) are captured with `published: "2026-06-15"` and note `"launch snapshot only, not on live board"`.
