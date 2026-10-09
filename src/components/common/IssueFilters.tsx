import { ChoiceGroup } from '@/components/common/ChoiceGroup'
import type { FilterKey } from '@/hooks/useIssueFilterParams'
import {
  filterIssues,
  type CategoryFilter,
  type SortOrder,
  type StatusFilter,
} from '@/lib/issueFilters'
import { CATEGORY_LABELS, ISSUE_CATEGORIES, ISSUE_STATUSES, STATUS_LABELS } from '@/lib/labels'
import type { Issue } from '@/types/issue'

interface IssueFiltersProps {
  /** 件数表示に使う、絞り込み前の投稿 */
  issues: Issue[]
  category: CategoryFilter
  status: StatusFilter
  /** 指定した場合だけ並び順の選択を表示する */
  sort?: SortOrder
  onChange: (key: FilterKey, value: string) => void
  /** 同じ画面に複数置く場合の id の接頭辞 */
  idPrefix?: string
}

const SELECT_CLASS =
  'h-12 w-full rounded-xl border-2 border-input bg-card px-3 font-bold transition-colors hover:border-primary/60'

/** 投稿一覧の絞り込み（カテゴリー・対応状況・並び順） */
export function IssueFilters({
  issues,
  category,
  status,
  sort,
  onChange,
  idPrefix = 'filter',
}: IssueFiltersProps) {
  const categoryOptions = (['all', ...ISSUE_CATEGORIES] as CategoryFilter[]).map((value) => ({
    value,
    label: `${value === 'all' ? 'すべて' : CATEGORY_LABELS[value]}（${filterIssues(issues, value, 'all').length}件）`,
  }))
  const statusCount = (value: StatusFilter) => filterIssues(issues, category, value).length

  return (
    <section aria-label="絞り込み" className="surface-card space-y-5 p-5 sm:p-6">
      <ChoiceGroup
        id={`${idPrefix}-category`}
        name={`${idPrefix}-category`}
        legend="カテゴリー"
        options={categoryOptions}
        value={category}
        onChange={(value) => onChange('category', value)}
        columns={3}
        size="compact"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor={`${idPrefix}-status`} className="block font-bold">
            対応状況
          </label>
          <select
            id={`${idPrefix}-status`}
            value={status}
            onChange={(event) => onChange('status', event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="all">すべての対応状況（{statusCount('all')}件）</option>
            {ISSUE_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}（{statusCount(value)}件）
              </option>
            ))}
          </select>
        </div>
        {sort && (
          <div className="space-y-2">
            <label htmlFor={`${idPrefix}-sort`} className="block font-bold">
              並び順
            </label>
            <select
              id={`${idPrefix}-sort`}
              value={sort}
              onChange={(event) => onChange('sort', event.target.value)}
              className={SELECT_CLASS}
            >
              <option value="newest">新しい順</option>
              <option value="unconfirmed-first">未確認を先に表示</option>
            </select>
          </div>
        )}
      </div>
    </section>
  )
}
