import { ArrowLeft, FileQuestion } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { PageHeader } from '@/components/common/PageHeader'
import { TeacherDemoNote } from '@/components/common/TeacherDemoNote'
import { ImprovementEditor } from '@/components/teacher/ImprovementEditor'
import { IssueOverviewCard } from '@/components/teacher/IssueOverviewCard'
import { Button } from '@/components/ui/button'
import { AUDIENCES } from '@/lib/audience'
import { PATHS } from '@/routes/paths'
import { findImprovement, findIssue } from '@/state/issueActions'
import { useDemoState } from '@/state/useDemoState'

export function TeacherIssuePage() {
  const { issueId = '' } = useParams()
  const { state } = useDemoState()
  const issue = findIssue(state, issueId)
  const improvement = issue ? findImprovement(state, issue.id) : undefined

  return (
    <div className="page-container py-8 sm:py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          to={PATHS.teacherDashboard}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg text-sm font-bold text-primary-ink hover:underline"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          ダッシュボードに戻る
        </Link>

        <div className="space-y-4">
          <PageHeader
            title="改善プランの検討"
            description="困りごとの内容を確認し、改善の方法と対応状況を記録します。最終的な判断は先生が行います。"
            audience={AUDIENCES.teacher}
          />
          <TeacherDemoNote />
        </div>

        {issue ? (
          <>
            <IssueOverviewCard issue={issue} />
            {/* key により、別の投稿へ移動したときは編集内容をリセットする */}
            <ImprovementEditor key={issue.id} issue={issue} improvement={improvement} />
          </>
        ) : (
          <EmptyState
            icon={FileQuestion}
            title="対象の困りごとが見つかりません"
            description="URLが正しいか確認してください。デモデータをリセットすると、新しく投稿した困りごとは削除されます。"
            action={
              <Button asChild>
                <Link to={PATHS.teacherDashboard}>
                  <ArrowLeft aria-hidden="true" data-icon="inline-start" />
                  ダッシュボードへ戻る
                </Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}
