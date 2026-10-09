import { ISSUE_STATUSES } from '@/lib/labels'
import type { IssueStatus } from '@/types/issue'

/**
 * 先生が記録する文章項目。
 * Improvement 型の項目に対応する。
 *   selectedAction  : 学校としての対応方針（参考例から選ぶか、先生が入力する）
 *   decisionReason  : その対応を選んだ理由（見送りの場合はその理由）
 *   trialResult     : 試した結果
 *   teacherResponse : 生徒へのメッセージ（任意）
 */
export type ImprovementTextField =
  | 'selectedAction'
  | 'decisionReason'
  | 'trialResult'
  | 'teacherResponse'

export const IMPROVEMENT_TEXT_FIELDS: ImprovementTextField[] = [
  'selectedAction',
  'decisionReason',
  'trialResult',
  'teacherResponse',
]

/** 先生が保存する内容（対応状況と記録） */
export interface ImprovementUpdate {
  status: IssueStatus
  selectedAction: string
  decisionReason: string
  trialResult: string
  teacherResponse: string
}

export const IMPROVEMENT_TEXT_MAX_LENGTH = 400

export const IMPROVEMENT_FIELD_LABELS: Record<ImprovementTextField, string> = {
  selectedAction: '学校としての対応方針',
  decisionReason: 'その対応を選んだ理由',
  trialResult: '試した結果',
  teacherResponse: '生徒へのメッセージ',
}

/**
 * 対応状況ごとに入力が必要な項目。
 * - 未確認・検討中：必須項目なし（方針が決まっていなくても保存できる）
 * - 試行予定・試行中：何を試すのか（対応方針）
 * - 改善済み：実施した対応と、試した結果
 * - 見送り：見送る理由
 */
export const REQUIRED_FIELDS_BY_STATUS: Record<IssueStatus, ImprovementTextField[]> = {
  unconfirmed: [],
  considering: [],
  'trial-planned': ['selectedAction'],
  'in-trial': ['selectedAction'],
  improved: ['selectedAction', 'trialResult'],
  declined: ['decisionReason'],
}

export interface ImprovementValidationError {
  field: ImprovementTextField
  message: string
}

/** 保存前の入力チェック。問題がなければ空配列を返す */
export function validateImprovementUpdate(
  update: ImprovementUpdate,
): ImprovementValidationError[] {
  const errors: ImprovementValidationError[] = []
  if (!ISSUE_STATUSES.includes(update.status)) {
    return [{ field: 'selectedAction', message: '対応状況の値が正しくありません' }]
  }
  const required = REQUIRED_FIELDS_BY_STATUS[update.status]
  for (const field of IMPROVEMENT_TEXT_FIELDS) {
    const value = update[field]
    if (typeof value !== 'string') {
      errors.push({ field, message: `${IMPROVEMENT_FIELD_LABELS[field]}の値が正しくありません` })
    } else if (value.trim().length > IMPROVEMENT_TEXT_MAX_LENGTH) {
      errors.push({
        field,
        message: `${IMPROVEMENT_FIELD_LABELS[field]}は${IMPROVEMENT_TEXT_MAX_LENGTH}文字以内で入力してください`,
      })
    } else if (required.includes(field) && value.trim() === '') {
      errors.push({ field, message: `${IMPROVEMENT_FIELD_LABELS[field]}を入力してください` })
    }
  }
  return errors
}
