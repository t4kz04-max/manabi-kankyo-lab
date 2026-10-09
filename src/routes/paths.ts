/** 画面のURLパス定義。リンクや遷移ではこの定数を使う。 */
export const PATHS = {
  home: '/',
  studentSubmit: '/student/new',
  studentStatus: '/student/status',
  teacherDashboard: '/teacher',
  teacherIssue: '/teacher/issues/:issueId',
  report: '/report',
} as const

export function teacherIssuePath(issueId: string): string {
  return PATHS.teacherIssue.replace(':issueId', encodeURIComponent(issueId))
}

/** 指定した投稿の改善レポートのURL */
export function reportPath(issueId: string): string {
  return `${PATHS.report}?${new URLSearchParams({ issueId }).toString()}`
}
