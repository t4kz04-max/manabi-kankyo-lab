import { SUGGESTED_ACTIONS } from '@/data/suggestedActions'
import type { DemoState, Improvement, Issue, NewIssueInput } from '@/types/issue'

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
