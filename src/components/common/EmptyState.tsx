import type { ReactNode } from 'react'
import { SearchX, type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
}

/** 表示する項目がないときの案内 */
export function EmptyState({ title, description, icon: Icon = SearchX, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-input/60 bg-card px-5 py-12 text-center">
      <Icon aria-hidden="true" className="mx-auto size-10 text-muted-foreground" />
      <p className="mt-3 font-bold">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
