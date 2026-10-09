import type { ReactNode } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Flag,
  Info,
  Lightbulb,
  MessageSquareText,
  Sparkles,
  Sun,
  Volume2,
  type LucideIcon,
} from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDate, formatDateTime } from '@/lib/format'
import {
  CATEGORY_LABELS,
  describeIssue,
  ISSUE_TYPE_LABELS,
  SITUATION_LABELS,
} from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { Improvement, Issue, IssueStatus } from '@/types/issue'

/** 対応状況ごとの、現在の結果の説明 */
const RESULT_MESSAGES: Record<IssueStatus, string> = {
  unconfirmed: 'まだ対応が記録されていません。',
  considering: '学校が改善の方法を検討しています。',
  'trial-planned': '改善の方法を試す予定です。',
  'in-trial': '改善の方法を試しています。',
  improved: '対応の内容と、試した結果が記録されています。',
  declined: '今回は実施しないと判断しました。',
}

interface ReportSummaryProps {
  issue: Issue
  improvement?: Improvement
}

/**
 * 改善のまとめ：「困っていたこと → 学校が考えた対応 → 結果」を1枚で示す。
 * 記録がない項目は「まだ記録されていません」と表示し、内容を補わない。
 */
export function ReportSummary({ issue, improvement }: ReportSummaryProps) {
  const CategoryIcon = issue.category === 'sound' ? Volume2 : Sun
  const action = improvement?.selectedAction?.trim() ?? ''
  const reason = improvement?.decisionReason.trim() ?? ''
  const trialResult = improvement?.trialResult.trim() ?? ''
  const highlight =
    issue.status === 'improved' && trialResult
      ? { label: '試した結果', text: trialResult }
      : issue.status === 'declined' && reason
        ? { label: '見送りの理由', text: reason }
        : trialResult
          ? { label: '試した結果', text: trialResult }
          : null

  return (
    <section aria-labelledby="report-summary-heading" className="surface-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <h2 id="report-summary-heading" className="flex items-center gap-2.5 text-lg sm:text-xl">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary-ink">
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
          改善のまとめ
        </h2>
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          現在の対応状況
          <StatusBadge status={issue.status} />
          <span>
            最終更新：<time dateTime={issue.updatedAt}>{formatDateTime(issue.updatedAt)}</time>
          </span>
        </p>
      </div>

      <ol className="grid lg:grid-cols-3">
        <SummaryStep index={0} label="困っていたこと" icon={MessageSquareText}>
          <p className="text-xl font-bold text-phrase sm:text-2xl">「{describeIssue(issue)}」</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
              <CategoryIcon aria-hidden="true" className="size-3.5" />
              {CATEGORY_LABELS[issue.category]}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
              {SITUATION_LABELS[issue.situation]}
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
              {ISSUE_TYPE_LABELS[issue.issueType]}
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            投稿日：<time dateTime={issue.createdAt}>{formatDate(issue.createdAt)}</time>
          </p>
        </SummaryStep>

        <SummaryStep index={1} label="学校が考えた対応" icon={Lightbulb}>
          {action ? (
            <p className="text-lg font-bold text-phrase line-clamp-4">{action}</p>
          ) : (
            <NotRecorded>まだ対応方針は記録されていません。</NotRecorded>
          )}
          {reason && issue.status !== 'declined' && (
            <div className="mt-3">
              <p className="text-xs font-bold text-muted-foreground">選んだ理由</p>
              <p className="mt-0.5 text-sm line-clamp-3">{reason}</p>
            </div>
          )}
        </SummaryStep>

        <SummaryStep index={2} label="結果" icon={Flag}>
          <p className="text-lg font-bold text-phrase">{RESULT_MESSAGES[issue.status]}</p>
          {highlight && (
            <div
              className={cn(
                'mt-3 rounded-xl px-4 py-3',
                issue.status === 'improved'
                  ? 'border border-success/50 bg-success-soft'
                  : 'border border-border bg-muted',
              )}
            >
              <p
                className={cn(
                  'text-xs font-bold',
                  issue.status === 'improved' ? 'text-success-ink' : 'text-muted-foreground',
                )}
              >
                {highlight.label}
              </p>
              <p className="mt-1 text-sm line-clamp-4 sm:text-base">{highlight.text}</p>
            </div>
          )}
          {issue.status === 'improved' && (
            <p className="mt-3 flex gap-1.5 text-xs text-muted-foreground">
              <Info aria-hidden="true" className="mt-[0.2em] size-3.5 shrink-0 text-primary" />
              <span>
                「改善済み」は学校の記録上の対応状況です。すべての生徒の困りごとが解消されたことを示すものではありません。
              </span>
            </p>
          )}
        </SummaryStep>
      </ol>
    </section>
  )
}

interface SummaryStepProps {
  index: number
  label: string
  icon: LucideIcon
  children: ReactNode
}

function SummaryStep({ index, label, icon: Icon, children }: SummaryStepProps) {
  return (
    <li
      className={cn(
        'relative px-5 py-6 sm:px-7',
        index > 0 && 'border-t border-border lg:border-t-0 lg:border-l',
      )}
    >
      {index > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-3.5 left-1/2 z-10 flex size-7 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card text-primary lg:top-1/2 lg:-left-3.5 lg:translate-x-0 lg:-translate-y-1/2"
        >
          <ChevronDown className="size-4 lg:hidden" />
          <ChevronRight className="hidden size-4 lg:block" />
        </span>
      )}
      <p className="flex items-center gap-2 text-sm font-bold text-primary-ink">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <span>
          <span className="sr-only">{index + 1}. </span>
          {label}
        </span>
      </p>
      <div className="mt-3">{children}</div>
    </li>
  )
}

function NotRecorded({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>
}
