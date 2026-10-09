# DeepSWE 1.1 Model Search Notes (US Labs)
*Date: 2026-10-09 | Dossier Task: t2*

This document catalogs every US lab frontier model investigated for self-reported scores on Datacurve's **DeepSWE v1.1** (113 long-horizon software engineering tasks across 91 repositories).

---

## 1. OpenAI

| Model | Reported DeepSWE 1.1? | Score / Status | Primary URL / Source |
| :--- | :--- | :--- | :--- |
| **GPT-6.1 Sol** | Yes | 75.22% (High), 73.01% (Medium), 71.90% (XHigh/Max), 64.38% (Low) | [OpenAI GPT-6.1 Sol Launch Post](https://openai.com/index/introducing-gpt-6-1-sol/) |
| **GPT-6.1 Luna** | No | Not released / no separate 6.1 Luna tier announced | [OpenAI GPT-6.1 Sol Launch Post](https://openai.com/index/introducing-gpt-6-1-sol/) (references base GPT-6 Luna) |
| **GPT-6 Astra** | Yes | 74.12% (XHigh), 73.23% (High/Max), 72.79% (Medium), 67.04% (Low) | [OpenAI GPT-6 Astra Launch Post](https://openai.com/index/gpt-6-astra/) |
| **GPT-6 Sol** | Yes | 68.81% (Max), 66.59% (XHigh), 65.27% (High), 56.64% (Medium), 37.17% (Low) | [OpenAI GPT-6 Sol & Luna Launch Post](https://openai.com/index/introducing-gpt-6-sol-and-luna/) |
| **GPT-6 Luna** | Yes | 66.59% (Max), 61.28% (XHigh), 59.29% (High), 44.47% (Medium), 2.43% (Low) | [OpenAI GPT-6 Sol & Luna Launch Post](https://openai.com/index/introducing-gpt-6-sol-and-luna/) |
| **GPT-5.6 Sol** | Yes | 72.67% (Max), 70.73% (XHigh), 69.40% (High), 61.06% (Medium), 45.35% (Low) | [OpenAI GPT-6 Astra Launch Post](https://openai.com/index/gpt-6-astra/) & [GPT-5.6 Launch Post](https://openai.com/index/gpt-5-6/) |
| **GPT-5.6 Terra** | Yes | 69.6% (Single attempt / launch table) | [OpenAI GPT-5.6 Launch Post](https://openai.com/index/gpt-5-6/) |
| **GPT-5.6 Luna** | Yes | 67.2% (Launch table) / Low 1.22% to Max 62.17% (GPT-6 Sol chart) | [OpenAI GPT-5.6 Launch Post](https://openai.com/index/gpt-5-6/) & [GPT-6 Sol & Luna Launch Post](https://openai.com/index/introducing-gpt-6-sol-and-luna/) |
| **GPT-5.5** | Yes | 67.0% (Launch comparison table) | [OpenAI GPT-5.6 Launch Post](https://openai.com/index/gpt-5-6/) |

---

## 2. Anthropic

| Model | Reported DeepSWE 1.1? | Score / Status | Primary URL / Source |
| :--- | :--- | :--- | :--- |
| **Claude Opus 5.5** | Yes | 74.2% (Mean@5 trials, Section 8.3) | [Claude Opus 5.5 System Card (PDF)](https://www-cdn.anthropic.com/fc1b44717c85dc068bc6ba5024219938094694bd/Claude%20Opus%205.5%20System%20Card.pdf) |
| **Claude Sonnet 5.5** | Yes | 71.0% (Mean@5 trials, Section 8.3) | [Claude Sonnet 5.5 System Card (PDF)](https://www-cdn.anthropic.com/870c8f525702625d2c62fc6dd04c857e3250bec1/Claude%20Sonnet%205.5%20System%20Card.pdf) |
| **Claude Haiku 5.5** | No | Reported SWE-bench Pro (64.8%), FrontierSWE v2 (43.8%), ProgramBench (82.0%); DeepSWE omitted from Section 8 | [Claude Haiku 5.5 System Card (PDF)](https://www-cdn.anthropic.com/e1080d6bf5ae2018ea3c2f414064be03232f5be5/Claude%20Haiku%205.5%20System%20Card.pdf) |
| **Claude Fable 5.1** | Yes | 67.4% (Mean@5 trials, Section 8.3; noted over-implementation penalty) | [Claude Fable 5.1 & Mythos 5.1 System Card (PDF)](https://www-cdn.anthropic.com/0339e6a7c5c7b87f5c07798616dc32c215d14235/Claude%20Fable%205.1%20&%20Claude%20Mythos%205.1%20System%20Card.pdf) |
| **Claude Opus 5** | Yes | 68.8% (Mean@5 trials, Section 8.3; OpenAI measured Low 58.13% to Max 73.65%) | [Claude Opus 5 System Card (PDF)](https://www-cdn.anthropic.com/c5fbac3f0b1280a933ebd26d3cb8bb9f5bdeaf48/Claude%20Opus%205%20System%20Card.pdf) |
| **Claude Opus 4.8** | Yes | 59.0% (Reported in Opus 5 System Card Table 8.1) | [Claude Opus 5 System Card (PDF)](https://www-cdn.anthropic.com/c5fbac3f0b1280a933ebd26d3cb8bb9f5bdeaf48/Claude%20Opus%205%20System%20Card.pdf) |
| **Claude Fable 5** | Yes | 69.7% (Reported in Opus 5 System Card Table 8.1; OpenAI measured Low 59.58% to Max 69.72%) | [Claude Opus 5 System Card (PDF)](https://www-cdn.anthropic.com/c5fbac3f0b1280a933ebd26d3cb8bb9f5bdeaf48/Claude%20Opus%205%20System%20Card.pdf) |
| **Claude Sonnet 5** | No | 53.8% cited on Datacurve public leaderboard (in peer cards); no Anthropic self-evaluation card reported | [Google Gemini 3.8 Flash Eval Report](https://storage.googleapis.com/deepmind-media/gemini/gemini_3-8_flash_model_evaluation.pdf) |

---

## 3. Google DeepMind

| Model | Reported DeepSWE 1.1? | Score / Status | Primary URL / Source |
| :--- | :--- | :--- | :--- |
| **Gemini 4 Argon** | Yes | 77.9% (Single attempt, highest thinking setting, mini-swe-agent) | [Introducing Gemini 4 Argon](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/) & [Evaluation PDF](https://storage.googleapis.com/deepmind-media/gemini/gemini_4_argon_model_evaluation.pdf) |
| **Gemini 3.8 Flash** | Yes | 73.7% / 73.8% (High thinking, mini-swe-agent harness) | [Introducing Gemini 3.8 Flash](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/) & [Evaluation PDF](https://storage.googleapis.com/deepmind-media/gemini/gemini_3-8_flash_model_evaluation.pdf) |
| **Gemini 3.7 Flash** | Sourced via Aggregator | 65.3% (Cited from Datacurve public leaderboard in Gemini 3.8 Flash report) | [Gemini 3.8 Flash Evaluation PDF](https://storage.googleapis.com/deepmind-media/gemini/gemini_3-8_flash_model_evaluation.pdf) |
| **Gemini 3.x Pro** | No | No standalone Gemini 3 Pro DeepSWE 1.1 score reported by Google | Google DeepMind evaluation archives |

---

## 4. xAI

| Model | Reported DeepSWE 1.1? | Score / Status | Primary URL / Source |
| :--- | :--- | :--- | :--- |
| **Grok 4.7** | Yes | 71.0% (High effort, mini-SWE-agent harness) | [Grok 4.7 Model Card (PDF)](https://media.x.ai/v1/website/card4p7-3a96f40b.pdf) |
| **Grok 4.6** | Yes | 67.0% (XHigh), 65.9% (High) (mini-swe-agent harness) | [Grok 4.6 Model Card (PDF)](https://media.x.ai/v1/website/card-4p6-4cd2dc57.pdf) |
| **Grok 4.5** | Yes | 54.0% (High effort in Grok 4.6 card) / 53.0% (Grok 4.7 card) | [Grok 4.6 Model Card (PDF)](https://media.x.ai/v1/website/card-4p6-4cd2dc57.pdf) |

---

## 5. Meta

| Model | Reported DeepSWE 1.1? | Score / Status | Primary URL / Source |
| :--- | :--- | :--- | :--- |
| **Muse Spark 1.3** | Yes | 75.4% (Max effort, mini-swe-agent harness) | [Introducing Muse Spark 1.3](https://research.meta.ai/blog/introducing-muse-spark-1-3) & [Methodology PDF](https://research.meta.ai/static/muse-spark-1-3-multimodal-evaluation-methodology) |
| **Muse Spark 1.2** | Yes | 55.0% (XHigh effort, reported in Muse Spark 1.3 scorecard) | [Introducing Muse Spark 1.3](https://research.meta.ai/blog/introducing-muse-spark-1-3) |
| **Muse Spark 1.1** | No | Only internal subsets reported in early evaluation report; no full DeepSWE 1.1 benchmark score | [Meta AI Muse Spark 1.1 Evaluation Report](https://ai.meta.com/static-resource/muse-spark-1-1-evaluation-report/) |

---

## 6. Other US Tech Platforms (Amazon, Microsoft, Nvidia)

| Entity / Model | Reported DeepSWE 1.1? | Notes | Primary URL / Source |
| :--- | :--- | :--- | :--- |
| **Amazon (AWS)** | No (first-party) | AWS does not report first-party model scores on DeepSWE 1.1; AWS Bedrock blog posts cite partner models (GPT-6.1 Sol, Grok 4.7, GLM 5.3) | [AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/) |
| **Microsoft (Phi / Copilot)** | No | No official Microsoft self-reported DeepSWE 1.1 scores for Phi-4 or Copilot Workspace | [Microsoft AI Blogs](https://blogs.microsoft.com/) |
| **Nvidia (Nemotron)** | No | No official Nvidia self-reported DeepSWE 1.1 scores for Nemotron 3/3.5 in published model cards | [NVIDIA Developer](https://developer.nvidia.com/) |
