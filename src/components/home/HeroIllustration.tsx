import type { ReactNode } from 'react'
import { ArrowDown, MessageSquareText, Presentation, Volume2 } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'

/**
 * ヒーローの右側に置く「使い方のイメージ」。
 * 実際のデータではなく、流れを伝えるための架空の例であることを明示する。
 */
export function HeroIllustration() {
  return (
    <figure className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        aria-hidden="true"
        className="absolute -inset-4 -z-0 rounded-[2rem] bg-card/60 ring-1 ring-primary/10 sm:-inset-6"
      />
      <div className="relative space-y-3">
        <IllustrationCard
          label="生徒が伝える"
          icon={<MessageSquareText aria-hidden="true" className="size-4" />}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
              <Volume2 aria-hidden="true" className="size-3.5" />音
            </span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
              授業の始まり
            </span>
          </div>
          <p className="mt-2 font-bold text-phrase">椅子を動かす音が気になって、集中しにくい</p>
        </IllustrationCard>

        <FlowArrow />

        <IllustrationCard
          label="先生が考えて、試す"
          icon={<Presentation aria-hidden="true" className="size-4" />}
          badge={<StatusBadge status="in-trial" />}
        >
          <p className="font-bold text-phrase">椅子の脚に消音キャップを付けてみます</p>
        </IllustrationCard>

        <FlowArrow />

        <IllustrationCard
          label="結果を確かめる"
          badge={<StatusBadge status="improved" />}
          highlighted
        >
          <p className="font-bold text-phrase">音が気にならなくなった、という声が届きました</p>
        </IllustrationCard>
      </div>
      <figcaption className="relative mt-5 text-center text-xs text-muted-foreground">
        画面のイメージです（内容は架空の例）
      </figcaption>
    </figure>
  )
}

interface IllustrationCardProps {
  label: string
  icon?: ReactNode
  badge?: ReactNode
  highlighted?: boolean
  children: ReactNode
}

function IllustrationCard({
  label,
  icon,
  badge,
  highlighted = false,
  children,
}: IllustrationCardProps) {
  return (
    <div
      className={
        highlighted
          ? 'rounded-2xl border border-success/50 bg-card p-4 shadow-raised sm:p-5'
          : 'surface-card p-4 sm:p-5'
      }
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground">
          {icon}
          {label}
        </p>
        {badge}
      </div>
      {children}
    </div>
  )
}

function FlowArrow() {
  return (
    <div aria-hidden="true" className="flex justify-center text-primary">
      <ArrowDown className="size-5" />
    </div>
  )
}
