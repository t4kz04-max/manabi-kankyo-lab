import { Link } from 'react-router'
import { PATHS } from '@/routes/paths'

export function NotFoundPage() {
  return (
    <section aria-labelledby="page-title" className="space-y-3">
      <h1 id="page-title" className="text-2xl font-bold">
        ページが見つかりません
      </h1>
      <p>お探しのページは存在しないか、移動した可能性があります。</p>
      <Link to={PATHS.home} className="text-primary underline">
        ホームに戻る
      </Link>
    </section>
  )
}
