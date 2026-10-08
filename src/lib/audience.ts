import { Backpack, Presentation, type LucideIcon } from 'lucide-react'

export interface Audience {
  label: string
  icon: LucideIcon
}

/** 画面の対象者を示すラベル */
export const AUDIENCES = {
  student: { label: '生徒向け', icon: Backpack },
  teacher: { label: '先生向け（デモ）', icon: Presentation },
} satisfies Record<string, Audience>
