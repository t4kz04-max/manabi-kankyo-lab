import { useMemo } from 'react'
import { Info, MessageSquareText } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { IssueFilters } from '@/components/common/IssueFilters'
import { PageHeader } from '@/components/common/PageHeader'
import { IssueStatusCard } from '@/components/student/IssueStatusCard'
import type { StatusPageLocationState } from '@/components/student/IssueSubmittedStep'
import { Button } from '@/components/ui/button'
import { useIssueFilterParams } from '@/hooks/useIssueFilterParams'
import { AUDIENCES } from '@/lib/audience'
import { filterIssues, sortByNewest } from '@/lib/issueFilters'
import { PATHS } from '@/routes/paths'
import { useDemoState } from '@/state/useDemoState'

export function StudentStatusPage() {
  const { state } = useDemoState()
  const location = useLocation()
  const highlightIssueId = (location.state as StatusPageLocationState | null)?.highlightIssueId
  const { category, status, updateFilter, clearFilters } = useIssueFilterParams()

  const improvementsById = useMemo(
    () => new Map(state.improvements.map((item) => [item.issueId, item])),
    [state.improvements],
  )
  const visibleIssues = useMemo(
    () => sortByNewest(filterIssues(state.issues, category, status)),
    [state.issues, category, status],
  )

  return (
    <div className="page-container py-10 sm:py-14">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <PageHeader
            title="対応状況を見る"
            description="この教室で伝えられた困りごとと、学校の対応状況です。"
            audience={AUDIENCES.student}
          />
          <Button asChild variant="outline" className="w-full shrink-0 sm:w-auto">
            <Link to={PATHS.studentSubmit}>
              <MessageSquareText aria-hidden="true" data-icon="inline-start" />
              困りごとを伝える
            </Link>
          </Button>
        </div>

        <p className="flex gap-2 text-sm text-muted-foreground">
          <Info aria-hidden="true" className="mt-[0.3em] size-4 shrink-0 text-primary" />
          <span>表示されている投稿や学校からの回答は、すべて架空のデモデータです。</span>
        </p>

        <IssueFilters
          issues={state.issues}
          category={category}
          status={status}
          onChange={updateFilter}
        />

        <section aria-labelledby="results-heading" className="space-y-4">
          <h2 id="results-heading" className="sr-only">
            困りごとの一覧
          </h2>
          <p role="status" aria-live="polite" className="font-bold">
            {visibleIssues.length}件の困りごとを表示しています
            <span className="ml-1 text-sm font-normal text-muted-foreground">（新しい順）</span>
          </p>

          {visibleIssues.length > 0 ? (
            <ul className="space-y-4">
              {visibleIssues.map((issue) => (
                <li key={issue.id}>
                  <IssueStatusCard
                    issue={issue}
                    improvement={improvementsById.get(issue.id)}
                    highlighted={issue.id === highlightIssueId}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="この条件に当てはまる困りごとはまだありません"
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
