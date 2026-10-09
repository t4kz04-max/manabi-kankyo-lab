import { Lock, Sun, Volume2 } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDateTime } from '@/lib/format'
import { CATEGORY_LABELS, describeIssue, ISSUE_TYPE_LABELS, SITUATION_LABELS } from '@/lib/labels'
import type { Issue } from '@/types/issue'

interface IssueOverviewCardProps {
  /** 保存済みの投稿（編集中の内容ではない） */
  issue: Issue
}

/** 生徒から届いた困りごとの内容（この画面では編集できない） */
export function IssueOverviewCard({ issue }: IssueOverviewCardProps) {
  const CategoryIcon = issue.category === 'sound' ? Volume2 : Sun
  const rows = [
    { term: 'カテゴリー', detail: CATEGORY_LABELS[issue.category] },
    { term: '場面', detail: SITUATION_LABELS[issue.situation] },
    { term: '困りごとの種類', detail: ISSUE_TYPE_LABELS[issue.issueType] },
    { term: '投稿日時', detail: formatDateTime(issue.createdAt) },
  ]

  return (
    <section aria-labelledby="overview-heading" className="surface-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border bg-secondary px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
        <div className="space-y-2">
          <h2 id="overview-heading" className="flex items-center gap-1.5 text-sm font-bold text-secondary-foreground">
            <CategoryIcon aria-hidden="true" className="size-4" />
            生徒から届いた困りごと
          </h2>
          <p className="text-xl font-bold text-phrase sm:text-2xl">{describeIssue(issue)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-sm">
          <span className="text-muted-foreground">保存済みの対応状況</span>
          <StatusBadge status={issue.status} />
        </div>
      </div>
      <dl className="grid gap-x-6 gap-y-3 px-5 py-5 sm:grid-cols-2 sm:px-7 lg:grid-cols-4">
        {rows.map((row) => (
          <div key={row.term}>
            <dt className="text-xs font-bold text-muted-foreground">{row.term}</dt>
            <dd className="font-bold">{row.detail}</dd>
          </div>
        ))}
      </dl>
      <p className="flex items-center gap-1.5 border-t border-border px-5 py-3 text-xs text-muted-foreground sm:px-7">
        <Lock aria-hidden="true" className="size-3.5 shrink-0" />
        生徒が投稿した内容は、先生の画面からは変更できません。
      </p>
    </section>
  )
}
