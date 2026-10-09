import type { ReactNode } from 'react'
import {
  ArrowRight,
  Hourglass,
  Megaphone,
  MessageSquareText,
  NotebookPen,
  type LucideIcon,
} from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDateTime } from '@/lib/format'
import { IMPROVEMENT_FIELD_LABELS } from '@/lib/improvementRules'
import { describeIssue, STATUS_LABELS } from '@/lib/labels'
import type { TimelineEntry } from '@/lib/reportTimeline'
import { STATUS_PRESENTATION } from '@/lib/status'
import { cn } from '@/lib/utils'
import type { Issue, ResponseUpdatedActivity } from '@/types/issue'

interface ReportTimelineProps {
  issue: Issue
  entries: TimelineEntry[]
}

/** 改善までの流れ（記録されている出来事だけを古い順に表示する） */
export function ReportTimeline({ issue, entries }: ReportTimelineProps) {
  return (
    <div className="relative">
      {/* 縦線（装飾） */}
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-[1.1875rem] w-0.5 bg-border" />
      <ol className="relative space-y-6">
        {entries.map((entry) => {
          switch (entry.kind) {
            case 'submitted':
              return (
                <TimelineItem
                  key="submitted"
                  icon={MessageSquareText}
                  iconClass="bg-primary text-primary-foreground"
                  title="生徒が困りごとを投稿"
                  time={entry.occurredAt}
                >
                  <p className="text-phrase">「{describeIssue(issue)}」</p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    投稿時の対応状況
                    <StatusBadge status="unconfirmed" />
                  </p>
                </TimelineItem>
              )
            case 'pre-history':
              return (
                <TimelineItem
                  key="pre-history"
                  icon={Hourglass}
                  iconClass="bg-muted text-muted-foreground ring-1 ring-border"
                  title="履歴の記録を始める前の状態"
                  timeLabel="日時の記録なし"
                >
                  <p className="flex flex-wrap items-center gap-2 text-sm">
                    記録を始めた時点の対応状況
                    <StatusBadge status={entry.status} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    架空の初期デモデータのため、投稿後に対応状況がいつ・どの順に変わったかは記録されていません。
                  </p>
                </TimelineItem>
              )
            case 'response':
              return <ResponseItem key={entry.activity.id} activity={entry.activity} />
          }
        })}
      </ol>
    </div>
  )
}

function ResponseItem({ activity }: { activity: ResponseUpdatedActivity }) {
  const { statusChange, recordChanges } = activity
  const sharesResult = recordChanges.some(
    (change) => change.field === 'trialResult' && change.value !== '',
  )
  const icon = statusChange ? STATUS_PRESENTATION[statusChange.to].icon : NotebookPen
  const iconClass =
    statusChange?.to === 'improved'
      ? 'bg-success-ink text-white'
      : statusChange
        ? 'bg-secondary text-primary-ink ring-1 ring-primary/40'
        : 'bg-card text-primary-ink ring-1 ring-border'

  return (
    <TimelineItem
      icon={icon}
      iconClass={iconClass}
      title={
        statusChange
          ? `対応状況を「${STATUS_LABELS[statusChange.to]}」に変更`
          : '先生が対応の記録を更新'
      }
      time={activity.occurredAt}
      tag={
        sharesResult ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-bold text-success-ink">
            <Megaphone aria-hidden="true" className="size-3.5" />
            結果を共有
          </span>
        ) : undefined
      }
    >
      {statusChange && (
        <p className="flex flex-wrap items-center gap-2">
          <StatusBadge status={statusChange.from} />
          <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="sr-only">から</span>
          <StatusBadge status={statusChange.to} />
          <span className="sr-only">に変更</span>
        </p>
      )}
      {recordChanges.length > 0 && (
        <dl className={cn('space-y-2', statusChange && 'mt-3')}>
          {recordChanges.map((change) => (
            <div key={change.field} className="rounded-lg bg-background px-3 py-2">
              <dt className="text-xs font-bold text-muted-foreground">
                {IMPROVEMENT_FIELD_LABELS[change.field]}
              </dt>
              <dd className={cn('text-sm sm:text-base', change.value === '' && 'text-muted-foreground')}>
                {change.value === '' ? '（記入を取り消しました）' : change.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </TimelineItem>
  )
}

interface TimelineItemProps {
  icon: LucideIcon
  iconClass: string
  title: string
  /** ISO 8601 の日時。日時がない場合は timeLabel を表示する */
  time?: string
  timeLabel?: string
  tag?: ReactNode
  children: ReactNode
}

function TimelineItem({ icon: Icon, iconClass, title, time, timeLabel, tag, children }: TimelineItemProps) {
  return (
    <li className="relative flex gap-4">
      <span
        className={cn('relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full', iconClass)}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1 pt-1.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-base sm:text-lg">{title}</h3>
          {tag}
        </div>
        <p className="text-sm text-muted-foreground">
          {time ? <time dateTime={time}>{formatDateTime(time)}</time> : timeLabel}
        </p>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  )
}
