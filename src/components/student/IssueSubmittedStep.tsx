import { CircleCheckBig, ListChecks, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { describeIssue } from '@/lib/labels'
import { PATHS } from '@/routes/paths'
import type { Issue } from '@/types/issue'

export interface StatusPageLocationState {
  highlightIssueId?: string
}

interface IssueSubmittedStepProps {
  issue: Issue
  onSubmitAnother: () => void
}

export function IssueSubmittedStep({ issue, onSubmitAnother }: IssueSubmittedStepProps) {
  const linkState: StatusPageLocationState = { highlightIssueId: issue.id }

  return (
    <div className="space-y-6">
      <div className="surface-card px-5 py-8 text-center sm:px-8 sm:py-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success-soft text-success-ink ring-1 ring-success/50">
          <CircleCheckBig aria-hidden="true" className="size-8" />
        </span>
        <p className="mt-5 text-xl font-bold text-phrase sm:text-2xl">
          「{describeIssue(issue)}」
        </p>
        <p className="mt-4 flex flex-wrap items-center justify-center gap-2 font-bold">
          対応状況は
          <StatusBadge status="unconfirmed" />
          です
        </p>
        <p className="mt-3 text-muted-foreground">
          先生が確認すると、対応状況が変わります。
        </p>
      </div>

      <p className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground sm:text-base">
        これはデモアプリ内での受付です。投稿はこのブラウザの中にだけ保存され、実際の学校には送信されていません。
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link to={PATHS.studentStatus} state={linkState}>
            <ListChecks aria-hidden="true" data-icon="inline-start" />
            対応状況を見る
          </Link>
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={onSubmitAnother} className="w-full sm:w-auto">
          <Plus aria-hidden="true" data-icon="inline-start" />
          別の困りごとを伝える
        </Button>
      </div>
    </div>
  )
}
