import { RotateCw, TriangleAlert } from 'lucide-react'
import { Link, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PATHS } from '@/routes/paths'

/** 画面の読み込みや表示でエラーが起きたときの案内（ヘッダー・フッターは表示したまま） */
export function RouteError() {
  const error = useRouteError()
  useDocumentTitle('画面を表示できませんでした')
  // 開発時の調査用に、エラーの内容は開発者ツールに残す
  console.warn(error)

  return (
    <div className="page-container py-20 sm:py-28">
      <div role="alert" className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-pending-soft text-pending-ink">
          <TriangleAlert aria-hidden="true" className="size-8" />
        </span>
        <h1 className="mt-6 text-2xl sm:text-3xl">画面を表示できませんでした</h1>
        <p className="mt-3 text-muted-foreground sm:text-lg">
          通信の状態などにより、画面を読み込めなかった可能性があります。再読み込みをお試しください。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={() => window.location.reload()}>
            <RotateCw aria-hidden="true" data-icon="inline-start" />
            再読み込みする
          </Button>
          <Button asChild variant="outline">
            <Link to={PATHS.home} reloadDocument>
              ホームに戻る
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
