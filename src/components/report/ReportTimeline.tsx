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
import { formatDateTime, formatDateTimeWithSeconds, minuteKey } from '@/lib/format'
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

function entryTime(entry: TimelineEntry): string | undefined {
  if (entry.kind === 'submitted') return entry.occurredAt
  if (entry.kind === 'response') return entry.activity.occurredAt
  return undefined
}

/**
 * 改善までの流れ（記録されている出来事だけを古い順に表示する）。
 * 続けて操作すると同じ「分」の記録が並ぶため、順番を「1件目」「2件目」と示し、
 * 同じ分の記録があるときだけ秒まで表示する（日時そのものは加工しない）。
 */
export function ReportTimeline({ issue, entries }: ReportTimelineProps) {
  const minuteCounts = new Map<string, number>()
  for (const entry of entries) {
    const time = entryTime(entry)
    if (time) minuteCounts.set(minuteKey(time), (minuteCounts.get(minuteKey(time)) ?? 0) + 1)
  }
  const showSeconds = (time: string) => (minuteCounts.get(minuteKey(time)) ?? 0) > 1

  return (
    <div className="relative">
      {/* 縦線（装飾） */}
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-[1.1875rem] w-0.5 bg-border" />
      <ol className="relative space-y-6">
        {entries.map((entry, index) => {
          const common = { order: index + 1, showSeconds }
          switch (entry.kind) {
            case 'submitted':
              return (
                <TimelineItem
                  key="submitted"
                  {...common}
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
                  {...common}
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
                    架空の初期デモデータのため、それまでの変更の日時や順序は記録されていません。
                  </p>
                </TimelineItem>
              )
            case 'response':
              return <ResponseItem key={entry.activity.id} {...common} activity={entry.activity} />
          }
        })}
      </ol>
    </div>
  )
}

interface ResponseItemProps {
  activity: ResponseUpdatedActivity
  order: number
  showSeconds: (time: string) => boolean
}

function ResponseItem({ activity, order, showSeconds }: ResponseItemProps) {
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
      order={order}
      showSeconds={showSeconds}
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
  /** 古い順の番号（1 始まり） */
  order: number
  showSeconds: (time: string) => boolean
  icon: LucideIcon
  iconClass: string
  title: string
  /** ISO 8601 の日時。日時がない場合は timeLabel を表示する */
  time?: string
  timeLabel?: string
  tag?: ReactNode
  children: ReactNode
}

function TimelineItem({
  order,
  showSeconds,
  icon: Icon,
  iconClass,
  title,
  time,
  timeLabel,
  tag,
  children,
}: TimelineItemProps) {
  return (
    <li className="relative flex gap-4 animate-in fade-in-0 duration-300">
      <span
        className={cn('relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full', iconClass)}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-bold text-foreground">
            {order}件目
          </span>
          {time ? (
            <time dateTime={time}>
              {showSeconds(time) ? formatDateTimeWithSeconds(time) : formatDateTime(time)}
            </time>
          ) : (
            timeLabel
          )}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-base sm:text-lg">{title}</h3>
          {tag}
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  )
}
