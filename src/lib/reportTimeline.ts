import type {
  ActivityEvent,
  Issue,
  IssueStatus,
  ResponseUpdatedActivity,
} from '@/types/issue'

/**
 * 改善レポートのタイムラインに表示する項目。
 * - submitted   : 投稿。履歴があればその日時、なければ投稿に保存されている作成日時を使う
 * - pre-history : 履歴を記録する仕組みの追加前（初期デモデータ）の状態。変更日時や順序は不明なので日時を持たない
 * - response    : 先生が保存した変更（実際に記録された履歴）
 */
export type TimelineEntry =
  | { kind: 'submitted'; occurredAt: string }
  | { kind: 'pre-history'; status: IssueStatus }
  | { kind: 'response'; activity: ResponseUpdatedActivity }

/**
 * 投稿と、その投稿の履歴からタイムラインを作る。
 * 記録されていない変更（例：途中の「試行中」）を推測で補うことはしない。
 */
export function buildTimeline(issue: Issue, activities: ActivityEvent[]): TimelineEntry[] {
  const own = activities
    .filter((activity) => activity.issueId === issue.id)
    .sort((a, b) => Date.parse(a.occurredAt) - Date.parse(b.occurredAt))
  const submitted = own.find((activity) => activity.type === 'issue-submitted')
  const responses = own.filter(
    (activity): activity is ResponseUpdatedActivity => activity.type === 'response-updated',
  )

  const entries: TimelineEntry[] = [
    { kind: 'submitted', occurredAt: submitted?.occurredAt ?? issue.createdAt },
  ]

  // 投稿の履歴がない＝履歴機能の追加前に作られた初期デモデータ。
  // 最初に記録された状態変更の「変更前」、なければ現在の状態が、記録開始時点の対応状況になる。
  if (!submitted) {
    const firstStatusChange = responses.find((activity) => activity.statusChange)?.statusChange
    const baseline = firstStatusChange?.from ?? issue.status
    if (baseline !== 'unconfirmed') entries.push({ kind: 'pre-history', status: baseline })
  }

  for (const activity of responses) entries.push({ kind: 'response', activity })
  return entries
}

/** 最後に先生が対応を保存した投稿のID（なければ undefined） */
export function latestRespondedIssueId(activities: ActivityEvent[]): string | undefined {
  return activities
    .filter((activity) => activity.type === 'response-updated')
    .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))[0]?.issueId
}
