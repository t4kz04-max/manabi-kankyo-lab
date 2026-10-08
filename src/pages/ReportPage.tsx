import { ComingSoonPage } from '@/components/common/ComingSoonPage'

export function ReportPage() {
  return (
    <ComingSoonPage
      title="改善レポート"
      description="困りごとが伝えられてから、検討・試行を経て結果が共有されるまでの流れをまとめる画面です。"
      plannedFeatures={[
        '投稿から結果の共有までの流れを、時系列で確認する',
        '対応状況ごとの件数を確認する',
        '改善につながった取り組みを振り返る',
      ]}
    />
  )
}
