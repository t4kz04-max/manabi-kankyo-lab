import { ArrowLeft, Construction } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/routes/paths'

interface ComingSoonNoticeProps {
  /** この画面で今後できるようになる予定のこと */
  plannedFeatures: string[]
}

/** 未実装の画面であることを明示する案内 */
export function ComingSoonNotice({ plannedFeatures }: ComingSoonNoticeProps) {
  return (
    <section
      aria-labelledby="coming-soon-title"
      className="surface-card overflow-hidden"
    >
      <div className="flex items-start gap-4 border-b border-border bg-pending-soft/60 px-5 py-5 sm:px-7">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pending-soft text-pending-ink ring-1 ring-pending/60">
          <Construction aria-hidden="true" className="size-6" />
        </span>
        <div className="space-y-1">
          <h2 id="coming-soon-title" className="text-lg">
            この機能は現在開発中です
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            まだ操作することはできません。完成までもうしばらくお待ちください。
          </p>
        </div>
      </div>
      <div className="space-y-5 px-5 py-6 sm:px-7">
        <div>
          <h3 className="text-base">この画面でできるようになる予定のこと</h3>
          <ul className="mt-3 space-y-2">
            {plannedFeatures.map((feature) => (
              <li key={feature} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-primary"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button asChild variant="outline">
          <Link to={PATHS.home}>
            <ArrowLeft aria-hidden="true" data-icon="inline-start" />
            ホームに戻る
          </Link>
        </Button>
      </div>
    </section>
  )
}
