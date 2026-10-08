import { ComingSoonPage } from '@/components/common/ComingSoonPage'
import { TeacherDemoNote } from '@/components/common/TeacherDemoNote'
import { AUDIENCES } from '@/lib/audience'

export function TeacherDashboardPage() {
  return (
    <ComingSoonPage
      title="先生用ダッシュボード"
      description="生徒から届いた困りごとを一覧で確認し、対応を始めるための画面です。"
      audience={AUDIENCES.teacher}
      note={<TeacherDemoNote />}
      plannedFeatures={[
        '届いた困りごとを一覧で確認する',
        '対応状況やカテゴリで絞り込む',
        '困りごとを選んで、改善案の検討に進む',
      ]}
    />
  )
}
