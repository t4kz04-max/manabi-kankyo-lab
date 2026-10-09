import { useMemo } from 'react'
import { Inbox } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { IssueFilters } from '@/components/common/IssueFilters'
import { PageHeader } from '@/components/common/PageHeader'
import { TeacherDemoNote } from '@/components/common/TeacherDemoNote'
import { SummaryCards } from '@/components/teacher/SummaryCards'
import { TeacherIssueRow } from '@/components/teacher/TeacherIssueRow'
import { Button } from '@/components/ui/button'
import { useIssueFilterParams } from '@/hooks/useIssueFilterParams'
import { AUDIENCES } from '@/lib/audience'
import { filterIssues, sortIssues } from '@/lib/issueFilters'
import { useDemoState } from '@/state/useDemoState'

export function TeacherDashboardPage() {
  const { state } = useDemoState()
  const { category, status, sort, updateFilter, updateFilters, clearFilters } =
    useIssueFilterParams()

  const visibleIssues = useMemo(
    () => sortIssues(filterIssues(state.issues, category, status), sort),
    [state.issues, category, status, sort],
  )
  const unconfirmedCount = state.issues.filter((issue) => issue.status === 'unconfirmed').length
  const showingOnlyUnconfirmed = status === 'unconfirmed' && category === 'all'

  return (
    <div className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4">
          <PageHeader
            title="先生ダッシュボード"
            description="生徒から届いた困りごとを確認し、対応を考えます。"
            audience={AUDIENCES.teacher}
          />
          <TeacherDemoNote />
        </div>

        <SummaryCards issues={state.issues} />

        {unconfirmedCount > 0 && !showingOnlyUnconfirmed && (
          <div className="flex flex-col gap-3 rounded-2xl bg-secondary px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-bold text-secondary-foreground">
              まだ確認していない困りごとが{unconfirmedCount}件あります。
            </p>
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => updateFilters({ category: 'all', status: 'unconfirmed' })}
            >
              未確認だけを表示する
            </Button>
          </div>
        )}

        <IssueFilters
          issues={state.issues}
          category={category}
          status={status}
          sort={sort}
          onChange={updateFilter}
        />

        <section aria-labelledby="teacher-results-heading" className="space-y-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="teacher-results-heading" className="text-xl">
              届いた困りごと
            </h2>
            <p role="status" aria-live="polite" className="text-sm font-bold text-muted-foreground">
              {visibleIssues.length}件を表示中（{sort === 'newest' ? '新しい順' : '未確認を先に表示'}）
            </p>
          </div>

          {visibleIssues.length > 0 ? (
            <ul className="space-y-3">
              {visibleIssues.map((issue) => (
                <li key={issue.id}>
                  <TeacherIssueRow issue={issue} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Inbox}
              title="この条件に当てはまる困りごとはありません"
              description="絞り込みの条件を変えてみてください。"
              action={
                <Button type="button" variant="outline" onClick={clearFilters}>
                  絞り込みを解除する
                </Button>
              }
            />
          )}
        </section>
      </div>
    </div>
  )
}
