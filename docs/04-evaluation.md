# Stage 04 — Evaluation

**Goal:** build an eval that can actually tell your retrievers apart — then believe it.

## Build the eval set first

Five scored question types, plus unanswerable controls:

| Type | What it tests | Example (from the v3 set) |
|---|---|---|
| Direct | Can it find a stated fact? | "What does RAG stand for?" |
| Paraphrase | Same fact, no shared keywords | "Explain turning text into lists of numbers that capture meaning." |
| Multi-hop | Combines two chunks (incl. cross-doc) | "Which file holds the pinned versions, and which command consumes that file?" |
| Adversarial / negation | Traps that punish guessing | "True or false: `pip freeze` installs packages from requirements.txt." |
| Ambiguous | Vague, under-specified | "How do I start?" / "Where does it run?" |
| Control | Must *not* be answered | "What is the capital of France?" (not in corpus) |

Score top-1 chunk's source document against the expected document, plus MRR, per-category accuracy, and latency. Always include controls — without them you cannot measure abstention.

## How the author's eval grew

| Eval | Corpus | Questions | What it found |
|---|---|---|---|
| v2 | 3 docs (~461 words) | 21 scored + 3 controls | Hybrid on small chunks: perfect **100% (21/21)**; SBERT 95% (20/21). Rerank the "surprise loser". |
| v3 | 3 docs (~461 words) | 80 scored + 10 controls = 90 | Hybrid's 100% collapses to 82% (A) / 90% (B). Rerank best on A: **94% (75/80)**. |
| corpus-v2 (v4) | 12 docs, 3,778 words | 52 scored + 5 controls = 57 | Rerank best on A: **92% (48/52)**. SBERT best on B: **92% (48/52)**. |

Sources: `rag-doc-qa/eval_results_v3.json`, `eval_results_v4.json`, `REPORT.md`, `corpus-v2-candidates/README.md` (adopted 2026-11-03).

## Per-category accuracy — v3, chunking A (80 scored, 16 per category)

| Category | TF-IDF | BM25 | SBERT | Hybrid | Rerank |
|---|---|---|---|---|---|
| Direct | 94% | 94% | 100% | 100% | 100% |
| Paraphrase | 100% | 75% | 88% | 88% | 100% |
| Multi-hop | 69% | 62% | 88% | 75% | 94% |
| Adversarial | 100% | 100% | 100% | 100% | 100% |
| Ambiguous | 50% | 38% | 69% | 50% | **75%** |

## For this, like this

- **For a trustworthy ranking:** use 50+ scored questions across all five types. A 21-question eval crowned hybrid at 100% and called rerank a loser — both reversed at 80 questions.
- **For the hardest test:** ambiguous questions. Direct is solved (94–100% for every method); ambiguous separates the field from 38% to 75%. If your eval has no ambiguous questions, it is not measuring retrieval.
- **For the next lever when scores plateau:** grow the corpus, not the question count. v3 squeezed 90 questions out of 3 documents and the strain showed — TF-IDF hit 100% on paraphrase because there was not enough lexical confusability left, and every method scored 100% on adversarial because the "trick" was an answer-time trap, not a retrieval trap. Corpus-v2 (12 docs, 3,778 words) was the fix.
- **For honest reporting:** state the corpus size next to every number. "94%" on 3 documents is a different claim from "94%" on a real knowledge base.

## The most interesting failure

Q74 — "What do I type in the terminal to begin?" — defeated *every* retriever on *both* chunkings in v3. And Q48 (cross-doc multi-hop) beat hybrid and rerank alike — only SBERT got it. Keep a hall of fame of failures; they are the spec for the next iteration.

## Exit criteria

- [ ] Your eval set has all five question types plus controls, with expected sources verified against the docs.
- [ ] You can quote per-category accuracy, not just one headline number.
- [ ] You have written down one finding that reversed when the eval grew — and what you changed because of it.

**Next:** [Stage 05 — Agents](05-agents.md)
