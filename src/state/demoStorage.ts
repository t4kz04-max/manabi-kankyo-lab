import { createInitialDemoState, DEMO_STATE_VERSION } from '@/data/demoData'
import { parseDemoState } from '@/state/parseDemoState'
import type { DemoState } from '@/types/issue'

export const DEMO_STORAGE_KEY = 'manabi-kankyo-lab:demo-state'

/**
 * 読み込み結果の種類
 * - restored        : 保存済みデータを復元した
 * - initialized     : 保存データがなく、初期デモデータで開始した
 * - reset-invalid   : 保存データが壊れていたため初期状態に戻した
 * - reset-version   : データ構造のバージョンが異なるため初期状態に戻した
 * - unavailable     : localStorage を利用できない（メモリ上だけで動作）
 */
export type LoadOutcome =
  | 'restored'
  | 'initialized'
  | 'reset-invalid'
  | 'reset-version'
  | 'unavailable'

export interface LoadResult {
  state: DemoState
  outcome: LoadOutcome
}

function getStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    // プライベートモードやブラウザ設定で利用できない場合
    return null
  }
}

/** 保存文字列を DemoState に変換する。null（未保存）の場合は initialized を返す */
export function deserializeDemoState(raw: string | null): LoadResult {
  if (raw === null) {
    return { state: createInitialDemoState(), outcome: 'initialized' }
  }
  let value: unknown
  try {
    value = JSON.parse(raw)
  } catch {
    return { state: createInitialDemoState(), outcome: 'reset-invalid' }
  }
  const result = parseDemoState(value, DEMO_STATE_VERSION)
  if (result.ok) return { state: result.state, outcome: 'restored' }
  return {
    state: createInitialDemoState(),
    outcome: result.reason === 'version-mismatch' ? 'reset-version' : 'reset-invalid',
  }
}

export function loadDemoState(): LoadResult {
  const storage = getStorage()
  if (!storage) {
    return { state: createInitialDemoState(), outcome: 'unavailable' }
  }
  try {
    return deserializeDemoState(storage.getItem(DEMO_STORAGE_KEY))
  } catch {
    return { state: createInitialDemoState(), outcome: 'unavailable' }
  }
}

/** 保存に成功した場合だけ true を返す（容量超過や利用不可の場合は false） */
export function saveDemoState(state: DemoState): boolean {
  const storage = getStorage()
  if (!storage) return false
  try {
    storage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}
