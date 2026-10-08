import type { ReactNode } from 'react'
import { ComingSoonNotice } from '@/components/common/ComingSoonNotice'
import { PageHeader } from '@/components/common/PageHeader'
import type { Audience } from '@/lib/audience'

interface ComingSoonPageProps {
  title: string
  description: string
  audience?: Audience
  plannedFeatures: string[]
  /** 見出しの下に添える補足（任意） */
  note?: ReactNode
}

/** 開発中の画面の共通レイアウト（各 Phase で本実装に置き換える） */
export function ComingSoonPage({
  title,
  description,
  audience,
  plannedFeatures,
  note,
}: ComingSoonPageProps) {
  return (
    <div className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-4xl space-y-8">
        <PageHeader title={title} description={description} audience={audience} />
        {note}
        <ComingSoonNotice plannedFeatures={plannedFeatures} />
      </div>
    </div>
  )
}
