import {
  CalendarClock,
  CircleCheckBig,
  CircleDashed,
  CircleMinus,
  FlaskConical,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { STATUS_LABELS } from '@/lib/labels'
import type { IssueStatus } from '@/types/issue'

type StatusTone = 'neutral' | 'pending' | 'primary' | 'success' | 'muted'

export interface StatusPresentation {
  label: string
  /** 生徒にもわかる短い説明 */
  description: string
  /** 色だけに頼らず判別できるよう、ステータスごとに異なるアイコンを割り当てる */
  icon: LucideIcon
  tone: StatusTone
}

export const STATUS_PRESENTATION: Record<IssueStatus, StatusPresentation> = {
  unconfirmed: {
    label: STATUS_LABELS.unconfirmed,
    description: 'まだ先生が確認していません',
    icon: CircleDashed,
    tone: 'neutral',
  },
  considering: {
    label: STATUS_LABELS.considering,
    description: '改善の方法を考えています',
    icon: Search,
    tone: 'pending',
  },
  'trial-planned': {
    label: STATUS_LABELS['trial-planned'],
    description: '試してみることが決まりました',
    icon: CalendarClock,
    tone: 'primary',
  },
  'in-trial': {
    label: STATUS_LABELS['in-trial'],
    description: '実際に試しています',
    icon: FlaskConical,
    tone: 'primary',
  },
  improved: {
    label: STATUS_LABELS.improved,
    description: '改善につながりました',
    icon: CircleCheckBig,
    tone: 'success',
  },
  declined: {
    label: STATUS_LABELS.declined,
    description: '今回は見送ります。理由もあわせて伝えます',
    icon: CircleMinus,
    tone: 'muted',
  },
}

/**
 * 先生ダッシュボードで「対応中」として数える対応状況。
 * 先生が確認済みで、結論（改善済み・見送り）がまだ出ていないもの。
 */
export const IN_PROGRESS_STATUSES: IssueStatus[] = ['considering', 'trial-planned', 'in-trial']

/** トーンごとの配色（文字はすべて背景に対して 4.5:1 以上） */
export const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
  neutral: 'border-input/60 bg-card text-muted-foreground',
  pending: 'border-pending/60 bg-pending-soft text-pending-ink',
  primary: 'border-primary/40 bg-secondary text-primary-ink',
  success: 'border-success/50 bg-success-soft text-success-ink',
  muted: 'border-border bg-muted text-muted-foreground',
}
