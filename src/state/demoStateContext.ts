import { createContext } from 'react'
import type { ImprovementUpdate } from '@/lib/improvementRules'
import type { DemoState, Issue, NewIssueInput } from '@/types/issue'

/** 画面上部に表示する、保存データに関するお知らせ */
export type StorageNotice = 'reset-invalid' | 'reset-version' | 'unavailable'

/**
 * 状態を変更する操作の結果。
 * どの操作も「ブラウザへの保存に成功した変更だけを確定する」。
 * save-failed の場合、状態・履歴は一切変わっていない。
 */
export type SubmitIssueResult =
  | { ok: true; issue: Issue }
  | { ok: false; reason: 'save-failed' }

export type UpdateIssueResponseResult =
  | {
      ok: true
      /** 保存済みの内容から変更があったか（false の場合は何も保存していない） */
      changed: boolean
    }
  | {
      ok: false
      /** not-found：投稿が存在しない／invalid：入力内容が正しくない／save-failed：保存できなかった */
      reason: 'not-found' | 'invalid' | 'save-failed'
    }

export type ResetDemoStateResult = { ok: true } | { ok: false; reason: 'save-failed' }

export interface DemoStateContextValue {
  state: DemoState
  storageNotice: StorageNotice | null
  dismissStorageNotice: () => void
  /** 生徒が困りごとを投稿する */
  submitIssue: (input: NewIssueInput) => SubmitIssueResult
  /** 先生が対応状況と改善記録を保存する */
  updateIssueResponse: (issueId: string, update: ImprovementUpdate) => UpdateIssueResponseResult
  /** デモデータを初期状態に戻す */
  resetDemoState: () => ResetDemoStateResult
}

export const DemoStateContext = createContext<DemoStateContextValue | null>(null)
