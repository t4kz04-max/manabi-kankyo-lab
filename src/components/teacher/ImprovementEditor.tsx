import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  CircleAlert,
  CircleCheckBig,
  CircleDot,
  ExternalLink,
  RotateCcw,
  Save,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router'
import { ChoiceGroup, type ChoiceOption } from '@/components/common/ChoiceGroup'
import type { StatusPageLocationState } from '@/components/student/IssueSubmittedStep'
import { IssueStatusCard } from '@/components/student/IssueStatusCard'
import {
  isDraftChanged,
  normalizeDraft,
  toImprovementDraft,
} from '@/components/teacher/improvementDraft'
import { SuggestedActionList } from '@/components/teacher/SuggestedActionList'
import { TextAreaField } from '@/components/teacher/TextAreaField'
import { UnsavedChangesDialog } from '@/components/teacher/UnsavedChangesDialog'
import { Button } from '@/components/ui/button'
import { SUGGESTED_ACTIONS } from '@/data/suggestedActions'
import {
  IMPROVEMENT_FIELD_LABELS,
  IMPROVEMENT_TEXT_MAX_LENGTH,
  REQUIRED_FIELDS_BY_STATUS,
  validateImprovementUpdate,
  type ImprovementTextField,
  type ImprovementUpdate,
} from '@/lib/improvementRules'
import { ISSUE_STATUSES } from '@/lib/labels'
import { STATUS_PRESENTATION } from '@/lib/status'
import { cn } from '@/lib/utils'
import { PATHS } from '@/routes/paths'
import { useDemoState } from '@/state/useDemoState'
import type { Improvement, Issue, IssueStatus } from '@/types/issue'

const STATUS_OPTIONS: ChoiceOption<IssueStatus>[] = ISSUE_STATUSES.map((status) => ({
  value: status,
  label: STATUS_PRESENTATION[status].label,
  description: STATUS_PRESENTATION[status].description,
  icon: STATUS_PRESENTATION[status].icon,
}))

const FIELD_HINTS: Record<ImprovementTextField, string> = {
  selectedAction: '学校として、何に取り組むか（取り組んだか）を書きます。',
  decisionReason: 'その対応を選んだ理由や、見送る場合はその理由を書きます。',
  trialResult: '実際に試してみて、どうだったかを書きます。',
  teacherResponse: '生徒の対応状況一覧に表示される、ひとことメッセージです。',
}

type SaveResult =
  | { kind: 'saved'; persisted: boolean }
  | { kind: 'error'; message: string }

interface ImprovementEditorProps {
  issue: Issue
  improvement?: Improvement
}

/**
 * 改善プランの編集フォーム。
 * 投稿ごとに key を付けて描画し、別の投稿へ移動したときに編集中の内容が引き継がれないようにする。
 */
export function ImprovementEditor({ issue, improvement }: ImprovementEditorProps) {
  const { updateIssueResponse } = useDemoState()
  const saved = toImprovementDraft(issue, improvement)
  const [draft, setDraft] = useState<ImprovementUpdate>(saved)
  const [showErrors, setShowErrors] = useState(false)
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null)
  const [errorAttempt, setErrorAttempt] = useState(0)
  const summaryRef = useRef<HTMLDivElement>(null)

  const isDirty = isDraftChanged(draft, saved)
  const errors = validateImprovementUpdate(draft)
  const errorFor = (field: ImprovementTextField) =>
    showErrors ? errors.find((error) => error.field === field)?.message : undefined
  const required = REQUIRED_FIELDS_BY_STATUS[draft.status]
  const suggestedActions =
    improvement && improvement.suggestedActions.length > 0
      ? improvement.suggestedActions
      : SUGGESTED_ACTIONS[issue.issueType]

  useEffect(() => {
    if (errorAttempt > 0) summaryRef.current?.focus()
  }, [errorAttempt])

  const change = (changes: Partial<ImprovementUpdate>) => {
    setDraft((current) => ({ ...current, ...changes }))
    setSaveResult(null)
  }

  const handleSave = (event: FormEvent) => {
    event.preventDefault()
    if (errors.length > 0) {
      setShowErrors(true)
      setSaveResult(null)
      setErrorAttempt((count) => count + 1)
      return
    }
    const result = updateIssueResponse(issue.id, draft)
    if (!result.ok) {
      setSaveResult({
        kind: 'error',
        message:
          result.reason === 'not-found'
            ? '対象の困りごとが見つからないため、保存できませんでした。'
            : '入力内容に誤りがあるため、保存できませんでした。',
      })
      return
    }
    setDraft(normalizeDraft(draft))
    setShowErrors(false)
    setSaveResult({ kind: 'saved', persisted: result.persisted })
  }

  const handleDiscard = () => {
    setDraft(saved)
    setShowErrors(false)
    setSaveResult(null)
  }

  const focusField = (field: ImprovementTextField) => {
    const element = document.getElementById(`field-${field}`)
    element?.scrollIntoView({ block: 'center' })
    element?.focus({ preventScroll: true })
  }

  const preview = normalizeDraft(draft)
  const studentLinkState: StatusPageLocationState = { highlightIssueId: issue.id }

  return (
    <form noValidate onSubmit={handleSave} className="space-y-6">
      <UnsavedChangesDialog when={isDirty} />

      {showErrors && errors.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby="editor-error-title"
          className="rounded-2xl border-2 border-destructive/60 bg-destructive/5 px-5 py-4 outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-destructive"
        >
          <h2 id="editor-error-title" className="flex items-center gap-2 text-base text-destructive">
            <CircleAlert aria-hidden="true" className="size-5 shrink-0" />
            「{STATUS_PRESENTATION[draft.status].label}」で保存するには、次の入力が必要です
          </h2>
          <ul className="mt-2 space-y-1 pl-7">
            {errors.map((error) => (
              <li key={error.field}>
                <a
                  href={`#field-${error.field}`}
                  onClick={(event) => {
                    event.preventDefault()
                    focusField(error.field)
                  }}
                  className="font-bold text-destructive underline underline-offset-4"
                >
                  {error.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          <EditorSection step={1} title="改善案の参考例を確認する">
            <SuggestedActionList
              actions={suggestedActions}
              currentAction={draft.selectedAction}
              onSelect={(action) => change({ selectedAction: action })}
            />
          </EditorSection>

          <EditorSection step={2} title="対応状況を選ぶ">
            <ChoiceGroup
              id="field-status"
              name="status"
              legend="対応状況"
              hint={
                required.length > 0
                  ? `「${STATUS_PRESENTATION[draft.status].label}」で保存するには、${required
                      .map((field) => IMPROVEMENT_FIELD_LABELS[field])
                      .join('と')}の入力が必要です。`
                  : `「${STATUS_PRESENTATION[draft.status].label}」は、対応方針が決まっていなくても保存できます。`
              }
              options={STATUS_OPTIONS}
              value={draft.status}
              onChange={(status) => change({ status })}
              columns={2}
            />
          </EditorSection>

          <EditorSection step={3} title="対応の内容を記録する">
            <p className="flex gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
              <ShieldCheck aria-hidden="true" className="mt-[0.25em] size-4 shrink-0" />
              <span>
                実在の生徒の名前や、健康・家庭に関する情報など、個人が特定できる内容は書かないでください。
              </span>
            </p>
            <div className="space-y-6">
              {(['selectedAction', 'decisionReason', 'trialResult', 'teacherResponse'] as const).map(
                (field) => (
                  <TextAreaField
                    key={field}
                    id={`field-${field}`}
                    label={IMPROVEMENT_FIELD_LABELS[field]}
                    hint={FIELD_HINTS[field]}
                    value={draft[field]}
                    onChange={(value) => change({ [field]: value })}
                    required={required.includes(field)}
                    maxLength={IMPROVEMENT_TEXT_MAX_LENGTH}
                    error={errorFor(field)}
                  />
                ),
              )}
            </div>
          </EditorSection>
        </div>

        <aside aria-labelledby="preview-heading" className="space-y-3 lg:sticky lg:top-24">
          <h2 id="preview-heading" className="text-base">
            生徒の画面での表示（プレビュー）
          </h2>
          <p className="text-sm text-muted-foreground">
            保存すると、生徒の「対応状況を見る」画面にこのように表示されます。
          </p>
          <IssueStatusCard
            issue={{ ...issue, status: preview.status }}
            improvement={{
              issueId: issue.id,
              suggestedActions,
              selectedAction: preview.selectedAction || null,
              decisionReason: preview.decisionReason,
              trialResult: preview.trialResult,
              teacherResponse: preview.teacherResponse,
              updatedAt: improvement?.updatedAt ?? issue.updatedAt,
              isDemo: true,
            }}
          />
        </aside>
      </div>

      {/* 保存バー：画面下部に固定し、未保存の変更があるかを常に表示する */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t border-border bg-card/95 px-4 py-3 shadow-raised backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-2xl lg:border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="status" aria-live="polite" className="min-w-0 text-sm font-bold">
            <SaveStatus isDirty={isDirty} saveResult={saveResult} studentLinkState={studentLinkState} />
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleDiscard}
              disabled={!isDirty}
              className="flex-1 sm:flex-none"
            >
              <RotateCcw aria-hidden="true" data-icon="inline-start" />
              変更を取り消す
            </Button>
            <Button type="submit" size="lg" className="flex-1 sm:flex-none">
              <Save aria-hidden="true" data-icon="inline-start" />
              変更を保存
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

function EditorSection({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  const headingId = `editor-section-${step}`
  return (
    <section aria-labelledby={headingId} className="surface-card space-y-4 p-5 sm:p-7">
      <h2 id={headingId} className="flex items-center gap-2.5 text-lg sm:text-xl">
        <span
          aria-hidden="true"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground"
        >
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

interface SaveStatusProps {
  isDirty: boolean
  saveResult: SaveResult | null
  studentLinkState: StatusPageLocationState
}

function SaveStatus({ isDirty, saveResult, studentLinkState }: SaveStatusProps) {
  if (saveResult?.kind === 'error') {
    return (
      <p className="flex items-start gap-1.5 text-destructive">
        <CircleAlert aria-hidden="true" className="mt-[0.25em] size-4 shrink-0" />
        {saveResult.message}
      </p>
    )
  }
  if (isDirty) {
    return (
      <p className="flex items-center gap-1.5 text-pending-ink">
        <CircleDot aria-hidden="true" className="size-4 shrink-0" />
        未保存の変更があります
      </p>
    )
  }
  if (saveResult?.kind === 'saved') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p
          className={cn(
            'flex items-start gap-1.5',
            saveResult.persisted ? 'text-success-ink' : 'text-destructive',
          )}
        >
          {saveResult.persisted ? (
            <CircleCheckBig aria-hidden="true" className="mt-[0.25em] size-4 shrink-0" />
          ) : (
            <CircleAlert aria-hidden="true" className="mt-[0.25em] size-4 shrink-0" />
          )}
          {saveResult.persisted
            ? '保存しました。生徒の対応状況一覧に反映されています。'
            : 'この画面には反映しましたが、ブラウザに保存できませんでした。再読み込みすると消えます。'}
        </p>
        <Link
          to={PATHS.studentStatus}
          state={studentLinkState}
          className="inline-flex items-center gap-1 text-link"
        >
          生徒の画面で確認する
          <ExternalLink aria-hidden="true" className="size-3.5" />
        </Link>
      </div>
    )
  }
  return (
    <p className="flex items-center gap-1.5 text-muted-foreground">
      <CircleCheckBig aria-hidden="true" className="size-4 shrink-0" />
      保存済みの内容を表示しています
    </p>
  )
}
