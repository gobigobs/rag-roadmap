# Stage 01 — RAG Basics

**Goal:** answer questions from your own documents, not from model memory.

## The five stages

```
Ingest → Embed → Store → Retrieve → Generate
```

1. **Ingest** — load documents (`.txt` / `.md`).
2. **Embed** — turn text into vectors that capture meaning.
3. **Store** — keep vectors in a vector store for fast lookup.
4. **Retrieve** — fetch the most relevant chunks for a question.
5. **Generate** — turn the retrieved chunks into an answer, with sources.

## Why RAG

- **Up-to-date answers** without retraining the model — swap the documents, not the weights.
- **Cited sources** — every answer is traceable to a chunk, which is how you reduce hallucinations.
- **Private data stays private** — the pipeline in `rag-doc-qa` runs fully offline by default, no API key needed.

## For this, like this

Build the offline pipeline first, exactly as in `rag-doc-qa`:

```
docs (.txt/.md) → chunk → embed → vector store → retrieve top-k → answer
```

- **Embeddings:** `sentence-transformers` (`all-MiniLM-L6-v2`, 384-dim), with automatic fallback to scikit-learn TF-IDF.
- **Vector store:** FAISS (`IndexFlatIP` on normalized vectors = cosine similarity), with automatic fallback to exact numpy brute-force search.
- **Answering:** extractive (best chunks + sources + scores) offline; abstractive via any OpenAI-compatible endpoint when a key is set. The retrieval layer is unchanged either way.

## The one habit that matters from day one

**Graceful fallbacks.** Sentence-transformers degrades to TF-IDF, FAISS degrades to numpy — so the demo never dies on a missing dependency. A pipeline that only works on a perfect machine is a toy.

## Try it

```bash
# in ~/workspace/projects/rag-doc-qa
python cli.py --ask "What is RAG and why does chunking matter?"
python cli.py --docs ./my_docs --ask "Summarize the refund policy" --top-k 5
```

## Exit criteria

- [ ] You can explain all five stages in order, in your own words.
- [ ] The offline CLI answers a question over your own docs, showing source filenames and scores.
- [ ] You can say what happens when the embedding model or FAISS is missing — and prove the fallback works.

**Next:** [Stage 02 — Retrieval](02-retrieval.md)
