import type {
  IssueCategory,
  IssueSituation,
  IssueStatus,
  IssueType,
} from '@/types/issue'

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  sound: '音',
  light: '光',
}

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  'chair-noise': '椅子を動かす音',
  'surrounding-noise': '授業中の周囲の音',
  'window-glare': '窓からのまぶしさ',
  'lighting-glare': '照明のまぶしさ',
  other: 'その他',
}

/** 各カテゴリで選べる種類（「その他」は両方に含める） */
export const ISSUE_TYPES_BY_CATEGORY: Record<IssueCategory, IssueType[]> = {
  sound: ['chair-noise', 'surrounding-noise', 'other'],
  light: ['window-glare', 'lighting-glare', 'other'],
}

export const SITUATION_LABELS: Record<IssueSituation, string> = {
  'class-start': '授業の始まり',
  'during-class': '授業中',
  'group-work': 'グループ活動中',
  test: 'テスト中',
  'break-time': '休み時間',
  other: 'その他',
}

/** 対応状況の表示名（表示順もこの並び） */
export const STATUS_LABELS: Record<IssueStatus, string> = {
  unconfirmed: '未確認',
  considering: '検討中',
  'trial-planned': '試行予定',
  'in-trial': '試行中',
  improved: '改善済み',
  declined: '見送り',
}

export const ISSUE_STATUSES = Object.keys(STATUS_LABELS) as IssueStatus[]
