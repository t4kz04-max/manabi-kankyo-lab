import { Info } from 'lucide-react'

/** 先生モードが実際の権限ではなくデモであることの補足 */
export function TeacherDemoNote() {
  return (
    <p className="flex gap-2 rounded-xl border border-pending/60 bg-pending-soft px-4 py-3 text-sm text-foreground">
      <Info aria-hidden="true" className="mt-[0.3em] size-4 shrink-0 text-pending-ink" />
      <span>
        <strong className="font-bold">先生モードはデモ用です。</strong>
        実際のログイン・権限管理はありません。表示される投稿と対応はすべて架空のデータです。
      </span>
    </p>
  )
}
