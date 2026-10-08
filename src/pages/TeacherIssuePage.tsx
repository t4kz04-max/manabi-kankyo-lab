import { useParams } from 'react-router'
import { PagePlaceholder } from '@/components/layout/PagePlaceholder'

export function TeacherIssuePage() {
  const { issueId } = useParams()

  return (
    <PagePlaceholder
      title="改善案の編集"
      description="改善案の参考例を見ながら、対応状況・理由・試行結果を記録します。"
      plannedPhase="Phase 3"
    >
      <p className="text-sm text-muted-foreground">対象の投稿ID：{issueId}</p>
    </PagePlaceholder>
  )
}
