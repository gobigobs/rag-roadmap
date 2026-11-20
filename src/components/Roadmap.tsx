import { useEffect, useState } from 'react'
import { BookOpen, Check, CheckCircle2, FileText, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { AGENTS_COMING_NEXT, ROADMAP_STAGES } from '../data/roadmap'
import { loadProgress, saveProgress, toggleStage, type StageId } from '../lib/progress'

export default function Roadmap() {
  const [open, setOpen] = useState<string>('retrieval')
  const [done, setDone] = useState<StageId[]>(() => {
    try {
      return loadProgress(window.localStorage)
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      saveProgress(window.localStorage, done)
    } catch {
      // Storage unavailable (private mode, disabled): progress still works in-memory.
    }
  }, [done])

  const doneCount = done.length
  const total = ROADMAP_STAGES.length

  return (
    <section id="roadmap" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20 sm:py-24">
      <p className="font-mono text-[11px] font-semibold tracking-[0.18em] text-[#c9a84c] uppercase">
        The roadmap
      </p>
      <h2 className="mt-3 max-w-2xl text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-[#faf7f2] sm:text-[2.75rem]">
        Five stages. Each one earns the next.
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#c9c6bf]">
        Open a stage to work through it. Every stage ends with the measured evidence
        from the eval lab — “for this, like this”, with real numbers, not advice.
      </p>

      {/* My progress — one quiet card, gold only when it moves. */}
      <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.7)] sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-semibold text-[#faf7f2]">My progress</p>
          <p className="font-mono text-sm font-bold text-[#e3c878]" aria-live="polite">
            {doneCount} / {total} stages done
          </p>
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.07]"
          role="progressbar"
          aria-valuenow={doneCount}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${doneCount} of ${total} stages done`}
        >
          <div
            className="h-full rounded-full bg-[#c9a84c] transition-all duration-500 ease-out"
            style={{ width: `${(doneCount / total) * 100}%` }}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#8f8c85]">
            Tick a stage when you have worked through it — your progress is saved in this
            browser and survives reloads.
          </p>
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => setDone([])}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#c9c6bf] transition-all duration-200 ease-out hover:border-white/25 hover:text-[#faf7f2] active:scale-[0.97]"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset progress
            </button>
          )}
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {ROADMAP_STAGES.map((stage) => {
          const isOpen = open === stage.id
          const isDone = done.includes(stage.id as StageId)
          return (
            <li
              key={stage.id}
              className={`rounded-2xl border bg-white/[0.02] transition-all duration-200 ease-out ${
                isOpen
                  ? 'border-[#c9a84c]/35 shadow-[0_20px_48px_-28px_rgba(0,0,0,0.9)]'
                  : 'border-white/[0.08] hover:-translate-y-0.5 hover:border-white/[0.16]'
              }`}
            >
              <div className="flex items-start gap-2 p-5 sm:p-6">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? '' : stage.id)}
                  aria-expanded={isOpen}
                  className="flex min-w-0 flex-1 items-start gap-4 text-left"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ring-1 transition-colors duration-200 ${
                      isOpen
                        ? 'bg-[#c9a84c]/15 text-[#e3c878] ring-[#c9a84c]/40'
                        : 'bg-white/[0.04] text-[#c9c6bf] ring-white/10'
                    }`}
                  >
                    {stage.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-xl font-bold tracking-tight text-[#faf7f2]">{stage.title}</span>
                      <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-[#c9a84c] uppercase">
                        {stage.weeks}
                      </span>
                      {isDone && (
                        <span className="rounded-full border border-[#c9a84c]/40 bg-[#c9a84c]/10 px-2 py-0.5 text-xs font-bold text-[#e3c878]">
                          Done
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-[#8f8c85]">{stage.tagline}</span>
                  </span>
                  <Plus
                    className={`mt-1.5 h-5 w-5 shrink-0 text-[#8f8c85] transition-transform duration-200 ease-out ${
                      isOpen ? 'rotate-45 text-[#e3c878]' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setDone((d) => toggleStage(d, stage.id as StageId))}
                  aria-pressed={isDone}
                  aria-label={isDone ? `Mark ${stage.title} as not done` : `Mark ${stage.title} as done`}
                  title={isDone ? 'Done — click to unmark' : 'Mark this stage as done'}
                  className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-2 transition-all duration-200 ease-out active:scale-90 ${
                    isDone
                      ? 'bg-[#c9a84c] text-[#0a0b0c] ring-[#e3c878]'
                      : 'bg-transparent text-transparent ring-white/20 hover:ring-[#c9a84c]'
                  }`}
                >
                  <Check className="h-5 w-5" strokeWidth={3} />
                </button>
              </div>

              {/* Expand with a grid-rows transition — no layout jump, 300ms. */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-white/[0.07] px-5 pb-6 pt-5 sm:px-6">
                    <ul className="space-y-2.5">
                      {stage.points.map((p) => (
                        <li key={p} className="flex gap-2.5 text-[15px] leading-relaxed text-[#c9c6bf]">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a84c]" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 rounded-xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.06] p-4">
                      <p className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.16em] text-[#e3c878] uppercase">
                        <FileText className="h-4 w-4" /> Measured evidence
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#c9c6bf]">{stage.evidence}</p>
                    </div>
                    {stage.id === 'agents' && (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.16em] text-[#e3c878] uppercase">
                          <Sparkles className="h-4 w-4" /> Coming next · {AGENTS_COMING_NEXT.status}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[#faf7f2]">
                          {AGENTS_COMING_NEXT.course} — IBM RAG and Agentic AI Specialization, Coursera
                        </p>
                        <ul className="mt-3 space-y-2.5">
                          {AGENTS_COMING_NEXT.topics.map((t) => (
                            <li key={t.title} className="flex gap-2.5 text-sm leading-relaxed text-[#c9c6bf]">
                              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a84c]" />
                              <span>
                                <strong className="font-semibold text-[#faf7f2]">{t.title}:</strong> {t.body}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-xs leading-relaxed text-[#8f8c85]">
                          {AGENTS_COMING_NEXT.disclaimer}
                        </p>
                      </div>
                    )}
                    <p className="mt-4 flex items-center gap-2 text-sm text-[#8f8c85]">
                      <BookOpen className="h-4 w-4" />
                      Deep dive:{' '}
                      <code className="rounded-md bg-white/[0.07] px-1.5 py-0.5 font-mono text-xs text-[#e3c878]">
                        {stage.doc}
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
