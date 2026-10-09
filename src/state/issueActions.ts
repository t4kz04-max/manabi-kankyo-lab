import { SUGGESTED_ACTIONS } from '@/data/suggestedActions'
import { validateImprovementUpdate, type ImprovementUpdate } from '@/lib/improvementRules'
import type {
  DemoState,
  Improvement,
  Issue,
  IssueStatus,
  NewIssueInput,
} from '@/types/issue'

/** 重複しない投稿IDを作る */
export function generateIssueId(existingIds: ReadonlySet<string>): string {
  for (;;) {
    const random =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    const id = `issue-${random}`
    if (!existingIds.has(id)) return id
  }
}

/**
 * 新しい困りごとを追加した状態を返す（元の状態は変更しない）。
 * 対応する改善記録も同時に作り、Phase 3 で先生が編集できるようにしておく。
 * 改善案は「参考例」として入れるだけで、選択・適用はしない。
 */
export function addIssue(
  state: DemoState,
  input: NewIssueInput,
  now: Date = new Date(),
): { state: DemoState; issue: Issue } {
  const timestamp = now.toISOString()
  const issue: Issue = {
    id: generateIssueId(new Set(state.issues.map((item) => item.id))),
    category: input.category,
    situation: input.situation,
    issueType: input.issueType,
    status: 'unconfirmed',
    createdAt: timestamp,
    updatedAt: timestamp,
    isDemo: true,
  }
  const improvement: Improvement = {
    issueId: issue.id,
    suggestedActions: [...SUGGESTED_ACTIONS[input.issueType]],
    selectedAction: null,
    teacherResponse: '',
    decisionReason: '',
    trialResult: '',
    updatedAt: timestamp,
    isDemo: true,
  }
  return {
    issue,
    state: {
      ...state,
      issues: [...state.issues, issue],
      improvements: [...state.improvements, improvement],
    },
  }
}

/** 投稿IDから困りごとを取得する */
export function findIssue(state: DemoState, issueId: string): Issue | undefined {
  return state.issues.find((issue) => issue.id === issueId)
}

/** 投稿IDから改善記録を取得する */
export function findImprovement(state: DemoState, issueId: string): Improvement | undefined {
  return state.improvements.find((improvement) => improvement.issueId === issueId)
}

export type UpdateIssueResult =
  | { ok: true; state: DemoState; issue: Issue; improvement: Improvement }
  | { ok: false; reason: 'not-found' | 'invalid' }

/** 投稿の対応状況を変更し、更新日時を記録する */
export function setIssueStatus(
  state: DemoState,
  issueId: string,
  status: IssueStatus,
  now: Date = new Date(),
): DemoState {
  return {
    ...state,
    issues: state.issues.map((issue) =>
      issue.id === issueId ? { ...issue, status, updatedAt: now.toISOString() } : issue,
    ),
  }
}

/**
 * 改善記録を更新し、更新日時を記録する。
 * 改善記録がまだない投稿（通常は起こらない）の場合は新しく作り、投稿と1対1の関係を保つ。
 */
export function updateImprovementRecord(
  state: DemoState,
  issue: Issue,
  fields: Pick<Improvement, 'selectedAction' | 'decisionReason' | 'trialResult' | 'teacherResponse'>,
  now: Date = new Date(),
): DemoState {
  const existing = findImprovement(state, issue.id)
  const improvement: Improvement = {
    issueId: issue.id,
    suggestedActions: existing?.suggestedActions ?? [...SUGGESTED_ACTIONS[issue.issueType]],
    isDemo: existing?.isDemo ?? true,
    ...fields,
    updatedAt: now.toISOString(),
  }
  return {
    ...state,
    improvements: existing
      ? state.improvements.map((item) => (item.issueId === issue.id ? improvement : item))
      : [...state.improvements, improvement],
  }
}

/**
 * 先生が保存した対応状況と記録を反映する（元の状態は変更しない）。
 * 投稿IDの存在と、入力内容（対応状況ごとの必須項目・文字数）を検証する。
 */
export function updateIssueResponse(
  state: DemoState,
  issueId: string,
  update: ImprovementUpdate,
  now: Date = new Date(),
): UpdateIssueResult {
  const issue = findIssue(state, issueId)
  if (!issue) return { ok: false, reason: 'not-found' }
  if (validateImprovementUpdate(update).length > 0) return { ok: false, reason: 'invalid' }

  const selectedAction = update.selectedAction.trim()
  const withStatus = setIssueStatus(state, issueId, update.status, now)
  const next = updateImprovementRecord(
    withStatus,
    issue,
    {
      selectedAction: selectedAction === '' ? null : selectedAction,
      decisionReason: update.decisionReason.trim(),
      trialResult: update.trialResult.trim(),
      teacherResponse: update.teacherResponse.trim(),
    },
    now,
  )
  return {
    ok: true,
    state: next,
    issue: findIssue(next, issueId)!,
    improvement: findImprovement(next, issueId)!,
  }
}
