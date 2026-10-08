import { ComingSoonPage } from '@/components/common/ComingSoonPage'
import { AUDIENCES } from '@/lib/audience'

export function StudentStatusPage() {
  return (
    <ComingSoonPage
      title="対応状況を見る"
      description="伝えた困りごとに、学校がどのように対応しているかを確認する画面です。"
      audience={AUDIENCES.student}
      plannedFeatures={[
        '困りごとごとの対応状況（未確認〜改善済み・見送り）を確認する',
        '先生からの返答と、判断の理由を読む',
        '試した改善の結果を確認する',
      ]}
    />
  )
}
