# Stage 05 — Agents

**Goal:** go from answering questions to doing work — carrying the same eval discipline into agentic RAG.

## Where this roadmap stands

Retrieval eval is complete through corpus-v2. The author's credentials in this specialization:

- **Advanced RAG with Vector Databases and Retrievers** — IBM, Coursera, certificate issued **13 Nov 2026**.
- **Build Multimodal Generative AI Applications** — IBM, Coursera, certificate issued **14 Nov 2026**.
- Both part of the **IBM RAG and Agentic AI Specialization** on Coursera.
- **Next course: Fundamentals of Building AI Agents.**

## Coming next — Fundamentals of Building AI Agents (planned)

**Status: planned — not yet started.** The next course in the same IBM specialization is *Fundamentals of Building AI Agents* (Coursera). What this stage plans to cover — framed from the course title and the specialization's arc (RAG → multimodal → agents), not quoted from a syllabus:

- **What an agent is** — a system that plans, uses tools, and acts toward a goal, not just answers a question; how that differs from the retrieval chatbot built so far.
- **Tool use, scored like retrieval** — every tool call is a decision with a right and wrong answer, so it gets its own scored eval set, the same measurement habit as the retrieval lab, applied to actions.
- **The reasoning loop** — plan → act → observe → re-plan, with the two-stage RAG pipeline (SBERT ranking, cross-encoder verifier) as the agent's memory and abstention gate.
- **When agents help — and when they don't** — which tasks genuinely need an agent versus a straight retrieval answer, judged from measured results instead of demos.

No syllabus, module, or certificate date is claimed here — those are confirmed when the course starts.

## For this, like this

- **For the agent's retrieval layer:** keep the two-stage pipeline the eval earned — cheap retriever (SBERT) for ranking, cross-encoder as verifier and abstention gate. An agent that acts on a wrong retrieval is worse than a chatbot that answers wrong.
- **For the agent's tools:** the same measurement habit applies — every tool call is a retrieval decision with a right and wrong answer, so it needs its own scored eval set, not vibes.
- **For hybrid search in agents:** learn the SBERT↔BM25 weight on a held-out split instead of fixed RRF `1/(60+rank)`. Fixed fusion was measuredly harmful on this corpus, not just uncalibrated.
- **For the next frontiers (from the lab notes):**
  1. **HyDE** — generate a hypothetical answer with an LLM, embed *that* for retrieval; attacks vocabulary mismatch from the other side.
  2. **Bigger cross-doc multi-hop corpus** — with multi-source expected answers, so multi-hop is genuinely cross-document.
  3. **Answer-level eval** — LLM-as-judge groundedness scoring on top of retrieval metrics. This is the planned next measurement.

## What is deliberately NOT claimed here

No answer-quality scores appear anywhere in this roadmap. Answer-level evaluation is the planned next step — it has not been run as a scored eval, so no number is quoted. (A small local trial with a small model and a noisy judge was run for exploration only; its scores are indicative, not evidence, and are excluded from this project.)

## Exit criteria

- [ ] You have completed *Fundamentals of Building AI Agents* in the IBM RAG and Agentic AI Specialization.
- [ ] Your agent's retrieval layer reuses the measured two-stage pipeline (SBERT + cross-encoder verifier).
- [ ] Your agent has a scored eval set for its tool decisions — built before you trust its answers.

**Back to the start:** [Stage 01 — Basics](01-basics.md) · [README](../README.md)
