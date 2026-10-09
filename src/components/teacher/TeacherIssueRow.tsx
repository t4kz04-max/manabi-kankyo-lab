import { ArrowRight, Eye, Sun, Volume2 } from 'lucide-react'
import { Link } from 'react-router'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'
import { CATEGORY_LABELS, describeIssue, SITUATION_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'
import { teacherIssuePath } from '@/routes/paths'
import type { Issue } from '@/types/issue'

interface TeacherIssueRowProps {
  issue: Issue
}

/** 先生ダッシュボードの投稿1件分 */
export function TeacherIssueRow({ issue }: TeacherIssueRowProps) {
  const CategoryIcon = issue.category === 'sound' ? Volume2 : Sun
  const isUnconfirmed = issue.status === 'unconfirmed'
  const titleId = `teacher-issue-${issue.id}-title`

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'surface-card relative flex flex-col gap-4 overflow-hidden p-5 sm:p-6 md:flex-row md:items-center',
        isUnconfirmed && 'pl-6 sm:pl-7',
      )}
    >
      {/* 未確認の投稿は左端の帯でも目立たせる（状態の判別はバッジの文字でも可能） */}
      {isUnconfirmed && (
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-primary" />
      )}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 font-bold text-secondary-foreground">
            <CategoryIcon aria-hidden="true" className="size-4" />
            {CATEGORY_LABELS[issue.category]}
          </span>
          <StatusBadge status={issue.status} />
          <span className="text-muted-foreground">
            投稿日：<time dateTime={issue.createdAt}>{formatDate(issue.createdAt)}</time>
          </span>
        </div>
        <h3 id={titleId} className="text-lg text-phrase">
          {describeIssue(issue)}
        </h3>
        <p className="text-sm text-muted-foreground">
          場面：<span className="font-bold text-foreground">{SITUATION_LABELS[issue.situation]}</span>
        </p>
      </div>
      <Button
        asChild
        variant={isUnconfirmed ? 'default' : 'outline'}
        className="w-full shrink-0 md:w-auto"
      >
        <Link to={teacherIssuePath(issue.id)} aria-describedby={titleId}>
          {isUnconfirmed ? (
            <>
              対応を考える
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </>
          ) : (
            <>
              <Eye aria-hidden="true" data-icon="inline-start" />
              対応内容を見る
            </>
          )}
        </Link>
      </Button>
    </article>
  )
}
