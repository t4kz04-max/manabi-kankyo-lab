import { ComingSoonPage } from '@/components/common/ComingSoonPage'
import { AUDIENCES } from '@/lib/audience'

export function StudentSubmitPage() {
  return (
    <ComingSoonPage
      title="困りごとを伝える"
      description="教室の音や光について、困っていることを先生に伝える画面です。"
      audience={AUDIENCES.student}
      plannedFeatures={[
        '「音」か「光」かを選ぶ',
        '困りごとの種類と、困る場面を選ぶ',
        '名前などの個人情報を入力せずに投稿する',
      ]}
    />
  )
}
