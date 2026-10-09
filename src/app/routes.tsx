import type { RouteObject } from 'react-router'
import { PageLoading } from '@/components/common/PageLoading'
import { RouteError } from '@/components/common/RouteError'
import { AppLayout } from '@/components/layout/AppLayout'
import { PATHS } from '@/routes/paths'

/**
 * アプリ全体のルート定義（ブラウザ用ルーターとテストで共用する）。
 * 各画面は React Router の lazy で画面ごとに分割して読み込む。
 * 読み込み中は前の画面を表示したままにし、ヘッダーの下に進行状況を表示する（AppLayout）。
 */
export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    hydrateFallbackElement: <PageLoading />,
    children: [
      {
        // 画面の読み込みに失敗した場合も、ヘッダー・フッターは残して案内を表示する
        errorElement: <RouteError />,
        children: [
          {
            path: PATHS.home,
            lazy: () => import('@/pages/HomePage').then((m) => ({ Component: m.HomePage })),
          },
          {
            path: PATHS.studentSubmit,
            lazy: () =>
              import('@/pages/StudentSubmitPage').then((m) => ({ Component: m.StudentSubmitPage })),
          },
          {
            path: PATHS.studentStatus,
            lazy: () =>
              import('@/pages/StudentStatusPage').then((m) => ({ Component: m.StudentStatusPage })),
          },
          {
            path: PATHS.teacherDashboard,
            lazy: () =>
              import('@/pages/TeacherDashboardPage').then((m) => ({
                Component: m.TeacherDashboardPage,
              })),
          },
          {
            path: PATHS.teacherIssue,
            lazy: () =>
              import('@/pages/TeacherIssuePage').then((m) => ({ Component: m.TeacherIssuePage })),
          },
          {
            path: PATHS.report,
            lazy: () => import('@/pages/ReportPage').then((m) => ({ Component: m.ReportPage })),
          },
          {
            path: '*',
            lazy: () => import('@/pages/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })),
          },
        ],
      },
    ],
  },
]
