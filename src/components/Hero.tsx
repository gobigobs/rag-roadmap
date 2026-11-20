import { useState } from 'react'
import { ArrowDown, ArrowRight, FlaskConical } from 'lucide-react'
import { CHUNKINGS, CORPUS_V2, EVAL_V3, V3_HEADLINE } from '../data/roadmap'

/** The hero IS the working product: a live slice of the Eval Lab, above the fold. */
function MiniLab() {
  const [chunkingId, setChunkingId] = useState<'A' | 'B'>('A')
  const chunking = CHUNKINGS.find((c) => c.id === chunkingId)!
  const top = chunking.retrievers.slice(0, 3)
  const best = chunking.retrievers[0]

  return (
    <div className="rise rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-[12px] sm:p-6" style={{ ['--rise-delay' as string]: '240ms' }}>
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.16em] text-[#c9a84c] uppercase">
          <FlaskConical className="h-3.5 w-3.5" /> Try the lab
        </p>
        <span className="font-mono text-[11px] text-[#8f8c85]">
          {CORPUS_V2.questionsScored} scored questions
        </span>
      </div>

      <div className="mt-4 inline-flex rounded-full border border-white/10 bg-[#0a0b0c]/70 p-1" role="tablist" aria-label="Chunking">
        {CHUNKINGS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={chunkingId === c.id}
            onClick={() => setChunkingId(c.id)}
            className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all duration-200 ease-out active:scale-[0.97] ${
              chunkingId === c.id
                ? 'bg-[#c9a84c] text-[#0a0b0c]'
                : 'text-[#c9c6bf] hover:text-[#faf7f2]'
            }`}
          >
            Chunking {c.id} · {c.chunkSize}/{c.overlap}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-4">
        {top.map((r, i) => (
          <div key={r.id}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-[#faf7f2]">
                <span className="mr-2 font-mono text-xs text-[#8f8c85]">0{i + 1}</span>
                {r.short}
                {r.id === best.id && (
                  <span className="ml-2 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-2 py-0.5 text-[11px] font-bold text-[#e3c878]">
                    Best
                  </span>
                )}
              </p>
              <p className="font-mono text-sm text-[#c9c6bf]">
                <span className="text-base font-bold text-[#faf7f2]">{r.accuracy}%</span>{' '}
                <span className="text-[#8f8c85]">({r.hits}/{r.scored})</span>
              </p>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  r.id === best.id ? 'bg-[#c9a84c]' : 'bg-white/30'
                }`}
                style={{ width: `${r.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-white/[0.07] pt-4 text-[13px] leading-relaxed text-[#8f8c85]">
        On chunking {chunkingId}, <span className="font-semibold text-[#faf7f2]">{best.name}</span> leads
        at {best.accuracy}% — toggle and watch the ranking move. That movement is the lesson.
      </p>
      <a
        href="#eval-lab"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#e3c878] transition-colors duration-200 hover:text-[#faf7f2]"
      >
        Open the full eval lab <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}

const STATS = [
  {
    value: `${V3_HEADLINE.bestAccuracy}%`,
    label: `best accuracy — ${V3_HEADLINE.bestMethod}`,
    sub: `${V3_HEADLINE.bestHits}/${V3_HEADLINE.bestScored} on chunking A · MRR ${V3_HEADLINE.bestMrr}`,
    featured: true,
  },
  {
    value: '90',
    label: 'questions in the v3 stress test',
    sub: '80 scored + 10 controls · 16 per category',
  },
  {
    value: '5',
    label: 'retrieval methods compared',
    sub: 'TF-IDF · BM25 · SBERT · Hybrid · Rerank',
  },
  {
    value: `${CORPUS_V2.docs}`,
    label: 'documents in corpus-v2',
    sub: `${CORPUS_V2.words.toLocaleString()} words · ${CORPUS_V2.questionsTotal} questions`,
  },
]

export default function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-white/[0.06]">
      {/* One ambient glow — the only decoration on the screen. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(56rem_28rem_at_50%_-12%,rgba(201,168,76,0.13),transparent_70%)]"
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div
              className="rise flex flex-wrap items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.16em] uppercase"
              style={{ ['--rise-delay' as string]: '0ms' }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a84c]/35 bg-[#c9a84c]/10 px-3 py-1 text-[#e3c878]">
                Interactive roadmap
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[#c9c6bf]">
                Built from a real eval lab — not opinions
              </span>
            </div>

            <h1
              className="rise mt-7 text-[clamp(3rem,7vw,4.5rem)] leading-[1.02] font-extrabold tracking-[-0.03em] text-[#faf7f2]"
              style={{ ['--rise-delay' as string]: '80ms' }}
            >
              Build retrieval
              <span className="block text-[#c9a84c]">you can prove.</span>
            </h1>

            <p
              className="rise mt-6 max-w-xl text-lg leading-relaxed text-[#c9c6bf]"
              style={{ ['--rise-delay' as string]: '160ms' }}
            >
              Five stages from your first chunk to production-grade retrieval — basics,
              retrieval, reranking, evaluation, agents — with every claim measured on a
              real 90-question stress test, exact hits beside it.
            </p>

            <div className="rise mt-9 flex flex-wrap items-center gap-5" style={{ ['--rise-delay' as string]: '220ms' }}>
              <a
                href="#roadmap"
                className="inline-flex items-center gap-2 rounded-full bg-[#c9a84c] px-6 py-3.5 text-sm font-semibold text-[#0a0b0c] shadow-[0_12px_32px_-12px_rgba(201,168,76,0.55)] transition-all duration-200 ease-out hover:bg-[#e3c878] active:scale-[0.97]"
              >
                Walk the roadmap <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#eval-lab"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#faf7f2] transition-colors duration-200 hover:text-[#e3c878]"
              >
                Open the eval lab <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="rise mt-7 font-mono text-xs text-[#8f8c85]" style={{ ['--rise-delay' as string]: '280ms' }}>
              IBM RAG &amp; Agentic AI Specialization · Coursera — 2 certificates earned
            </p>
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <MiniLab />
          </div>
        </div>

        {/* Bento stats */}
        <dl className="rise mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6" style={{ ['--rise-delay' as string]: '320ms' }}>
          {STATS.map((s) => (
            <div
              key={s.label}
              className={`group rounded-2xl border p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 sm:p-6 ${
                s.featured
                  ? 'border-[#c9a84c]/30 bg-[#c9a84c]/[0.07] sm:col-span-2 lg:col-span-2'
                  : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] lg:col-span-1'
              } ${!s.featured && s.value === '90' ? 'lg:col-span-2' : ''}`}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd
                className={`font-mono font-extrabold tracking-tight ${
                  s.featured ? 'text-6xl text-[#c9a84c]' : 'text-4xl text-[#faf7f2]'
                }`}
              >
                {s.value}
              </dd>
              <dd className="mt-2 text-sm font-semibold text-[#faf7f2]">{s.label}</dd>
              <dd className="mt-0.5 font-mono text-xs leading-relaxed text-[#8f8c85]">{s.sub}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 font-mono text-xs text-[#8f8c85]">
          Eval sets: v2 — 21 scored questions · v3 — {EVAL_V3.questionsScored} scored +{' '}
          {EVAL_V3.controls} controls · corpus-v2 — {CORPUS_V2.questionsScored} scored +{' '}
          {CORPUS_V2.controls} controls. Source: the author’s rag-doc-qa eval lab.
        </p>
      </div>
    </header>
  )
}
