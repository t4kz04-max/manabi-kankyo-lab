/**
 * まなび環境ラボのドメイン型定義。
 * 個人を特定できる情報（氏名・学籍番号・クラス名など）は意図的に持たない。
 */

/** 困りごとのカテゴリ */
export type IssueCategory = 'sound' | 'light'

/** 困りごとの種類（カテゴリごとの選択肢は lib/labels.ts の ISSUE_TYPES_BY_CATEGORY） */
export type IssueType =
  // 音
  | 'chair-noise'
  | 'surrounding-noise'
  | 'hallway-noise'
  | 'other-sound'
  // 光
  | 'window-glare'
  | 'lighting-glare'
  | 'board-reflection'
  | 'room-brightness'

/** 困りごとが起きる場面（カテゴリごとの選択肢は lib/labels.ts の SITUATIONS_BY_CATEGORY） */
export type IssueSituation =
  | 'class-start'
  | 'during-class'
  | 'group-work'
  | 'test'
  | 'break-time'
  | 'time-of-day'
  | 'specific-place'

/** 対応状況 */
export type IssueStatus =
  | 'unconfirmed'
  | 'considering'
  | 'trial-planned'
  | 'in-trial'
  | 'improved'
  | 'declined'

/** 生徒から投稿された困りごと */
export interface Issue {
  id: string
  category: IssueCategory
  situation: IssueSituation
  issueType: IssueType
  status: IssueStatus
  /** ISO 8601 形式の日時 */
  createdAt: string
  /** ISO 8601 形式の日時 */
  updatedAt: string
  /** 架空のデモデータであることを示すフラグ */
  isDemo: boolean
}

/** 困りごとに対する学校側の改善記録 */
export interface Improvement {
  issueId: Issue['id']
  /** 参考となる改善案（先生が選択・編集する。自動では適用しない） */
  suggestedActions: string[]
  /** 先生が選んだ、または入力した改善案 */
  selectedAction: string | null
  /** 生徒への返答 */
  teacherResponse: string
  /** 対応状況を決めた理由 */
  decisionReason: string
  /** 試行の結果 */
  trialResult: string
  /** ISO 8601 形式の日時 */
  updatedAt: string
  /** 架空のデモデータであることを示すフラグ */
  isDemo: boolean
}

/** 生徒が投稿フォームで入力する内容（すべて選択式で、自由記述や個人情報は含まない） */
export interface NewIssueInput {
  category: IssueCategory
  situation: IssueSituation
  issueType: IssueType
}

/** 先生が記録する改善記録の文章項目 */
export type ImprovementRecordField =
  | 'selectedAction'
  | 'decisionReason'
  | 'trialResult'
  | 'teacherResponse'

/** 生徒が困りごとを投稿した */
export interface IssueSubmittedActivity {
  id: string
  issueId: Issue['id']
  type: 'issue-submitted'
  /** ISO 8601 形式の日時 */
  occurredAt: string
  isDemo: boolean
}

/**
 * 先生が対応状況・改善記録を保存した（保存1回につき1件）。
 * 変更があった項目だけを、その時点の値で記録する。後から編集しても過去の記録は書き換えない。
 */
export interface ResponseUpdatedActivity {
  id: string
  issueId: Issue['id']
  type: 'response-updated'
  /** ISO 8601 形式の日時 */
  occurredAt: string
  /** 対応状況を変更した場合だけ記録する */
  statusChange: { from: IssueStatus; to: IssueStatus } | null
  /** 内容を変更した記録項目と、変更後の値（空文字は削除を表す） */
  recordChanges: { field: ImprovementRecordField; value: string }[]
  isDemo: boolean
}

/** 対応履歴のイベント */
export type ActivityEvent = IssueSubmittedActivity | ResponseUpdatedActivity

/** localStorage に保存するデモ状態全体 */
export interface DemoState {
  version: number
  issues: Issue[]
  improvements: Improvement[]
  /** 対応履歴（Phase 4 で追加。それ以前の操作の履歴は存在しない） */
  activities: ActivityEvent[]
}
