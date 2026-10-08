import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const STEPS = ['選ぶ', '確認する', '完了'] as const

interface FormStepsProps {
  /** 現在のステップ（0 始まり） */
  current: number
}

/** 投稿フォームの進み具合 */
export function FormSteps({ current }: FormStepsProps) {
  return (
    <ol aria-label="投稿の手順" className="flex items-center gap-2 text-sm font-bold">
      {STEPS.map((label, index) => {
        const done = index < current
        const active = index === current
        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className="flex items-center gap-2"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={cn('h-0.5 w-5 rounded-full sm:w-10', done || active ? 'bg-primary' : 'bg-border')}
              />
            )}
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full border-2',
                done && 'border-primary bg-primary text-primary-foreground',
                active && 'border-primary bg-card text-primary-ink',
                !done && !active && 'border-border bg-card text-muted-foreground',
              )}
            >
              {done ? <Check aria-hidden="true" className="size-4" strokeWidth={3} /> : index + 1}
            </span>
            <span className={active ? 'text-primary-ink' : 'text-muted-foreground'}>
              {label}
              {done && <span className="sr-only">（完了）</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
