import { useLocation, useSearchParams } from 'react-router'
import {
  parseCategoryFilter,
  parseSortOrder,
  parseStatusFilter,
  type CategoryFilter,
  type SortOrder,
  type StatusFilter,
} from '@/lib/issueFilters'

export type FilterKey = 'category' | 'status' | 'sort'

const DEFAULTS: Record<FilterKey, string> = { category: 'all', status: 'all', sort: 'newest' }

/** 一覧の絞り込み・並び順を URL のクエリ文字列で管理する（再読み込みしても保たれる） */
export function useIssueFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const category: CategoryFilter = parseCategoryFilter(searchParams.get('category'))
  const status: StatusFilter = parseStatusFilter(searchParams.get('status'))
  const sort: SortOrder = parseSortOrder(searchParams.get('sort'))

  /** 複数の条件をまとめて変更する（既定値の条件は URL から取り除く） */
  const updateFilters = (changes: Partial<Record<FilterKey, string>>) => {
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params)
        for (const [key, value] of Object.entries(changes) as [FilterKey, string][]) {
          if (value === DEFAULTS[key]) next.delete(key)
          else next.set(key, value)
        }
        return next
      },
      // 画面遷移時に渡された state（直前の投稿の強調表示など）を保つ
      { replace: true, state: location.state },
    )
  }

  const updateFilter = (key: FilterKey, value: string) => updateFilters({ [key]: value })

  const clearFilters = () => setSearchParams({}, { replace: true, state: location.state })

  return { category, status, sort, updateFilter, updateFilters, clearFilters }
}
