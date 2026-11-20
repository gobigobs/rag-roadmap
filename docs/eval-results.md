# Eval Results — the numbers behind the roadmap

All numbers come from the author's eval lab, `~/workspace/projects/rag-doc-qa/`.
Percentages are rounded to the nearest whole percent; exact hits/scored are shown so nothing is hidden.

## Corpus-v2 (v4) — headline eval

- **Corpus:** 12 documents, 3,778 words (9 new docs adopted 2026-11-03, original 3 unchanged).
- **Questions:** 57 total = 52 scored + 5 unanswerable controls (`eval_set_v4.json`).
- **Results:** `eval_results_v4.json`.

### Chunking A — 500 chars / 100 overlap, 64 chunks

| Retriever | Accuracy | Hits | MRR | Latency/query | Hit–control gap |
|---|---|---|---|---|---|
| Cross-encoder rerank | 92% | 48/52 | 0.957 | 2,472 ms | +11.68 |
| SBERT | 90% | 47/52 | 0.935 | 45 ms | +0.32 |
| Hybrid RRF | 88% | 46/52 | 0.934 | 46 ms | +0.001 |
| BM25 | 85% | 44/52 | 0.907 | 0.24 ms | +8.04 |
| TF-IDF | 81% | 42/52 | 0.884 | 0.57 ms | +0.09 |

### Chunking B — 250 chars / 50 overlap, 126 chunks

| Retriever | Accuracy | Hits | MRR | Latency/query | Hit–control gap |
|---|---|---|---|---|---|
| SBERT | 92% | 48/52 | 0.962 | 57 ms | +0.32 |
| Cross-encoder rerank | 90% | 47/52 | 0.943 | 1,389 ms | +11.17 |
| Hybrid RRF | 88% | 46/52 | 0.926 | 56 ms | +0.002 |
| BM25 | 81% | 42/52 | 0.886 | 1.61 ms | +8.84 |
| TF-IDF | 77% | 40/52 | 0.859 | 17.7 ms | +0.11 |

### Corpus-v2 per-category accuracy (chunking A)

| Category | TF-IDF | BM25 | SBERT | Hybrid | Rerank |
|---|---|---|---|---|---|
| Direct (26) | 88% | 88% | 92% | 92% | 96% |
| Paraphrase (15) | 87% | 87% | 93% | 93% | 93% |
| Multi-hop (4) | 50% | 75% | 75% | 50% | 100% |
| Adversarial (4) | 100% | 100% | 100% | 100% | 100% |
| Ambiguous (3) | 0% | 33% | 67% | 67% | 33% |

Note the small denominators in multi-hop (4), adversarial (4) and ambiguous (3) — per-category percentages there are indicative, not stable. The headline accuracy (52 scored) is the number to quote.

## v3 — 90-question stress test

- **Corpus:** 3 documents (~461 words).
- **Questions:** 90 total = 80 scored (16 each of direct / paraphrase / multi-hop / adversarial / ambiguous) + 10 controls. 6 questions flagged hard.
- **Results:** `eval_results_v3.json`, narrative in `REPORT.md`.

### Chunking A (500/100, 8 chunks)

| Retriever | Accuracy | Hits | MRR | Latency/query |
|---|---|---|---|---|
| Cross-encoder rerank | **94%** | 75/80 | 0.964 | 616 ms |
| SBERT | 89% | 71/80 | 0.930 | 31 ms |
| TF-IDF | 82% | 66/80 | 0.898 | 0.4 ms |
| Hybrid RRF | 82% | 66/80 | 0.897 | 25 ms |
| BM25 | 74% | 59/80 | 0.855 | 0.1 ms |

### Chunking B (250/50, 16 chunks)

| Retriever | Accuracy | Hits | MRR |
|---|---|---|---|
| SBERT | 94% | 75/80 | 0.957 |
| Hybrid RRF | 90% | 72/80 | 0.933 |
| Cross-encoder rerank | 90% | 72/80 | 0.940 |
| TF-IDF | 76% | 61/80 | 0.856 |
| BM25 | 74% | 59/80 | 0.840 |

### v3 per-category accuracy, chunking A

| Category | TF-IDF | BM25 | SBERT | Hybrid | Rerank |
|---|---|---|---|---|---|
| Direct | 94% | 94% | 100% | 100% | 100% |
| Paraphrase | 100% | 75% | 88% | 88% | 100% |
| Multi-hop | 69% | 62% | 88% | 75% | 94% |
| Adversarial | 100% | 100% | 100% | 100% | 100% |
| Ambiguous | 50% | 38% | 69% | 50% | 75% |

## v2 — 21-question eval (for the reversal story)

- **Corpus:** 3 documents (~3 KB). **Questions:** 21 scored + 3 controls.
- Chunking A: SBERT 95% (20/21), hybrid 90% (19/21), rerank 90% (19/21), BM25 81% (17/21), TF-IDF 71% (15/21).
- Chunking B: hybrid **100% (21/21)**, SBERT 95% (20/21), rerank 90% (19/21), BM25 81% (17/21), TF-IDF 76% (16/21).
- Full narrative: `REPORT.md`.

## Methodology notes

- **Scoring:** top-1 chunk's source document == expected document. MRR uses the rank of the first correct-source chunk.
- **Hit–control gap:** mean top-1 score on scored questions minus mean top-1 score on unanswerable controls. Bigger = more trustworthy abstention signal.
- **Latency:** mean ms/query on CPU, as recorded in the eval JSONs.
- **Rounding:** 84.6% → 85%, 80.8% → 81%, 92.3% → 92%, 90.4% → 90%, 88.5% → 88%. Exact fractions are always shown next to the rounded figure.
- **Limits (stated in REPORT.md):** tiny corpus; questions hand-written by the person who knows the docs; "multi-step" questions are single-doc in v2/v3; no answer-quality eval yet — retrieval only.

## What is NOT in this file

No answer-level trial scores. A small local trial with a small model and a noisy judge was run for exploration; its scores are indicative only and are deliberately excluded from this roadmap, this file, and the site.
