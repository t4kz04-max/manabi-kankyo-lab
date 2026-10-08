import { cn } from '@/lib/utils'
import { STATUS_PRESENTATION, STATUS_TONE_CLASSES } from '@/lib/status'
import type { IssueStatus } from '@/types/issue'

interface StatusBadgeProps {
  status: IssueStatus
  className?: string
}

/** 対応状況のバッジ。色・アイコン・文字の3つで状態を伝える */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, icon: Icon, tone } = STATUS_PRESENTATION[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm leading-none font-bold whitespace-nowrap',
        STATUS_TONE_CLASSES[tone],
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {label}
    </span>
  )
}
