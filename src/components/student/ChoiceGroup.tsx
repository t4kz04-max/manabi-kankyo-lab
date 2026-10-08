import type { ReactNode } from 'react'
import { Check, CircleAlert, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChoiceOption<T extends string> {
  value: T
  label: string
  description?: string
  icon?: LucideIcon
}

interface ChoiceGroupProps<T extends string> {
  /** fieldset の id（エラー一覧からのリンク先） */
  id: string
  name: string
  legend: string
  /** 見出しの前に付ける番号（例：1） */
  step?: number
  hint?: string
  options: ChoiceOption<T>[]
  value: T | null
  onChange: (value: T) => void
  error?: string
  /** 選択肢を表示できない場合の案内（例：先にカテゴリーを選ぶ） */
  placeholder?: ReactNode
  columns?: 2 | 3
  size?: 'default' | 'large' | 'compact'
}

/**
 * ラジオボタンを選択カードとして表示するグループ。
 * ネイティブのラジオボタンを使うため、矢印キーでの選択やスクリーンリーダーにそのまま対応する。
 */
export function ChoiceGroup<T extends string>({
  id,
  name,
  legend,
  step,
  hint,
  options,
  value,
  onChange,
  error,
  placeholder,
  columns = 2,
  size = 'default',
}: ChoiceGroupProps<T>) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ')

  return (
    <fieldset
      id={id}
      tabIndex={-1}
      aria-describedby={describedBy || undefined}
      className="scroll-mt-24 rounded-2xl outline-none"
    >
      <legend className="flex items-center gap-2.5 text-lg font-bold">
        {step !== undefined && (
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground"
          >
            {step}
          </span>
        )}
        {legend}
      </legend>
      {hint && (
        <p id={hintId} className="mt-1 text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="mt-2 flex items-center gap-1.5 text-sm font-bold text-destructive"
        >
          <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      )}

      {placeholder ? (
        <div className="mt-3 rounded-xl border border-dashed border-input/60 bg-muted/50 px-4 py-5 text-sm text-muted-foreground">
          {placeholder}
        </div>
      ) : (
        <div
          className={cn(
            'mt-3 grid gap-3',
            columns === 2
              ? 'sm:grid-cols-2'
              : size === 'compact'
                ? 'sm:grid-cols-3'
                : 'sm:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {options.map((option) => {
            const Icon = option.icon
            const checked = value === option.value
            return (
              <label
                key={option.value}
                className={cn(
                  'relative flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-card px-4 transition-colors',
                  'has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring',
                  { large: 'min-h-20 py-4', default: 'min-h-14 py-3', compact: 'min-h-12 py-2' }[size],
                  checked
                    ? 'border-primary bg-secondary'
                    : error
                      ? 'border-destructive/50 hover:border-primary/60'
                      : 'border-border hover:border-primary/60 hover:bg-secondary/40',
                )}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={checked}
                  onChange={() => onChange(option.value)}
                  className="peer sr-only"
                />
                {Icon && (
                  <span
                    className={cn(
                      'flex shrink-0 items-center justify-center rounded-xl',
                      size === 'large' ? 'size-12' : 'size-9',
                      checked
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-primary-ink',
                    )}
                  >
                    <Icon aria-hidden="true" className={size === 'large' ? 'size-6' : 'size-5'} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block font-bold text-phrase',
                      size === 'large' ? 'text-lg' : 'text-base',
                      checked && 'text-primary-ink',
                    )}
                  >
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="block text-sm text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </span>
                {/* 選択状態を色だけでなくチェックマークでも示す */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border-2',
                    checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input bg-card',
                  )}
                >
                  {checked && <Check className="size-4" strokeWidth={3} />}
                </span>
              </label>
            )
          })}
        </div>
      )}
    </fieldset>
  )
}
