import { useContext } from 'react'
import { DemoStateContext } from '@/state/demoStateContext'

/** デモ状態と操作を取得する（DemoStateProvider の内側で使う） */
export function useDemoState() {
  const context = useContext(DemoStateContext)
  if (!context) {
    throw new Error('useDemoState は DemoStateProvider の内側で使用してください')
  }
  return context
}
