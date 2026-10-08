import { useMemo } from 'react'
import { Info, MessageSquareText, SearchX } from 'lucide-react'
import { Link, useLocation, useSearchParams } from 'react-router'
import { PageHeader } from '@/components/common/PageHeader'
import { ChoiceGroup } from '@/components/student/ChoiceGroup'
import { IssueStatusCard } from '@/components/student/IssueStatusCard'
import type { StatusPageLocationState } from '@/components/student/IssueSubmittedStep'
import {
  filterIssues,
  parseCategoryFilter,
  parseStatusFilter,
  sortByNewest,
  type CategoryFilter,
  type StatusFilter,
} from '@/components/student/statusFilters'
import { Button } from '@/components/ui/button'
import { AUDIENCES } from '@/lib/audience'
import { CATEGORY_LABELS, ISSUE_CATEGORIES, ISSUE_STATUSES, STATUS_LABELS } from '@/lib/labels'
import { PATHS } from '@/routes/paths'
import { useDemoState } from '@/state/useDemoState'

export function StudentStatusPage() {
  const { state } = useDemoState()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const highlightIssueId = (location.state as StatusPageLocationState | null)?.highlightIssueId

  const category = parseCategoryFilter(searchParams.get('category'))
  const status = parseStatusFilter(searchParams.get('status'))

  const improvementsById = useMemo(
    () => new Map(state.improvements.map((item) => [item.issueId, item])),
    [state.improvements],
  )
  const visibleIssues = useMemo(
    () => sortByNewest(filterIssues(state.issues, category, status)),
    [state.issues, category, status],
  )

  // 絞り込み条件は URL に残し、再読み込みしても保たれるようにする
  const updateFilter = (key: 'category' | 'status', value: string) => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        if (value === 'all') next.delete(key)
        else next.set(key, value)
        return next
      },
      { replace: true, state: location.state },
    )
  }

  const categoryOptions = (['all', ...ISSUE_CATEGORIES] as CategoryFilter[]).map((value) => {
    const count = filterIssues(state.issues, value, 'all').length
    return {
      value,
      label: `${value === 'all' ? 'すべて' : CATEGORY_LABELS[value]}（${count}件）`,
    }
  })

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

        <section aria-label="絞り込み" className="surface-card space-y-5 p-5 sm:p-6">
          <ChoiceGroup
            id="filter-category"
            name="filter-category"
            legend="カテゴリー"
            options={categoryOptions}
            value={category}
            onChange={(value) => updateFilter('category', value)}
            columns={3}
            size="compact"
          />
          <div className="space-y-2">
            <label htmlFor="filter-status" className="block font-bold">
              対応状況
            </label>
            <select
              id="filter-status"
              value={status}
              onChange={(event) => updateFilter('status', event.target.value as StatusFilter)}
              className="h-12 w-full rounded-xl border-2 border-input bg-card px-3 font-bold sm:w-72"
            >
              <option value="all">すべての対応状況</option>
              {ISSUE_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </section>

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
            <div className="rounded-2xl border border-dashed border-input/60 bg-card px-5 py-12 text-center">
              <SearchX aria-hidden="true" className="mx-auto size-10 text-muted-foreground" />
              <p className="mt-3 font-bold">この条件に当てはまる困りごとはまだありません</p>
              <p className="mt-1 text-sm text-muted-foreground">
                絞り込みの条件を変えてみてください。
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={() => setSearchParams({}, { replace: true, state: location.state })}
              >
                絞り込みを解除する
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
