# Stage 02 — Retrieval

**Goal:** pick the retriever that actually deserves to serve your RAG system — by measuring it, not by reading about it.

## The five methods, in the order you should try them

| # | Method | What it does | When it shines |
|---|---|---|---|
| 1 | TF-IDF | Term-frequency × inverse-document-frequency weighting | Baseline. Every method must beat it. |
| 2 | BM25 | Probabilistic lexical ranking (k1, b parameters) | Keyword-heavy traffic; best latency/accuracy trade |
| 3 | SBERT | Dense embeddings (`all-MiniLM-L6-v2`) + FAISS cosine search | Paraphrases with zero keyword overlap |
| 4 | Hybrid (RRF) | Reciprocal rank fusion of SBERT + BM25 rankings | When the two rankings disagree usefully |
| 5 | Cross-encoder rerank | Pairwise query↔chunk scoring (MS MARCO MiniLM-L-6-v2) | Ambiguous and multi-hop questions — see Stage 03 |

## Measured results — corpus-v2 (12 docs, 3,778 words, 52 scored questions)

Source: `rag-doc-qa/eval_results_v4.json`.

### Chunking A — 500 chars / 100 overlap, 64 chunks

| Retriever | Accuracy | MRR | Latency/query |
|---|---|---|---|
| Cross-encoder rerank | **92%** (48/52) | 0.957 | 2,472 ms |
| SBERT | 90% (47/52) | 0.935 | 45 ms |
| Hybrid RRF | 88% (46/52) | 0.934 | 46 ms |
| BM25 | 85% (44/52) | 0.907 | 0.24 ms |
| TF-IDF | 81% (42/52) | 0.884 | 0.57 ms |

### Chunking B — 250 chars / 50 overlap, 126 chunks

| Retriever | Accuracy | MRR | Latency/query |
|---|---|---|---|
| SBERT | **92%** (48/52) | 0.962 | 57 ms |
| Cross-encoder rerank | 90% (47/52) | 0.943 | 1,389 ms |
| Hybrid RRF | 88% (46/52) | 0.926 | 56 ms |
| BM25 | 81% (42/52) | 0.886 | 1.61 ms |
| TF-IDF | 77% (40/52) | 0.859 | 17.7 ms |

## For this, like this

- **For a first prototype:** TF-IDF. It is the baseline, not the system — it dies on paraphrases with zero keyword overlap.
- **For keyword-heavy traffic at scale:** BM25 — 85% at 0.24 ms/query on chunking A. Nothing else is that cheap.
- **For the balanced production pick:** SBERT — 90% at ~45 ms on chunking A, 92% on chunking B.
- **For fusion:** measure before you believe it. Hybrid trails SBERT alone on both chunkings here (88% vs 90%/92%). Fusion is not a free win.
- **For chunking:** halving chunks (500/100 → 250/50) lifts SBERT 90% → 92%. Finer chunks are tighter semantic units, so embeddings dilute less.

## The trap to remember

On the small 21-question v2 eval, hybrid on small chunks scored a perfect **100% (21/21)**. On 52 scored questions it is 88%. Small evals lie politely — see [Stage 04 — Evaluation](04-evaluation.md).

## Exit criteria

- [ ] You have run at least TF-IDF, BM25 and SBERT over the same eval set and can quote all three accuracies.
- [ ] You can explain, with an example, a question SBERT gets that BM25 misses (a paraphrase with no shared keywords).
- [ ] You have tried two chunk sizes and measured the difference instead of assuming one.

**Next:** [Stage 03 — Reranking & Abstention](03-reranking.md)
