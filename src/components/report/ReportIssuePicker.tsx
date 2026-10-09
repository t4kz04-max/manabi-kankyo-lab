import { formatDate } from '@/lib/format'
import { sortByNewest } from '@/lib/issueFilters'
import { describeIssue, STATUS_LABELS } from '@/lib/labels'
import type { Issue } from '@/types/issue'

interface ReportIssuePickerProps {
  issues: Issue[]
  /** 選択中の投稿ID（指定の投稿が存在しない場合は空文字） */
  value: string
  onChange: (issueId: string) => void
}

/** レポートを表示する困りごとの切り替え */
export function ReportIssuePicker({ issues, value, onChange }: ReportIssuePickerProps) {
  return (
    <div className="surface-card flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
      <label htmlFor="report-issue" className="shrink-0 font-bold">
        表示する困りごと
      </label>
      <select
        id="report-issue"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full min-w-0 rounded-xl border-2 border-input bg-card px-3 font-bold transition-colors hover:border-primary/60"
      >
        {value === '' && <option value="">選んでください</option>}
        {sortByNewest(issues).map((issue) => (
          <option key={issue.id} value={issue.id}>
            {describeIssue(issue)}（{STATUS_LABELS[issue.status]}・{formatDate(issue.createdAt)}投稿）
          </option>
        ))}
      </select>
    </div>
  )
}
