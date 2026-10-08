import type { ReactNode } from 'react'

interface PagePlaceholderProps {
  title: string
  description: string
  plannedPhase: string
  children?: ReactNode
}

/** 未実装画面の仮表示（各 Phase で本実装に置き換える） */
export function PagePlaceholder({
  title,
  description,
  plannedPhase,
  children,
}: PagePlaceholderProps) {
  return (
    <section aria-labelledby="page-title" className="space-y-3">
      <h1 id="page-title" className="text-2xl font-bold">
        {title}
      </h1>
      <p>{description}</p>
      <p className="text-sm text-muted-foreground">
        この画面は {plannedPhase} で実装予定です。
      </p>
      {children}
    </section>
  )
}
