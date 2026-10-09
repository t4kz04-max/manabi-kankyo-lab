import { FileChartColumn, MessageCircleReply, Sparkles, Sun, Volume2 } from 'lucide-react'
import { Link } from 'react-router'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/format'
import {
  CATEGORY_LABELS,
  describeIssue,
  ISSUE_TYPE_LABELS,
  SITUATION_LABELS,
} from '@/lib/labels'
import { STATUS_PRESENTATION } from '@/lib/status'
import { cn } from '@/lib/utils'
import { reportPath } from '@/routes/paths'
import type { Improvement, Issue } from '@/types/issue'

interface IssueStatusCardProps {
  issue: Issue
  improvement?: Improvement
  /** 直前に投稿した困りごとを目立たせる */
  highlighted?: boolean
  /** 改善レポートへのリンクを表示するか（先生画面のプレビューでは表示しない） */
  showReportLink?: boolean
}

export function IssueStatusCard({
  issue,
  improvement,
  highlighted = false,
  showReportLink = true,
}: IssueStatusCardProps) {
  const CategoryIcon = issue.category === 'sound' ? Volume2 : Sun
  const titleId = `issue-${issue.id}-title`
  // 先生が実際に記録した内容だけを表示する（空の項目は表示しない）
  const responseRows = improvement
    ? [
        { term: '学校からの回答', detail: improvement.teacherResponse },
        { term: '学校としての対応方針', detail: improvement.selectedAction ?? '' },
        { term: '判断の理由', detail: improvement.decisionReason },
        { term: '試した結果', detail: improvement.trialResult },
      ].filter((row) => row.detail.trim() !== '')
    : []

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'rounded-2xl border bg-card p-5 shadow-card sm:p-6',
        highlighted ? 'border-2 border-primary' : 'border-border',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 font-bold text-secondary-foreground">
            <CategoryIcon aria-hidden="true" className="size-4" />
            {CATEGORY_LABELS[issue.category]}
          </span>
          <span className="text-muted-foreground">
            投稿日：<time dateTime={issue.createdAt}>{formatDate(issue.createdAt)}</time>
          </span>
          {highlighted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 font-bold text-primary-foreground">
              <Sparkles aria-hidden="true" className="size-3.5" />
              いま投稿した困りごと
            </span>
          )}
        </div>
        <StatusBadge status={issue.status} />
      </div>

      <h3 id={titleId} className="mt-3 text-lg text-phrase sm:text-xl">
        {describeIssue(issue)}
      </h3>
      <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <div className="flex gap-1">
          <dt className="text-muted-foreground">場面：</dt>
          <dd className="font-bold">{SITUATION_LABELS[issue.situation]}</dd>
        </div>
        <div className="flex gap-1">
          <dt className="text-muted-foreground">種類：</dt>
          <dd className="font-bold">{ISSUE_TYPE_LABELS[issue.issueType]}</dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-border pt-4">
        {responseRows.length > 0 ? (
          <div className="rounded-xl bg-secondary/60 px-4 py-3">
            <p className="flex items-center gap-1.5 text-sm font-bold text-secondary-foreground">
              <MessageCircleReply aria-hidden="true" className="size-4" />
              学校の対応
            </p>
            <dl className="mt-2 space-y-2">
              {responseRows.map((row) => (
                <div key={row.term}>
                  <dt className="text-xs font-bold text-muted-foreground">{row.term}</dt>
                  <dd className="text-sm sm:text-base">{row.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {STATUS_PRESENTATION[issue.status].description}。学校からの回答はまだありません。
          </p>
        )}
      </div>
      {showReportLink && (
        <Link
          to={reportPath(issue.id)}
          aria-describedby={titleId}
          className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm text-link"
        >
          <FileChartColumn aria-hidden="true" className="size-4" />
          改善レポートを見る
        </Link>
      )}
    </article>
  )
}
