import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import type { Audience } from '@/lib/audience'

interface PageHeaderProps {
  title: string
  description: string
  /** 「生徒向け」「先生向け」など、画面の対象を示すラベル */
  audience?: Audience
}

/** 各画面の先頭に置く見出し。ページタイトルも合わせて設定する */
export function PageHeader({ title, description, audience }: PageHeaderProps) {
  useDocumentTitle(title)
  const AudienceIcon = audience?.icon

  return (
    <header className="space-y-3">
      {audience && AudienceIcon && (
        <p className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm leading-6 font-bold text-secondary-foreground">
          <AudienceIcon aria-hidden="true" className="size-4" />
          {audience.label}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl">{title}</h1>
      <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
        {description}
      </p>
    </header>
  )
}
