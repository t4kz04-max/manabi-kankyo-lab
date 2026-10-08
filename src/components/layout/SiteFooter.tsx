import { Info } from 'lucide-react'
import { Link } from 'react-router'
import { LogoMark } from '@/components/brand/LogoMark'
import { NAV_SECTIONS } from '@/components/layout/navigation'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="page-container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-9" />
            <p className="text-lg font-bold">まなび環境ラボ</p>
          </div>
          <p className="font-bold">教室の「困った」を「変わった」に。</p>
          <p className="flex gap-2 text-sm text-muted-foreground">
            <Info aria-hidden="true" className="mt-[0.3em] size-4 shrink-0" />
            <span>
              このアプリはコンテスト応募用のデモ用プロトタイプです。表示される投稿・対応・改善結果は、すべて架空のデータです。実際の学校や生徒の情報は扱っていません。
            </span>
          </p>
        </div>

        <nav aria-label="フッターメニュー">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {NAV_SECTIONS.flatMap((section) => section.items).map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="inline-flex min-h-10 items-center font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="page-container py-4 text-xs text-muted-foreground">
          NIJIN教育万博2026 アイデアコンテスト応募用プロトタイプ
        </p>
      </div>
    </footer>
  )
}
