import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowRight, CircleAlert, ShieldCheck, Sun, Volume2 } from 'lucide-react'
import { ChoiceGroup, type ChoiceOption } from '@/components/common/ChoiceGroup'
import {
  changeCategory,
  FIELD_ERROR_MESSAGES,
  getMissingFields,
  type DraftField,
  type IssueDraft,
} from '@/components/student/issueDraft'
import { Button } from '@/components/ui/button'
import {
  ISSUE_TYPE_LABELS,
  ISSUE_TYPES_BY_CATEGORY,
  SITUATION_LABELS,
  SITUATIONS_BY_CATEGORY,
} from '@/lib/labels'
import type { IssueCategory, IssueSituation, IssueType } from '@/types/issue'

const CATEGORY_OPTIONS: ChoiceOption<IssueCategory>[] = [
  { value: 'sound', label: '音', description: '椅子の音、話し声など', icon: Volume2 },
  { value: 'light', label: '光', description: 'まぶしさ、反射など', icon: Sun },
]

const FIELD_IDS: Record<DraftField, string> = {
  category: 'field-category',
  situation: 'field-situation',
  issueType: 'field-issue-type',
}

const CATEGORY_FIRST_MESSAGE = '先に「1. 音・光」を選ぶと、選択肢が表示されます。'

interface IssueInputStepProps {
  draft: IssueDraft
  onDraftChange: (draft: IssueDraft) => void
  onNext: () => void
}

export function IssueInputStep({ draft, onDraftChange, onNext }: IssueInputStepProps) {
  const [showErrors, setShowErrors] = useState(false)
  const summaryRef = useRef<HTMLDivElement>(null)
  const missing = getMissingFields(draft)
  const errorFor = (field: DraftField) =>
    showErrors && missing.includes(field) ? FIELD_ERROR_MESSAGES[field] : undefined

  // エラー一覧を表示したら、そこへフォーカスを移して読み上げる
  const [errorAttempt, setErrorAttempt] = useState(0)
  useEffect(() => {
    if (errorAttempt > 0) summaryRef.current?.focus()
  }, [errorAttempt])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (missing.length > 0) {
      setShowErrors(true)
      setErrorAttempt((count) => count + 1)
      return
    }
    onNext()
  }

  const focusField = (field: DraftField) => {
    const element = document.getElementById(FIELD_IDS[field])
    element?.scrollIntoView({ block: 'start' })
    element?.focus({ preventScroll: true })
  }

  const situationOptions: ChoiceOption<IssueSituation>[] = draft.category
    ? SITUATIONS_BY_CATEGORY[draft.category].map((value) => ({
        value,
        label: SITUATION_LABELS[value],
      }))
    : []
  const issueTypeOptions: ChoiceOption<IssueType>[] = draft.category
    ? ISSUE_TYPES_BY_CATEGORY[draft.category].map((value) => ({
        value,
        label: ISSUE_TYPE_LABELS[value],
      }))
    : []

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-10">
      <p className="flex gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground sm:text-base">
        <ShieldCheck aria-hidden="true" className="mt-[0.25em] size-5 shrink-0" />
        <span>
          選ぶだけで伝えられます。名前やクラスなど、あなたが誰かわかる情報は入力しません。
        </span>
      </p>

      {showErrors && missing.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="error-summary-title"
          className="rounded-2xl border-2 border-destructive/60 bg-destructive/5 px-5 py-4 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-destructive"
        >
          <h2 id="error-summary-title" className="flex items-center gap-2 text-base text-destructive">
            <CircleAlert aria-hidden="true" className="size-5 shrink-0" />
            まだ選んでいない項目があります
          </h2>
          <ul className="mt-2 space-y-1 pl-7">
            {missing.map((field) => (
              <li key={field}>
                <a
                  href={`#${FIELD_IDS[field]}`}
                  onClick={(event) => {
                    event.preventDefault()
                    focusField(field)
                  }}
                  className="font-bold text-destructive underline underline-offset-4"
                >
                  {FIELD_ERROR_MESSAGES[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ChoiceGroup
        id={FIELD_IDS.category}
        name="category"
        step={1}
        legend="何に困っていますか？"
        hint="「音」か「光」のどちらかを選んでください。"
        options={CATEGORY_OPTIONS}
        value={draft.category}
        onChange={(category) => onDraftChange(changeCategory(draft, category))}
        error={errorFor('category')}
        size="large"
      />

      <ChoiceGroup
        id={FIELD_IDS.situation}
        name="situation"
        step={2}
        legend="どんな場面で困りますか？"
        hint={draft.category ? 'いちばん近いものを1つ選んでください。' : undefined}
        options={situationOptions}
        value={draft.situation}
        onChange={(situation) => onDraftChange({ ...draft, situation })}
        error={errorFor('situation')}
        placeholder={draft.category ? undefined : CATEGORY_FIRST_MESSAGE}
        columns={3}
      />

      <ChoiceGroup
        id={FIELD_IDS.issueType}
        name="issueType"
        step={3}
        legend="どんな困りごとですか？"
        hint={draft.category ? 'いちばん近いものを1つ選んでください。' : undefined}
        options={issueTypeOptions}
        value={draft.issueType}
        onChange={(issueType) => onDraftChange({ ...draft, issueType })}
        error={errorFor('issueType')}
        placeholder={draft.category ? undefined : CATEGORY_FIRST_MESSAGE}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          次の画面で内容を確認してから投稿します。
        </p>
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          内容を確認する
          <ArrowRight aria-hidden="true" data-icon="inline-end" />
        </Button>
      </div>
    </form>
  )
}
