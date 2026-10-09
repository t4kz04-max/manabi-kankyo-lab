import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { FormSteps } from '@/components/student/FormSteps'
import { IssueConfirmStep } from '@/components/student/IssueConfirmStep'
import { IssueInputStep } from '@/components/student/IssueInputStep'
import { IssueSubmittedStep } from '@/components/student/IssueSubmittedStep'
import { EMPTY_DRAFT, toIssueInput, type IssueDraft } from '@/components/student/issueDraft'
import { AUDIENCES } from '@/lib/audience'
import { useDemoState } from '@/state/useDemoState'
import type { Issue } from '@/types/issue'

type Step = 'input' | 'confirm' | 'done'

const STEP_INDEX: Record<Step, number> = { input: 0, confirm: 1, done: 2 }

const STEP_HEADINGS: Record<Step, string> = {
  input: '当てはまるものを選んでください',
  confirm: 'この内容で伝えますか？',
  done: '困りごとを受け付けました',
}

export function StudentSubmitPage() {
  const { submitIssue } = useDemoState()
  const [step, setStep] = useState<Step>('input')
  const [draft, setDraft] = useState<IssueDraft>(EMPTY_DRAFT)
  const [submittedIssue, setSubmittedIssue] = useState<Issue | null>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)
  const input = toIssueInput(draft)

  // ステップが切り替わったら、画面の先頭に戻り見出しへフォーカスを移す
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  const handleSubmit = () => {
    if (!input || submittedIssue) return
    const result = submitIssue(input)
    if (!result.ok) {
      // 保存できなかった投稿は確定しない。選んだ内容を残したまま確認画面で再試行できるようにする
      setFailedAttempts((count) => count + 1)
      return
    }
    setSubmittedIssue(result.issue)
    setFailedAttempts(0)
    setStep('done')
  }

  const handleSubmitAnother = () => {
    setDraft(EMPTY_DRAFT)
    setSubmittedIssue(null)
    setFailedAttempts(0)
    setStep('input')
  }

  return (
    <div className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <PageHeader
          title="困りごとを伝える"
          description="教室の音や光について、困っていることを選んで伝えましょう。"
          audience={AUDIENCES.student}
        />
        <FormSteps current={STEP_INDEX[step]} />

        <section aria-labelledby="step-heading" className="space-y-6">
          <h2
            id="step-heading"
            ref={headingRef}
            tabIndex={-1}
            className="text-xl outline-none sm:text-2xl"
          >
            {STEP_HEADINGS[step]}
          </h2>

          {/* ステップの切り替え時に控えめなフェードを入れる（動きを減らす設定では無効） */}
          <div key={step} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200">
            {step === 'input' && (
              <IssueInputStep
                draft={draft}
                onDraftChange={setDraft}
                onNext={() => setStep('confirm')}
              />
            )}
            {step === 'confirm' && input && (
              <IssueConfirmStep
                input={input}
                onBack={() => {
                  setFailedAttempts(0)
                  setStep('input')
                }}
                failedAttempts={failedAttempts}
                onSubmit={handleSubmit}
              />
            )}
            {step === 'done' && submittedIssue && (
              <IssueSubmittedStep
                issue={submittedIssue}
                onSubmitAnother={handleSubmitAnother}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
