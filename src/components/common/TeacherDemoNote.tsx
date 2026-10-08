import { Info } from 'lucide-react'

/** 先生モードが実際の権限ではなくデモであることの補足 */
export function TeacherDemoNote() {
  return (
    <p className="flex gap-2 text-sm text-muted-foreground">
      <Info aria-hidden="true" className="mt-[0.3em] size-4 shrink-0 text-primary" />
      <span>
        先生向けの画面は、デモとして誰でも見られます。実際のログイン機能はありません。
      </span>
    </p>
  )
}
