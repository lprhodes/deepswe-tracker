# DeepSWE 1.1 Model Investigation Notes (Task t3: Chinese Labs, Open-Weight Labs, Mistral)

Conducted: 2026-10-09

## Overview
Datacurve's DeepSWE is a contamination-resistant long-horizon software engineering benchmark consisting of 113 original tasks across 91 open-source repositories in 5 languages (Python, TypeScript, Go, Rust, JavaScript). Version 1.1 introduced isolated verifier environments and sanitized git histories to prevent repository commit inspection.

This research tracked self-reported and verified benchmark scores for Chinese labs, open-weight models, and Mistral, with an emphasis on models released or updated since 2026-09-12.

---

## Model Census

| Lab | Model | DeepSWE 1.1 Status | Score (%) | Harness | Primary URL |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **DeepSeek** | DeepSeek-V4.1-Flash | **Yes** | 74.2% | mini-swe-agent (max effort) | [HuggingFace](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) |
| DeepSeek | DeepSeek-V4.1-Flash (multi-scaffold) | **Yes** | 65.5%–72.6% | Claude Code, Codex, OpenCode, Pi, DSH | [HuggingFace](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) |
| DeepSeek | DeepSeek-V4-Pro | **Yes** | 62.7% | mini-swe-agent | [HuggingFace](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) |
| DeepSeek | DeepSeek-V4-Flash | **Yes** | 54.4% | mini-swe-agent | [HuggingFace](https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash) |
| DeepSeek | DeepSeek R-series (R1/R2) | No | — | — | [HuggingFace](https://huggingface.co/deepseek-ai) |
| **Alibaba Qwen** | Qwen3.8-Flash-Next | **Yes** | 58.7% | mini-swe-agent | [HuggingFace](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) |
| Alibaba Qwen | Qwen3.8-Max (2.4T-A95B) | **Yes** | 56.6% | Claude Code | [HuggingFace](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) |
| Alibaba Qwen | Qwen3.8-27B | **Yes** | 42.2% | Claude Code | [HuggingFace](https://huggingface.co/Qwen/Qwen3.8-27B) |
| Alibaba Qwen | Qwen3.6-27B | **Yes** | 13.3% | Claude Code | [HuggingFace](https://huggingface.co/Qwen/Qwen3.8-27B) |
| Alibaba Qwen | Qwen3.7-Plus | **Yes** | 16.5% | mini-swe-agent | [HuggingFace](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) |
| Alibaba Qwen | Qwen3.7-Max | **Yes** | 21.6% | Claude Code | [HuggingFace](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) |
| Alibaba Qwen | Qwen 2.5-Coder / 3-Coder | No | — | — | [GitHub](https://github.com/QwenLM) |
| **Moonshot AI** | Kimi K3 | **Yes** | 67.5% | Kimi Code (lab-internal) | [HuggingFace](https://huggingface.co/moonshotai/Kimi-K3) |
| Moonshot AI | Kimi K3 (official board) | **Yes** | 67.3% | mini-swe-agent | [HuggingFace](https://huggingface.co/moonshotai/Kimi-K3) |
| Moonshot AI | K3 Low / High / Max (Fireworks) | **Yes** | 55.8% / 62.8% / 66.4% | mini-swe-agent | [Fireworks Blog](https://fireworks.ai/blog/ember-1) |
| Moonshot AI | Kimi K2.7-Code | No | — | — | [Moonshot](https://www.kimi.ai/) |
| **Zhipu AI (Z.ai)** | GLM-5.3 | **Yes** | 66.9% | mini-swe-agent | [HuggingFace](https://huggingface.co/zai-org/GLM-5.3) |
| Zhipu AI (Z.ai) | GLM-5.3-Flash | **Yes** | 63.4% | mini-swe-agent | [Z.ai Blog](https://z.ai/blog/glm-5.3-flash) |
| Zhipu AI (Z.ai) | GLM-5.2 | **Yes** | 46.2% | mini-swe-agent (Pier) | [HuggingFace](https://huggingface.co/zai-org/GLM-5.2) |
| Zhipu AI (Z.ai) | GLM-5.1 | Different (v1.0) | 18.0% | mini-swe-agent | [Z.ai](https://z.ai/) |
| **Xiaomi** | MiMo-V2.6-Pro | **Yes** | 71.9% (72.57% RL) | lab-internal | [Xiaomi MiMo](https://mimo.xiaomi.com/mimo-v2-6) |
| Xiaomi | MiMo-V2.6-Flash | **Yes** | 67.9% (65.68% RL) | lab-internal | [Xiaomi MiMo](https://mimo.xiaomi.com/mimo-v2-6) |
| Xiaomi | MiMo-V2.5-Pro | **Yes** | 19.0% | lab-internal | [Xiaomi MiMo](https://mimo.xiaomi.com/mimo-v2-6) |
| **Tencent** | Hy4 preview | **Yes** | 64.3% | lab-internal | [HuggingFace](https://huggingface.co/tencent/Hy4-preview) |
| Tencent | Hy3 | **Yes** | 28.0% | lab-internal | [HuggingFace](https://huggingface.co/tencent/Hy4-preview) |
| **StepFun** | Step 5 Preview | **Yes** | 67.7% | mini-swe-agent / SWE-agent | [StepFun](https://www.stepfun.com/) |
| StepFun | Step-2 / Step-3 | No | — | — | [StepFun](https://www.stepfun.com/) |
| **Mistral AI** | Mistral Large 4 (*le Chonk*) | **Yes** | 61.7% | Partner eval (AA & Surge) | [Mistral News](https://mistral.ai/news/mistral-large-4/) |
| Mistral AI | Devstral 2 / Devstral Small | No | — | — | [Mistral News](https://mistral.ai/news/devstral-2-vibe-cli/) |
| Mistral AI | Codestral | No | — | — | [Mistral News](https://mistral.ai/news/codestral/) |
| **Fireworks AI** | Ember-1 | **Yes** | 75.2% | mini-swe-agent | [Fireworks Blog](https://fireworks.ai/blog/ember-1) |
| **Reflection AI** | Beam | **Yes** | 44.4% | Not stated | [The Decoder](https://the-decoder.com/reflections-beam-becomes-the-most-capable-open-weight-model-built-outside-china/) |
| **MiniMax** | MiniMax-M3 | **Yes** (Third-party) | 13.3% (strict) / 16.8% (ext) | mini-swe-agent (Pier) | [Audit by entrpi](https://entrpi.github.io/misc/deep-swe-minimax-m3/) |
| MiniMax | MiniMax-Text-02 / abab | No | — | — | [MiniMax](https://minimax.io/) |
| **ByteDance** | Seed 2.0 / Seed-Coder / Doubao | No | — | — | [ByteDance Seed](https://seed.bytedance.com/) |
| **Baidu** | ERNIE 4.5 / 5.0 / 5.1 | No | — | — | [Baidu ERNIE](https://ernie.baidu.com/) |
| **Meituan** | LongCat 2.0 / 2.5 | No | — | — | [arXiv:2609.35236](https://arxiv.org/html/2609.35236v1) |
| **iFlytek** | SparkDesk 5.0 | No | — | — | [iFlytek](https://www.iflytek.com/) |
| **01.AI** | Yi-Coder / Yi-Lightning | No | — | — | [01.AI](https://01.ai/) |
| **Nvidia** | Nemotron (Cascade / 3 / 4) | No | — | — | [Nvidia Research](https://research.nvidia.com/labs/nemotron/) |
| **Allen AI** | OLMo / Tulu / SERA | No | — | — | [Allen AI](https://allenai.org/) |
| **Cohere** | Command R / Command R+ | No | — | — | [Cohere](https://cohere.com/) |
| **Agentica** | DeepSWE-Preview (Model) | Different benchmark | — | — | [HuggingFace](https://huggingface.co/agentica-org/DeepSWE-Preview) |

---

## Detailed Notes by Lab

### 1. DeepSeek
- **DeepSeek-V4.1-Flash** (2026-09-10): Reports 74.2% on DeepSWE v1.1 under `reasoning_effort=100`, evaluated with `mini-swe-agent` across N=8 samples per task (temp=1.0, top_p=0.95, 1M context, max_steps=500). Also provides multi-scaffold ablation: Claude Code (69.8%), Codex (65.6%), OpenCode (65.5%), Pi (66.2%), DSH Minimal (72.6%), DSH Standard (70.5%), and DSH PTC (67.6%).
- **DeepSeek-V4-Pro**: Baseline in the comparison table at 62.7% (with independent leaderboard tracking at 63.0% ± 6%).
- **DeepSeek-V4-Flash**: Baseline in the table at 54.4%.

### 2. Alibaba Qwen
- **Qwen3.8-Flash-Next** (2026-08-24): Self-reports 58.7% on DeepSWE 1.1. Footnote specifies evaluation with Claude Code and mini-SWE-agent (temp=1.0, top_p=0.95, 256K context), taking the highest score (performs best on mini-SWE-agent).
- **Qwen3.8-Max** (`Qwen3.8-2.4T-A95B`, 2026-08-08): Self-reports 56.6% on DeepSWE 1.1, performing best on Claude Code.
- **Qwen3.8-27B** (2026-08-05): Self-reports 42.2% on Claude Code.
- Earlier baselines in tables: Qwen3.7-Max (21.6%), Qwen3.7-Plus (16.5%), Qwen3.6-27B (13.3%).

### 3. Moonshot AI
- **Kimi K3** (2026-07-23, updated 2026-09-02): Self-reports 67.5% on DeepSWE v1.1 using the Kimi Code harness at max reasoning effort (temp=1.0, top_p=1.0). Footnote notes K3 achieves 67.3% on the official leaderboard with mini-SWE-agent.
- **Fireworks evaluation of K3** (2026-09-23): K3 Low: 55.8%, K3 High: 62.8%, K3 Max: 66.4% across 113 tasks.

### 4. Zhipu AI (Z.ai)
- **GLM-5.3** (2026-08-25): Self-reports 66.9% on DeepSWE v1.1 using mini-swe-agent (`temp=0.95`, `top_p=1.0`, timeout=6h, 400K context).
- **GLM-5.3-Flash** (2026-08-25): Self-reports 63.4% on DeepSWE v1.1 with mini-swe-agent.
- **GLM-5.2** (2026-06-16): Self-reports 46.2% on DeepSWE using Pier and mini-swe-agent (`temp=1.0`, `top_p=1.0`, timeout=2h, 400K context, 2 CPUs, 8GB RAM).

### 5. Xiaomi
- **MiMo-V2.6-Pro** (2026-09-21): Self-reports 71.9% on DeepSWE v1.1 in the launch appendix; live RL telemetry reached 72.57% (up from 58.4% before RL).
- **MiMo-V2.6-Flash** (2026-09-21): Self-reports 67.9% in the launch appendix; RL run reached 65.68% (up from 48.8%).
- **MiMo-V2.5-Pro**: Baseline at 19.0%.

### 6. Tencent Hunyuan
- **Hy4 preview** (2026-08-27): Reports 64.3% on DeepSWE in official Benchmark Appendix image/technical disclosures.
- **Hy3**: Baseline at 28.0%.

### 7. StepFun
- **Step 5 Preview** (2026-09-20): 600B MoE (27B active) self-reports 67.7% on DeepSWE v1.1 at High reasoning effort using SWE-agent / mini-swe-agent.

### 8. Mistral AI
- **Mistral Large 4** (2026-10-06): Self-reports 61.7% on DeepSWE v1.1 (evaluated in partnership with Artificial Analysis and Surge AI).
- Devstral 2 and Codestral did not self-report DeepSWE 1.1 scores (reported SWE-bench Verified and Terminal-Bench).

### 9. Fireworks AI
- **Ember-1** (2026-09-23): Post-trained Kimi K3 variant self-reports 75.2% on DeepSWE 1.1 (N=113), saving 23.7% ($126.90 total, $3.62/task vs $4.74/task for K3 Max).

### 10. Reflection AI
- **Beam** (2026-10-06): Open-weight 501B/23B MoE reports 44.4% on DeepSWE v1.1.

### 11. MiniMax
- **MiniMax-M3**: Lab did not publish DeepSWE scores on official website. Independent audit by entrpi (2026-06-02) using unmodified mini-swe-agent in Pier evaluated 113 tasks: 13.3% strict pass rate, 16.8% extended pass rate, $7.48 median cost, 80k median tokens, 325 median steps.

### 12. Non-Reporting Labs
- **ByteDance**: Seed-Coder and Doubao-Seed-Code published SWE-bench Verified (78.8%) but no DeepSWE 1.1 scores.
- **Baidu**: Published technical deep-dives on DeepSWE methodology but no self-reported ERNIE score.
- **Meituan**: Published research paper (arXiv:2609.35236) analyzing DeepSWE v1.1 capability correlations across 29 benchmarks, but no self-reported score for LongCat models.
- **iFlytek**, **01.AI**, **Cohere**: No DeepSWE 1.1 scores published.
- **Nvidia**: Supported DeepSWE environment in NeMo Gym and hosts third-party models with DeepSWE scores on NIM, but no self-reported score for Nemotron models.
- **Allen AI**: Cited DeepSWE-Preview agent in SERA paper; did not benchmark on DeepSWE benchmark.
- **Agentica / Together AI**: Released `agentica-org/DeepSWE-Preview`, which is an RL-trained model named DeepSWE evaluated on SWE-bench Verified (42.2%–59.0%), not a score on Datacurve's DeepSWE benchmark.
