import type { RouteObject } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ReportPage } from '@/pages/ReportPage'
import { StudentStatusPage } from '@/pages/StudentStatusPage'
import { StudentSubmitPage } from '@/pages/StudentSubmitPage'
import { TeacherDashboardPage } from '@/pages/TeacherDashboardPage'
import { TeacherIssuePage } from '@/pages/TeacherIssuePage'
import { PATHS } from '@/routes/paths'

/** アプリ全体のルート定義（ブラウザ用ルーターとテストで共用する） */
export const appRoutes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { path: PATHS.home, element: <HomePage /> },
      { path: PATHS.studentSubmit, element: <StudentSubmitPage /> },
      { path: PATHS.studentStatus, element: <StudentStatusPage /> },
      { path: PATHS.teacherDashboard, element: <TeacherDashboardPage /> },
      { path: PATHS.teacherIssue, element: <TeacherIssuePage /> },
      { path: PATHS.report, element: <ReportPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
