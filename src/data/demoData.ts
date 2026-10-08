/**
 * 架空のデモデータ。
 * ここに含まれる困りごと・先生の返答・試行結果はすべて架空のもので、
 * 実在の学校・生徒・先生の声や実際の改善結果ではありません。
 */
import { SUGGESTED_ACTIONS } from '@/data/suggestedActions'
import type { DemoState, Improvement, Issue } from '@/types/issue'

export const DEMO_STATE_VERSION = 1

export const DEMO_DATA_NOTICE =
  'このアプリに表示される投稿・対応・結果は、すべて架空のデモデータです。'

/** メインデモ：授業の始まりに椅子を動かす音が気になる（先生の対応前の状態） */
export const MAIN_DEMO_ISSUE_ID = 'demo-issue-001'

export const DEMO_ISSUES: Issue[] = [
  {
    id: MAIN_DEMO_ISSUE_ID,
    category: 'sound',
    situation: 'class-start',
    issueType: 'chair-noise',
    status: 'unconfirmed',
    createdAt: '2026-09-28T08:40:00+09:00',
    updatedAt: '2026-09-28T08:40:00+09:00',
    isDemo: true,
  },
  {
    id: 'demo-issue-002',
    category: 'light',
    situation: 'during-class',
    issueType: 'window-glare',
    status: 'considering',
    createdAt: '2026-09-24T13:10:00+09:00',
    updatedAt: '2026-09-26T16:00:00+09:00',
    isDemo: true,
  },
  {
    id: 'demo-issue-003',
    category: 'sound',
    situation: 'test',
    issueType: 'surrounding-noise',
    status: 'trial-planned',
    createdAt: '2026-09-18T11:20:00+09:00',
    updatedAt: '2026-09-22T17:30:00+09:00',
    isDemo: true,
  },
  {
    id: 'demo-issue-004',
    category: 'light',
    situation: 'during-class',
    issueType: 'lighting-glare',
    status: 'improved',
    createdAt: '2026-09-08T10:05:00+09:00',
    updatedAt: '2026-09-19T15:45:00+09:00',
    isDemo: true,
  },
  {
    id: 'demo-issue-005',
    category: 'sound',
    situation: 'group-work',
    issueType: 'surrounding-noise',
    status: 'declined',
    createdAt: '2026-09-10T14:30:00+09:00',
    updatedAt: '2026-09-12T16:10:00+09:00',
    isDemo: true,
  },
]

export const DEMO_IMPROVEMENTS: Improvement[] = [
  {
    issueId: MAIN_DEMO_ISSUE_ID,
    suggestedActions: SUGGESTED_ACTIONS['chair-noise'],
    selectedAction: null,
    teacherResponse: '',
    decisionReason: '',
    trialResult: '',
    updatedAt: '2026-09-28T08:40:00+09:00',
    isDemo: true,
  },
  {
    issueId: 'demo-issue-002',
    suggestedActions: SUGGESTED_ACTIONS['window-glare'],
    selectedAction: '時間帯に合わせてカーテンやブラインドを調整する',
    teacherResponse:
      '（架空）午後の時間帯にまぶしくなる席があることを確認しました。対応方法を検討しています。',
    decisionReason:
      '（架空）カーテンの開け閉めで対応できるか、まず担任間で相談するため。',
    trialResult: '',
    updatedAt: '2026-09-26T16:00:00+09:00',
    isDemo: true,
  },
  {
    issueId: 'demo-issue-003',
    suggestedActions: SUGGESTED_ACTIONS['surrounding-noise'],
    selectedAction: '必要な生徒がイヤーマフを使えるようにする',
    teacherResponse:
      '（架空）次回の小テストから、希望する人がイヤーマフを使えるようにする予定です。',
    decisionReason:
      '（架空）すぐに準備でき、他の生徒への影響も少ないと考えたため。',
    trialResult: '',
    updatedAt: '2026-09-22T17:30:00+09:00',
    isDemo: true,
  },
  {
    issueId: 'demo-issue-004',
    suggestedActions: SUGGESTED_ACTIONS['lighting-glare'],
    selectedAction: 'まぶしい位置の照明を部分的に消灯・調光する',
    teacherResponse:
      '（架空）黒板前の照明の一部を、授業中は消灯することにしました。',
    decisionReason:
      '（架空）消灯しても板書が見えにくくならないことを確認できたため。',
    trialResult:
      '（架空の結果）1週間試したところ、まぶしさが減ったという声が寄せられました。',
    updatedAt: '2026-09-19T15:45:00+09:00',
    isDemo: true,
  },
  {
    issueId: 'demo-issue-005',
    suggestedActions: SUGGESTED_ACTIONS['surrounding-noise'],
    selectedAction: null,
    teacherResponse:
      '（架空）グループ活動では話し合いが必要なため、今回は見送ります。',
    decisionReason:
      '（架空）活動の目的上、会話を減らすことが難しいため。代わりに静かに作業できる時間を別に設けることを今後検討します。',
    trialResult: '',
    updatedAt: '2026-09-12T16:10:00+09:00',
    isDemo: true,
  },
]

/** リセット時に使う初期デモ状態を新しく生成する */
export function createInitialDemoState(): DemoState {
  return {
    version: DEMO_STATE_VERSION,
    issues: DEMO_ISSUES.map((issue) => ({ ...issue })),
    improvements: DEMO_IMPROVEMENTS.map((improvement) => ({
      ...improvement,
      suggestedActions: [...improvement.suggestedActions],
    })),
  }
}
