/**
 * まなび環境ラボのドメイン型定義。
 * 個人を特定できる情報（氏名・学籍番号・クラス名など）は意図的に持たない。
 */

/** 困りごとのカテゴリ */
export type IssueCategory = 'sound' | 'light'

/** 困りごとの種類 */
export type IssueType =
  | 'chair-noise'
  | 'surrounding-noise'
  | 'window-glare'
  | 'lighting-glare'
  | 'other'

/** 困りごとが起きる場面 */
export type IssueSituation =
  | 'class-start'
  | 'during-class'
  | 'group-work'
  | 'test'
  | 'break-time'
  | 'other'

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

/** localStorage に保存するデモ状態全体 */
export interface DemoState {
  version: number
  issues: Issue[]
  improvements: Improvement[]
}
