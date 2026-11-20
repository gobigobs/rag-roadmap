# RAG Roadmap — Build Retrieval You Can Prove

Learn RAG by measuring it: five stages from your first chunk to production-grade
retrieval, where every claim carries its exact accuracy, hits, and latency from a
real 90-question stress test. Rerank wins at **94%** — and you can see why.

![RAG Roadmap hero — outcome-first headline, live mini eval lab, bento stats](docs/screenshots/home.png)

[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Eval: rerank 94%](https://img.shields.io/badge/v3_stress_test-rerank_94%25_(75%2F80)-C9A84C)](docs/eval-results.md)

## Quick start — 30 seconds

```bash
npm install
npm run dev      # open the roadmap in your browser
npm run build    # type-check + production build → dist/
```

That's it. No API key, no account, no backend — the whole site runs locally and
offline. Requires Node 18+.

## What it is

A developer-roadmap site for Retrieval-Augmented Generation, built the way the
subject was actually learned: **basics → retrieval → reranking → evaluation →
agents**. Every percentage on the page comes from the author's own retrieval eval
lab (`rag-doc-qa`), with its exact hits, corpus size, and latency next to it.
Nothing is advice without evidence; nothing is a claim without a count.

| Feature | What you get |
|---|---|
| Interactive roadmap | 5 expandable stages, each ending with measured evidence from the lab — "for this, like this", with real numbers |
| Try-the-lab hero | A working slice of the Eval Lab above the fold: toggle chunking A/B and watch the top-3 ranking move live |
| Eval Lab | 5 retrieval methods × 2 chunkings over corpus-v2 (52 scored questions), plus the v3 per-category table |
| My progress | Tick stages done; count and progress bar persist in localStorage across reloads, with reset |
| Lessons | 6 findings the eval actually taught — small evals lie, fusion is not free magic, the cross-encoder is a verifier |
| Pipeline | The exact stack that produced the numbers: SBERT, FAISS, word-boundary chunking, fallbacks |
| Credentials | IBM RAG and Agentic AI Specialization progress, earned in the author's own coursework |
| Coming next | Agents stage carries a clearly-marked *planned* card for *Fundamentals of Building AI Agents* — no syllabus or date claimed |

![Eval Lab — toggle chunking A/B and watch the ranking move](docs/screenshots/eval-lab.png)

## Headline numbers (all verified — see `docs/eval-results.md`)

| Eval | Best method | Accuracy |
|---|---|---|
| 90-question stress test (v3), chunking A | Cross-encoder rerank | **94%** (75/80) |
| Corpus-v2 (12 docs, 52 scored), chunking A | Cross-encoder rerank | **92%** (48/52) |
| Corpus-v2, chunking B | SBERT | **92%** (48/52) |

Corpus-v2, chunking A in full: rerank 92% (48/52), SBERT 90% (47/52), hybrid 88%
(46/52), BM25 85% (44/52), TF-IDF 81% (42/52). Chunking B: SBERT 92% (48/52),
rerank 90% (47/52), hybrid 88% (46/52).

The number that matters most for production is not accuracy — it is the
cross-encoder's hit–control gap of **+11.68**, the best "I don't know" signal in
the lab, vs ≈ +0.001 for hybrid RRF. That gap is why the roadmap says: rank with
SBERT, let the cross-encoder decide whether to answer at all.

## Roadmap structure

| Stage | Title | One line |
|---|---|---|
| 01 | RAG Basics | Answer from your documents, not from model memory. |
| 02 | Retrieval | The retriever is the system. Measure it before you trust it. |
| 03 | Reranking & Abstention | Rank cheap, verify expensive — and know when to say "I don't know". |
| 04 | Evaluation | Measure first, trust later. The corpus — not the retriever — is usually the limit. |
| 05 | Agents | From answering questions to doing work, with the same eval discipline. |

![Roadmap stages — expandable cards with measured evidence](docs/screenshots/stages.png)

## How the numbers were earned

The lab grew its questions as it grew its corpus, and the findings reversed as it
grew — which is itself the lesson. The v2 eval had 21 scored questions and hybrid
scored a perfect 100% on small chunks. On the 90-question v3 stress test (80 scored
+ 10 controls, 16 per category), hybrid fell to 82–90% and rerank went from
"surprise loser" to best at 94%. v3 squeezed those 90 questions out of just 3
documents (~461 words) and the strain showed, so corpus-v2 added 9 documents:
12 docs, 3,778 words, 57 new questions (52 scored + 5 controls), adopted
2026-11-03. Chunking is a lever, not a detail: halving chunks (500/100 → 250/50)
lifts SBERT 90% → 92%. Ambiguous questions are where methods actually separate —
BM25 38%, rerank 75% on v3 — and one question (Q74, "What do I type in the
terminal to begin?") defeated every retriever on both chunkings. Full method:
`docs/methodology.md`. Every number, with exact hits/scored: `docs/eval-results.md`.

## Repo layout

```
rag-roadmap/
├── src/
│   ├── data/roadmap.ts        # single source of truth: every verified number
│   ├── lib/progress.ts        # "My progress" tracker: localStorage persistence
│   ├── components/            # Hero (live mini-lab), Roadmap, EvalLab, Sections
│   └── App.tsx
├── docs/
│   ├── 01-basics.md … 05-agents.md   # stage guides, "for this, like this"
│   ├── eval-results.md        # every number, with exact hits/scored
│   ├── methodology.md         # how the numbers were produced
│   └── screenshots/           # fresh captures of the production build
└── README.md
```

## Design

Dark-first editorial system: near-black canvas (`#0A0B0C`), warm off-white ink
(`#FAF7F2`), one muted-gold accent (`#C9A84C`) used sparingly, Inter in three
weights with a mono face for numbers and labels. Motion is CSS transitions only —
200 ms hovers, 500 ms bar and reveal animations — and respects
`prefers-reduced-motion`.

## Sources

Every number comes from the author's eval lab, `~/workspace/projects/rag-doc-qa/`:

- `eval_results_v4.json` — corpus-v2 results (12 docs, 3,778 words, 52 scored + 5 controls).
- `eval_results_v3.json` + `REPORT.md` — 90-question stress test (80 scored + 10 controls) and the 21-question v2 eval.
- `corpus-v2-candidates/README.md` — corpus-v2 adoption (2026-11-03).
- `README.md`, `chunker.py`, `embedder.py`, `vectorstore.py` — pipeline facts (all-MiniLM-L6-v2, FAISS IndexFlatIP, word-boundary chunking, fallbacks).

Certificates: *Advanced RAG with Vector Databases and Retrievers* (IBM, Coursera,
issued 13 Nov 2026) and *Build Multimodal Generative AI Applications* (IBM,
Coursera, issued 14 Nov 2026), both in the IBM RAG and Agentic AI Specialization.
Next course: *Fundamentals of Building AI Agents*.

## What is deliberately NOT here

No answer-level trial scores appear anywhere in this repo — site, docs or README.
A small local trial with a small model and a noisy judge was run for exploration
only; its scores are indicative, not evidence, and are excluded by design.

## Status

Local build only. No GitHub repo has been created and nothing has been pushed.

## Corrections log

- 2026-11-17: the v3 corpus size was corrected from "~2,500 words" to "~461 words" in `src/data/roadmap.ts`, `docs/04-evaluation.md`, `docs/eval-results.md` and `docs/methodology.md`. The figure came from `REPORT.md`, but the three v3 documents total 454 words by `wc -w`, and `rag-doc-qa/corpus-v2-candidates/README.md` states "~461 words total". The old figure is not used anywhere now.
- 2026-11-17: added the "My progress" tracker (`src/lib/progress.ts`, localStorage key `rag-roadmap-progress-v1`) and the "Coming next" card for the Agents stage (planned coverage only — see `src/data/roadmap.ts`, `AGENTS_COMING_NEXT`).
- 2026-11-18: luxury polish — gold-on-near-black editorial system, live mini-lab in the hero, bento stats, sticky glass nav, refined Eval Lab, scroll reveals, fresh screenshots. No number changed.
