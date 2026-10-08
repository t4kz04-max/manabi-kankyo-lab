import { ArrowLeft, Info, Send } from 'lucide-react'
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
}

export function IssueConfirmStep({ input, onBack, onSubmit }: IssueConfirmStepProps) {
  const rows = [
    { term: '何に困っているか', detail: CATEGORY_LABELS[input.category] },
    { term: '場面', detail: SITUATION_LABELS[input.situation] },
    { term: '困りごとの種類', detail: ISSUE_TYPE_LABELS[input.issueType] },
  ]

  return (
    <div className="space-y-6">
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
          <Send aria-hidden="true" data-icon="inline-start" />
          この内容で投稿する
        </Button>
      </div>
    </div>
  )
}
