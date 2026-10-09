import { CircleCheckBig, CircleDashed, FlaskConical, Inbox, type LucideIcon } from 'lucide-react'
import { STATUS_LABELS } from '@/lib/labels'
import { IN_PROGRESS_STATUSES } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { Issue } from '@/types/issue'

interface SummaryItem {
  label: string
  count: number
  note: string
  icon: LucideIcon
  iconClass: string
  emphasized?: boolean
}

interface SummaryCardsProps {
  issues: Issue[]
}

/** 投稿の件数の概要。数値はすべて現在の状態から計算する */
export function SummaryCards({ issues }: SummaryCardsProps) {
  const countOf = (predicate: (issue: Issue) => boolean) => issues.filter(predicate).length
  const unconfirmed = countOf((issue) => issue.status === 'unconfirmed')
  const declined = countOf((issue) => issue.status === 'declined')

  const items: SummaryItem[] = [
    {
      label: '投稿総数',
      count: issues.length,
      note: declined > 0 ? `うち見送り ${declined}件` : 'すべての対応状況を含む',
      icon: Inbox,
      iconClass: 'bg-secondary text-primary-ink',
    },
    {
      label: STATUS_LABELS.unconfirmed,
      count: unconfirmed,
      note: unconfirmed > 0 ? 'まず内容を確認しましょう' : '未確認の投稿はありません',
      icon: CircleDashed,
      iconClass: 'bg-card text-muted-foreground ring-1 ring-input/60',
      emphasized: unconfirmed > 0,
    },
    {
      label: '対応中',
      count: countOf((issue) => IN_PROGRESS_STATUSES.includes(issue.status)),
      note: IN_PROGRESS_STATUSES.map((status) => STATUS_LABELS[status]).join('・'),
      icon: FlaskConical,
      iconClass: 'bg-pending-soft text-pending-ink',
    },
    {
      label: STATUS_LABELS.improved,
      count: countOf((issue) => issue.status === 'improved'),
      note: '試した結果を共有済み',
      icon: CircleCheckBig,
      iconClass: 'bg-success-soft text-success-ink',
    },
  ]

  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">
        投稿の概要
      </h2>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className={cn(
                'surface-card flex flex-col gap-3 p-4 sm:p-5',
                item.emphasized && 'border-2 border-primary',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <dt className="text-sm font-bold text-muted-foreground">{item.label}</dt>
                <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl', item.iconClass)}>
                  <Icon aria-hidden="true" className="size-5" />
                </span>
              </div>
              <dd className="space-y-1">
                <span className="block text-3xl leading-none font-bold sm:text-4xl">
                  {item.count}
                  <span className="ml-1 text-base font-bold text-muted-foreground">件</span>
                </span>
                <span className="block text-xs text-muted-foreground text-phrase">{item.note}</span>
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}
