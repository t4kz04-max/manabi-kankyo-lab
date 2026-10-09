import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TextAreaFieldProps {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  required: boolean
  maxLength: number
  error?: string
  placeholder?: string
}

/** 先生が対応内容を記録する文章入力欄 */
export function TextAreaField({
  id,
  label,
  hint,
  value,
  onChange,
  required,
  maxLength,
  error,
  placeholder,
}: TextAreaFieldProps) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const countId = `${id}-count`
  const describedBy = [hint && hintId, error && errorId, countId].filter(Boolean).join(' ')

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex flex-wrap items-center gap-2 font-bold">
        {label}
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-bold',
            required ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
          )}
        >
          {required ? '必須' : '任意'}
        </span>
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        rows={3}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        placeholder={placeholder}
        className={cn(
          'block w-full resize-y rounded-xl border-2 bg-card px-4 py-3 text-base leading-relaxed transition-colors placeholder:text-muted-foreground/80 hover:border-primary/60',
          error ? 'border-destructive' : 'border-input',
        )}
      />
      <div className="flex flex-wrap items-start justify-between gap-2 text-sm">
        {error ? (
          <p id={errorId} className="flex items-center gap-1.5 font-bold text-destructive">
            <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
            {error}
          </p>
        ) : (
          <span />
        )}
        <p id={countId} className="text-muted-foreground">
          {value.length} / {maxLength}文字
        </p>
      </div>
    </div>
  )
}
