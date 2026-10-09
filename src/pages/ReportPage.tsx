import { useMemo } from 'react'
import { ClipboardList, FileQuestion, Inbox, Info, Route } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { ReportIssuePicker } from '@/components/report/ReportIssuePicker'
import { ReportResponseDetails } from '@/components/report/ReportResponseDetails'
import { ReportSection } from '@/components/report/ReportSection'
import { ReportSummary } from '@/components/report/ReportSummary'
import { ReportTimeline } from '@/components/report/ReportTimeline'
import { Button } from '@/components/ui/button'
import { REPORT_DEFAULT_ISSUE_ID } from '@/data/demoData'
import { sortByNewest } from '@/lib/issueFilters'
import { buildTimeline, latestRespondedIssueId } from '@/lib/reportTimeline'
import { PATHS } from '@/routes/paths'
import { findImprovement, findIssue } from '@/state/issueActions'
import { useDemoState } from '@/state/useDemoState'
import type { DemoState, Issue } from '@/types/issue'

/**
 * 投稿の指定がない場合に表示する投稿と、その理由。
 * 1. 最後に先生が対応を保存した投稿
 * 2. 対応内容と結果がそろった架空のデモ例
 * 3. 最も新しい投稿
 */
function pickDefaultIssue(state: DemoState): { issue?: Issue; reason: string } {
  const responded = latestRespondedIssueId(state.activities)
  const respondedIssue = responded ? findIssue(state, responded) : undefined
  if (respondedIssue) return { issue: respondedIssue, reason: '最近、対応が記録された困りごと' }
  const demo = findIssue(state, REPORT_DEFAULT_ISSUE_ID)
  if (demo) return { issue: demo, reason: '対応と結果が記録された架空のデモ例' }
  return { issue: sortByNewest(state.issues)[0], reason: '最も新しい困りごと' }
}

export function ReportPage() {
  const { state } = useDemoState()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedId = searchParams.get('issueId')

  const fallback = useMemo(() => pickDefaultIssue(state), [state])
  const issue = requestedId ? findIssue(state, requestedId) : fallback.issue
  const improvement = issue ? findImprovement(state, issue.id) : undefined
  const timeline = useMemo(
    () => (issue ? buildTimeline(issue, state.activities) : []),
    [issue, state.activities],
  )

  const selectIssue = (issueId: string) => {
    if (issueId) setSearchParams({ issueId })
  }

  return (
    <div className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          title="改善レポート"
          description="困りごとが、どのように検討・対応されたかを確認できます。"
        />
        <p className="flex gap-2 text-sm text-muted-foreground">
          <Info aria-hidden="true" className="mt-[0.3em] size-4 shrink-0 text-primary" />
          <span>表示される内容はすべて架空のデモデータで、実際の学校の成果ではありません。</span>
        </p>

        {state.issues.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="まだ困りごとが投稿されていません"
            description="困りごとが投稿されると、改善レポートを確認できるようになります。"
            action={
              <Button asChild>
                <Link to={PATHS.studentSubmit}>困りごとを伝える</Link>
              </Button>
            }
          />
        ) : (
          <>
            <ReportIssuePicker
              issues={state.issues}
              value={issue?.id ?? ''}
              onChange={selectIssue}
            />
            {!requestedId && issue && (
              <p className="-mt-2 text-sm text-muted-foreground">
                表示する困りごとが指定されていないため、{fallback.reason}を表示しています。
              </p>
            )}

            {issue ? (
              <>
                <ReportSummary issue={issue} improvement={improvement} />
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
                  <ReportSection
                    id="report-timeline-heading"
                    title="改善までの流れ"
                    icon={Route}
                    lead="記録された出来事だけを、古い順に表示しています。"
                  >
                    <ReportTimeline issue={issue} entries={timeline} />
                  </ReportSection>
                  <ReportSection
                    id="report-response-heading"
                    title="学校の対応内容"
                    icon={ClipboardList}
                    lead="現在保存されている記録の全文です。"
                  >
                    <ReportResponseDetails improvement={improvement} />
                  </ReportSection>
                </div>
              </>
            ) : (
              <EmptyState
                icon={FileQuestion}
                title="指定された困りごとが見つかりません"
                description="URLが正しいか確認してください。デモデータをリセットすると、新しく投稿した困りごとは削除されます。上の一覧から、表示する困りごとを選べます。"
                action={
                  <Button asChild variant="outline">
                    <Link to={PATHS.report}>最新のレポートを表示する</Link>
                  </Button>
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
