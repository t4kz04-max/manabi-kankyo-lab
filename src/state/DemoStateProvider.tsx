import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createInitialDemoState } from '@/data/demoData'
import {
  DemoStateContext,
  type DemoStateContextValue,
  type StorageNotice,
} from '@/state/demoStateContext'
import {
  DEMO_STORAGE_KEY,
  deserializeDemoState,
  loadDemoState,
  saveDemoState,
  type LoadResult,
} from '@/state/demoStorage'
import { addIssue, updateIssueResponse as applyIssueResponse } from '@/state/issueActions'
import type { DemoState } from '@/types/issue'

function noticeFromLoad(outcome: LoadResult['outcome']): StorageNotice | null {
  switch (outcome) {
    case 'reset-invalid':
    case 'reset-version':
    case 'unavailable':
      return outcome
    default:
      return null
  }
}

/** デモ状態を保持し、変更のたびに localStorage へ保存する */
export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(loadDemoState)
  const [state, setState] = useState<DemoState>(initial.state)
  const [storageNotice, setStorageNotice] = useState<StorageNotice | null>(() =>
    noticeFromLoad(initial.outcome),
  )
  // 操作の結果を同期的に返すため、最新の状態を ref でも保持する
  const stateRef = useRef(state)

  const replaceState = useCallback((next: DemoState) => {
    stateRef.current = next
    setState(next)
  }, [])

  /** 状態を更新して保存する。保存に失敗した場合はお知らせを表示する */
  const commit = useCallback(
    (next: DemoState) => {
      replaceState(next)
      const persisted = saveDemoState(next)
      if (!persisted) setStorageNotice('save-failed')
      return persisted
    },
    [replaceState],
  )

  // 壊れたデータ・古いバージョンのデータは、初期状態で上書きしておく
  useEffect(() => {
    if (initial.outcome === 'reset-invalid' || initial.outcome === 'reset-version') {
      saveDemoState(initial.state)
    }
  }, [initial])

  // 別のタブでの変更を反映する
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== DEMO_STORAGE_KEY && event.key !== null) return
      const result = deserializeDemoState(event.newValue)
      replaceState(result.state)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [replaceState])

  const submitIssue = useCallback<DemoStateContextValue['submitIssue']>(
    (input) => {
      const { state: next, issue } = addIssue(stateRef.current, input)
      return { issue, persisted: commit(next) }
    },
    [commit],
  )

  const updateIssueResponse = useCallback<DemoStateContextValue['updateIssueResponse']>(
    (issueId, update) => {
      const result = applyIssueResponse(stateRef.current, issueId, update)
      if (!result.ok) return result
      if (!result.changed) return { ok: true, changed: false }
      // 保存できなかった変更は画面にも反映しない（保存されていない履歴を表示しないため）
      if (!saveDemoState(result.state)) return { ok: false, reason: 'save-failed' }
      replaceState(result.state)
      return { ok: true, changed: true }
    },
    [replaceState],
  )

  const resetDemoState = useCallback(() => {
    const persisted = commit(createInitialDemoState())
    if (persisted) setStorageNotice(null)
    return { persisted }
  }, [commit])

  const dismissStorageNotice = useCallback(() => setStorageNotice(null), [])

  const value = useMemo<DemoStateContextValue>(
    () => ({
      state,
      storageNotice,
      dismissStorageNotice,
      submitIssue,
      updateIssueResponse,
      resetDemoState,
    }),
    [state, storageNotice, dismissStorageNotice, submitIssue, updateIssueResponse, resetDemoState],
  )

  return <DemoStateContext value={value}>{children}</DemoStateContext>
}
