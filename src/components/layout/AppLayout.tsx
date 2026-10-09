import { Outlet, ScrollRestoration, useNavigation } from 'react-router'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { StorageNoticeBanner } from '@/components/layout/StorageNoticeBanner'

/** 全画面共通のレイアウト（ヘッダー・本文・フッター） */
export function AppLayout() {
  // 次の画面を読み込んでいる間は、前の画面を表示したまま上部に進行状況を出す
  const isLoading = useNavigation().state === 'loading'

  return (
    <div className="flex min-h-svh flex-col">
      {isLoading && (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-secondary"
        >
          <div className="h-full w-1/3 animate-[loading-bar_1s_ease-in-out_infinite] bg-primary" />
          <span className="sr-only">画面を読み込んでいます</span>
        </div>
      )}
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        本文へスキップ
      </a>
      <SiteHeader />
      <StorageNoticeBanner />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  )
}
