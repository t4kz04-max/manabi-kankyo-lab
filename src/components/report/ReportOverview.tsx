import { Sun, Volume2 } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/format'
import { CATEGORY_LABELS, describeIssue, ISSUE_TYPE_LABELS, SITUATION_LABELS } from '@/lib/labels'
import type { Issue } from '@/types/issue'

interface ReportOverviewProps {
  issue: Issue
}

/** 生徒が困っていたこと */
export function ReportOverview({ issue }: ReportOverviewProps) {
  const CategoryIcon = issue.category === 'sound' ? Volume2 : Sun
  const rows = [
    { term: 'カテゴリー', detail: CATEGORY_LABELS[issue.category] },
    { term: '困る場面', detail: SITUATION_LABELS[issue.situation] },
    { term: '困りごとの種類', detail: ISSUE_TYPE_LABELS[issue.issueType] },
    { term: '投稿日', detail: formatDate(issue.createdAt) },
  ]

  return (
    <section aria-labelledby="report-overview-heading" className="surface-card overflow-hidden">
      <div className="flex flex-col gap-4 bg-secondary px-5 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-7">
        <div className="space-y-2">
          <h2
            id="report-overview-heading"
            className="flex items-center gap-1.5 text-sm font-bold text-secondary-foreground"
          >
            <CategoryIcon aria-hidden="true" className="size-4" />
            生徒が困っていたこと
          </h2>
          <p className="text-2xl font-bold text-phrase sm:text-3xl">「{describeIssue(issue)}」</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="text-muted-foreground">現在の対応状況</span>
          <StatusBadge status={issue.status} />
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 px-5 py-5 sm:px-7 lg:grid-cols-4">
        {rows.map((row) => (
          <div key={row.term}>
            <dt className="text-xs font-bold text-muted-foreground">{row.term}</dt>
            <dd className="font-bold">{row.detail}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
