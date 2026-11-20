/**
 * "My progress" tracker — persistence layer.
 *
 * Pure functions over a Storage-like object so the logic is unit-testable
 * in Node (see the check in this repo's test notes) and the component stays
 * thin. The component passes window.localStorage; anything that cannot
 * read/write (private mode, disabled storage) degrades to in-memory only.
 */

export const PROGRESS_KEY = 'rag-roadmap-progress-v1'

export const STAGE_IDS = ['basics', 'retrieval', 'reranking', 'eval', 'agents'] as const

export type StageId = (typeof STAGE_IDS)[number]

export function isStageId(value: unknown): value is StageId {
  return typeof value === 'string' && (STAGE_IDS as readonly string[]).includes(value)
}

/** Load the done-stage list. Corrupt or unexpected stored data → empty list. */
export function loadProgress(storage: Pick<Storage, 'getItem'>): StageId[] {
  try {
    const raw = storage.getItem(PROGRESS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // De-dupe while keeping first-seen order; drop anything that is not a stage.
    return [...new Set(parsed.filter(isStageId))]
  } catch {
    return []
  }
}

/** Persist the done-stage list. Storage failures are swallowed by design. */
export function saveProgress(storage: Pick<Storage, 'setItem'>, done: StageId[]): void {
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(done))
  } catch {
    // Private mode / quota / disabled storage: progress still works in-memory.
  }
}

/** Toggle one stage. Returns a new array; never mutates the input. */
export function toggleStage(done: StageId[], id: StageId): StageId[] {
  return done.includes(id) ? done.filter((d) => d !== id) : [...done, id]
}
