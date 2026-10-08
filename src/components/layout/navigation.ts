import {
  Backpack,
  FileText,
  House,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  Presentation,
  type LucideIcon,
} from 'lucide-react'
import { PATHS } from '@/routes/paths'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** true のとき、パスが完全一致した場合だけ現在地として扱う */
  end?: boolean
}

export interface NavSection {
  id: string
  /** 対象者のラベル（なしの場合は共通の項目） */
  audience?: { label: string; icon: LucideIcon }
  items: NavItem[]
}

/** ヘッダー・フッターで共通利用するナビゲーション構成 */
export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'common',
    items: [{ to: PATHS.home, label: 'ホーム', icon: House, end: true }],
  },
  {
    id: 'student',
    audience: { label: '生徒', icon: Backpack },
    items: [
      {
        to: PATHS.studentSubmit,
        label: '困りごとを伝える',
        icon: MessageSquareText,
      },
      { to: PATHS.studentStatus, label: '対応状況を見る', icon: ListChecks },
    ],
  },
  {
    id: 'teacher',
    audience: { label: '先生', icon: Presentation },
    items: [
      {
        to: PATHS.teacherDashboard,
        label: 'ダッシュボード',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 'report',
    items: [{ to: PATHS.report, label: '改善レポート', icon: FileText }],
  },
]
