import { SUGGESTED_ACTIONS } from '@/data/suggestedActions'
import {
  IMPROVEMENT_TEXT_FIELDS,
  validateImprovementUpdate,
  type ImprovementUpdate,
} from '@/lib/improvementRules'
import type {
  ActivityEvent,
  DemoState,
  Improvement,
  Issue,
  IssueStatus,
  NewIssueInput,
  ResponseUpdatedActivity,
} from '@/types/issue'

/** 重複しないIDを作る（例：issue-xxxx、activity-xxxx） */
export function generateId(prefix: string, existingIds: ReadonlySet<string>): string {
  for (;;) {
    const random =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    const id = `${prefix}-${random}`
    if (!existingIds.has(id)) return id
  }
}

/** 重複しない投稿IDを作る */
export function generateIssueId(existingIds: ReadonlySet<string>): string {
  return generateId('issue', existingIds)
}

function newActivityId(state: DemoState): string {
  return generateId('activity', new Set(state.activities.map((activity) => activity.id)))
}

/**
 * 新しい困りごとを追加した状態を返す（元の状態は変更しない）。
 * 対応する改善記録と「投稿」の履歴も同時に作り、Phase 3 以降で先生が編集できるようにしておく。
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
  const activity: ActivityEvent = {
    id: newActivityId(state),
    issueId: issue.id,
    type: 'issue-submitted',
    occurredAt: timestamp,
    isDemo: true,
  }
  return {
    issue,
    state: {
      ...state,
      issues: [...state.issues, issue],
      improvements: [...state.improvements, improvement],
      activities: [...state.activities, activity],
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

/** 投稿IDから対応履歴を古い順に取得する */
export function findActivities(state: DemoState, issueId: string): ActivityEvent[] {
  return state.activities
    .filter((activity) => activity.issueId === issueId)
    .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt))
}

export type UpdateIssueResult =
  | {
      ok: true
      state: DemoState
      /** 保存済みの内容から変更があったか（変更がない場合は状態も履歴も変えない） */
      changed: boolean
    }
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

/** 改善記録の文章項目を、比較しやすい形（未入力は空文字）で取り出す */
function recordValue(improvement: Improvement | undefined, field: (typeof IMPROVEMENT_TEXT_FIELDS)[number]) {
  return (improvement?.[field] ?? '').trim()
}

/**
 * 先生が保存した対応状況と記録を反映する（元の状態は変更しない）。
 * 投稿IDの存在と、入力内容（対応状況ごとの必須項目・文字数）を検証する。
 * 保存済みの内容から変わった点だけを、その時点の値で履歴に1件追加する。変更がなければ何もしない。
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

  const current = findImprovement(state, issueId)
  const next = {
    selectedAction: update.selectedAction.trim(),
    decisionReason: update.decisionReason.trim(),
    trialResult: update.trialResult.trim(),
    teacherResponse: update.teacherResponse.trim(),
  }
  const statusChange =
    issue.status !== update.status ? { from: issue.status, to: update.status } : null
  const recordChanges = IMPROVEMENT_TEXT_FIELDS.filter(
    (field) => recordValue(current, field) !== next[field],
  ).map((field) => ({ field, value: next[field] }))

  if (!statusChange && recordChanges.length === 0) {
    return { ok: true, state, changed: false }
  }

  const activity: ResponseUpdatedActivity = {
    id: newActivityId(state),
    issueId,
    type: 'response-updated',
    occurredAt: now.toISOString(),
    statusChange,
    recordChanges,
    isDemo: true,
  }
  const withStatus = setIssueStatus(state, issueId, update.status, now)
  const withRecord = updateImprovementRecord(
    withStatus,
    issue,
    { ...next, selectedAction: next.selectedAction === '' ? null : next.selectedAction },
    now,
  )
  return {
    ok: true,
    changed: true,
    state: { ...withRecord, activities: [...withRecord.activities, activity] },
  }
}
