import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: ReactNode
  lead?: ReactNode
  align?: 'left' | 'center'
}

/** ホーム画面の各セクションの見出し */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl space-y-3',
        align === 'center' && 'mx-auto text-center',
      )}
    >
      <p className="text-sm font-bold tracking-wider text-primary-ink">
        {eyebrow}
      </p>
      <h2 id={id} className="text-2xl sm:text-3xl">
        {title}
      </h2>
      {lead && (
        <p className="text-base text-muted-foreground sm:text-lg">{lead}</p>
      )}
    </div>
  )
}
