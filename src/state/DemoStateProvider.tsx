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

  /**
   * 変更を保存し、保存に成功した場合だけ状態に反映する。
   * 保存できなかった変更（投稿・対応・履歴・リセット）は確定済みのデータとして扱わない。
   */
  const persist = useCallback(
    (next: DemoState) => {
      if (!saveDemoState(next)) return false
      replaceState(next)
      return true
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
      return persist(next) ? { ok: true, issue } : { ok: false, reason: 'save-failed' }
    },
    [persist],
  )

  const updateIssueResponse = useCallback<DemoStateContextValue['updateIssueResponse']>(
    (issueId, update) => {
      const result = applyIssueResponse(stateRef.current, issueId, update)
      if (!result.ok) return result
      if (!result.changed) return { ok: true, changed: false }
      if (!persist(result.state)) return { ok: false, reason: 'save-failed' }
      return { ok: true, changed: true }
    },
    [persist],
  )

  const resetDemoState = useCallback<DemoStateContextValue['resetDemoState']>(() => {
    if (!persist(createInitialDemoState())) return { ok: false, reason: 'save-failed' }
    setStorageNotice(null)
    return { ok: true }
  }, [persist])

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
