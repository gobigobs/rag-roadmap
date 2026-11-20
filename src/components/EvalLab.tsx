import { useState } from 'react'
import { BarChart3, Clock3, Gauge, ShieldCheck } from 'lucide-react'
import { CHUNKINGS, CORPUS_V2, V3_CATEGORIES, V3_HEADLINE } from '../data/roadmap'

function formatLatency(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(ms < 10 ? 2 : 0)} ms`
}

export default function EvalLab() {
  const [chunkingId, setChunkingId] = useState<'A' | 'B'>('A')
  const chunking = CHUNKINGS.find((c) => c.id === chunkingId)!
  const best = chunking.retrievers[0]

  return (
    <section id="eval-lab" className="scroll-mt-20 border-y border-white/[0.06] bg-[#121317]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <p className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.18em] text-[#c9a84c] uppercase">
          <BarChart3 className="h-4 w-4" /> The eval lab — interactive
        </p>
        <h2 className="mt-3 max-w-2xl text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-[#faf7f2] sm:text-[2.75rem]">
          Same questions. Two chunkings. Five retrievers.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#c9c6bf]">
          Corpus-v2: {CORPUS_V2.docs} documents, {CORPUS_V2.words.toLocaleString()} words,{' '}
          {CORPUS_V2.questionsScored} scored questions + {CORPUS_V2.controls} unanswerable
          controls (adopted {CORPUS_V2.adopted}). Toggle the chunking and watch the ranking
          move — that movement is the lesson.
        </p>

        <div className="mt-10 inline-flex rounded-full border border-white/10 bg-[#0a0b0c]/70 p-1" role="tablist" aria-label="Chunking">
          {CHUNKINGS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={chunkingId === c.id}
              onClick={() => setChunkingId(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ease-out active:scale-[0.97] ${
                chunkingId === c.id
                  ? 'bg-[#c9a84c] text-[#0a0b0c] shadow-[0_8px_20px_-8px_rgba(201,168,76,0.6)]'
                  : 'text-[#c9c6bf] hover:text-[#faf7f2]'
              }`}
            >
              {c.label} · {c.chunkSize}/{c.overlap} · {c.nChunks} chunks
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {chunking.retrievers.map((r, i) => {
            const isBest = r.id === best.id
            return (
              <article
                key={r.id}
                className={`rounded-2xl border p-5 transition-all duration-200 ease-out hover:-translate-y-0.5 sm:p-6 ${
                  isBest
                    ? 'border-[#c9a84c]/35 bg-[#c9a84c]/[0.05] shadow-[0_20px_48px_-28px_rgba(0,0,0,0.9)]'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16]'
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-bold tracking-tight text-[#faf7f2]">
                    <span className="mr-2.5 font-mono text-xs text-[#8f8c85]">0{i + 1}</span>
                    {r.name}
                    {isBest && (
                      <span className="ml-2.5 rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-2 py-0.5 text-xs font-bold text-[#e3c878]">
                        Best on this chunking
                      </span>
                    )}
                  </h3>
                  <p className="font-mono text-sm text-[#c9c6bf]">
                    <span className={`text-2xl font-extrabold ${isBest ? 'text-[#e3c878]' : 'text-[#faf7f2]'}`}>
                      {r.accuracy}%
                    </span>{' '}
                    <span className="text-[#8f8c85]">({r.hits}/{r.scored})</span>
                    <span className="ml-3 text-[#8f8c85]">MRR {r.mrr.toFixed(3)}</span>
                  </p>
                </div>
                <div
                  className="mt-3.5 h-2 overflow-hidden rounded-full bg-white/[0.07]"
                  role="img"
                  aria-label={`${r.name} accuracy ${r.accuracy} percent`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      isBest ? 'bg-[#c9a84c]' : 'bg-white/30'
                    }`}
                    style={{ width: `${r.accuracy}%` }}
                  />
                </div>
                <p className="mt-3.5 text-[15px] leading-relaxed text-[#c9c6bf]">{r.blurb}</p>
                <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 font-mono text-xs text-[#8f8c85]">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" /> {formatLatency(r.latencyMs)}/query
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> hit–control gap +{r.hitControlGap.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5" /> MRR {r.mrr.toFixed(3)}
                  </span>
                </p>
              </article>
            )
          })}
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#8f8c85]">
          Hit–control gap = mean top-1 score on scored questions minus mean top-1 score on
          unanswerable controls. Bigger = a more trustworthy “I don’t know” signal. Hybrid’s
          gap is ≈ 0.001 — its scores carry no abstention signal at all.
        </p>

        {/* v3 headline strip */}
        <div className="mt-14 rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/[0.06] p-5 sm:p-6">
          <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#e3c878] uppercase">
            v3 stress-test headline
          </p>
          <p className="mt-2 text-lg leading-relaxed text-[#faf7f2]">
            <span className="font-mono text-2xl font-extrabold text-[#e3c878]">
              {V3_HEADLINE.bestAccuracy}%
            </span>{' '}
            — {V3_HEADLINE.bestMethod} ({V3_HEADLINE.bestHits}/{V3_HEADLINE.bestScored}), MRR{' '}
            {V3_HEADLINE.bestMrr}, chunking {V3_HEADLINE.chunking}. 90 questions, 80 scored,
            16 per category.
          </p>
        </div>

        <h3 className="mt-14 text-2xl font-bold tracking-tight text-[#faf7f2] sm:text-3xl">
          Where the methods actually separate
        </h3>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[#c9c6bf]">
          v3 per-category accuracy, chunking A. Direct questions are solved by everyone;
          ambiguous ones decide the ranking.
        </p>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] font-mono text-xs tracking-[0.12em] text-[#8f8c85] uppercase">
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-4 py-3.5 font-semibold">TF-IDF</th>
                <th className="px-4 py-3.5 font-semibold">BM25</th>
                <th className="px-4 py-3.5 font-semibold">SBERT</th>
                <th className="px-4 py-3.5 font-semibold">Hybrid</th>
                <th className="px-4 py-3.5 font-semibold text-[#e3c878]">Rerank</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {V3_CATEGORIES.map((row) => (
                <tr
                  key={row.category}
                  className="border-b border-white/[0.05] transition-colors duration-200 last:border-0 hover:bg-white/[0.03]"
                >
                  <th className="px-5 py-3.5 font-sans font-semibold text-[#faf7f2]">{row.category}</th>
                  <td className="px-4 py-3.5 text-[#c9c6bf]">{row.tfidf}%</td>
                  <td className="px-4 py-3.5 text-[#c9c6bf]">{row.bm25}%</td>
                  <td className="px-4 py-3.5 text-[#c9c6bf]">{row.sbert}%</td>
                  <td className="px-4 py-3.5 text-[#c9c6bf]">{row.hybrid}%</td>
                  <td className="px-4 py-3.5 font-bold text-[#e3c878]">{row.rerank}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[#8f8c85]">
          Source: rag-doc-qa REPORT.md, v3 section (eval_results_v3.json). The 6 hard-flagged
          questions include Q74 (“What do I type in the terminal to begin?”), which defeated
          every retriever on both chunkings.
        </p>
      </div>
    </section>
  )
}
