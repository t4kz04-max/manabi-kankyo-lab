import { createContext } from 'react'
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

export interface DemoStateContextValue {
  state: DemoState
  storageNotice: StorageNotice | null
  dismissStorageNotice: () => void
  submitIssue: (input: NewIssueInput) => SubmitIssueResult
  /** デモデータを初期状態に戻す。保存に成功したかを返す */
  resetDemoState: () => { persisted: boolean }
}

export const DemoStateContext = createContext<DemoStateContextValue | null>(null)
