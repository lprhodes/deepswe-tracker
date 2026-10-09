# DeepSWE 1.1 Tracker

Every published DeepSWE 1.1 score in one dataset: the official [Datacurve leaderboard](https://deepswe.datacurve.ai/), the scores labs report for their own models at each reasoning-effort level, and independent re-runs. Each row records who measured it, the harness and effort setting, and the cost and token figures where the source published them.

The official board has added no model since **3 September 2026** (GPT-6 Astra). Since then labs have kept publishing DeepSWE 1.1 numbers for GPT-6.1 Sol, Claude Opus 5.5 and Sonnet 5.5, Gemini 4 Argon, Grok 4.7, DeepSeek V4.1 Flash, Mistral Large 4 and others, and Mercor has run its own independent evaluation. This repo puts them side by side without pretending they are the same measurement.

**Interactive page:** [deepswe.dev](https://deepswe.dev) (also `index.html` in this repo). The cost chart and leaderboard use the official board's chart forms and controls: colour by lab, a line through each model's effort levels, cost running from high to low (log scale by default), a leaderboard of bars with confidence whiskers, all effort levels or the best per model, and filters for lab, model and configuration. The top-right corner of the main chart, high score for low cost, is where a model wants to be. A release-date slider opens on the models released in the last 60 days, narrows to 30, 14 or 7, and widens to 90 days or any time. The first chart ranks every model by its best score, one dot per reading, so it needs no cost; most Anthropic, Google and Meta claims publish none and appear only there and in the table.

![Every model released in the last 60 days, ranked by best score](charts/ranked.svg)

![Score against cost per task, models released in the last 60 days](charts/score-vs-cost.svg)

![Best score per model by who measured it](charts/best-per-model.svg)


## The data

| File | What it holds |
|---|---|
| `data/deepswe-1.1.csv` | One row per reading: a model at an effort level, from one source. The file you edit. |
| `data/models.csv` | One row per model: display name, lab, open weights (blank when not established), and `released` with `released_source` where a source states the release date. |
| `data/deepswe-1.1.json` | Generated: the two CSVs joined and typed, plus the notes shown on the page. `model_released` is the stated release date, or failing that the date the model's first DeepSWE 1.1 result was published. |
| `SOURCES.md` | Generated: every original source, numbered as on the page, with what it establishes. |
| `data/pricing/ai-gateway.json` | List prices from Vercel AI Gateway, used only to estimate cost where a source published tokens but no cost (refresh with `node scripts/sync-pricing.mjs`). |
| `data/official/` | The official board's rows as embedded in its page, its JSON artifact, and the date each configuration first appeared. |
| `research/` | The October 2026 research sweeps (every score, then other effort levels for single-setting models): raw findings per search task, the fact-checks, the reports, and the merge script and log. |

Columns in `deepswe-1.1.csv`:

| Column | Meaning |
|---|---|
| `model_key` | Joins `models.csv` |
| `model_as_reported` | The name exactly as the source writes it |
| `effort` | Reasoning effort as the source states it (`low` … `max`, or a lab's own term); blank when unstated |
| `harness` | `mini-swe-agent`, `lab-internal`, or the named agent (Claude Code, Codex, Devin CLI, Grok Build…) |
| `score_pct` | Pass@1 on the 113 tasks |
| `ci_pct` | ± half-width of the 95% interval, when the source gives one |
| `n_samples` | Runs averaged (official) or samples (Mercor), when stated |
| `cost_per_task_usd`, `tokens_per_task`, `input_tokens_per_task`, `output_tokens_per_task`, `steps_per_task` | Per-task means, only where the source published them |
| `source_type` | `official_leaderboard`, `lab_self_reported` or `third_party_run` |
| `verified_primary` | `true` when the number was read at the source that published it |
| `source_name`, `source_url`, `quote` | Where the number came from, and the sentence or table row carrying it |
| `published`, `accessed` | When the number was published (blank when the source gives no date) and when it was last read |
| `notes` | Footnotes, corrections and caveats |

## What the sources mean

- **Official board.** Datacurve runs every model on mini-swe-agent, four passes over the 113 tasks, and publishes pass@1 with a run-to-run 95% interval and the mean cost, tokens and steps per task. The leaderboard page and its JSON artifact give different costs for 19 of 70 configurations (GPT-5.6 Luna [max]: $0.61 on the page, $3.03 in the artifact). This repo uses the page's figure and records the artifact's in `notes`.
- **Lab claims.** Run by the lab, on its own harness, effort settings and trial count. Anthropic reports a five-trial average; OpenAI publishes a score and cost per effort level; Google and Meta say they used mini-swe-agent. xAI's Grok 4.7 card says its numbers came from evaluations Datacurve ran but never posted. These are not directly comparable with the official runs.
- **Independent runs.** Mercor (mini-swe-agent, 500 steps, 2-hour limit, 3 passes; no per-model dates), Artificial Analysis (Grok Build harness), Fireworks (Kimi K3 at three efforts) and entrpi (MiniMax M3).

Every original source is numbered in [SOURCES.md](SOURCES.md) and at the foot of the page, where each entry says what it establishes and links back to the readings that cite it. On the page, each score carries its source number; hovering, focusing or tapping it shows the source, and with scripts off it jumps to the list.

Where a source published token counts but no cost, the page shows an estimate from Vercel AI Gateway's list prices, marked est. and cited; with only a total token count it is a range from all-input to all-output pricing. Estimates live in the generated JSON (`cost_estimate`), never in the CSV.

A number is included only when it was read at the source that published it. Figures that appear only on aggregator sites are left out; `research/ingest-log.txt` lists every rejected figure and the reason.

Two caveats apply to every score here. Epoch AI's review of 7 September 2026 rated DeepSWE 1.1 "flawed", with grading defects in 23 of the 113 tasks. Tokenless separately documented 70 ways a submission can rewrite test outcomes. Differences of a few points are within that noise.

## Keeping it current

`scripts/sync-official.mjs` reads the official board, regenerates every official row, and stamps new configurations with the date they first appeared. `.github/workflows/sync-official.yml` runs it daily and commits only when the board's data changes. `.github/workflows/check.yml` fails a push whose CSV has an invalid row or whose generated files were not rebuilt.

To add a lab-reported or independent result:

1. Add a row to `data/deepswe-1.1.csv`, with `source_url` pointing at the lab's own page and `quote` holding the line that carries the number. Add the model to `data/models.csv` if it is new.
2. Run `npm run build` (Node 20+, no dependencies). It validates both CSVs and regenerates the JSON, the charts and `index.html`.
3. Commit the CSV and the regenerated files together.

## Not affiliated

This is an independent tracker. DeepSWE is Datacurve's benchmark; scores belong to whoever published them, and every row links to its source.
