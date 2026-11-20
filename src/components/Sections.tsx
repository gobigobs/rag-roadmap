import { Award, Lightbulb, Server } from 'lucide-react'
import { CERTIFICATES, LESSONS, NEXT_COURSE, PIPELINE } from '../data/roadmap'

const FLOW = ['docs', 'chunk', 'embed', 'store', 'retrieve', 'answer']

export function Pipeline() {
  const rows: Array<[string, string]> = [
    ['Embeddings', PIPELINE.embedder],
    ['Vector store', PIPELINE.vectorStore],
    ['Chunking', PIPELINE.chunker],
    ['Answering', PIPELINE.answering],
    ['Author’s hybrid', PIPELINE.hybridWeights],
  ]
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.18em] text-[#c9a84c] uppercase">
        <Server className="h-4 w-4" /> The pipeline that produced these numbers
      </p>
      <h2 className="mt-3 max-w-2xl text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-[#faf7f2] sm:text-[2.75rem]">
        Docs → chunk → embed → store → retrieve → answer
      </h2>

      {/* Flow stepper — the pipeline as one quiet line. */}
      <ol className="mt-8 flex flex-wrap items-center gap-y-2 font-mono text-xs sm:text-[13px]">
        {FLOW.map((step, i) => (
          <li key={step} className="flex items-center">
            <span
              className={`rounded-full border px-3 py-1.5 ${
                i === FLOW.length - 1
                  ? 'border-[#c9a84c]/40 bg-[#c9a84c]/10 font-bold text-[#e3c878]'
                  : 'border-white/10 bg-white/[0.03] text-[#c9c6bf]'
              }`}
            >
              {step}
            </span>
            {i < FLOW.length - 1 && <span className="mx-1.5 text-[#8f8c85]">→</span>}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/[0.16] sm:p-6"
          >
            <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#c9a84c] uppercase">{k}</p>
            <p className="mt-2.5 font-mono text-sm leading-relaxed text-[#c9c6bf]">{v}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/[0.06] p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 sm:p-6">
          <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#e3c878] uppercase">Reproduce it</p>
          <p className="mt-2.5 font-mono text-sm leading-relaxed text-[#faf7f2]">
            rag-doc-qa:{' '}
            <span className="text-[#c9c6bf]">python cli.py --ask “What is RAG and why does chunking matter?”</span>
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#8f8c85]">
            Runs fully offline by default — no API key needed. Add one to switch from
            extractive to abstractive answers; the retrieval layer is unchanged.
          </p>
        </div>
      </div>
    </section>
  )
}

export function Lessons() {
  return (
    <section id="lessons" className="scroll-mt-20 border-t border-white/[0.06] bg-[#121317]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.18em] text-[#c9a84c] uppercase">
          <Lightbulb className="h-4 w-4" /> Six lessons the eval taught
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-[#faf7f2] sm:text-[2.75rem]">
          What the numbers actually mean
        </h2>
        <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {LESSONS.map((l, i) => (
            <article
              key={l.title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#c9a84c]/30 sm:p-6"
            >
              <p className="font-mono text-xs font-bold text-[#c9a84c]">0{i + 1}</p>
              <h3 className="mt-2.5 text-lg font-bold tracking-tight text-[#faf7f2]">{l.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#c9c6bf]">{l.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Certs() {
  return (
    <section id="credentials" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20 sm:py-24">
      <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.18em] text-[#c9a84c] uppercase">
        <Award className="h-4 w-4" /> Credentials — earned, not claimed
      </p>
      <h2 className="mt-3 max-w-2xl text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-[#faf7f2] sm:text-[2.75rem]">
        IBM RAG and Agentic AI Specialization
      </h2>
      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {CERTIFICATES.map((c) => (
          <article
            key={c.title}
            className="rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/[0.05] p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 sm:p-7"
          >
            <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-[#e3c878] uppercase">
              {c.issuer} · {c.program}
            </p>
            <h3 className="mt-3 text-xl leading-snug font-bold tracking-tight text-[#faf7f2]">{c.title}</h3>
            <p className="mt-3 font-mono text-xs text-[#8f8c85]">Certificate issued {c.issued}.</p>
          </article>
        ))}
      </div>
      <p className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-[15px] leading-relaxed text-[#c9c6bf] sm:p-6">
        <strong className="font-semibold text-[#faf7f2]">Next up:</strong> {NEXT_COURSE} — the
        fifth stage of this roadmap, and the next course in the same IBM specialization on
        Coursera.
      </p>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0b0c]">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-[#8f8c85]">
        <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#c9a84c] uppercase">
          Sources — every number on this page
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed">
          <li>
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#c9c6bf]">
              rag-doc-qa/eval_results_v4.json
            </code>{' '}
            — corpus-v2 results (12 docs, 52 scored questions): chunking A rerank 92% (48/52),
            SBERT 90% (47/52), hybrid 88% (46/52), BM25 85% (44/52), TF-IDF 81% (42/52);
            chunking B SBERT 92% (48/52), rerank 90% (47/52), hybrid 88% (46/52).
          </li>
          <li>
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#c9c6bf]">
              rag-doc-qa/eval_results_v3.json
            </code>{' '}
            +{' '}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#c9c6bf]">
              REPORT.md
            </code>{' '}
            — 90-question stress test (80 scored + 10 controls): rerank best on chunking A,
            94% (75/80); per-category table; v2 21-question eval (hybrid 100% on small chunks).
          </li>
          <li>
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#c9c6bf]">
              rag-doc-qa/corpus-v2-candidates/README.md
            </code>{' '}
            — corpus-v2 adoption 2026-11-03: 12 docs, 3,778 words, 57 questions (52 scored + 5
            controls).
          </li>
          <li>
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#c9c6bf]">
              rag-doc-qa/README.md
            </code>
            ,{' '}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#c9c6bf]">
              chunker.py
            </code>
            ,{' '}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#c9c6bf]">
              embedder.py
            </code>
            ,{' '}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#c9c6bf]">
              vectorstore.py
            </code>{' '}
            — pipeline facts (all-MiniLM-L6-v2, FAISS IndexFlatIP, word-boundary chunking,
            fallbacks).
          </li>
        </ul>
        <p className="mt-6 leading-relaxed">
          RAG Roadmap — built from the author’s real coursework and eval lab. No answer-level
          trial scores are shown anywhere on this site: they were a small-model, noisy-judge
          trial, indicative only.
        </p>
      </div>
    </footer>
  )
}
