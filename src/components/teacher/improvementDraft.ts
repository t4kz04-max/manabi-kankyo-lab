import { IMPROVEMENT_TEXT_FIELDS, type ImprovementUpdate } from '@/lib/improvementRules'
import type { Improvement, Issue } from '@/types/issue'

/** 保存済みの投稿と改善記録から、編集フォームの初期値を作る */
export function toImprovementDraft(issue: Issue, improvement?: Improvement): ImprovementUpdate {
  return {
    status: issue.status,
    selectedAction: improvement?.selectedAction ?? '',
    decisionReason: improvement?.decisionReason ?? '',
    trialResult: improvement?.trialResult ?? '',
    teacherResponse: improvement?.teacherResponse ?? '',
  }
}

/** 保存時と同じく前後の空白を取り除く */
export function normalizeDraft(draft: ImprovementUpdate): ImprovementUpdate {
  return {
    status: draft.status,
    selectedAction: draft.selectedAction.trim(),
    decisionReason: draft.decisionReason.trim(),
    trialResult: draft.trialResult.trim(),
    teacherResponse: draft.teacherResponse.trim(),
  }
}

/** 保存済みの内容と比べて変更があるか */
export function isDraftChanged(draft: ImprovementUpdate, saved: ImprovementUpdate): boolean {
  const a = normalizeDraft(draft)
  const b = normalizeDraft(saved)
  return a.status !== b.status || IMPROVEMENT_TEXT_FIELDS.some((field) => a[field] !== b[field])
}
