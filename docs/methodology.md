# Methodology — how every number on this site was produced

## The lab

All measurements come from the author's own project, `~/workspace/projects/rag-doc-qa/`
(a Python CLI: `rag.py`, `chunker.py`, `embedder.py`, `vectorstore.py`, `rag_llm.py`, `cli.py`).

## Pipeline (the system under test)

- **Chunking:** word-boundary splitting, never mid-word, with overlap so context survives chunk edges. Chunking A: 500 chars / 100 overlap. Chunking B: 250 chars / 50 overlap.
- **Embeddings:** `sentence-transformers`, `all-MiniLM-L6-v2` (384-dim), with automatic TF-IDF fallback.
- **Vector store:** FAISS `IndexFlatIP` on normalized vectors (= cosine similarity), with automatic numpy brute-force fallback.
- **Retrievers compared:** TF-IDF, BM25, SBERT, Hybrid RRF (reciprocal rank fusion, `1/(60+rank)`), cross-encoder rerank (MS MARCO `MiniLM-L-6-v2`).
- **Answering:** extractive offline; abstractive via any OpenAI-compatible endpoint when a key is set.

## Scoring

- **Accuracy (acc@1):** top-1 chunk's source document == expected document.
- **MRR:** mean reciprocal rank of the first correct-source chunk.
- **Margin:** top-1 minus top-2 score, native scale (not comparable across retrievers).
- **Hit–control gap:** mean top-1 score on scored questions minus mean top-1 score on unanswerable controls. Bigger = more trustworthy abstention signal.
- **Latency:** mean ms/query on CPU, as recorded in the eval JSONs.

## Eval sets

| Eval | Corpus | Questions | Files |
|---|---|---|---|
| v2 | 3 docs, ~3 KB | 21 scored + 3 controls | `eval_set_v2.json`, `eval_v2.py` |
| v3 | 3 docs, ~461 words | 80 scored + 10 controls (90 total), 6 flagged hard | `eval_set_v3.json`, `eval_v3.py`, `eval_results_v3.json` |
| corpus-v2 (v4) | 12 docs, 3,778 words | 52 scored + 5 controls (57 total) | `eval_set_v4.json`, `eval_v4.py`, `eval_results_v4.json` |

Corpus-v2 was adopted 2026-11-03: 9 candidate documents added unchanged to `demo_docs/`, original 3 untouched. See `corpus-v2-candidates/README.md` for per-document sources (Wikipedia CC BY-SA, Milvus, LangChain, KDB-X, Reintech, and the author's own rag-chatbot README).

## Reproduce

```bash
cd ~/workspace/projects/rag-doc-qa
no_proxy=localhost,127.0.0.1 NO_PROXY=localhost,127.0.0.1 .venv/bin/python eval_v4.py
```

## Honest limits (from REPORT.md)

- Tiny corpus (3 docs in v2/v3; 12 in v4) — rankings may shuffle on a real knowledge base.
- Questions hand-written by the same person who knows the docs — possible bias toward/against specific retrievers.
- "Multi-step" questions are single-doc in v2/v3; true cross-document multi-hop needs a bigger corpus and multi-source scoring.
- Retrieval only — no answer-quality eval yet.

## What this project excludes, deliberately

Answer-level trial scores from a small local model with a noisy judge are **not** used anywhere in this repo — not in the site, not in the docs, not in the README. They were an exploratory trial, indicative only, and must never be quoted as results.
