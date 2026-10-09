import { useEffect, useRef } from 'react'
import { ArrowLeft, CircleAlert, Info, RotateCw, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CATEGORY_LABELS,
  describeIssue,
  ISSUE_TYPE_LABELS,
  SITUATION_LABELS,
} from '@/lib/labels'
import type { NewIssueInput } from '@/types/issue'

interface IssueConfirmStepProps {
  input: NewIssueInput
  onBack: () => void
  onSubmit: () => void
  /** 投稿に失敗した回数（0 は未失敗）。失敗するたびにエラーへフォーカスを移す */
  failedAttempts: number
}

export function IssueConfirmStep({ input, onBack, onSubmit, failedAttempts }: IssueConfirmStepProps) {
  const errorRef = useRef<HTMLDivElement>(null)
  const rows = [
    { term: '何に困っているか', detail: CATEGORY_LABELS[input.category] },
    { term: '場面', detail: SITUATION_LABELS[input.situation] },
    { term: '困りごとの種類', detail: ISSUE_TYPE_LABELS[input.issueType] },
  ]

  useEffect(() => {
    if (failedAttempts > 0) errorRef.current?.focus()
  }, [failedAttempts])

  return (
    <div className="space-y-6">
      {failedAttempts > 0 && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="flex gap-3 rounded-2xl border-2 border-destructive/60 bg-destructive/5 px-5 py-4 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-destructive"
        >
          <CircleAlert aria-hidden="true" className="mt-[0.2em] size-5 shrink-0 text-destructive" />
          <div className="space-y-1">
            <p className="font-bold text-destructive">投稿できませんでした</p>
            <p className="text-sm">
              このブラウザにデータを保存できませんでした。選んだ内容はそのまま残っているので、もう一度お試しください。
            </p>
          </div>
        </div>
      )}

      <div className="surface-card overflow-hidden">
        <div className="border-b border-border bg-secondary px-5 py-6 sm:px-7">
          <p className="text-sm font-bold text-secondary-foreground">伝える内容</p>
          <p className="mt-2 text-xl font-bold text-phrase sm:text-2xl">
            「{describeIssue(input)}」
          </p>
        </div>
        <dl className="divide-y divide-border px-5 sm:px-7">
          {rows.map((row) => (
            <div key={row.term} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="text-sm font-bold text-muted-foreground">{row.term}</dt>
              <dd className="font-bold">{row.detail}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="flex gap-2 text-sm text-muted-foreground sm:text-base">
        <Info aria-hidden="true" className="mt-[0.3em] size-4 shrink-0 text-primary" />
        <span>
          これはデモです。投稿はこのブラウザの中にだけ保存され、実際の学校には送信されません。名前などの個人情報も記録されません。
        </span>
      </p>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeft aria-hidden="true" data-icon="inline-start" />
          戻って修正する
        </Button>
        <Button type="button" size="lg" onClick={onSubmit} className="w-full sm:w-auto">
          {failedAttempts > 0 ? (
            <>
              <RotateCw aria-hidden="true" data-icon="inline-start" />
              もう一度投稿する
            </>
          ) : (
            <>
              <Send aria-hidden="true" data-icon="inline-start" />
              この内容で投稿する
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
