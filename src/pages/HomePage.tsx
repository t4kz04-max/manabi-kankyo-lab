import { Link } from 'react-router'
import { PagePlaceholder } from '@/components/layout/PagePlaceholder'
import { DEMO_DATA_NOTICE, MAIN_DEMO_ISSUE_ID } from '@/data/demoData'
import { PATHS, teacherIssuePath } from '@/routes/paths'

/** 開発確認用の画面一覧（Phase 1 でホーム画面のデザインに置き換える） */
const PAGE_LINKS = [
  { to: PATHS.studentSubmit, label: '困りごとを投稿する（生徒）' },
  { to: PATHS.studentStatus, label: '対応状況を見る（生徒）' },
  { to: PATHS.teacherDashboard, label: '先生用ダッシュボード' },
  { to: teacherIssuePath(MAIN_DEMO_ISSUE_ID), label: '改善案の編集（先生）' },
  { to: PATHS.report, label: '改善レポート' },
]

export function HomePage() {
  return (
    <PagePlaceholder
      title="まなび環境ラボ"
      description="教室の「困った」を「変わった」に。"
      plannedPhase="Phase 1"
    >
      <p className="text-sm">{DEMO_DATA_NOTICE}</p>
      <nav aria-label="画面一覧">
        <ul className="list-disc space-y-1 pl-6">
          {PAGE_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="text-primary underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </PagePlaceholder>
  )
}
