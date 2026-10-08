import { useParams } from 'react-router'
import { ComingSoonPage } from '@/components/common/ComingSoonPage'
import { TeacherDemoNote } from '@/components/common/TeacherDemoNote'
import { AUDIENCES } from '@/lib/audience'

export function TeacherIssuePage() {
  const { issueId } = useParams()

  return (
    <ComingSoonPage
      title="改善案の検討"
      description="1件の困りごとについて、改善案を選び、対応状況と理由、試した結果を記録する画面です。"
      audience={AUDIENCES.teacher}
      note={
        <div className="space-y-2">
          <TeacherDemoNote />
          <p className="text-sm text-muted-foreground">
            対象の投稿ID：<code className="font-mono">{issueId}</code>
          </p>
        </div>
      }
      plannedFeatures={[
        '改善案の参考例を見ながら、改善方法を選ぶ・入力する',
        '対応状況を更新し、判断の理由を書き添える',
        '試した結果を記録して、生徒に共有する',
      ]}
    />
  )
}
