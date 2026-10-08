import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@/lib/labels'
import type { Issue, IssueCategory, IssueStatus } from '@/types/issue'

export type CategoryFilter = IssueCategory | 'all'
export type StatusFilter = IssueStatus | 'all'

/** URL のクエリ文字列から、カテゴリーの絞り込み条件を読み取る（不正な値は「すべて」） */
export function parseCategoryFilter(value: string | null): CategoryFilter {
  return ISSUE_CATEGORIES.find((category) => category === value) ?? 'all'
}

/** URL のクエリ文字列から、対応状況の絞り込み条件を読み取る（不正な値は「すべて」） */
export function parseStatusFilter(value: string | null): StatusFilter {
  return ISSUE_STATUSES.find((status) => status === value) ?? 'all'
}

export function filterIssues(
  issues: Issue[],
  category: CategoryFilter,
  status: StatusFilter,
): Issue[] {
  return issues.filter(
    (issue) =>
      (category === 'all' || issue.category === category) &&
      (status === 'all' || issue.status === status),
  )
}

/** 新しい投稿が上になるように並べる */
export function sortByNewest(issues: Issue[]): Issue[] {
  return [...issues].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}
