import { createContext } from 'react'
import type { ImprovementUpdate } from '@/lib/improvementRules'
import type { DemoState, Issue, NewIssueInput } from '@/types/issue'

/** 画面上部に表示する、保存に関するお知らせ */
export type StorageNotice =
  | 'reset-invalid'
  | 'reset-version'
  | 'unavailable'
  | 'save-failed'

export interface SubmitIssueResult {
  issue: Issue
  /** localStorage への保存に成功したか（失敗時はこのタブのメモリ上にだけ存在する） */
  persisted: boolean
}

export type UpdateIssueResponseResult =
  | {
      ok: true
      /** localStorage への保存に成功したか（失敗時はこのタブのメモリ上にだけ反映される） */
      persisted: boolean
    }
  | {
      ok: false
      /** not-found：投稿が存在しない／invalid：入力内容が正しくない */
      reason: 'not-found' | 'invalid'
    }

export interface DemoStateContextValue {
  state: DemoState
  storageNotice: StorageNotice | null
  dismissStorageNotice: () => void
  submitIssue: (input: NewIssueInput) => SubmitIssueResult
  /** 先生が対応状況と改善記録を保存する */
  updateIssueResponse: (issueId: string, update: ImprovementUpdate) => UpdateIssueResponseResult
  /** デモデータを初期状態に戻す。保存に成功したかを返す */
  resetDemoState: () => { persisted: boolean }
}

export const DemoStateContext = createContext<DemoStateContextValue | null>(null)
