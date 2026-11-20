/**
 * RAG Roadmap — verified data.
 *
 * Every number in this file was read from the author's own eval lab:
 *   ~/workspace/projects/rag-doc-qa/
 *   - eval_results_v3.json  (90-question stress test: 80 scored + 10 controls,
 *                             3-doc corpus)
 *   - eval_results_v4.json  (corpus-v2: 12 docs, 3,778 words,
 *                             57 questions = 52 scored + 5 controls)
 *   - REPORT.md              (narrative findings, v2 21-question eval)
 *   - corpus-v2-candidates/README.md (corpus-v2 adoption, 2026-11-03)
 *   - README.md / embedder.py / vectorstore.py / chunker.py (pipeline facts)
 *
 * Percentages are rounded to the nearest whole percent; the exact
 * hits/scored counts are kept alongside so nothing is hidden.
 * Nothing here comes from the answer-level local trial — those scores
 * are noisy, indicative only, and deliberately excluded.
 */

export type RetrieverId = 'tfidf' | 'bm25' | 'sbert' | 'hybrid' | 'rerank'

export interface RetrieverResult {
  id: RetrieverId
  name: string
  short: string
  accuracy: number // percent, rounded
  hits: number
  scored: number
  mrr: number
  latencyMs: number
  hitControlGap: number
  blurb: string
}

export interface ChunkingResult {
  id: 'A' | 'B'
  label: string
  chunkSize: number
  overlap: number
  nChunks: number
  retrievers: RetrieverResult[]
}

/** Corpus-v2 eval (eval_results_v4.json) — the headline numbers. */
export const CORPUS_V2 = {
  docs: 12,
  words: 3778,
  questionsTotal: 57,
  questionsScored: 52,
  controls: 5,
  adopted: '2026-11-03',
  note: '9 new documents added to the original 3; 57 new questions written for them.',
} as const

/** v3 stress test (eval_results_v3.json + REPORT.md). */
export const EVAL_V3 = {
  questionsTotal: 90,
  questionsScored: 80,
  controls: 10,
  categories: ['direct', 'paraphrase', 'multi-hop', 'adversarial', 'ambiguous'],
  perCategory: 16,
  hardFlagged: 6,
} as const

export const EVAL_V2 = {
  questionsScored: 21,
  controls: 3,
  hybridSmallChunks: '100% (21/21)',
  sbertSmallChunks: '95% (20/21)',
} as const

export const CHUNKINGS: ChunkingResult[] = [
  {
    id: 'A',
    label: 'Chunking A — current',
    chunkSize: 500,
    overlap: 100,
    nChunks: 64,
    retrievers: [
      {
        id: 'rerank',
        name: 'Cross-encoder rerank',
        short: 'Rerank',
        accuracy: 92,
        hits: 48,
        scored: 52,
        mrr: 0.957,
        latencyMs: 2472,
        hitControlGap: 11.68,
        blurb:
          'Best accuracy on corpus-v2. Judges each query↔chunk pair directly, so it wins exactly where term-matching guesses: ambiguous and multi-hop questions.',
      },
      {
        id: 'sbert',
        name: 'SBERT dense retrieval',
        short: 'SBERT',
        accuracy: 90,
        hits: 47,
        scored: 52,
        mrr: 0.935,
        latencyMs: 45,
        hitControlGap: 0.32,
        blurb:
          'The balanced pick: 90% at ~45 ms. Gets the hard paraphrases lexical methods miss, because it matches meaning, not keywords.',
      },
      {
        id: 'hybrid',
        name: 'Hybrid RRF fusion',
        short: 'Hybrid',
        accuracy: 88,
        hits: 46,
        scored: 52,
        mrr: 0.934,
        latencyMs: 46,
        hitControlGap: 0.001,
        blurb:
          'Fuses SBERT + BM25 with reciprocal rank fusion. Trails SBERT alone here — fusion is not a free win, and its scores carry zero abstention signal.',
      },
      {
        id: 'bm25',
        name: 'BM25 lexical ranking',
        short: 'BM25',
        accuracy: 85,
        hits: 44,
        scored: 52,
        mrr: 0.907,
        latencyMs: 0.24,
        hitControlGap: 8.04,
        blurb:
          'Best latency/accuracy trade for keyword-heavy traffic: 85% at 0.24 ms/query. Dies on paraphrases with zero keyword overlap.',
      },
      {
        id: 'tfidf',
        name: 'TF-IDF baseline',
        short: 'TF-IDF',
        accuracy: 81,
        hits: 42,
        scored: 52,
        mrr: 0.884,
        latencyMs: 0.57,
        hitControlGap: 0.09,
        blurb:
          'The baseline every method must beat. Fine for a first prototype, not a system — it cannot see meaning, only term overlap.',
      },
    ],
  },
  {
    id: 'B',
    label: 'Chunking B — small',
    chunkSize: 250,
    overlap: 50,
    nChunks: 126,
    retrievers: [
      {
        id: 'sbert',
        name: 'SBERT dense retrieval',
        short: 'SBERT',
        accuracy: 92,
        hits: 48,
        scored: 52,
        mrr: 0.962,
        latencyMs: 57,
        hitControlGap: 0.32,
        blurb:
          'Best on small chunks. Finer chunks are tighter semantic units, so embeddings dilute less — SBERT gains 90% → 92% when chunks halve.',
      },
      {
        id: 'rerank',
        name: 'Cross-encoder rerank',
        short: 'Rerank',
        accuracy: 90,
        hits: 47,
        scored: 52,
        mrr: 0.943,
        latencyMs: 1389,
        hitControlGap: 11.17,
        blurb:
          'Still the best abstention signal in the lab (gap +11.17). As a ranker it trails SBERT on small chunks — use it as a verifier, not a ranker.',
      },
      {
        id: 'hybrid',
        name: 'Hybrid RRF fusion',
        short: 'Hybrid',
        accuracy: 88,
        hits: 46,
        scored: 52,
        mrr: 0.926,
        latencyMs: 56,
        hitControlGap: 0.002,
        blurb:
          'Same 88% on both chunkings. On the small 21-question v2 eval it hit a perfect 100% — v4 shows that was a small-sample artifact.',
      },
      {
        id: 'bm25',
        name: 'BM25 lexical ranking',
        short: 'BM25',
        accuracy: 81,
        hits: 42,
        scored: 52,
        mrr: 0.886,
        latencyMs: 1.61,
        hitControlGap: 8.84,
        blurb: 'Drops to 81% on small chunks — term saturation gets less precise when passages shrink.',
      },
      {
        id: 'tfidf',
        name: 'TF-IDF baseline',
        short: 'TF-IDF',
        accuracy: 77,
        hits: 40,
        scored: 52,
        mrr: 0.859,
        latencyMs: 17.7,
        hitControlGap: 0.11,
        blurb: 'Worst on small chunks (77%). The baseline stays the baseline.',
      },
    ],
  },
]

/** v3 per-category accuracy, chunking A (REPORT.md). */
export const V3_CATEGORIES = [
  { category: 'Direct', tfidf: 94, bm25: 94, sbert: 100, hybrid: 100, rerank: 100 },
  { category: 'Paraphrase', tfidf: 100, bm25: 75, sbert: 88, hybrid: 88, rerank: 100 },
  { category: 'Multi-hop', tfidf: 69, bm25: 62, sbert: 88, hybrid: 75, rerank: 94 },
  { category: 'Adversarial', tfidf: 100, bm25: 100, sbert: 100, hybrid: 100, rerank: 100 },
  { category: 'Ambiguous', tfidf: 50, bm25: 38, sbert: 69, hybrid: 50, rerank: 75 },
] as const

/** v3 headline (eval_results_v3.json): rerank best on chunking A. */
export const V3_HEADLINE = {
  bestMethod: 'Cross-encoder rerank',
  bestAccuracy: 94,
  bestHits: 75,
  bestScored: 80,
  bestMrr: 0.964,
  chunking: 'A (500/100)',
} as const

export const PIPELINE = {
  embedder: 'sentence-transformers · all-MiniLM-L6-v2 (384-dim), TF-IDF fallback',
  vectorStore: 'FAISS IndexFlatIP on normalized vectors (= cosine similarity), numpy fallback',
  chunker: 'Word-boundary chunking, 500 chars / 100 overlap (A) or 250 / 50 (B)',
  answering: 'Extractive offline; abstractive via any OpenAI-compatible endpoint when a key is set',
  hybridWeights: '0.75 cosine + 0.25 keyword, 0.35 abstention threshold (author’s own rag-chatbot)',
} as const

export const CERTIFICATES = [
  {
    title: 'Advanced RAG with Vector Databases and Retrievers',
    issuer: 'IBM · Coursera',
    issued: '13 Nov 2026',
    program: 'IBM RAG and Agentic AI Specialization',
  },
  {
    title: 'Build Multimodal Generative AI Applications',
    issuer: 'IBM · Coursera',
    issued: '14 Nov 2026',
    program: 'IBM RAG and Agentic AI Specialization',
  },
] as const

export const NEXT_COURSE = 'Fundamentals of Building AI Agents'

/**
 * "Coming next" for the Agents stage — PLANNED content, not a syllabus quote.
 * The next course in the same IBM specialization is Fundamentals of Building
 * AI Agents (Coursera). Nothing below claims a specific syllabus, module, or
 * certificate date: these are the topics this roadmap plans to cover, framed
 * from the course title and the specialization's arc (RAG → multimodal →
 * agents), plus the eval discipline the lab already earned. The exact
 * syllabus is confirmed when the course starts.
 */
export const AGENTS_COMING_NEXT = {
  course: NEXT_COURSE,
  status: 'Planned — not yet started',
  disclaimer:
    'Planned coverage, framed from the course title and the specialization’s arc. No syllabus, module, or certificate date is claimed here — those are confirmed when the course starts.',
  topics: [
    {
      title: 'What an agent is',
      body: 'A system that plans, uses tools, and acts toward a goal — not just answers a question. How that differs from the retrieval chatbot built so far.',
    },
    {
      title: 'Tool use, scored like retrieval',
      body: 'Every tool call is a decision with a right and wrong answer, so it gets its own scored eval set — the same measurement habit as the retrieval lab, applied to actions.',
    },
    {
      title: 'The reasoning loop',
      body: 'Plan → act → observe → re-plan, with the two-stage RAG pipeline (SBERT ranking, cross-encoder verifier) as the agent’s memory and abstention gate.',
    },
    {
      title: 'When agents help — and when they don’t',
      body: 'Which tasks genuinely need an agent versus a straight retrieval answer, and how to tell from measured results instead of demos.',
    },
  ],
} as const

export const ROADMAP_STAGES = [
  {
    n: '01',
    id: 'basics',
    title: 'RAG Basics',
    tagline: 'Answer from your documents, not from model memory.',
    weeks: 'Week 1–2',
    points: [
      'The five stages: Ingest → Embed → Store → Retrieve → Generate.',
      'Why RAG: up-to-date answers and cited sources, without retraining.',
      'Build the offline pipeline first: docs → chunk → embed → vector store → retrieve → answer.',
      'Graceful fallbacks from day one: SBERT degrades to TF-IDF, FAISS degrades to numpy — the demo never dies on a missing dependency.',
    ],
    evidence:
      'Built as rag-doc-qa: a fully offline CLI that answers questions over local Markdown docs, with extractive answers, source filenames and similarity scores on every answer.',
    doc: 'docs/01-basics.md',
  },
  {
    n: '02',
    id: 'retrieval',
    title: 'Retrieval',
    tagline: 'The retriever is the system. Measure it before you trust it.',
    weeks: 'Week 3–5',
    points: [
      'Start with a baseline: TF-IDF. Then BM25 — strictly better at 0.1 ms/query.',
      'Go dense: SBERT (all-MiniLM-L6-v2) embeddings + FAISS cosine search. It gets the paraphrases lexical methods miss.',
      'Try hybrid fusion (RRF over SBERT + BM25) — but measure: on corpus-v2 it trails SBERT alone, 88% vs 90%.',
      'Chunking is a lever, not a detail: halving chunks (500/100 → 250/50) lifts SBERT 90% → 92%.',
    ],
    evidence:
      'Corpus-v2, chunking A: SBERT 90% (47/52), BM25 85% (44/52), TF-IDF 81% (42/52). Chunking B: SBERT 92% (48/52). 52 scored questions, 12 documents, 3,778 words.',
    doc: 'docs/02-retrieval.md',
  },
  {
    n: '03',
    id: 'reranking',
    title: 'Reranking & Abstention',
    tagline: 'Rank cheap, verify expensive — and know when to say “I don’t know”.',
    weeks: 'Week 6–7',
    points: [
      'Two-stage retrieval: cheap retriever fetches 50–100 candidates, cross-encoder (MS MARCO MiniLM-L-6-v2) re-scores them pairwise.',
      'Best accuracy on corpus-v2: rerank 92% (48/52) on chunking A — it wins ambiguous and multi-hop questions where term-matching guesses.',
      'Its real superpower is abstention: hit–control gap +11.68, the largest separation of any retriever. Use it as a verifier / “don’t answer” gate.',
      'Mind the cost: ~2,472 ms/query on CPU vs ~45 ms for SBERT. Reranking is unjustifiable as a ranker unless you need its signal.',
    ],
    evidence:
      'Corpus-v2 chunking A: rerank 92% (48/52), MRR 0.957, gap +11.68. On the 90-question v3 stress test it was also best on chunking A at 94% (75/80).',
    doc: 'docs/03-reranking.md',
  },
  {
    n: '04',
    id: 'eval',
    title: 'Evaluation',
    tagline: 'Measure first, trust later. The corpus — not the retriever — is usually the limit.',
    weeks: 'Week 8–10',
    points: [
      'Build a real eval set: direct, paraphrase, multi-hop, adversarial-negation, ambiguous + unanswerable controls. Score top-1 source match + MRR + latency.',
      'Grow the questions with the corpus: v2 had 21 scored questions, v3 had 80 scored + 10 controls, corpus-v2 has 52 scored + 5 controls.',
      'Watch findings reverse as the eval grows: hybrid’s “perfect 100%” (v2, 21 questions) fell to 82–90% on bigger sets; rerank went from “surprise loser” to best.',
      'Ambiguous queries break everything (38–75% across methods on v3) — that is where rankings actually separate.',
    ],
    evidence:
      'v3 per-category, chunking A: ambiguous — rerank 75%, SBERT 69%, hybrid 50%, TF-IDF 50%, BM25 38%. One question (Q74, “What do I type in the terminal to begin?”) defeated every retriever on both chunkings.',
    doc: 'docs/04-evaluation.md',
  },
  {
    n: '05',
    id: 'agents',
    title: 'Agents',
    tagline: 'From answering questions to doing work — with the same eval discipline.',
    weeks: 'Next',
    points: [
      'Next course: Fundamentals of Building AI Agents (IBM RAG and Agentic AI Specialization, Coursera).',
      'Carry the lab forward: two-stage pipeline — SBERT for ranking, cross-encoder as verifier/abstention gate.',
      'Learned hybrid weights on a held-out split instead of fixed RRF 1/(60+rank).',
      'Next frontiers from the lab notes: HyDE (embed a hypothetical answer), bigger cross-doc multi-hop corpus, and answer-level eval with an LLM judge for groundedness.',
    ],
    evidence:
      'Status: retrieval eval complete through corpus-v2. Answer-level eval is the planned next measurement — no answer-quality scores are claimed yet.',
    doc: 'docs/05-agents.md',
  },
] as const

export const LESSONS = [
  {
    title: 'The corpus is the limit',
    body: 'v3 squeezed 90 questions out of 3 documents (~461 words) and the strain showed — TF-IDF hit 100% on paraphrase because there was not enough lexical confusability left. The fix was corpus-v2: 12 documents, 3,778 words, 57 new questions.',
  },
  {
    title: 'Small evals lie politely',
    body: 'Hybrid scored a perfect 100% (21/21) on v2 with small chunks. On 80 questions it dropped to 82% (A) / 90% (B) — worse than SBERT alone. Never ship a ranking built on 21 questions.',
  },
  {
    title: 'Fusion is not free magic',
    body: 'On chunking A, RRF fusion scored below pure SBERT (90% vs 95% on v2; 88% vs 90% on v4). Worse, 10 of hybrid’s v3 misses came from BM25 noise pulling the wrong document to the top.',
  },
  {
    title: 'Use the cross-encoder as a verifier',
    body: 'Its logits are the best abstention signal measured (hit–control gap +11.68 on corpus-v2, +7.3 on v3). Keep hybrid/SBERT ranking; let the cross-encoder decide whether to answer at all.',
  },
  {
    title: 'Ambiguity is the real benchmark',
    body: 'Direct questions are solved (94–100% for every method). Ambiguous ones separate the field: BM25 38%, rerank 75%. If your eval has no ambiguous questions, it is not measuring retrieval.',
  },
  {
    title: 'Latency is a feature',
    body: 'BM25 answers in 0.24 ms, SBERT in ~45 ms, rerank in ~2,472 ms (corpus-v2, chunking A, CPU). The production pick is the best accuracy you can afford at the latency you can ship.',
  },
] as const
