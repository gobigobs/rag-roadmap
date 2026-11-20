# Stage 03 — Reranking & Abstention

**Goal:** rank cheap, verify expensive — and know when to say "I don't know".

## Two-stage retrieval

```
Cheap retriever (SBERT/BM25) fetches 50–100 candidates
        ↓
Cross-encoder (MS MARCO MiniLM-L-6-v2) scores each query↔chunk pair
        ↓
Re-ordered top-k — or no answer at all, if the scores say so
```

A bi-encoder (SBERT) embeds query and chunk separately and compares vectors. A cross-encoder reads the query and the chunk *together* and judges them pairwise. That joint reading is slower and sharper.

## Measured results — corpus-v2 (52 scored questions)

Source: `rag-doc-qa/eval_results_v4.json`.

| Chunking | Rerank accuracy | MRR | Latency/query | Hit–control gap |
|---|---|---|---|---|
| A (500/100) | **92%** (48/52) | 0.957 | 2,472 ms | **+11.68** |
| B (250/50) | 90% (47/52) | 0.943 | 1,389 ms | **+11.17** |

On the 90-question v3 stress test, rerank was also the best retriever on chunking A: **94% (75/80)**, MRR 0.964. It wins exactly where term-matching guesses — ambiguous (75% vs BM25's 38%) and multi-hop (94%) questions.

## For this, like this

- **For the best accuracy on vague questions:** cross-encoder rerank. It fixes most of hybrid's misses, almost entirely in the ambiguous category, by judging semantics pairwise instead of counting terms.
- **For a trustworthy "don't answer" gate:** the cross-encoder again — but as a *verifier*, not a ranker. Its logits are by far the best abstention signal measured: hit–control gap +11.68 on corpus-v2 (+7.3 on v3), vs +0.32 for SBERT and ≈ +0.001 for hybrid RRF. Unanswerable controls score around −9.6 to −11.2 while hits score high — a gap you can actually threshold on.
- **For latency you can ship:** don't rerank everything. SBERT retrieves in ~45 ms; rerank costs ~2,472 ms/query on CPU (chunking A) — 25–40× hybrid's cost. The production shape is: SBERT for ranking, cross-encoder as verifier/abstention gate.

## The finding that reversed

On the 21-question v2 eval, rerank was the "surprise loser" (90%): it demoted correct answers on paraphrase-hard questions because a MARCO-trained cross-encoder over-trusts lexical overlap. On 80 questions it is the best retriever. The lesson is not "rerank is good" or "rerank is bad" — it is that **a 21-question eval cannot tell you which**.

## The author's own hybrid, for contrast

The author's rag-chatbot uses 0.75 cosine + 0.25 keyword weighting with a 0.35 abstention threshold — a fixed-weight hybrid with an explicit "don't answer" cutoff, rather than RRF fusion. RRF's scores, by contrast, carry zero abstention signal (gap ≈ 0.001): you cannot use them for "I don't know" decisions.

## Exit criteria

- [ ] You can explain bi-encoder vs cross-encoder in one paragraph each.
- [ ] You have measured a hit–control gap for at least two retrievers and can say which one you would threshold on.
- [ ] You can state the latency cost of reranking on your own machine, in ms/query.

**Next:** [Stage 04 — Evaluation](04-evaluation.md)
