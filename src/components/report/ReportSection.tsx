import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface ReportSectionProps {
  id: string
  title: string
  icon: LucideIcon
  /** 見出しの下の短い説明 */
  lead?: string
  children: ReactNode
}

/** 改善レポートの各セクション */
export function ReportSection({ id, title, icon: Icon, lead, children }: ReportSectionProps) {
  return (
    <section aria-labelledby={id} className="surface-card p-5 sm:p-7">
      <h2 id={id} className="flex items-center gap-2.5 text-lg sm:text-xl">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary-ink">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        {title}
      </h2>
      {lead && <p className="mt-2 text-sm text-muted-foreground">{lead}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}
