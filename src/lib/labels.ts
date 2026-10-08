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

export const ISSUE_CATEGORIES = Object.keys(CATEGORY_LABELS) as IssueCategory[]

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  'chair-noise': '椅子を動かす音',
  'surrounding-noise': '周囲の話し声',
  'hallway-noise': '廊下から聞こえる音',
  'other-sound': 'その他の教室内の音',
  'window-glare': '窓からのまぶしさ',
  'lighting-glare': '照明のまぶしさ',
  'board-reflection': '黒板や画面の反射',
  'room-brightness': '教室内の明るさ',
}

/** 確認文で使う、困りごとの言い方（例：「椅子を動かす音が気になる」） */
export const ISSUE_TYPE_PHRASES: Record<IssueType, string> = {
  'chair-noise': '椅子を動かす音が気になる',
  'surrounding-noise': '周囲の話し声が気になる',
  'hallway-noise': '廊下から聞こえる音が気になる',
  'other-sound': '教室内の音が気になる',
  'window-glare': '窓からの光がまぶしい',
  'lighting-glare': '照明がまぶしい',
  'board-reflection': '黒板や画面が反射して見えにくい',
  'room-brightness': '教室の明るさが合わない',
}

/** 各カテゴリで選べる種類（表示順もこの並び） */
export const ISSUE_TYPES_BY_CATEGORY: Record<IssueCategory, IssueType[]> = {
  sound: ['chair-noise', 'surrounding-noise', 'hallway-noise', 'other-sound'],
  light: [
    'window-glare',
    'lighting-glare',
    'board-reflection',
    'room-brightness',
  ],
}

export const SITUATION_LABELS: Record<IssueSituation, string> = {
  'class-start': '授業の始まり',
  'during-class': '授業中',
  'group-work': 'グループ活動中',
  test: 'テスト中',
  'break-time': '休み時間',
  'time-of-day': '特定の時間帯（午後など）',
  'specific-place': '教室内の特定の場所（席など）',
}

/** 確認文で使う、場面の言い方（例：「授業の始まりに」） */
export const SITUATION_PHRASES: Record<IssueSituation, string> = {
  'class-start': '授業の始まりに',
  'during-class': '授業中に',
  'group-work': 'グループ活動中に',
  test: 'テスト中に',
  'break-time': '休み時間に',
  'time-of-day': '特定の時間帯に',
  'specific-place': '教室内の特定の場所で',
}

/** 各カテゴリで選べる場面（表示順もこの並び） */
export const SITUATIONS_BY_CATEGORY: Record<IssueCategory, IssueSituation[]> = {
  sound: [
    'class-start',
    'during-class',
    'group-work',
    'test',
    'break-time',
    'specific-place',
  ],
  light: ['during-class', 'time-of-day', 'specific-place'],
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
export const ISSUE_TYPES = Object.keys(ISSUE_TYPE_LABELS) as IssueType[]
export const ISSUE_SITUATIONS = Object.keys(SITUATION_LABELS) as IssueSituation[]

/** 困りごとを1文で表す（例：「授業の始まりに、椅子を動かす音が気になる」） */
export function describeIssue(issue: {
  situation: IssueSituation
  issueType: IssueType
}): string {
  return `${SITUATION_PHRASES[issue.situation]}、${ISSUE_TYPE_PHRASES[issue.issueType]}`
}
