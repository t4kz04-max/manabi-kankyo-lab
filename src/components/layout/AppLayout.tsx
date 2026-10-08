import { Outlet } from 'react-router'

/**
 * 全画面共通のレイアウト。
 * ヘッダー・ナビゲーションなどのデザインは Phase 1 で実装する。
 */
export function AppLayout() {
  return (
    <div className="min-h-svh">
      <main className="mx-auto w-full max-w-5xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
