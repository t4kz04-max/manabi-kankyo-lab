import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DemoBadgeProps {
  className?: string
}

/** 架空データを使ったデモ版であることを示す小さな表示 */
export function DemoBadge({ className }: DemoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-pending/70 bg-pending-soft px-2.5 py-0.5 text-xs leading-5 font-bold whitespace-nowrap text-pending-ink',
        className,
      )}
    >
      <FlaskConical aria-hidden="true" className="size-3.5" />
      デモ版
      <span className="sr-only">（架空のデータを使っています）</span>
    </span>
  )
}
