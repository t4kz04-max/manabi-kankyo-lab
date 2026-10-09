import { Info } from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { Improvement, Issue, IssueStatus } from '@/types/issue'

/** 対応状況ごとの、現在の結果の説明 */
const RESULT_MESSAGES: Record<IssueStatus, string> = {
  unconfirmed: 'まだ対応が記録されていません。先生が確認すると、ここに対応の内容が表示されます。',
  considering: '学校が改善の方法を検討しています。',
  'trial-planned': '改善の方法を試す予定です。',
  'in-trial': '改善の方法を試しています。',
  improved: '対応の内容と、試した結果が記録されています。',
  declined: '今回は実施しないと判断しました。その理由が記録されています。',
}

interface ReportResultProps {
  issue: Issue
  improvement?: Improvement
}

/** 現在の結果 */
export function ReportResult({ issue, improvement }: ReportResultProps) {
  const trialResult = improvement?.trialResult.trim() ?? ''
  const decisionReason = improvement?.decisionReason.trim() ?? ''
  // 改善済みなら試した結果、見送りなら理由を目立たせる（記録がある場合だけ）
  const highlight =
    issue.status === 'improved' && trialResult
      ? { label: '試した結果', text: trialResult }
      : issue.status === 'declined' && decisionReason
        ? { label: '見送りの理由', text: decisionReason }
        : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={issue.status} className="text-base" />
        <span className="text-sm text-muted-foreground">
          最終更新：<time dateTime={issue.updatedAt}>{formatDateTime(issue.updatedAt)}</time>
        </span>
      </div>
      <p className="text-lg font-bold text-phrase">{RESULT_MESSAGES[issue.status]}</p>
      {highlight && (
        <div
          className={cn(
            'rounded-xl px-4 py-3',
            issue.status === 'improved'
              ? 'border border-success/50 bg-success-soft'
              : 'border border-border bg-muted',
          )}
        >
          <p
            className={cn(
              'text-xs font-bold',
              issue.status === 'improved' ? 'text-success-ink' : 'text-muted-foreground',
            )}
          >
            {highlight.label}
          </p>
          <p className="mt-1">{highlight.text}</p>
        </div>
      )}
      {issue.status === 'improved' && (
        <p className="flex gap-2 text-sm text-muted-foreground">
          <Info aria-hidden="true" className="mt-[0.3em] size-4 shrink-0 text-primary" />
          <span>
            「改善済み」は学校の記録上の対応状況です。すべての生徒の困りごとが解消されたことを示すものではありません。
          </span>
        </p>
      )}
    </div>
  )
}
