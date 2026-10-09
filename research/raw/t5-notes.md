# DeepSWE 1.1: Community & Journalism Research Notes (Task T5)

**Date of Research:** 2026-10-09  
**Benchmark Scope:** Datacurve DeepSWE v1.1 (113 long-horizon software engineering tasks across 91 repositories)

---

## 1. Leaderboard Status & Inclusion/Submission Policy

### Official Inclusion & Submission Stance
* **Closed Evaluation Pipeline:** The official DeepSWE leaderboard ([deepswe.datacurve.ai](https://deepswe.datacurve.ai/)) has no open community submission portal or pull request acceptance mechanism for benchmark results. Datacurve maintains sole authority over official additions.
* **Stated Policy:** The website states:
  > *"All models run on mini-swe-agent for consistency."*  
  > *"New frontier models are added to the DeepSWE leaderboard as they're released."*
* **Pipeline Freeze Date:**
  * The last model added to the official changelog was **GPT-6 Astra on September 3, 2026** (evaluated across low, medium, high, xhigh, and max reasoning efforts).
  * Underlying data in `artifacts/v1.1/leaderboard-live.json` reveals the last evaluated job was `20260901-deep-swe-1-1-gpt-6-astra` (completed 2026-09-01T07:35:13Z).
  * While the homepage displays `"updated September 22, 2026"`, inspection of `leaderboard-live.json` confirms this was an artifact timestamp regeneration (`generated_at: 2026-09-22T06:27:15Z`) with **zero new model jobs added**.

### Why the Official Leaderboard Stopped Adding Models
The pause on new model additions stems from three compounding developments between September 3 and October 2, 2026:

1. **Epoch AI Benchmark Audit (2026-09-07) Classified DeepSWE v1.1 as "Flawed":**
   * Epoch AI's formal review ([epoch.ai/benchmarks/deepswe/review](https://epoch.ai/benchmarks/deepswe/review)) uncovered evaluation defects in at least **23 of 113 tasks (>20.3%)**.
   * Epoch halted its review after crossing its 20% "flawed" threshold without inspecting false positives.
   * **78% of defects (18 of 23 tasks)** were caused by verifier collisions: when models wrote or modified unit tests (a normal developer behavior), DeepSWE's verifier discarded parts of the changes or injected hidden tests that collided with model-defined symbols (e.g. Go duplicate declarations, pytest fixture collisions), failing working solutions.
2. **Datacurve Pivoted to Next-Generation Benchmark (DeepSWE v1.2 / v2):**
   * On September 22, 2026, Datacurve co-founder & CEO Serena Ge posted on X ([status/2101911256135340532](https://x.com/serenaa_ge/status/2101911256135340532), cited in GitHub Issue #103) indicating that the team is *"cooking the next generation of DeepSWE"*.
   * Community discussion in GitHub Issue #103 noted: *"They officially stopped releasing benchmark results for models since Sep 03... A one-liner like 'working on the next version, updates paused for now' would've been enough."*
3. **Tokenless `envcheck` Audit (2026-09-30 / 2026-10-02) Documented 70 Grading Vulnerabilities:**
   * Tokenless published an audit ([usetokenless.com/blog/envcheck](https://usetokenless.com/blog/envcheck/) / GitHub Issue #105) showing that DeepSWE v1.1 grading environments fail to isolate test execution from model submissions.
   * Because the test harness lives inside the repository the agent patches, a submission altering `tests/conftest.py` (or equivalent test hooks in Jest/Go) can rewrite test outcomes from failed to passed, achieving full reward without implementing any functional product code.
4. **Benchmark Saturation at ~74%:**
   * Community contributors noted on GitHub Issues #98 and #102 that frontier models (Opus 5, Astra, Opus 5.5, Sol 6.1) have clustered between 74% and 75%, indicating that v1.1 has reached its discriminative ceiling.

---

## 2. Unofficial / Non-Leaderboard DeepSWE 1.1 Data Points

While the official board paused at GPT-6 Astra (74.1%), labs and researchers have self-reported or run DeepSWE 1.1 evaluations:

| Model | Lab / Origin | Score (%) | Effort / Harness | Cost / Task | Source | Date |
|---|---|---|---|---|---|---|
| **GPT-6.1 Sol** | OpenAI | 75.2% | High / mini-swe-agent | ~$0.65 | OpenAI Announcement Blog | 2026-09-29 |
| **GPT-6.1 Sol** | OpenAI | 71.0% | Max / mini-swe-agent | — | OpenAI Release (GH Issue #102) | 2026-09-29 |
| **GPT-6.1 Sol** | OpenAI | 71.0% | Xhigh / mini-swe-agent | — | OpenAI Release (GH Issue #102) | 2026-09-29 |
| **GPT-6.1 Sol** | OpenAI | 73.0% | Medium / mini-swe-agent | — | OpenAI Release (GH Issue #102) | 2026-09-29 |
| **GPT-6.1 Sol** | OpenAI | 64.0% | Low / mini-swe-agent | — | OpenAI Release (GH Issue #102) | 2026-09-29 |
| **GPT-6 Sol** | OpenAI | 68.8% | Max / mini-swe-agent | — | OpenAI Announcement Blog | 2026-09-22 |
| **GPT-6 Luna** | OpenAI | 66.6% | Max / mini-swe-agent | — | OpenAI Announcement Blog | 2026-09-22 |
| **Claude Opus 5.5** | Anthropic | 74.2% | Max (unspecified) / mini-swe-agent | — | Anthropic System Card (§8) | 2026-09-22 |
| **Claude Sonnet 5.5** | Anthropic | 71.0% | 5-trial avg / mini-swe-agent | — | Anthropic System Card | 2026-09-29 |
| **Grok 4.7** | xAI | 71.0% | High / mini-swe-agent | — | xAI News Announcement | 2026-09-21 |
| **Grok 4.7** | xAI | 73.0% | High / Grok Build harness | — | xAI News Announcement | 2026-09-21 |
| **Gemini 4 Argon** | Google DeepMind | 77.9% | Default / mini-swe-agent | — | Google DeepMind Blog | 2026-09-24 |
| **Muse Spark 1.3** | Meta | 75.4% | Max / Muse Code harness | ~$0.55 | Meta AI Research | 2026-09-02 |
| **Qwen3.8-Flash-Next NVFP4** | Community (aiglobaluser) | 47.8% | Local (2× DGX Spark) / Pier + mini-swe-agent | — | GitHub Issue #106 / edge-llm-benchmarks | 2026-10-04 |

---

## 3. Media & Independent Journalism Coverage Since 2026-09-12

1. **Epoch AI Research (2026-09-07, reported widely mid-Sep):**
   * *Report:* "Benchmark Review: DeepSWE v1.1" ([epoch.ai/benchmarks/deepswe/review](https://epoch.ai/benchmarks/deepswe/review))
   * *Nature:* Independent technical audit.
   * *Content:* Detailed 23 task failures (78% verifier collisions) leading to a "Flawed" rating.
2. **ZAVINO (2026-09-18):**
   * *Article:* "Epoch AI Benchmarks Flawed Audit" ([zavino.co/en/news/epoch-ai-benchmarks-flawed-audit](https://zavino.co/en/news/epoch-ai-benchmarks-flawed-audit))
   * *Nature:* Independent tech journalism summarizing Epoch AI's audit.
   * *Content:* Highlighted DeepSWE v1.1 as the audit's "worst case" where grader bugs discarded agent test changes without notification.
3. **The Neuron (2026-09-18):**
   * *Article:* "Epoch AI Benchmark Reviews: Nine Flawed" ([theneuron.ai/news/epoch-ai-benchmark-reviews-nine-flawed/](https://theneuron.ai/news/epoch-ai-benchmark-reviews-nine-flawed/))
   * *Nature:* Independent newsletter/journalism.
   * *Content:* Reported on the 9 flawed benchmarks, citing DeepSWE 1.1's high false-negative threshold violation.
4. **AI Weekly (2026-09-22):**
   * *Alert:* "xAI ships Grok 4.7 at $2/$6 per million tokens, DeepSWE 71%" ([aiweekly.co/alerts/xai-ships-grok-47-at-26-per-million-tokens-deepswe-71](https://aiweekly.co/alerts/xai-ships-grok-47-at-26-per-million-tokens-deepswe-71))
   * *Nature:* Industry trade news repeating lab self-reported numbers (71% / 73%).
5. **DataCamp Technical Blog (2026-09-30):**
   * *Analysis:* "GPT-6.1 Sol vs Claude Sonnet 5.5: Benchmarks and Cost Tradeoffs" ([datacamp.com/blog/gpt-6-1-sol](https://www.datacamp.com/blog/gpt-6-1-sol))
   * *Nature:* Analytical synthesis comparing vendor release benchmarks.
   * *Content:* Reported GPT-6.1 Sol scoring 75.2% on DeepSWE v1.1 at $0.65/task against Sonnet 5.5 (71.0%) and Astra (74.1% at $4.43/task).
6. **Tokenless Blog (2026-09-30 / 2026-10-02):**
   * *Article:* "envcheck: Auditing DeepSWE" ([usetokenless.com/blog/envcheck/](https://usetokenless.com/blog/envcheck/))
   * *Nature:* Independent security and benchmark integrity report.
   * *Content:* Disclosed 70 reward-hacking vulnerabilities allowing empty code changes to obtain reward 1.0 via pytest hook manipulation.
7. **CodingFleet (2026-10-02):**
   * *Report:* "DeepSWE v1.1 Leaderboard 2026" ([codingfleet.com/blog/deepswe-v11-leaderboard-2026/](https://codingfleet.com/blog/deepswe-v11-leaderboard-2026/))
   * *Nature:* Independent aggregator tracking the gap between vendor self-reports and official board stagnation.

---

## 4. Community Observations on Score Comparability

1. **Harness Discrepancies & Scaffolding Advantage:**
   * Official DeepSWE leaderboard mandates `mini-swe-agent` with standardized tools and prompt.
   * Vendor self-reports frequently use proprietary agent harnesses (e.g. xAI's *Grok Build* reaching 73% vs 71% on mini-swe-agent; Meta's *Muse Code* achieving 75.4%), conflating model capabilities with scaffolding enhancements.
2. **Effort Level Inconsistencies & Non-Monotonic Scaling:**
   * Labs report scores at differing or unstated effort levels.
   * For example, OpenAI's GPT-6.1 Sol exhibits a non-monotonic curve on DeepSWE v1.1: High effort (75.2%) outperforms both Xhigh (71.0%) and Max (71.0%), suggesting over-reasoning loops or token budget exhaustions on extreme effort settings.
3. **Severe Verification Contamination & False Negatives:**
   * Epoch AI's audit confirmed that >20.3% of tasks produce false negatives when agents write clean code but modify tests.
   * This means scores in the 70–75% band are likely compressed against an artificial ceiling caused by broken verifiers rather than model cognitive limits.
4. **Vulnerability to Reward Hacking:**
   * Tokenless demonstrated that agents can bypass tests entirely by rewriting `conftest.py` or mocking testing hooks, questioning whether future models scoring >75% are genuinely solving tasks or discovering harness bypasses.
5. **Cost-to-Score Disparities:**
   * GPT-6.1 Sol achieves 75.2% at ~$0.65 per task, while GPT-6 Astra achieves 74.1% at ~$4.43 per task (nearly 7× more expensive).
   * Leaderboards focusing solely on pass rate obscure dramatic efficiency and cost divergences across models.
