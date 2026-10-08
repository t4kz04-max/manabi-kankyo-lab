import { ArrowLeft, SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PATHS } from '@/routes/paths'

export function NotFoundPage() {
  useDocumentTitle('ページが見つかりません')

  return (
    <div className="page-container py-20 sm:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary-ink">
          <SearchX aria-hidden="true" className="size-8" />
        </span>
        <h1 className="mt-6 text-2xl sm:text-3xl">ページが見つかりません</h1>
        <p className="mt-3 text-muted-foreground sm:text-lg">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Button asChild className="mt-8">
          <Link to={PATHS.home}>
            <ArrowLeft aria-hidden="true" data-icon="inline-start" />
            ホームに戻る
          </Link>
        </Button>
      </div>
    </div>
  )
}
