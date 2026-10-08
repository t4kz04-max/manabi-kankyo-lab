import {
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  Lightbulb,
  MessageSquareText,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from '@/components/home/SectionHeading'

interface Step {
  title: string
  actor: string
  description: string
  icon: LucideIcon
}

const STEPS: Step[] = [
  {
    title: '伝える',
    actor: '生徒',
    description: '教室の音や光で困っていることを、選ぶだけで伝えられます。',
    icon: MessageSquareText,
  },
  {
    title: '考える',
    actor: '先生',
    description: '届いた困りごとを確認し、改善の方法を検討します。',
    icon: Lightbulb,
  },
  {
    title: '確かめる',
    actor: '先生から生徒へ',
    description: '試した内容と結果、判断の理由を生徒に返します。',
    icon: CircleCheckBig,
  },
]

export function StepsSection() {
  return (
    <section aria-labelledby="steps-title" className="page-container py-16 sm:py-20">
      <SectionHeading
        id="steps-title"
        eyebrow="使い方"
        title="3つのステップで、困りごとを改善へ"
        align="center"
      />

      <ol className="mt-10 grid gap-10 md:mt-12 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon
          return (
            <li key={step.title} className="surface-card relative flex flex-col p-6 sm:p-7">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-8 left-1/2 -translate-x-1/2 text-primary md:top-1/2 md:-left-8 md:translate-x-0 md:-translate-y-1/2"
                >
                  <ChevronDown className="size-6 md:hidden" />
                  <ChevronRight className="hidden size-6 md:block" />
                </span>
              )}
              <div className="flex items-center justify-between gap-3">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <span className="text-sm font-bold text-muted-foreground">
                  STEP {index + 1}
                </span>
              </div>
              <h3 className="mt-5 text-xl sm:text-2xl">{step.title}</h3>
              <p className="mt-1 text-sm font-bold text-primary-ink">{step.actor}</p>
              <p className="mt-3 text-muted-foreground text-phrase">{step.description}</p>
            </li>
          )
        })}
      </ol>

      <p className="mx-auto mt-8 flex max-w-2xl items-start justify-center gap-2 text-center font-bold text-primary-ink">
        <RefreshCw aria-hidden="true" className="mt-[0.35em] size-4 shrink-0" />
        <span>確かめた結果が、次の改善のヒントになります。</span>
      </p>
    </section>
  )
}
