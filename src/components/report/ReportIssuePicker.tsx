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
    <div className="surface-card space-y-2 p-5 sm:p-6">
      <label htmlFor="report-issue" className="block font-bold">
        表示する困りごと
      </label>
      <select
        id="report-issue"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border-2 border-input bg-card px-3 font-bold transition-colors hover:border-primary/60"
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
